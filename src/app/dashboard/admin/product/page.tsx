"use client";
import { useState } from "react";
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

export default function AdminProductPage() {

  const [products, setProducts] = useState([
    {
      id: 1,
      sku: "NVG-001",
      name: "Night Vision Goggles",
      price: 150000,
      category: "Optical Equipment",
      supplier: "DefTech Industries",
      qty: 25,
      lowStock: 5,
      serialTracked: true,
      image: "",
    },
    {
      id: 2,
      sku: "DRN-007",
      name: "Surveillance Drone X7",
      price: 750000,
      category: "Aerial Systems",
      supplier: "AeroDefense Corp",
      qty: 12,
      lowStock: 3,
      serialTracked: true,
      image: "",
    },
    {
      id: 3,
      sku: "RAD-450",
      name: "Portable Radar Unit",
      price: 1200000,
      category: "Detection Systems",
      supplier: "SecureWave Technologies",
      qty: 8,
      lowStock: 2,
      serialTracked: true,
      image: "",
    },
  ]);

  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [supplier, setSupplier] = useState("");
  const [qty, setQty] = useState("");
  const [lowStock, setLowStock] = useState("");
  const [serialTracked, setSerialTracked] = useState(false);
  const [image, setImage] = useState("");

  const [editingProduct, setEditingProduct] = useState<any>(null);

  const [successMsg, setSuccessMsg] = useState("");

  const handleAddProduct = () => {

    if (!sku.trim() || !name.trim()) return;

    const newId = products.length
      ? Math.max(...products.map(p => p.id)) + 1
      : 1;

    setProducts([
      ...products,
      {
        id: newId,
        sku,
        name,
        price: Number(price),
        category,
        supplier,
        qty: Number(qty),
        lowStock: Number(lowStock),
        serialTracked,
        image,
      },
    ]);

    setSku("");
    setName("");
    setPrice("");
    setCategory("");
    setSupplier("");
    setQty("");
    setLowStock("");
    setSerialTracked(false);
    setImage("");

    setSuccessMsg("Product added successfully");
    setTimeout(() => setSuccessMsg(""), 2000);
  };

  const handleDeleteProduct = (id: number) => {

    setProducts(products.filter(p => p.id !== id));

    setSuccessMsg("Product deleted successfully");
    setTimeout(() => setSuccessMsg(""), 2000);
  };

  const openEdit = (product: any) => {
    setEditingProduct(product);
  };

  const saveEdit = () => {

    setProducts(
      products.map(p =>
        p.id === editingProduct.id ? editingProduct : p
      )
    );

    setEditingProduct(null);

    setSuccessMsg("Product updated");
    setTimeout(() => setSuccessMsg(""), 2000);
  };

  return (
    <div className="space-y-8 bg-[#f8fafc] min-h-screen p-6">

      <Card className="shadow-2xl rounded-2xl border-none">

        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Product Management
          </CardTitle>
        </CardHeader>

        <CardContent>

          <div className="mb-6">

            <h3 className="font-semibold mb-2 text-lg">
              Add Product
            </h3>

            <div className="flex flex-wrap gap-3 items-center">

              <Input placeholder="SKU" value={sku} onChange={e => setSku(e.target.value)} className="w-32 rounded-lg" />

              <Input placeholder="Name" value={name} onChange={e => setName(e.target.value)} className="w-40 rounded-lg" />

              <Input placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} className="w-28 rounded-lg" type="number" />

              <Input placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} className="w-36 rounded-lg" />

              <Input placeholder="Supplier" value={supplier} onChange={e => setSupplier(e.target.value)} className="w-36 rounded-lg" />

              <Input placeholder="Qty" value={qty} onChange={e => setQty(e.target.value)} className="w-20 rounded-lg" type="number" />

              <Input placeholder="Low stock threshold" value={lowStock} onChange={e => setLowStock(e.target.value)} className="w-28 rounded-lg" type="number" />

              <Input type="file" onChange={(e:any)=>setImage(e.target.files[0]?.name)} className="w-40"/>

              <label className="flex items-center gap-2 text-sm">
                Serial tracked
                <input type="checkbox" checked={serialTracked} onChange={e=>setSerialTracked(e.target.checked)} />
              </label>

              <Button onClick={handleAddProduct} variant="default" className="rounded-lg font-semibold">
                Add Product
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

                  <TableHead className="text-white font-bold text-lg">SKU</TableHead>
                  <TableHead className="text-white font-bold text-lg">Name</TableHead>
                  <TableHead className="text-white font-bold text-lg">Price</TableHead>
                  <TableHead className="text-white font-bold text-lg">Category</TableHead>
                  <TableHead className="text-white font-bold text-lg">Supplier</TableHead>
                  <TableHead className="text-white font-bold text-lg">Qty</TableHead>
                  <TableHead className="text-white font-bold text-lg">Low stock threshold</TableHead>
                  <TableHead className="text-white font-bold text-lg">Serial Tracked</TableHead>
                  <TableHead className="text-white font-bold text-lg">Action</TableHead>

                </TableRow>

              </TableHeader>

              <TableBody>

                {products.length === 0 ? (

                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground">
                      No products found.
                    </TableCell>
                  </TableRow>

                ) : (

                  products.map(product => (

                    <TableRow key={product.id} className="hover:bg-muted/30 transition-colors">

                      <TableCell>{product.sku}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.price}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{product.supplier}</TableCell>
                      <TableCell>{product.qty}</TableCell>
                      <TableCell>{product.lowStock}</TableCell>
                      <TableCell>{product.serialTracked ? "Yes" : "No"}</TableCell>

                      <TableCell className="flex gap-2">

                        <Button size="sm" className="bg-yellow-500 text-white rounded-md" onClick={() => openEdit(product)}>
                          Edit
                        </Button>

                        <Button variant="destructive" size="sm" className="rounded-md" onClick={() => handleDeleteProduct(product.id)}>
                          Delete
                        </Button>

                      </TableCell>

                    </TableRow>

                  ))

                )}

              </TableBody>

            </Table>

          </div>

        </CardContent>

      </Card>

      {/* EDIT MODAL */}

      {editingProduct && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white p-6 rounded shadow space-y-4 w-96">

            <h2 className="text-xl font-bold">
              Edit Product
            </h2>

            <Input value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct,name:e.target.value})}/>

            <Input type="number" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct,price:Number(e.target.value)})}/>

            <Input value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct,category:e.target.value})}/>

            <Input value={editingProduct.supplier} onChange={e => setEditingProduct({...editingProduct,supplier:e.target.value})}/>

            <Input type="number" value={editingProduct.lowStock} onChange={e => setEditingProduct({...editingProduct,lowStock:Number(e.target.value)})}/>

            <label className="flex items-center gap-2">
              Serial tracked
              <input type="checkbox"
                checked={editingProduct.serialTracked}
                onChange={e=>setEditingProduct({...editingProduct,serialTracked:e.target.checked})}
              />
            </label>

            <div className="flex justify-end gap-3">

              <Button variant="outline" onClick={() => setEditingProduct(null)}>
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
  );
}