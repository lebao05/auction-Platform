import { useState } from "react"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Button } from "../../../components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card"
import { Badge } from "../../../components/ui/Badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/Dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
} from "../../../components/ui/AlertDialog"
import { useAdmin } from "../../../contexts/AdminContext"


// SAMPLE DATA
const initialCategories = [
    { id: '1', name: "Electronics", parentId: null, productCount: 342, createdAt: "2024-01-15" },
    { id: '2', name: "Fashion", parentId: null, productCount: 521, createdAt: "2024-01-20" },
    { id: '3', name: "Home & Garden", parentId: null, productCount: 218, createdAt: "2024-02-01" },
    { id: '4', name: "Sports & Outdoors", parentId: null, productCount: 145, createdAt: "2024-02-10" },
    { id: '5', name: "Books & Media", parentId: null, productCount: 0, createdAt: "2024-03-05" },
]

export function AdminCategories() {
    const [tempCategories, setTempCategories] = useState(initialCategories)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [formData, setFormData] = useState({ name: "", parentId: null })
    const [deleteAlertOpen, setDeleteAlertOpen] = useState(false)
    const [categoryToDelete, setCategoryToDelete] = useState(null)
    const { categories, addCategory, updateCategory, deleteCategory } = useAdmin();
    console.log(categories);
    // --------------------
    // ADD
    // --------------------
    const openAddDialog = () => {
        setEditingId(null)
        setFormData({ name: "", parentId: null })
        setDialogOpen(true)
    }

    const handleAdd = () => {
        if (!formData.name.trim()) return

        const newCategory = {
            id: Math.max(...categories.map((c) => c.id), 0) + 1,
            name: formData.name,
            parentId: formData.parentId || null,
            productCount: 0,
            createdAt: new Date().toISOString().split("T")[0],
        }
        addCategory(newCategory);
        setDialogOpen(false)
    }

    // --------------------
    // EDIT
    // --------------------
    const openEditDialog = (category) => {
        setEditingId(category.id)
        setFormData({ ...category, parentId: category.parent?.id })
        setDialogOpen(true)
    }

    const handleEdit = () => {
        if (!formData.name.trim() || !editingId) return
        updateCategory({ id: editingId, name: formData.name, parentId: formData.parentId });
        setDialogOpen(false)
        setEditingId(null)
    }
    console.log(formData);
    // --------------------
    // DELETE
    // --------------------
    const handleDelete = () => {
        if (!categoryToDelete) return

        deleteCategory(categoryToDelete);
    }
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Quản Lý Danh Mục</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Thêm, sửa, xóa & quản lý danh mục cha - con
                    </p>
                </div>

                <Button
                    className="flex items-center gap-2 bg-green-500 text-white"
                    onClick={openAddDialog}
                >
                    <Plus className="h-4 w-4" />
                    Thêm Danh Mục
                </Button>
            </div>

            {/* DIALOG */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingId ? "Sửa Danh Mục" : "Thêm Danh Mục Mới"}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        {/* NAME */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Tên Danh Mục</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border rounded-md"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                            />
                        </div>

                        {/* PARENT CATEGORY */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Danh Mục Cha (Tuỳ chọn)
                            </label>

                            <select
                                className="w-full px-3 py-2 border rounded-md"
                                value={formData.parentId ?? ""}
                                onChange={(e) =>
                                    setFormData({ ...formData, parentId: e.target.value || null })
                                }
                            >
                                <option value="">Không chọn</option>

                                {categories
                                    .filter((c) => c.id !== editingId && c.parent === null)
                                    .map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name} *(depth = 1)
                                        </option>
                                    ))}
                            </select>
                        </div>

                        {/* SAVE BUTTON */}
                        <Button
                            onClick={editingId ? handleEdit : handleAdd}
                            className="w-full bg-primary text-white"
                        >
                            {editingId ? "Cập Nhật" : "Thêm"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* TABLE */}
            <Card>
                <CardHeader>
                    <CardTitle>Danh Sách Danh Mục</CardTitle>
                </CardHeader>

                <CardContent>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b">
                                <th className="py-3 px-4 text-left font-semibold">Tên Danh Mục</th>
                                <th className="py-3 px-4 text-left font-semibold">Danh Mục Cha</th>
                                <th className="py-3 px-4 text-left font-semibold">Sản Phẩm</th>
                                <th className="py-3 px-4 text-left font-semibold">Ngày Tạo</th>
                                <th className="py-3 px-4 text-left font-semibold">Thao Tác</th>
                            </tr>
                        </thead>

                        <tbody>
                            {categories.map((category) => {
                                const parent = categories.find((c) => c.id === category.parentId)
                                const canDelete = category.productCount === 0

                                return (
                                    <tr key={category.id} className="border-b hover:bg-accent/50">
                                        <td className="py-4 px-4">{category.name}</td>

                                        <td className="py-4 px-4 text-muted-foreground">
                                            {category.parent ? category.parent.name : "—"}
                                        </td>

                                        <td className="py-4 px-4">
                                            <Badge variant={canDelete ? "secondary" : "default"}>
                                                0 sản phẩm
                                            </Badge>
                                        </td>

                                        <td className="py-4 px-4 text-muted-foreground">
                                            {new Date(category.createdAt).toLocaleDateString("vi-VN")}
                                        </td>

                                        <td className="py-4 px-4">
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openEditDialog(category)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>

                                                {/* DELETE */}
                                                {true ? (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            setCategoryToDelete(category.id);
                                                            handleDelete();
                                                        }}
                                                        className="text-destructive"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        disabled
                                                        className="cursor-not-allowed text-muted-foreground"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    )
}
