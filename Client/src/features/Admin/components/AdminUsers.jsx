import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Eye, Trash2, KeyRound, Ban, Search, RefreshCw } from "lucide-react";
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
import { useAdminUsers } from "../../../hooks/useAdminUsers";
import { useAuth } from "../../../contexts/AuthContext";
import { formatDateTimeFull } from "../../../utils/DateTimeExtension";
import { toast } from "react-toastify";

export function AdminUsers() {
    const { user } = useAuth();

    // --- Hook Integration ---
    const {
        users,
        loading: usersLoading,
        actionLoading,
        resetPassword,
        banUser,
        refetch
    } = useAdminUsers();

    const {
        sellerRequests,
        loading: requestsLoading,
        fetchRequests,
        handleRequest
    } = useSellerRequests();

    // --- State ---
    const [banAlertOpen, setBanAlertOpen] = useState(false);
    const [userToBan, setUserToBan] = useState(null);
    const [searchRequests, setSearchRequests] = useState("");
    const [sortNewest, setSortNewest] = useState(true);

    // Initial load for requests (as per your original code)
    useEffect(() => {
        fetchRequests("", true, 1);
    }, [user]);

    // --- Handlers for User Management ---
    const handleResetPassword = async (userId) => {
        const success = await resetPassword(userId);
        if (success) {
            toast.success("Mật khẩu đã được đặt lại thành mặc định thành công.");
        } else {
            toast.error("Lỗi khi đặt lại mật khẩu.");
        }
    };

    const handleConfirmBan = async () => {
        if (userToBan) {
            const success = await banUser(userToBan.id);
            if (success) {
                toast.success(`Đã khóa tài khoản thành công.`);
                setBanAlertOpen(false);
                setUserToBan(null);
            } else {
                toast.error("Không thể khóa tài khoản này.");
            }
        }
    };

    // --- Handlers for Seller Requests (Unchanged Logic) ---
    const handleApproveUpgrade = async (requestId) => {
        await handleRequest(requestId, true);
    };

    const handleRejectUpgrade = async (requestId) => {
        await handleRequest(requestId, false);
    };

    return (
        <div className="space-y-6 p-4">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Quản Lý Hệ Thống</h2>
                    <p className="text-sm text-muted-foreground mt-1">Điều hành người dùng và yêu cầu nâng cấp</p>
                </div>
            </div>

            <Tabs defaultValue="users" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="users">Người Dùng ({users?.length || 0})</TabsTrigger>
                    <TabsTrigger value="upgrades" className="relative">
                        Yêu Cầu Nâng Cấp
                        {sellerRequests.length > 0 && (
                            <Badge className="ml-2 bg-destructive text-destructive-foreground animate-pulse">
                                {sellerRequests.length}
                            </Badge>
                        )}
                    </TabsTrigger>
                </TabsList>

                {/* --- USERS MANAGEMENT TAB --- */}
                <TabsContent value="users" className="space-y-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <CardTitle>Danh Sách Thành Viên</CardTitle>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={refetch}
                                disabled={usersLoading}
                                className="gap-2"
                            >
                                <RefreshCw className={`h-4 w-4 ${usersLoading ? 'animate-spin' : ''}`} />
                                Làm mới
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-border bg-muted/50">
                                            <th className="text-left py-3 px-4 font-semibold text-foreground">Họ Tên</th>
                                            <th className="text-left py-3 px-4 font-semibold text-foreground">Email</th>
                                            <th className="text-left py-3 px-4 font-semibold text-foreground">Vai Trò</th>
                                            <th className="text-left py-3 px-4 font-semibold text-foreground">Ngày Tham Gia</th>
                                            <th className="text-right py-3 px-4 font-semibold text-foreground">Hành Động</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {usersLoading ? (
                                            <tr><td colSpan="6" className="text-center py-10 text-muted-foreground">Đang tải danh sách người dùng...</td></tr>
                                        ) : users.length === 0 ? (
                                            <tr><td colSpan="6" className="text-center py-10 text-muted-foreground">Không tìm thấy người dùng nào.</td></tr>
                                        ) : (
                                            users.map((u) => (
                                                <tr key={u.id} className="hover:bg-accent/30 transition-colors">
                                                    <td className="py-4 px-4 text-foreground font-medium">{u.fullName || u.name}</td>
                                                    <td className="py-4 px-4 text-muted-foreground">{u.email}</td>
                                                    <td className="py-4 px-4">
                                                        <Badge variant={(u.role === "Seller" || u.type === "seller") ? "default" : "secondary"}>
                                                            {(u.role === "Seller" || u.type === "seller") ? "Người Bán" : "Người Mua"}
                                                        </Badge>
                                                    </td>
                                                    <td className="py-4 px-4 text-muted-foreground">
                                                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString("vi-VN") : "N/A"}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex justify-end gap-1">
                                                            <button
                                                                onClick={() => handleResetPassword(u.id)}
                                                                className="p-2 text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                                                                title="Đặt lại mật khẩu"
                                                            >
                                                                <KeyRound className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => { setUserToBan(u); setBanAlertOpen(true); }}
                                                                className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                                title="Khóa tài khoản"
                                                            >
                                                                <Ban className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- SELLER REQUESTS TAB (Preserved UI) --- */}
                <TabsContent value="upgrades" className="space-y-4">
                    {requestsLoading ? (
                        <Card><CardContent className="py-12 text-center text-muted-foreground">Đang tải yêu cầu...</CardContent></Card>
                    ) : sellerRequests.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <p className="text-muted-foreground">Không có yêu cầu nâng cấp nào cần xử lý</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            {/* <div className="flex flex-col md:flex-row items-center gap-4 mb-4 mt-2">
                                <div className="relative flex-1 w-full">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <input
                                        className="w-full border border-input bg-background px-9 py-2 rounded-md text-sm focus:ring-1 focus:ring-primary outline-none"
                                        placeholder="Tìm theo tên hoặc email..."
                                        value={searchRequests}
                                        onChange={(e) => setSearchRequests(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-2 w-full md:w-auto">
                                    <Button
                                        variant="outline"
                                        onClick={() => setSortNewest(prev => !prev)}
                                        className="whitespace-nowrap"
                                    >
                                        {sortNewest ? "Mới nhất ↓" : "Cũ nhất ↑"}
                                    </Button>
                                    <Button
                                        onClick={() => fetchRequests(searchRequests, sortNewest, 1)}
                                    >
                                        Lọc
                                    </Button>
                                </div>
                            </div> */}

                            <div className="grid gap-4">
                                {sellerRequests.map((request) => (
                                    <Card key={request.id} className="overflow-hidden border-l-4 border-l-primary">
                                        <CardContent className="pt-6">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div className="space-y-1">
                                                    <h3 className="font-bold text-lg text-foreground">{request.fullName}</h3>
                                                    <p className="text-sm text-muted-foreground">{request.email}</p>
                                                    <div className="text-xs text-muted-foreground pt-1">
                                                        Ngày yêu cầu: {formatDateTimeFull(request.createdAt)}
                                                    </div>
                                                </div>

                                                <div className="flex gap-3">
                                                    {request.status === 0 ? (
                                                        <>
                                                            <Button
                                                                onClick={() => handleApproveUpgrade(request.id)}
                                                                className="gap-2 bg-green-600 hover:bg-green-700 text-white min-w-[120px]"
                                                            >
                                                                <CheckCircle className="h-4 w-4" />
                                                                Phê Duyệt
                                                            </Button>
                                                            <Button
                                                                onClick={() => handleRejectUpgrade(request.id)}
                                                                variant="outline"
                                                                className="gap-2 border-destructive text-destructive hover:bg-destructive/10 min-w-[120px]"
                                                            >
                                                                <XCircle className="h-4 w-4" />
                                                                Từ Chối
                                                            </Button>
                                                        </>
                                                    ) : (
                                                        <Badge className={request.status === 1 ? "bg-green-500 text-green-700 p-2 px-4" : "bg-red-100 text-red-700 p-2 px-4"}>
                                                            {request.status === 1 ? "Đã phê duyệt" : "Đã từ chối"}
                                                        </Badge>
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

            {/* --- CONFIRMATION DIALOGS --- */}
            <AlertDialog open={banAlertOpen} onOpenChange={setBanAlertOpen}>
                <AlertDialogContent>
                    <div className="flex items-center gap-3 text-destructive">
                        <Ban className="h-6 w-6" />
                        <AlertDialogTitle>Khóa Tài Khoản Người Dùng</AlertDialogTitle>
                    </div>
                    <AlertDialogDescription className="py-2">
                        Bạn có chắc chắn muốn khóa tài khoản của <strong>{userToBan?.fullName || userToBan?.name}</strong>?
                        Hành động này sẽ ngăn người dùng truy cập vào hệ thống cho đến khi được mở khóa lại.
                    </AlertDialogDescription>
                    <div className="flex gap-2 justify-end mt-4">
                        <AlertDialogCancel disabled={actionLoading}>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmBan}
                            className="bg-destructive hover:bg-destructive/90 text-white"
                            disabled={actionLoading}
                        >
                            {actionLoading ? "Đang xử lý..." : "Xác nhận Khóa"}
                        </AlertDialogAction>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}