"use client";

import { useEffect,useState } from "react";
import { collection,getDocs,updateDoc,doc,addDoc,getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { formatUTCDate } from "@/lib/utils";

export default function OrdersPage(){

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

const approveOrder = async(id:string)=>{

const orderRef = doc(db,"orders",id);
const orderSnap = await getDoc(orderRef);
const order:any = orderSnap.data();

if(!order) return;

for(const item of order.items || []){

if(!item.medicineId) continue;

const productRef = doc(db,"products",String(item.medicineId));
const productSnap = await getDoc(productRef);

if(productSnap.exists()){

const productData:any = productSnap.data();

await updateDoc(productRef,{
quantity:(productData.quantity || 0) - (item.quantity || 1)
});

}

await addDoc(collection(db,"transactions"),{

medicineId:item.medicineId,
medicineName:item.medicineName,
quantity:item.quantity,
type:"OUT",
createdAt:new Date()

});

}

await updateDoc(orderRef,{
status:"approved"
});

/* ASSIGN medicine TO pharmacist */

await addDoc(collection(db,"assignments"),{

userId:order.userId,
items:order.items,
issuedDate:new Date(),
status:"active"

});

fetchOrders();

};

/* REJECT ORDER */

const rejectOrder = async(id:string)=>{

await updateDoc(doc(db,"orders",id),{
status:"rejected"
});

fetchOrders();

};

return(

<div>

<h1 className="text-2xl font-bold mb-4">
Medicine Requests
</h1>

{orders.map(order=>(

<div key={order.id} className="border p-4 mb-2 rounded">

{/* NEW REQUEST INFORMATION */}

<div className="mb-3 text-sm space-y-1">

<p><b>Requested By:</b> {order.requestedBy || "pharmacist"}</p>

<p><b>Reason:</b> {order.reason || "N/A"}</p>

<p>
<b>Requested Date:</b>{" "}
{order.createdAt
? formatUTCDate(new Date(order.createdAt.seconds * 1000))
: "N/A"}
</p>

<p>
<b>Priority:</b>{" "}
<span className={
order.priority === "High"
? "text-red-600 font-semibold"
: order.priority === "Medium"
? "text-yellow-600 font-semibold"
: "text-green-600 font-semibold"
}>
{order.priority || "Low"}
</span>
</p>

</div>

{/* DISPLAY ITEMS */}

{order.items?.map((item:any,index:number)=>(

<div key={index} className="mb-2">

<p className="font-semibold">{item.medicineName}</p>

<p>Qty: {item.quantity}</p>

</div>

))}

<p>
Status: 

<span className={
order.status === "approved"
? "text-green-600 font-semibold ml-2"
: order.status === "rejected"
? "text-red-600 font-semibold ml-2"
: "text-yellow-600 font-semibold ml-2"
}>
{order.status || "pending"}
</span>

</p>

<div className="mt-2">

{order.status !== "approved" && order.status !== "rejected" && (

<>

<button
onClick={()=>approveOrder(order.id)}
className="bg-green-600 text-white px-3 py-1 rounded mr-2"
>
Approve
</button>

<button
onClick={()=>rejectOrder(order.id)}
className="bg-red-500 text-white px-3 py-1 rounded"
>
Reject
</button>

</>

)}

</div>

</div>

))}

</div>

);

}