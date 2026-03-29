"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
collection,
addDoc,
onSnapshot,
updateDoc,
doc,
serverTimestamp
} from "firebase/firestore";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
Table,
TableHeader,
TableBody,
TableHead,
TableRow,
TableCell,
} from "@/components/ui/table";

export default function AdminSupplierPage() {

const [suppliers,setSuppliers] = useState<any[]>([]);

const [name,setName] = useState("");
const [phone,setPhone] = useState("");
const [email,setEmail] = useState("");
const [address,setAddress] = useState("");
const [country,setCountry] = useState("");
const [contact,setContact] = useState("");
const [contract,setContract] = useState("");
const [rating,setRating] = useState("");

const [successMsg,setSuccessMsg] = useState("");
const [editingSupplier,setEditingSupplier] = useState<any>(null);



/* LOAD SUPPLIERS FROM FIRESTORE */

useEffect(()=>{

  const unsub = onSnapshot(
    collection(db, "suppliers"),
    (snap)=>{
      setSuppliers(
        snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      );
    },
    (error) => {
      console.error("Firestore listener error:", error);
    }
  );

  return () => unsub();

},[]);

/* ADD SUPPLIER */

const handleAddSupplier = async () => {

if(!name.trim() || !phone.trim() || !email.trim()) return

await addDoc(collection(db,"suppliers"),{

name,
phone,
email,
address,
country,
contact,
contract,
rating:Number(rating),
status:"active",
createdAt:serverTimestamp()

})

setName("")
setPhone("")
setEmail("")
setAddress("")
setCountry("")
setContact("")
setContract("")
setRating("")

setSuccessMsg("Supplier added successfully")

setTimeout(()=>setSuccessMsg(""),2000)

}



/* ACTIVATE / DEACTIVATE */

const handleDeactivateSupplier = async (id:string,status:string)=>{

await updateDoc(doc(db,"suppliers",id),{

status: status === "inactive" ? "active":"inactive"

})

setSuccessMsg("Supplier status updated")

setTimeout(()=>setSuccessMsg(""),2000)

}



/* EDIT */

const openEdit=(supplier:any)=>{
setEditingSupplier(supplier)
}

const saveEdit=async()=>{

await updateDoc(doc(db,"suppliers",editingSupplier.id),{

name:editingSupplier.name,
phone:editingSupplier.phone,
email:editingSupplier.email

})

setEditingSupplier(null)

setSuccessMsg("Supplier updated")

setTimeout(()=>setSuccessMsg(""),2000)

}



return (

<div className="space-y-8 bg-[#f8fafc] min-h-screen p-6">

<Card className="shadow-2xl rounded-2xl border-none">

<CardHeader>
<CardTitle className="text-2xl font-bold text-gray-900">
Supplier Management
</CardTitle>
</CardHeader>

<CardContent>

<div className="mb-6">

<h3 className="font-semibold mb-2 text-lg">
Add Supplier
</h3>

<div className="flex flex-wrap gap-3 items-center">

<Input placeholder="Supplier name" value={name} onChange={e=>setName(e.target.value)} className="w-48 rounded-lg"/>

<Input placeholder="Phone" value={phone} onChange={e=>setPhone(e.target.value)} className="w-40 rounded-lg"/>

<Input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} className="w-64 rounded-lg"/>

<Input placeholder="Address" value={address} onChange={e=>setAddress(e.target.value)} className="w-64 rounded-lg"/>

<Input placeholder="Country" value={country} onChange={e=>setCountry(e.target.value)} className="w-40 rounded-lg"/>

<Input placeholder="Contact Person" value={contact} onChange={e=>setContact(e.target.value)} className="w-48 rounded-lg"/>

<Input placeholder="Contract Status" value={contract} onChange={e=>setContract(e.target.value)} className="w-40 rounded-lg"/>

<Input placeholder="Rating" value={rating} onChange={e=>setRating(e.target.value)} className="w-24 rounded-lg"/>

<Button onClick={handleAddSupplier} className="rounded-lg font-semibold">
Add Supplier
</Button>

</div>

{successMsg && (
<div className="bg-green-100 text-green-700 px-3 py-1 rounded mb-2 text-sm w-fit mt-3 shadow">
{successMsg}
</div>
)}

</div>

<div className="overflow-x-auto rounded-xl mt-4">

<Table>

<TableHeader>

<TableRow className="bg-blue-700 hover:bg-blue-700 cursor-default">

<TableHead className="text-white font-bold text-lg">Name</TableHead>
<TableHead className="text-white font-bold text-lg">Phone</TableHead>
<TableHead className="text-white font-bold text-lg">Email</TableHead>
<TableHead className="text-white font-bold text-lg">Country</TableHead>
<TableHead className="text-white font-bold text-lg">Contact</TableHead>
<TableHead className="text-white font-bold text-lg">Contract</TableHead>
<TableHead className="text-white font-bold text-lg">Rating</TableHead>
<TableHead className="text-white font-bold text-lg">Status</TableHead>
<TableHead className="text-white font-bold text-lg">Action</TableHead>

</TableRow>

</TableHeader>

<TableBody>

{suppliers.map((supplier)=>(
<TableRow key={supplier.id}>

<TableCell>{supplier.name}</TableCell>
<TableCell>{supplier.phone}</TableCell>
<TableCell>{supplier.email}</TableCell>
<TableCell>{supplier.country}</TableCell>
<TableCell>{supplier.contact}</TableCell>
<TableCell>{supplier.contract}</TableCell>
<TableCell>{supplier.rating}</TableCell>

<TableCell>
<span className={supplier.status==="inactive"?"text-red-500":"text-green-600"}>
{supplier.status}
</span>
</TableCell>

<TableCell className="flex gap-2">

<Button size="sm" className="bg-yellow-500 text-white rounded-md"
onClick={()=>openEdit(supplier)}>
Edit
</Button>

<Button size="sm" className="bg-gray-600 text-white rounded-md"
onClick={()=>handleDeactivateSupplier(supplier.id,supplier.status)}>
{supplier.status==="inactive"?"Activate":"Deactivate"}
</Button>

</TableCell>

</TableRow>
))}

</TableBody>

</Table>

</div>

</CardContent>

</Card>



{editingSupplier && (

<div className="fixed inset-0 bg-black/40 flex items-center justify-center">

<div className="bg-white p-6 rounded shadow space-y-4 w-96">

<h2 className="text-xl font-bold">Edit Supplier</h2>

<Input value={editingSupplier.name}
onChange={e=>setEditingSupplier({...editingSupplier,name:e.target.value})}/>

<Input value={editingSupplier.phone}
onChange={e=>setEditingSupplier({...editingSupplier,phone:e.target.value})}/>

<Input value={editingSupplier.email}
onChange={e=>setEditingSupplier({...editingSupplier,email:e.target.value})}/>

<div className="flex justify-end gap-3">

<Button variant="outline" onClick={()=>setEditingSupplier(null)}>
Cancel
</Button>

<Button onClick={saveEdit} className="bg-blue-600 text-white">
Save
</Button>

</div>

</div>

</div>

)}

</div>

)
}
    