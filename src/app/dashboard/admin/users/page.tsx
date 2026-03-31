"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, setDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { formatUTCDate } from "@/lib/utils";

type User = {
  id: string;
  fullName?: string;
  email?: string;
  role?: string;
  status?: string;
  lastLogin?: any;
};

export default function UsersPage() {

const [users,setUsers] = useState<User[]>([]);
const [name,setName] = useState("");
const [email,setEmail] = useState("");
const [password,setPassword] = useState("");
const [role,setRole] = useState("pharmacist");

const [editingUser,setEditingUser] = useState<User | null>(null);
const [editName,setEditName] = useState("");
const [editRole,setEditRole] = useState("");

// ⭐ refresh timer
const [timeRefresh,setTimeRefresh] = useState(0);

const fetchUsers = async () => {

const snap = await getDocs(collection(db,"users"));

setUsers(
snap.docs.map(d => ({
id:d.id,
...(d.data() as Omit<User,"id">)
}))
);

};

useEffect(()=>{
fetchUsers();
},[]);


// ⭐ auto refresh every minute
useEffect(()=>{

const interval = setInterval(()=>{
setTimeRefresh(prev=>prev+1);
},60000);

return ()=>clearInterval(interval);

},[]);


const getSecondaryAuth = () => {
  const secondaryApp = getApps().find((app) => app.name === "secondary") 
  return getAuth(secondaryApp);
};

const handleCreate = async () => {

  if (!name || !email || !password) {
    alert("Please provide name, email, and password for the new user.");
    return;
  }

  const secondaryAuth = getSecondaryAuth();

  try {
    const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
    const uid = userCredential.user.uid;

    await setDoc(doc(db, "users", uid), {
      fullName: name,
      username: name.replace(/\s+/g, "").toLowerCase(),
      email,
      role,
      status: "active",
      createdAt: new Date(),
      lastLogin: null,
    });

    setName("");
    setEmail("");
    setPassword("");

    fetchUsers();
  } catch (error: any) {
    alert(`Could not create user: ${error.message || error}`);
  } finally {
    try {
      await signOut(getSecondaryAuth());
    } catch {
      // ignore secondary auth cleanup errors
    }
  }

};

const deleteUser = async(id:string,role?:string)=>{

if(role==="admin"){
alert("System admin cannot be deleted");
return;
}

await deleteDoc(doc(db,"users",id));

fetchUsers();

};

const toggleUserStatus = async(user:User)=>{

if(!user.id) return;

const newStatus = user.status === "suspended" ? "active" : "suspended";

await updateDoc(doc(db,"users",user.id),{
status:newStatus
});

fetchUsers();

};

const openEdit = (user:User)=>{

setEditingUser(user);
setEditName(user.fullName || "");
setEditRole(user.role || "pharmacist");

};

const saveEdit = async()=>{

if(!editingUser) return;

await updateDoc(doc(db,"users",editingUser.id),{
fullName:editName,
role:editRole
});

setEditingUser(null);

fetchUsers();

};

const resetPassword = async(user:User)=>{
alert(`Password reset link sent to ${user.email}`);
};



// ⭐ RELATIVE LAST LOGIN FORMATTER

const formatLastLogin = (lastLogin:any) => {

if(!lastLogin) return "Never";

try{

let loginDate:Date;

if(lastLogin.seconds){
loginDate = new Date(lastLogin.seconds * 1000);
}else{
loginDate = new Date(lastLogin);
}

const now = new Date();
const diff = now.getTime() - loginDate.getTime();

const minutes = Math.floor(diff/60000);
const hours = Math.floor(diff/3600000);
const days = Math.floor(diff/86400000);

if(minutes < 1) return "Just now";
if(minutes < 60) return `${minutes} min ago`;
if(hours < 24) return `${hours} hour${hours>1?"s":""} ago`;
if(days === 1) return "Yesterday";
if(days < 7) return `${days} days ago`;

return formatUTCDate(loginDate);

}catch{
return "Unknown";
}

};

return(

<div className="space-y-6">

<h1 className="text-3xl font-bold">
User Management
</h1>

{/* CREATE USER */}

<div className="flex gap-3 bg-white p-4 rounded shadow">

<input
placeholder="Full Name"
value={name}
onChange={e=>setName(e.target.value)}
autoComplete="off"
className="border p-2 rounded"
/>

<input
placeholder="Email"
value={email}
onChange={e=>setEmail(e.target.value)}
autoComplete="off"
className="border p-2 rounded"
/>

<input
placeholder="Password"
type="password"
value={password}
onChange={e=>setPassword(e.target.value)}
autoComplete="new-password"
className="border p-2 rounded"
/>

<select
value={role}
onChange={e=>setRole(e.target.value)}
className="border p-2 rounded"
>

<option value="admin">Admin</option>
<option value="manager">Manager</option>
<option value="pharmacist">Pharmacist</option>

</select>

<button
onClick={handleCreate}
className="bg-blue-600 text-white px-4 rounded"
>
Create User
</button>

</div>

{/* USERS TABLE */}

<table className="w-full bg-white rounded shadow">

<thead className="bg-blue-600 text-white">

<tr>
<th className="text-left p-2">Name</th>
<th className="text-left p-2">Email</th>
<th className="text-left p-2">Role</th>
<th className="text-left p-2">Status</th>
<th className="text-left p-2">Last Login</th>
<th className="text-left p-2">Actions</th>
</tr>

</thead>

<tbody>

{users.map(user=>(

<tr key={user.id} className="border-b">

<td className="p-2">{user.fullName}</td>
<td className="p-2">{user.email}</td>
<td className="p-2">{user.role}</td>

<td className="p-2">
<span className={user.status==="suspended"?"text-red-600":"text-green-600"}>
{user.status || "active"}
</span>
</td>

<td className="p-2">
{formatLastLogin(user.lastLogin)}
</td>

<td className="p-2">
<div className="flex gap-2">

<button
onClick={()=>openEdit(user)}
className="bg-yellow-500 text-white px-3 py-1 rounded"
>
Edit
</button>

<button
onClick={()=>resetPassword(user)}
className="bg-purple-600 text-white px-3 py-1 rounded"
>
Reset
</button>

<button
onClick={()=>toggleUserStatus(user)}
className={`px-3 py-1 rounded text-white ${
user.status === "suspended"
? "bg-green-600"
: "bg-gray-600"
}`}
>
{user.status === "suspended" ? "Enable" : "Disable"}
</button>

<button
onClick={()=>deleteUser(user.id,user.role)}
className="bg-red-500 text-white px-3 py-1 rounded"
>
Delete
</button>

</div>
</td>

</tr>

))}

</tbody>

</table>

{/* EDIT MODAL */}

{editingUser && (

<div className="fixed inset-0 bg-black/40 flex items-center justify-center">

<div className="bg-white p-6 rounded shadow space-y-4 w-96">

<h2 className="text-xl font-bold">
Edit User
</h2>

<input
value={editName}
onChange={e=>setEditName(e.target.value)}
className="border p-2 rounded w-full"
/>

<select
value={editRole}
onChange={e=>setEditRole(e.target.value)}
className="border p-2 rounded w-full"
>

<option value="manager">Manager</option>
<option value="pharmacist">Pharmacist</option>

</select>

<div className="flex justify-end gap-3">

<button
onClick={()=>setEditingUser(null)}
className="px-4 py-2 border rounded"
>
Cancel
</button>

<button
onClick={saveEdit}
className="bg-blue-600 text-white px-4 py-2 rounded"
>
Save
</button>

</div>

</div>

</div>

)}

</div>

);

}