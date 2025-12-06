import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Eye, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/Tabs";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
} from "../../../components/ui/AlertDialog";
import { useSellerRequests } from "../../../hooks/useSellerRequests";
import { useAuth } from "../../../contexts/AuthContext";
import { formatDateTimeFull } from "../../../utils/DateTimeExtension";

const initialUsers = [
    { id: 1, name: "Nguyễn Văn A", email: "nguyenvana@email.com", joinDate: "2024-01-15", rating: 4.8, type: "bidder" },
    { id: 2, name: "Trần Thị B", email: "tranthib@email.com", joinDate: "2024-02-20", rating: 4.9, type: "seller" },
    { id: 3, name: "Phạm Văn C", email: "phamvanc@email.com", joinDate: "2024-03-10", rating: 4.5, type: "bidder" },
];
export function AdminUsers() {
    const { user } = useAuth();
    const [users, setUsers] = useState(initialUsers);
    const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const { sellerRequests, loading, fetchRequests, handleRequest } = useSellerRequests();
    const [search, setSearch] = useState("");
    const [sortNewest, setSortNewest] = useState(true);
    useEffect(() => {
        fetchRequests("", true, 1);
    }, [user]);
    useEffect(() => {
        console.log(sellerRequests);
    }, [sellerRequests]);
    const handleApproveUpgrade = async (requestId) => {
        await handleRequest(requestId, true);
        console.log(requestId);
    };

    const handleRejectUpgrade = async (requestId) => {
        await handleRequest(requestId, false);
    };

    const handleDeleteUser = () => {
        if (userToDelete) {
            setUsers(users.filter((u) => u.id !== userToDelete));
            setUserToDelete(null);
            setDeleteAlertOpen(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-foreground">Quản Lý Người Dùng</h2>
                <p className="text-sm text-muted-foreground mt-1">Quản lý tài khoản và phê duyệt nâng cấp</p>
            </div>

            <Tabs defaultValue="users" className="w-full">
                <TabsList>
                    <TabsTrigger value="users">Người Dùng ({users.length})</TabsTrigger>
                    <TabsTrigger value="upgrades" className="relative">
                        Yêu Cầu Nâng Cấp
                        {sellerRequests.length > 0 && (
                            <Badge className="ml-2 bg-destructive text-destructive-foreground">{sellerRequests.length}</Badge>
                        )}
                    </TabsTrigger>
                </TabsList>

                {/* Users Tab */}
                <TabsContent value="users" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Danh Sách Người Dùng</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-border">
                                            <th className="text-left py-3 px-4 font-semibold text-foreground">Tên</th>
                                            <th className="text-left py-3 px-4 font-semibold text-foreground">Email</th>
                                            <th className="text-left py-3 px-4 font-semibold text-foreground">Loại</th>
                                            <th className="text-left py-3 px-4 font-semibold text-foreground">Đánh Giá</th>
                                            <th className="text-left py-3 px-4 font-semibold text-foreground">Ngày Tham Gia</th>
                                            <th className="text-left py-3 px-4 font-semibold text-foreground">Thao Tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => (
                                            <tr key={user.id} className="border-b border-border hover:bg-accent/50">
                                                <td className="py-4 px-4 text-foreground font-medium">{user.name}</td>
                                                <td className="py-4 px-4 text-muted-foreground">{user.email}</td>
                                                <td className="py-4 px-4">
                                                    <Badge variant={user.type === "seller" ? "default" : "secondary"}>
                                                        {user.type === "seller" ? "Người Bán" : "Người Mua"}
                                                    </Badge>
                                                </td>
                                                <td className="py-4 px-4 text-yellow-500">★ {user.rating}</td>
                                                <td className="py-4 px-4 text-muted-foreground">
                                                    {new Date(user.joinDate).toLocaleDateString("vi-VN")}
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex gap-2">
                                                        <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setUserToDelete(user.id);
                                                                    setDeleteAlertOpen(true);
                                                                }}
                                                                className="text-destructive hover:bg-destructive/10"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                            <AlertDialogContent>
                                                                <AlertDialogTitle>Xóa Tài Khoản?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Bạn có chắc chắn muốn xóa tài khoản "{user.name}"?
                                                                </AlertDialogDescription>
                                                                <div className="flex gap-2 justify-end">
                                                                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                                                                    <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive">
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
                </TabsContent>

                {/* Upgrade Requests Tab */}
                <TabsContent value="upgrades" className="space-y-4">
                    {sellerRequests.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <p className="text-muted-foreground">Không có yêu cầu nâng cấp nào</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <><div className="flex items-center gap-4 mb-4">

                            <div className="flex flex-[3] items-center mt-5 gap-4 mb-4">

                                {/* SEARCH INPUT — takes all remaining space */}
                                <input
                                    className="border px-3 py-2 rounded flex-1"
                                    placeholder="Tìm theo tên..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />

                                {/* SORT BUTTON */}
                                <Button
                                    variant="outline"
                                    onClick={() => setSortNewest(prev => !prev)}
                                >
                                    {sortNewest ? "Mới nhất ↓" : "Cũ nhất ↑"}
                                </Button>

                                {/* APPLY FILTER BUTTON */}
                                <Button
                                    onClick={() => fetchRequests(search, sortNewest, 1)}
                                >
                                    Lọc
                                </Button>
                            </div>

                        </div>
                            <div className="grid gap-4">
                                {sellerRequests.map((request) => (
                                    <Card key={request.id}>
                                        <CardContent className="pt-6">
                                            <div className="space-y-4">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h3 className="font-semibold text-foreground">{request.fullName}</h3>
                                                        <p className="text-sm text-muted-foreground">{request.email}</p>
                                                        {/* <p className="text-sm text-muted-foreground mt-2">Lý do: {request.reason}</p> */}
                                                    </div>
                                                    {/* <Badge variant="outline">{request.currentType === "bidder" ? "Người Mua" : "Người Bán"}</Badge> */}
                                                </div>

                                                <div className="text-xs text-muted-foreground">
                                                    Yêu cầu ngày: {formatDateTimeFull(request.createdAt)}
                                                </div>

                                                <div className="flex gap-2 pt-2">
                                                    {request.status === 0 && (
                                                        <>
                                                            <Button
                                                                onClick={() => handleApproveUpgrade(request.id)}
                                                                className="flex-1 gap-2 bg-green-600 hover:bg-green-700 text-white"
                                                            >
                                                                <CheckCircle className="h-4 w-4" />
                                                                Phê Duyệt
                                                            </Button>

                                                            <Button
                                                                onClick={() => handleRejectUpgrade(request.id)}
                                                                variant="outline"
                                                                className="flex-1 gap-2 border-destructive text-destructive hover:bg-destructive/10"
                                                            >
                                                                <XCircle className="h-4 w-4" />
                                                                Từ Chối
                                                            </Button>
                                                        </>
                                                    )}

                                                    {request.status === 1 && (
                                                        <div className="flex-1 text-center py-2 rounded-lg bg-green-100 text-green-700 font-medium">
                                                            ✔ Đã phê duyệt
                                                        </div>
                                                    )}

                                                    {request.status === 2 && (
                                                        <div className="flex-1 text-center py-2 rounded-lg bg-red-100 text-red-600 font-medium">
                                                            ✖ Đã từ chối
                                                        </div>
                                                    )}
                                                </div>

                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
