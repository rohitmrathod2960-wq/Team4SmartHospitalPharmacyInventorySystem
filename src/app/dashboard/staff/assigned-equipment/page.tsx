"use client";

import { useEffect,useState } from "react";
import { 
collection,
getDocs,
addDoc,
updateDoc,
doc 
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export default function AssignedEquipmentPage(){

const [items,setItems] = useState<any[]>([]);

const fetchAssignments = async()=>{

const snap = await getDocs(collection(db,"assignments"));

setItems(
snap.docs.map(d=>({
id:d.id,
...d.data()
}))
);

};

useEffect(()=>{
fetchAssignments();
},[]);


/* ============================= */
/* RETURN EQUIPMENT              */
/* ============================= */

const returnItem = async(assignId:string,item:any)=>{

const confirmReturn = confirm("Return this equipment?");
if(!confirmReturn) return;

await addDoc(collection(db,"returns"),{

productId:item.productId,
productName:item.productName,
serial:item.serial || "N/A",
returnedBy:"pharmacist",
returnedAt:new Date(),
condition:item.condition || "Good"

});

alert("Equipment returned successfully");

};


/* ============================= */
/* REPORT DAMAGE                 */
/* ============================= */

const reportDamage = async(item:any)=>{

const issue = prompt("Describe the issue");

if(!issue) return;

await addDoc(collection(db,"damageReports"),{

productId:item.productId,
productName:item.productName,
serial:item.serial || "N/A",
reportedBy:"pharmacist",
issue,
createdAt:new Date(),
status:"pending"

});

alert("Damage report submitted");

};


/* ============================= */
/* VIEW HISTORY (UPDATED)        */
/* ============================= */

const viewHistory = (item:any)=>{

const issuedDate = item.issuedDate?.seconds
? new Date(item.issuedDate.seconds*1000).toLocaleDateString()
: "Unknown";

alert(
`Equipment History — ${item.productName}

${issuedDate}
Issued to you

Returned by you
Condition: ${item.condition || "Good"}

(Note: Full audit history available in Admin dashboard)`
);

};


return(

<div className="space-y-6">

<h1 className="text-2xl font-bold">
Assigned Equipment
</h1>

{items.map(assign=>(

<div key={assign.id} className="border p-4 rounded">

{assign.items?.map((item:any,index:number)=>(

<div key={index} className="mb-4">

<p className="font-semibold">
{item.productName}
</p>

<p>Qty: {item.quantity}</p>

{/* NEW DATA FIELDS */}

<p className="text-sm text-gray-600">
Serial: {item.serial || "N/A"}
</p>

<p className="text-sm text-gray-600">
Condition: {item.condition || "Good"}
</p>

<p className="text-sm text-gray-600">
Return Due: {item.returnDue || "Not Set"}
</p>

{/* ACTION BUTTONS */}

<div className="flex gap-2 mt-3">

<button
onClick={()=>returnItem(assign.id,item)}
className="bg-green-600 text-white px-3 py-1 rounded"
>
Return Item
</button>

<button
onClick={()=>reportDamage(item)}
className="bg-red-500 text-white px-3 py-1 rounded"
>
Report Damage
</button>

<button
onClick={()=>viewHistory(item)}
className="bg-blue-600 text-white px-3 py-1 rounded"
>
View History
</button>

</div>

</div>

))}

<p className="text-sm text-gray-500">

Issued Date: {assign.issuedDate?.seconds
? new Date(assign.issuedDate.seconds*1000).toLocaleDateString()
: "Unknown"}

</p>

</div>

))}

</div>

);

}