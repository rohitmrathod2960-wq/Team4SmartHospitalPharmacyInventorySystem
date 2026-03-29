"use client";

import { useEffect,useState } from "react";
import { collection,getDocs,updateDoc,doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { formatUTCDate } from "@/lib/utils";

export default function pharmacistOrdersPage(){

const [orders,setOrders] = useState<any[]>([]);

const fetchOrders = async()=>{

const snap = await getDocs(collection(db,"orders"));

setOrders(
snap.docs.map(d=>({
id:d.id,
...d.data()
}))
);

};

useEffect(()=>{
fetchOrders();
},[]);


/* ============================= */
/* CANCEL REQUEST                */
/* ============================= */

const cancelRequest = async(id:string)=>{

const confirmCancel = confirm("Cancel this request?");
if(!confirmCancel) return;

await updateDoc(doc(db,"orders",id),{
status:"cancelled"
});

fetchOrders();

};


return(

<div className="space-y-6">

<h1 className="text-2xl font-bold">
My Medicine Requests
</h1>

{orders.length===0 &&(
<p className="text-gray-500">
No requests found
</p>
)}

{orders.map(order=>(

<div key={order.id} className="border p-4 rounded">

{order.items?.map((item:any,index:number)=>(

<div key={index} className="mb-2">

<p className="font-semibold">
{item.productName}
</p>

<p className="text-sm">
Qty: {item.quantity}
</p>

{/* NEW FIELD */}
<p className="text-sm text-gray-500">
Requested: {order.createdAt?.seconds
? formatUTCDate(new Date(order.createdAt.seconds * 1000))
: "Unknown"}
</p>

</div>

))}

<p>

Status:

<span className={
order.status === "approved"
? "text-green-600 font-semibold ml-2"
: order.status === "rejected"
? "text-red-600 font-semibold ml-2"
: order.status === "cancelled"
? "text-gray-500 font-semibold ml-2"
: "text-yellow-600 font-semibold ml-2"
}>
{order.status || "pending"}
</span>

</p>

{/* APPROVED BY */}

{order.status==="approved" && order.approvedBy &&(

<p className="text-sm text-gray-600 mt-1">
Approved By: {order.approvedBy}
</p>

)}

{/* REJECTION REASON */}

{order.status==="rejected" && order.rejectionReason &&(

<p className="text-sm text-red-600 mt-1">
Reason: {order.rejectionReason}
</p>

)}

{/* CANCEL BUTTON */}

{order.status==="pending" &&(

<button
onClick={()=>cancelRequest(order.id)}
className="mt-3 bg-red-500 text-white px-3 py-1 rounded"
>
Cancel
</button>

)}

</div>

))}

</div>

);

}