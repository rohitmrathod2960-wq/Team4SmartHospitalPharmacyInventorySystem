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
  expiryDate?: any;
  category?: string;
  supplier?: string;
};

type Supplier = {
  id: string;
  name: string;
  email: string;
};

export default function AlertsPage() {

  const [lowStock,setLowStock] = useState<Product[]>([]);
  const [expiryStock,setExpiryStock] = useState<Product[]>([]);
  const [suppliers,setSuppliers] = useState<Supplier[]>([]);
  const [openDropdown,setOpenDropdown] = useState<string | null>(null);

  const [selectedSupplier,setSelectedSupplier] = useState<Supplier | null>(null);
  const [selectedProduct,setSelectedProduct] = useState<Product | null>(null);

  const [message,setMessage] = useState("");

  /* ================= FETCH DATA ================= */

  const fetchAll = async ()=>{

    const snap = await getDocs(collection(db,"products"));

    const today = new Date();
    const next3Days = new Date();
    next3Days.setDate(today.getDate() + 3);

    const products:Product[] = snap.docs.map(d=>{
      const data = d.data();

      return {
        id: d.id,
        ...data,
        name: data.name || data.medicineName || "Unknown Product"
      };
    });

    // LOW STOCK
    const low = products.filter(p=>{
      const quantity = p.quantity ?? p.qty ?? 0;
      const threshold = p.lowStockThreshold ?? p.lowStock ?? 5;
      return quantity <= threshold;
    });

    // EXPIRY
    const expiry = products.filter(p=>{
      if (!p.expiryDate) return false;

      const exp = p.expiryDate?.toDate
        ? p.expiryDate.toDate()
        : new Date(p.expiryDate);

      return exp <= next3Days;
    });

    setLowStock(low);
    setExpiryStock(expiry);
  };

  const fetchSuppliers = async ()=>{
    const snap = await getDocs(collection(db,"suppliers"));

    setSuppliers(
      snap.docs.map(doc=>({
        id:doc.id,
        name:doc.data().name,
        email:doc.data().email
      }))
    );
  };

  useEffect(()=>{
    fetchAll();
    fetchSuppliers();
  },[]);

  /* ================= EMAIL ================= */

  const openEmailModal = (product:Product,supplier:Supplier)=>{

    setSelectedSupplier(supplier);
    setSelectedProduct(product);
    setOpenDropdown(null);

    setMessage(
`Dear ${supplier.name},

Our stock for "${product.name}" requires attention.

Please supply additional units as soon as possible.

Regards,
Inventory Manager`
    );
  };

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

    await addDoc(collection(db,"restockRequests"),{
      medicineId:selectedProduct.id,
      medicineName:selectedProduct.name,
      supplierName:selectedSupplier.name,
      supplierEmail:selectedSupplier.email,
      message:message,
      status:"pending",
      createdAt:new Date()
    });

    alert("Email sent successfully");

    setSelectedSupplier(null);
    setSelectedProduct(null);
  };

  /* ================= UI ================= */

  const renderDropdown = (p:Product)=>(
    <div className="mt-2 relative">

      <button
        className="bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1"
        onClick={()=>setOpenDropdown(openDropdown===p.id?null:p.id)}
      >
        Request Restock <ChevronDown size={16}/>
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
  );

  return (

<ManagerGuard>

<div className="flex flex-col h-[calc(100vh-100px)] space-y-6">

<h1 className="text-3xl font-bold text-red-600">
Inventory Alerts
</h1>

<div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">

{/* ================= LOW STOCK ================= */}

<div className="bg-white rounded-2xl shadow p-4 flex flex-col h-full">

<h2 className="text-xl font-bold text-red-600 mb-4">
Low Stock Alerts
</h2>
<div className="flex-1 overflow-auto p-1">

<table className="w-full">

<thead className="bg-red-600 text-white">
<tr>
<th className="p-2">#</th>
<th className="p-2">Product</th>
<th className="p-2">Category</th>
<th className="p-2">Supplier</th>
<th className="p-2">Qty</th>
<th className="p-2">Action</th>
</tr>
</thead>

<tbody>

{lowStock.length===0 ? (
<tr><td colSpan={6} className="text-center py-4">No Low Stock</td></tr>
) : (
lowStock.map((p,index)=>{

const quantity = p.quantity ?? p.qty ?? 0;

return(
<tr key={p.id} className="text-center border-b">

<td>{index+1}</td>
<td>{p.name}</td>
<td>{p.category}</td>
<td>{p.supplier}</td>
<td className="text-red-600 font-bold">{quantity}</td>

<td>{renderDropdown(p)}</td>

</tr>
);

})
)}

</tbody>

</table>

</div>

</div>

{/* ================= EXPIRY ================= */}

<div className="bg-white rounded-2xl shadow p-4">

<h2 className="text-xl font-bold text-orange-600 mb-4">
Expiry Alerts
</h2>

<div className="overflow-x-auto">

<table className="w-full">

<thead className="bg-orange-500 text-white">
<tr>
<th className="p-2">#</th>
<th className="p-2">Product</th>
<th className="p-2">Category</th>
<th className="p-2">Supplier</th>
<th className="p-2">Expiry</th>
<th className="p-2">Action</th>
</tr>
</thead>

<tbody>

{expiryStock.length===0 ? (
<tr><td colSpan={6} className="text-center py-4">No Expiry Medicines 🚫</td></tr>
) : (
expiryStock.map((p,index)=>{

const expiry = p.expiryDate?.toDate
? p.expiryDate.toDate()
: new Date(p.expiryDate);

return(
<tr key={p.id} className="text-center border-b">

<td>{index+1}</td>
<td>{p.name}</td>
<td>{p.category}</td>
<td>{p.supplier}</td>
<td>{expiry.toLocaleDateString()}</td>

<td>{renderDropdown(p)}</td>

</tr>
);

})
)}

</tbody>

</table>

</div>

</div>

</div>

</div>

{/* ================= MODAL ================= */}

{selectedSupplier && (

<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
  <div className="bg-white p-6 rounded shadow-lg w-[400px]">

<h2 className="text-xl font-bold">Send Restock Email</h2>

<input className="w-full border p-2 my-2" value={selectedSupplier.email} readOnly />

<input className="w-full border p-2 my-2" value={`Restock Request - ${selectedProduct?.name}`} readOnly />

<textarea
className="w-full border p-2 h-40"
value={message}
onChange={(e)=>setMessage(e.target.value)}
/>

<div className="flex justify-end gap-3 mt-3">

<button onClick={()=>setSelectedSupplier(null)} className="bg-gray-300 px-4 py-2 rounded">
Cancel
</button>

<button onClick={sendEmail} className="bg-blue-600 text-white px-4 py-2 rounded">
Send
</button>

</div>

</div>
</div>

)}

</ManagerGuard>
);
}