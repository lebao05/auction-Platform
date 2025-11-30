import { useState } from "react"
import { Plus, Edit, Trash2, Eye } from "lucide-react"
import { Button } from "../../../components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card"
import { Badge } from "../../../components/ui/Badge"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
} from "../../../components/ui/AlertDialog"

const initialProducts = [
    {
        id: 1,
        name: "iPhone 11",
        category: "Electronics",
        price: 10000000,
        seller: "Tech Store",
        status: "active",
        endDate: "2024-11-15",
    },
    {
        id: 2,
        name: "MacBook Pro 16",
        category: "Electronics",
        price: 28000000,
        seller: "Laptop World",
        status: "active",
        endDate: "2024-11-14",
    },
    {
        id: 3,
        name: "Rolex Submariner",
        category: "Fashion",
        price: 15000000,
        seller: "Luxury Watches",
        status: "ended",
        endDate: "2024-11-10",
    },
]

export function AdminProducts() {
    const [products, setProducts] = useState(initialProducts)
    const [deleteAlertOpen, setDeleteAlertOpen] = useState(false)
    const [productToDelete, setProductToDelete] = useState < number | null > (null)

    const handleDelete = () => {
        if (productToDelete) {
            setProducts(products.filter((p) => p.id !== productToDelete))
            setProductToDelete(null)
            setDeleteAlertOpen(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Quản Lý Sản Phẩm</h2>
                    <p className="text-sm text-muted-foreground mt-1">Xem, thêm, sửa, xóa sản phẩm đấu giá</p>
                </div>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Thêm Sản Phẩm
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Danh Sách Sản Phẩm</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left py-3 px-4 font-semibold text-foreground">Tên Sản Phẩm</th>
                                    <th className="text-left py-3 px-4 font-semibold text-foreground">Danh Mục</th>
                                    <th className="text-left py-3 px-4 font-semibold text-foreground">Người Bán</th>
                                    <th className="text-left py-3 px-4 font-semibold text-foreground">Giá Hiện Tại</th>
                                    <th className="text-left py-3 px-4 font-semibold text-foreground">Trạng Thái</th>
                                    <th className="text-left py-3 px-4 font-semibold text-foreground">Thao Tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id} className="border-b border-border hover:bg-accent/50">
                                        <td className="py-4 px-4 text-foreground font-medium">{product.name}</td>
                                        <td className="py-4 px-4 text-muted-foreground">{product.category}</td>
                                        <td className="py-4 px-4 text-muted-foreground">{product.seller}</td>
                                        <td className="py-4 px-4 text-foreground font-medium">
                                            {product.price.toLocaleString("vi-VN")} VND
                                        </td>
                                        <td className="py-4 px-4">
                                            <Badge variant={product.status === "active" ? "default" : "secondary"}>
                                                {product.status === "active" ? "Đang diễn ra" : "Đã kết thúc"}
                                            </Badge>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex gap-2">
                                                <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            setProductToDelete(product.id)
                                                            setDeleteAlertOpen(true)
                                                        }}
                                                        className="text-destructive hover:bg-destructive/10"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                    <AlertDialogContent>
                                                        <AlertDialogTitle>Xóa Sản Phẩm?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Bạn có chắc chắn muốn xóa sản phẩm "{product.name}"?
                                                        </AlertDialogDescription>
                                                        <div className="flex gap-2 justify-end">
                                                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                                                            <AlertDialogAction onClick={handleDelete} className="bg-destructive">
                                                                Xóa
                                                            </AlertDialogAction>
                                                        </div>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
