"use client";

import { useEffect,useState } from "react";
import { collection,getDocs,addDoc, serverTimestamp } from "firebase/firestore"; // ✅ added
import { db } from "@/lib/firebase";
import { getAuth } from "firebase/auth"; // ✅ added
import { resolveName } from "@/lib/utils";

export default function CartPage(){

const [products,setProducts] = useState<any[]>([]);
const [medicineId,setMedicineId] = useState("");
const [quantity,setQuantity] = useState(1);
const [reason,setReason] = useState("");
const [deploymentDate,setDeploymentDate] = useState("");

/* FETCH AVAILABLE medicine */

const fetchProducts = async()=>{

const snap = await getDocs(collection(db,"products"));

setProducts(
snap.docs.map(d=>({
id:d.id,
...d.data()
}))
);

};

useEffect(()=>{
fetchProducts();
},[]);


/* SUBMIT medicine REQUEST */

const submitRequest = async()=>{

if(!medicineId || !reason || !deploymentDate){
alert("Please complete the form");
return;
}

/* realistic quantity control */

if(quantity < 1 || quantity > 5){
alert("pharmacist can request only 1–5 units");
return;
}

const product = products.find(p=>p.id===medicineId);

/* 🔥 GET LOGGED IN USER */
const auth = getAuth();
const user = auth.currentUser;

/* -------------------- */
/* SAVE ORDER (existing) */
/* -------------------- */

await addDoc(collection(db,"orders"),{
  items:[{
    medicineId:medicineId,
    medicineName:resolveName(product),
    quantity: quantity,          // ✅ ADD THIS
    deploymentDate,
  }],
  reason: reason,                // ✅ ADD THIS (OUTSIDE items)
  status:"pending",
  userId:user?.uid || "pharmacist",
  userEmail:user?.email || "unknown",
  createdAt:serverTimestamp()
});


/* -------------------- */
/* 🔥 ADD TRANSACTION   */
/* -------------------- */

await addDoc(collection(db,"transactions"),{

medicineId:medicineId,
medicineName:resolveName(product),
// ✅ IMPORTANT FEATURE
reason:reason,
performedBy:user?.email || "pharmacist",
userId:user?.uid || null,


createdAt:serverTimestamp()

});


alert("Medicine request submitted for approval");

/* reset form */

setMedicineId("");
setQuantity(1);
setReason("");
setDeploymentDate("");

};


return(

<div className="space-y-6">

<h1 className="text-2xl font-bold">
Request Medicine
</h1>

{/* REQUEST FORM */}

<div className="border p-4 rounded space-y-4">

{/* PRODUCT */}

<div>

<label className="block text-sm font-semibold mb-1">
Product
</label>

<select
value={medicineId}
onChange={(e)=>setMedicineId(e.target.value)}
className="border rounded p-2 w-full"
>

<option value="">Select Medicine</option>

{products.map(p=>(

<option key={p.id} value={p.id}>
{resolveName(p)}
</option>

))}

</select>

</div>


{/* QUANTITY */}

<div>

<label className="block text-sm font-semibold mb-1">
Quantity
</label>

<input
type="number"
min="1"
max="2"
value={quantity}
onChange={(e)=>setQuantity(Number(e.target.value))}
className="border rounded p-2 w-32"
/>

<p className="text-xs text-gray-500 mt-1">
pharmacist may request maximum 2 units
</p>

</div>


{/* REASON */}

<div>

<label className="block text-sm font-semibold mb-1">
Reason
</label>

<textarea
value={reason}
onChange={(e)=>setReason(e.target.value)}
className="border rounded p-2 w-full"
placeholder="Explain why the medicine is required"
/>

</div>


{/* DEPLOYMENT DATE */}

<div>

<label className="block text-sm font-semibold mb-1">
Deployment Date
</label>

<input
type="date"
value={deploymentDate}
onChange={(e)=>setDeploymentDate(e.target.value)}
className="border rounded p-2"
/>

</div>


{/* SUBMIT */}

<button
onClick={submitRequest}
className="bg-green-600 text-white px-4 py-2 rounded"
>
Submit Request
</button>

</div>

</div>

);

}