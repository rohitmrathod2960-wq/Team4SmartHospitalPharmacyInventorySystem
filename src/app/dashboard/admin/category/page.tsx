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

export default function AdminCategoryPage() {

  const [categories, setCategories] = useState([
    { id: 1, name: "Electronics", description: "Electronic devices and accessories", products: 5, status: "active" },
    { id: 2, name: "Office Supplies", description: "General office supplies and stationery", products: 0, status: "active" },
    { id: 3, name: "Furniture", description: "Office area workspace furniture", products: 2, status: "active" },
  ]);

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const handleAddCategory = () => {
    if (!name.trim() || !desc.trim()) return;

    const newId = categories.length ? Math.max(...categories.map(c => c.id)) + 1 : 1;

    setCategories([
      ...categories,
      { id: newId, name, description: desc, products: 0, status: "active" }
    ]);

    setName("");
    setDesc("");

    setSuccessMsg("Category added successfully");
    setTimeout(() => setSuccessMsg(""), 2000);
  };

  const handleDeleteCategory = (id: number) => {

    const category = categories.find(c => c.id === id);

    if (!category) return;

    if (category.products > 0) {
      setSuccessMsg("Cannot delete category because products exist");
      setTimeout(() => setSuccessMsg(""), 2000);
      return;
    }

    setCategories(categories.filter(c => c.id !== id));

    setSuccessMsg("Category deleted successfully");
    setTimeout(() => setSuccessMsg(""), 2000);
  };

  const handleArchiveCategory = (id:number) => {

    setCategories(categories.map(cat =>
      cat.id === id ? { ...cat, status: "archived" } : cat
    ));

    setSuccessMsg("Category archived");
    setTimeout(() => setSuccessMsg(""), 2000);
  };

  const openEdit = (cat:any) => {
    setEditingCategory(cat);
    setEditName(cat.name);
    setEditDesc(cat.description);
  };

  const saveEdit = () => {

    setCategories(categories.map(cat =>
      cat.id === editingCategory.id
        ? { ...cat, name: editName, description: editDesc }
        : cat
    ));

    setEditingCategory(null);

    setSuccessMsg("Category updated");
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

          <div className="mb-6">
            <h3 className="font-semibold mb-2 text-lg">Add Category</h3>

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
                variant="default"
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

          <div className="overflow-x-auto rounded-xl mt-4">

            <Table>

              <TableHeader>

                <TableRow className="bg-blue-700 hover:bg-blue-700 cursor-default">

                  <TableHead className="text-white font-bold text-lg">
                    ID
                  </TableHead>

                  <TableHead className="text-white font-bold text-lg">
                    Name
                  </TableHead>

                  <TableHead className="text-white font-bold text-lg">
                    Description
                  </TableHead>

                  <TableHead className="text-white font-bold text-lg">
                    Products
                  </TableHead>

                  <TableHead className="text-white font-bold text-lg">
                    Status
                  </TableHead>

                  <TableHead className="text-white font-bold text-lg">
                    Action
                  </TableHead>

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

                  categories.map(cat => (

                    <TableRow key={cat.id} className="hover:bg-muted/30 transition-colors">

                      <TableCell>{cat.id}</TableCell>

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
                          className="bg-yellow-500 text-white rounded-md"
                          onClick={() => openEdit(cat)}
                        >
                          Edit
                        </Button>

                        <Button
                          size="sm"
                          className="bg-gray-600 text-white rounded-md"
                          onClick={() => handleArchiveCategory(cat.id)}
                        >
                          Archive
                        </Button>

                        <Button
                          variant="destructive"
                          size="sm"
                          className="rounded-md"
                          onClick={() => handleDeleteCategory(cat.id)}
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

            <h2 className="text-xl font-bold">
              Edit Category
            </h2>

            <Input
              value={editName}
              onChange={e => setEditName(e.target.value)}
              className="rounded-lg"
            />

            <Input
              value={editDesc}
              onChange={e => setEditDesc(e.target.value)}
              className="rounded-lg"
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