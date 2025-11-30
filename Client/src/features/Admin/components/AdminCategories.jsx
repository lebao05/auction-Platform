"use client"

import { useState } from "react"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Button } from "../../../components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card"
import { Badge } from "../../../components/ui/Badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/Dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
} from "../../../components/ui/AlertDialog"

const initialCategories = [
    { id: 1, name: "Electronics", productCount: 342, createdAt: "2024-01-15" },
    { id: 2, name: "Fashion", productCount: 521, createdAt: "2024-01-20" },
    { id: 3, name: "Home & Garden", productCount: 218, createdAt: "2024-02-01" },
    { id: 4, name: "Sports & Outdoors", productCount: 145, createdAt: "2024-02-10" },
    { id: 5, name: "Books & Media", productCount: 0, createdAt: "2024-03-05" },
]

export function AdminCategories() {
    const [categories, setCategories] = useState(initialCategories)
    const [isOpen, setIsOpen] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [formData, setFormData] = useState({ name: "" })
    const [deleteAlertOpen, setDeleteAlertOpen] = useState(false)
    const [categoryToDelete, setCategoryToDelete] = useState(null)

    const handleAdd = () => {
        if (formData.name.trim()) {
            const newCategory = {
                id: Math.max(...categories.map((c) => c.id), 0) + 1,
                name: formData.name,
                productCount: 0,
                createdAt: new Date().toISOString().split("T")[0],
            }
            setCategories([...categories, newCategory])
            setFormData({ name: "" })
            setIsOpen(false)
        }
    }

    const handleEdit = () => {
        if (formData.name.trim() && editingId) {
            setCategories(
                categories.map((c) =>
                    c.id === editingId ? { ...c, name: formData.name } : c
                )
            )
            setFormData({ name: "" })
            setEditingId(null)
            setIsOpen(false)
        }
    }

    const handleDelete = () => {
        if (categoryToDelete) {
            const categoryHasProducts =
                categories.find((c) => c.id === categoryToDelete)?.productCount === 0

            if (categoryHasProducts) {
                setCategories(categories.filter((c) => c.id !== categoryToDelete))
            }

            setCategoryToDelete(null)
            setDeleteAlertOpen(false)
        }
    }

    const startEdit = (category) => {
        setEditingId(category.id)
        setFormData({ name: category.name })
        setIsOpen(true)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Quản Lý Danh Mục</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Thêm, sửa, xóa danh mục sản phẩm
                    </p>
                </div>

                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button
                            onClick={() => {
                                setEditingId(null)
                                setFormData({ name: "" })
                            }}
                            className="gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Thêm Danh Mục
                        </Button>
                    </DialogTrigger>

                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {editingId ? "Sửa Danh Mục" : "Thêm Danh Mục Mới"}
                            </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Tên Danh Mục
                                </label>
                                <input
                                    type="text"
                                    placeholder="VD: Electronics"
                                    className="w-full px-3 py-2 bg-card border border-border rounded-md text-foreground placeholder-muted-foreground"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ name: e.target.value })}
                                />
                            </div>

                            <Button
                                onClick={editingId ? handleEdit : handleAdd}
                                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                                {editingId ? "Cập Nhật" : "Thêm"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Danh Sách Danh Mục</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                                        Tên Danh Mục
                                    </th>
                                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                                        Sản Phẩm
                                    </th>
                                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                                        Ngày Tạo
                                    </th>
                                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                                        Thao Tác
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {categories.map((category) => {
                                    const canDelete = category.productCount === 0

                                    return (
                                        <tr key={category.id} className="border-b border-border hover:bg-accent/50">
                                            <td className="py-4 px-4 text-foreground font-medium">
                                                {category.name}
                                            </td>

                                            <td className="py-4 px-4">
                                                <Badge
                                                    variant={
                                                        category.productCount > 0 ? "default" : "secondary"
                                                    }
                                                >
                                                    {category.productCount} sản phẩm
                                                </Badge>
                                            </td>

                                            <td className="py-4 px-4 text-muted-foreground">
                                                {new Date(category.createdAt).toLocaleDateString("vi-VN")}
                                            </td>

                                            <td className="py-4 px-4">
                                                <div className="flex gap-2">

                                                    {/* EDIT */}
                                                    <Dialog
                                                        open={isOpen && editingId === category.id}
                                                        onOpenChange={setIsOpen}
                                                    >
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => startEdit(category)}
                                                                className="text-primary hover:bg-primary/10"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        </DialogTrigger>
                                                    </Dialog>

                                                    {/* DELETE */}
                                                    {canDelete ? (
                                                        <AlertDialog
                                                            open={deleteAlertOpen}
                                                            onOpenChange={setDeleteAlertOpen}
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setCategoryToDelete(category.id)
                                                                    setDeleteAlertOpen(true)
                                                                }}
                                                                className="text-destructive hover:bg-destructive/10"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>

                                                            <AlertDialogContent>
                                                                <AlertDialogTitle>Xóa Danh Mục?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Bạn có chắc muốn xóa danh mục "
                                                                    {category.name}"?
                                                                </AlertDialogDescription>

                                                                <div className="flex gap-2 justify-end">
                                                                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        onClick={handleDelete}
                                                                        className="bg-destructive"
                                                                    >
                                                                        Xóa
                                                                    </AlertDialogAction>
                                                                </div>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    ) : (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            disabled
                                                            title="Không thể xóa danh mục có sản phẩm"
                                                            className="text-muted-foreground cursor-not-allowed"
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
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
