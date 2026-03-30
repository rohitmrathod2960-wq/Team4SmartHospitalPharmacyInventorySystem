"use client";

import { useState, useEffect } from "react";
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

import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export default function AdminCategoryPage() {

  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");

  /* =============================== */
  /* FETCH CATEGORIES FROM FIRESTORE */
  /* =============================== */

const fetchCategories = async () => {

  const catSnap = await getDocs(collection(db, "categories"));
  const prodSnap = await getDocs(collection(db, "products"));

  const products = prodSnap.docs.map(doc => doc.data());

  const data = catSnap.docs.map((docItem, index) => {

    const cat = docItem.data();

    // 🔥 count products for this category
    const count = products.filter(
      (p: any) => p.category === cat.name
    ).length;

    return {
      id: docItem.id,
      index: index + 1,
      name: cat.name,
      description: cat.description,
      products: count === 0 ? "N/A" : count,  // ✅ YOUR REQUIREMENT
      status: cat.status
    };
  });

  setCategories(data);
};

  useEffect(() => {
    fetchCategories();
  }, []);

  /* =============================== */
  /* ADD CATEGORY                    */
  /* =============================== */

  const handleAddCategory = async () => {

    if (!name.trim() || !desc.trim()) return;

    await addDoc(collection(db, "categories"), {
      name: name,
      description: desc,
      status: "active",
      createdAt: serverTimestamp()
    });

    setName("");
    setDesc("");

    setSuccessMsg("Category added successfully");

    fetchCategories();

    setTimeout(() => setSuccessMsg(""), 2000);
  };

  /* =============================== */
  /* DELETE CATEGORY                 */
  /* =============================== */

  const handleDeleteCategory = async (id: string, products: number) => {

    if (products > 0) {
      setSuccessMsg("Cannot delete category because products exist");
      setTimeout(() => setSuccessMsg(""), 2000);
      return;
    }

    await deleteDoc(doc(db, "categories", id));

    setSuccessMsg("Category deleted successfully");

    fetchCategories();

    setTimeout(() => setSuccessMsg(""), 2000);
  };

  /* =============================== */
  /* ARCHIVE CATEGORY                */
  /* =============================== */

  const handleArchiveCategory = async (id: string) => {

    await updateDoc(doc(db, "categories", id), {
      status: "archived"
    });

    setSuccessMsg("Category archived");

    fetchCategories();

    setTimeout(() => setSuccessMsg(""), 2000);
  };

  /* =============================== */
  /* EDIT CATEGORY                   */
  /* =============================== */

  const openEdit = (cat:any) => {

    setEditingCategory(cat);
    setEditName(cat.name);
    setEditDesc(cat.description);

  };

  const saveEdit = async () => {

    await updateDoc(doc(db, "categories", editingCategory.id), {
      name: editName,
      description: editDesc
    });

    setEditingCategory(null);

    setSuccessMsg("Category updated");

    fetchCategories();

    setTimeout(() => setSuccessMsg(""), 2000);

  };

  return (

    <div className="space-y-8 bg-[#f8fafc] min-h-screen p-6">

      <Card className="shadow-2xl rounded-2xl border-none">

        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Category Management
          </CardTitle>
        </CardHeader>

        <CardContent>

          {/* ADD CATEGORY */}

          <div className="mb-6">

            <h3 className="font-semibold mb-2 text-lg">
              Add Category
            </h3>

            <div className="flex flex-wrap gap-3 items-center">

              <Input
                placeholder="Category name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-48 rounded-lg"
              />

              <Input
                placeholder="Description"
                value={desc}
                onChange={e => setDesc(e.target.value)}
                className="w-96 rounded-lg"
              />

              <Button
                onClick={handleAddCategory}
                className="rounded-lg font-semibold"
              >
                Add Category
              </Button>

            </div>

            {successMsg && (
              <div className="bg-green-100 text-green-700 px-3 py-1 rounded mb-2 text-sm w-fit mt-3 shadow">
                {successMsg}
              </div>
            )}

          </div>

          {/* CATEGORY TABLE */}

          <div className="overflow-x-auto rounded-xl mt-4">

            <Table>

              <TableHeader>

                <TableRow className="bg-blue-700 hover:bg-blue-700">

                  <TableHead className="text-white font-bold text-lg">ID</TableHead>
                  <TableHead className="text-white font-bold text-lg">Name</TableHead>
                  <TableHead className="text-white font-bold text-lg">Description</TableHead>
                  <TableHead className="text-white font-bold text-lg">Products</TableHead>
                  <TableHead className="text-white font-bold text-lg">Status</TableHead>
                  <TableHead className="text-white font-bold text-lg">Action</TableHead>

                </TableRow>

              </TableHeader>

              <TableBody>

                {categories.length === 0 ? (

                  <TableRow>

                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No categories found.
                    </TableCell>

                  </TableRow>

                ) : (

                  categories.map((cat, index) => (

                    <TableRow key={cat.id} className="hover:bg-muted/30">

                      <TableCell>{index + 1}</TableCell>

                      <TableCell>{cat.name}</TableCell>

                      <TableCell>{cat.description}</TableCell>

                      <TableCell>{cat.products}</TableCell>

                      <TableCell>

                        <span className={cat.status === "archived" ? "text-red-500" : "text-green-600"}>
                          {cat.status}
                        </span>

                      </TableCell>

                      <TableCell className="flex gap-2">

                        <Button
                          size="sm"
                          className="bg-yellow-500 text-white"
                          onClick={() => openEdit(cat)}
                        >
                          Edit
                        </Button>

                        <Button
                          size="sm"
                          className="bg-gray-600 text-white"
                          onClick={() => handleArchiveCategory(cat.id)}
                        >
                          Archive
                        </Button>

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteCategory(cat.id, cat.products)}
                        >
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

      {editingCategory && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white p-6 rounded shadow space-y-4 w-96">

            <h2 className="text-xl font-bold">Edit Category</h2>

            <Input
              value={editName}
              onChange={e => setEditName(e.target.value)}
            />

            <Input
              value={editDesc}
              onChange={e => setEditDesc(e.target.value)}
            />

            <div className="flex justify-end gap-3">

              <Button
                variant="outline"
                onClick={() => setEditingCategory(null)}
              >
                Cancel
              </Button>

              <Button
                onClick={saveEdit}
                className="bg-blue-600 text-white"
              >
                Save
              </Button>

            </div>

          </div>

        </div>

      )}

    </div>

  );
}