"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ManagerGuard from "@/components/dashboard/ManagerGuard";
import { ChevronDown } from "lucide-react";

type Product = {
  id: string;
  name: string;
  quantity?: number;
  qty?: number;
  lowStockThreshold?: number;
  lowStock?: number;
};

type Supplier = {
  id: string;
  name: string;
  email: string;
};

export default function AlertsPage() {

  const [lowStock,setLowStock] = useState<Product[]>([]);
  const [suppliers,setSuppliers] = useState<Supplier[]>([]);
  const [openDropdown,setOpenDropdown] = useState<string | null>(null);

  const [selectedSupplier,setSelectedSupplier] = useState<Supplier | null>(null);
  const [selectedProduct,setSelectedProduct] = useState<Product | null>(null);

  const [message,setMessage] = useState("");

  /* FETCH PRODUCTS */

  const fetchAlerts = async ()=>{

    const snap = await getDocs(collection(db,"products"));

    const products:Product[] = snap.docs.map(d=>({
      id:d.id,
      ...(d.data() as Omit<Product,"id">)
    }));

    const filtered = products.filter(p=>{
      const quantity = p.quantity ?? p.qty ?? 0;
      const threshold = p.lowStockThreshold ?? p.lowStock ?? 5;
      return quantity <= threshold;
    });

    setLowStock(filtered);

  };

  /* FETCH SUPPLIERS */

  const fetchSuppliers = async ()=>{

    const snap = await getDocs(collection(db,"suppliers"));

    const data:Supplier[] = snap.docs.map(doc=>({
      id:doc.id,
      name:doc.data().name,
      email:doc.data().email
    }));

    setSuppliers(data);

  };

  useEffect(()=>{
    fetchAlerts();
    fetchSuppliers();
  },[]);


  /* OPEN EMAIL MODAL */

  const openEmailModal = (product:Product,supplier:Supplier)=>{

    setSelectedSupplier(supplier);
    setSelectedProduct(product);
    setOpenDropdown(null);
    setMessage(
`Dear ${supplier.name},

Our stock for "${product.name}" has dropped below the safety threshold.

Please supply additional units as soon as possible.

Regards,
Inventory Manager`
    );

  };


  /* SEND EMAIL */

  const sendEmail = async ()=>{

    if(!selectedSupplier || !selectedProduct) return;

    await fetch("/api/send-restock-mail",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({
        to:selectedSupplier.email,
        subject:`Restock Request - ${selectedProduct.name}`,
        message:message
      })
    });

    const quantity = selectedProduct.quantity ?? selectedProduct.qty ?? 0;
    const threshold = selectedProduct.lowStockThreshold ?? selectedProduct.lowStock ?? 5;

    await addDoc(collection(db,"restockRequests"),{

      productId:selectedProduct.id,
      productName:selectedProduct.name,
      supplierName:selectedSupplier.name,
      supplierEmail:selectedSupplier.email,
      currentStock:quantity,
      threshold:threshold,
      message:message,
      status:"pending",
      createdAt:new Date()

    });

    alert("Email sent successfully");

    setSelectedSupplier(null);
    setSelectedProduct(null);

  };


  return (

<ManagerGuard>

<div className="space-y-6">

<h1 className="text-3xl font-bold text-red-600">
Low Stock Alerts
</h1>

<div className="grid grid-cols-3 gap-4">

{lowStock.map(p=>{

const quantity = p.quantity ?? p.qty ?? 0;
const threshold = p.lowStockThreshold ?? p.lowStock ?? 5;

return(

<div
key={p.id}
className="bg-white border-l-4 border-red-500 shadow p-4 rounded-lg"
>

<h2 className="text-lg font-semibold">{p.name}</h2>

<p className="text-gray-600">
Available: <span className="font-bold text-red-600">{quantity}</span>
</p>

<p className="text-sm text-gray-500">
Threshold: {threshold}
</p>

<span className="inline-block mt-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
Low Stock Warning
</span>

<div className="mt-3 flex items-center gap-2 relative">

<button
className="bg-blue-600 text-white px-4 py-1 rounded"
onClick={()=>setOpenDropdown(openDropdown===p.id?null:p.id)}
>
Request Restock
</button>

<button
onClick={()=>setOpenDropdown(openDropdown===p.id?null:p.id)}
className="bg-gray-200 p-1 rounded"
>
<ChevronDown size={18}/>
</button>

{openDropdown===p.id &&(

<div className="absolute top-10 left-0 bg-white shadow-lg border rounded w-64 z-10">

{suppliers.map(s=>(
<div
key={s.id}
onClick={()=>openEmailModal(p,s)}
className="p-3 hover:bg-gray-100 cursor-pointer border-b"
>

<p className="font-semibold text-sm">{s.name}</p>
<p className="text-xs text-gray-500">{s.email}</p>

</div>
))}

</div>

)}

</div>

</div>

);

})}

</div>

</div>


{/* EMAIL COMPOSE MODAL */}

{selectedSupplier && (

<div className="fixed inset-0 bg-black/40 flex items-center justify-end pr-32 z-50">

<div className="bg-white p-6 rounded-xl w-[500px] space-y-4">

<h2 className="text-xl font-bold">
Send Restock Email
</h2>

<div>

<label className="text-sm text-gray-500">To</label>

<input
className="w-full border rounded p-2"
value={selectedSupplier.email}
readOnly
/>

</div>

<div>

<label className="text-sm text-gray-500">Subject</label>

<input
className="w-full border rounded p-2"
value={`Restock Request - ${selectedProduct?.name}`}
readOnly
/>

</div>

<textarea
className="w-full border rounded p-2 h-40"
value={message}
onChange={(e)=>setMessage(e.target.value)}
/>

<div className="flex justify-end gap-3">

<button
onClick={()=>setSelectedSupplier(null)}
className="px-4 py-2 bg-gray-300 rounded"
>
Cancel
</button>

<button
onClick={sendEmail}
className="px-4 py-2 bg-blue-600 text-white rounded"
>
Send
</button>

</div>

</div>

</div>

)}

</ManagerGuard>

);

}