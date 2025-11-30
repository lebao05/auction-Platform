import { useState } from "react";
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

const initialUsers = [
    { id: 1, name: "Nguyễn Văn A", email: "nguyenvana@email.com", joinDate: "2024-01-15", rating: 4.8, type: "bidder" },
    { id: 2, name: "Trần Thị B", email: "tranthib@email.com", joinDate: "2024-02-20", rating: 4.9, type: "seller" },
    { id: 3, name: "Phạm Văn C", email: "phamvanc@email.com", joinDate: "2024-03-10", rating: 4.5, type: "bidder" },
];

const initialUpgradeRequests = [
    {
        id: 1,
        name: "Lê Văn D",
        email: "levand@email.com",
        currentType: "bidder",
        requestDate: "2024-11-05",
        reason: "Muốn bán các sản phẩm cũ của mình",
    },
    {
        id: 2,
        name: "Hoàng Thị E",
        email: "hoangthe@email.com",
        currentType: "bidder",
        requestDate: "2024-11-06",
        reason: "Kinh doanh đồ cổ",
    },
    {
        id: 3,
        name: "Võ Văn F",
        email: "vovand@email.com",
        currentType: "bidder",
        requestDate: "2024-11-07",
        reason: "Bán electronics",
    },
];

export function AdminUsers() {
    const [users, setUsers] = useState(initialUsers);
    const [upgradeRequests, setUpgradeRequests] = useState(initialUpgradeRequests);
    const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const handleApproveUpgrade = (requestId) => {
        const request = upgradeRequests.find((r) => r.id === requestId);
        if (request) {
            setUsers([
                ...users,
                {
                    id: Math.max(...users.map((u) => u.id), 0) + 1,
                    name: request.name,
                    email: request.email,
                    joinDate: new Date().toISOString().split("T")[0],
                    rating: 0,
                    type: "seller",
                },
            ]);
            setUpgradeRequests(upgradeRequests.filter((r) => r.id !== requestId));
        }
    };

    const handleRejectUpgrade = (requestId) => {
        setUpgradeRequests(upgradeRequests.filter((r) => r.id !== requestId));
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
                        {upgradeRequests.length > 0 && (
                            <Badge className="ml-2 bg-destructive text-destructive-foreground">{upgradeRequests.length}</Badge>
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
                    {upgradeRequests.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <p className="text-muted-foreground">Không có yêu cầu nâng cấp nào</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4">
                            {upgradeRequests.map((request) => (
                                <Card key={request.id}>
                                    <CardContent className="pt-6">
                                        <div className="space-y-4">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="font-semibold text-foreground">{request.name}</h3>
                                                    <p className="text-sm text-muted-foreground">{request.email}</p>
                                                    <p className="text-sm text-muted-foreground mt-2">Lý do: {request.reason}</p>
                                                </div>
                                                <Badge variant="outline">{request.currentType === "bidder" ? "Người Mua" : "Người Bán"}</Badge>
                                            </div>

                                            <div className="text-xs text-muted-foreground">
                                                Yêu cầu ngày: {new Date(request.requestDate).toLocaleDateString("vi-VN")}
                                            </div>

                                            <div className="flex gap-2 pt-2">
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
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
