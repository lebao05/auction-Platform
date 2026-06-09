import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom"; // Thêm Link
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card";
import { useOrder } from "../../../hooks/useOrder";
import { useAuth } from "../../../contexts/AuthContext";
import Spinner from "../../../components/ui/Spinner";
import { toast } from "react-toastify";
// ============================================
// CONSTANTS & ENUMS
// ============================================

const OrderStatus = {
    WaitingForPayment: 0,
    Shipping: 1,
    Completed: 2,
    CancelledBySeller: 3
};

const STEPS = [
    { id: 1, title: "Thanh toán", description: "Người mua gửi ảnh, Người bán xác nhận" },
    { id: 2, title: "Vận chuyển", description: "Người bán gửi bill vận chuyển" },
    { id: 3, title: "Nhận hàng", description: "Người mua xác nhận nhận hàng" },
    { id: 4, title: "Đánh giá", description: "Hoàn tất giao dịch" },
];

const STATUS_MAP = {
    0: { label: "Chờ thanh toán", variant: "secondary", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
    1: { label: "Đang vận chuyển", variant: "default", color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200" },
    2: { label: "Hoàn tất", variant: "success", color: "text-green-600", bg: "bg-green-50", border: "border-green-200" },
    3: { label: "Đã hủy", variant: "destructive", color: "text-red-600", bg: "bg-red-50", border: "border-red-200" }
};

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function OrderPage() {
    const { productId: routeProductId } = useParams();
    const { user } = useAuth();

    const {
        order, loading, error, setProductId,
        updatePaymentPhase, updateShippingPhase, confirmOrderStatus,
        cancelOrder, addRating, updateRating
    } = useOrder();

    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const currentUserId = user?.userId;

    useEffect(() => {
        if (routeProductId) setProductId(routeProductId);
    }, [routeProductId, setProductId]);

    if (loading && !order) return <Spinner />;
    if (error) return <div className="p-20 text-center text-red-500">Lỗi: {error.message}</div>;
    if (!order) return <div className="p-20 text-center">Không tìm thấy đơn hàng.</div>;

    const isSeller = currentUserId === order.sellerId;
    const currentStatus = order.orderStatus;
    const isCancelled = currentStatus === OrderStatus.CancelledBySeller;

    const myRating = isSeller ? order.sellerRating : order.buyerRating;
    const theirRating = isSeller ? order.buyerRating : order.sellerRating;
    const partnerName = isSeller ? order.buyerName : order.sellerName;

    // Visual Step Logic
    const getVisualStepIndex = () => {
        if (currentStatus === OrderStatus.Completed) return 3;
        if (currentStatus === OrderStatus.WaitingForPayment) return 0;
        if (currentStatus === OrderStatus.Shipping) {
            const hasShippingImg = !!(order.shippingInvoiceImageUrl || order.shippingInvoiceUrl);
            return hasShippingImg ? 2 : 1;
        }
        return 0; // Default or Cancelled
    };

    const visualStepIndex = getVisualStepIndex();

    // Handlers
    const handleSellerConfirmPayment = () => confirmOrderStatus({ orderStatus: OrderStatus.Shipping });
    const handleBuyerConfirmReceived = () => confirmOrderStatus({ orderStatus: OrderStatus.Completed });

    return (
        <main className="min-h-screen bg-gray-50 py-8">
            <div className="mx-auto max-w-7xl px-4">
                {/* Header */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                            <Link to="/orders" className="hover:text-blue-600">Đơn hàng</Link>
                            <span>/</span>
                            <span>#{order.id}</span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Chi tiết đơn hàng</h1>
                    </div>
                    <div className={`px-4 py-2 rounded-full font-bold text-sm uppercase tracking-wide border ${STATUS_MAP[currentStatus]?.bg} ${STATUS_MAP[currentStatus]?.color} ${STATUS_MAP[currentStatus]?.border}`}>
                        {STATUS_MAP[currentStatus]?.label}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Progress Bar - Always Visible for History Context */}
                        <Card className="shadow-sm border-0">
                            <CardContent className="pt-6">
                                <OrderStepper steps={STEPS} activeStepIndex={visualStepIndex} isCancelled={isCancelled} />
                            </CardContent>
                        </Card>

                        {/* --- CONDITIONAL RENDERING FOR CANCELLED STATE --- */}
                        {isCancelled ? (
                            <CancelledOrderView
                                isSeller={isSeller}
                                order={order}
                                partnerName={partnerName}
                            />
                        ) : (
                            // --- NORMAL FLOW (Active Order) ---
                            <>
                                {/* STEP 1: PAYMENT */}
                                <Card className={`transition-all duration-300 ${visualStepIndex === 0 ? 'ring-2 ring-blue-500 shadow-md' : 'opacity-80'}`}>
                                    <CardHeader>
                                        <CardTitle className="flex justify-between items-center text-lg">
                                            <span>1. Thông tin thanh toán</span>
                                            {visualStepIndex === 0 && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Đang xử lý</span>}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <PaymentSection
                                            isSeller={isSeller}
                                            order={order}
                                            onBuyerSubmit={updatePaymentPhase}
                                            onSellerConfirm={handleSellerConfirmPayment}
                                            isActive={currentStatus === OrderStatus.WaitingForPayment}
                                        />
                                    </CardContent>
                                </Card>

                                {/* STEP 2: SHIPPING */}
                                {(currentStatus >= OrderStatus.Shipping) && (
                                    <Card className={`transition-all duration-300 ${visualStepIndex === 1 ? 'ring-2 ring-purple-500 shadow-md' : 'opacity-80'}`}>
                                        <CardHeader>
                                            <CardTitle className="flex justify-between items-center text-lg">
                                                <span>2. Vận chuyển</span>
                                                {visualStepIndex === 1 && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">Người bán xử lý</span>}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <ShippingSection
                                                isSeller={isSeller}
                                                order={order}
                                                onSellerUpload={updateShippingPhase}
                                                isActive={currentStatus === OrderStatus.Shipping}
                                            />
                                        </CardContent>
                                    </Card>
                                )}

                                {/* STEP 3: RECEIVE */}
                                {(currentStatus >= OrderStatus.Shipping && (order.shippingInvoiceImageUrl || order.shippingInvoiceUrl)) && (
                                    <Card className={`transition-all duration-300 ${visualStepIndex === 2 ? 'ring-2 ring-green-500 shadow-md' : 'opacity-80'}`}>
                                        <CardHeader><CardTitle className="text-lg">3. Xác nhận nhận hàng</CardTitle></CardHeader>
                                        <CardContent>
                                            <ReceivingSection
                                                isSeller={isSeller}
                                                isCompleted={currentStatus === OrderStatus.Completed}
                                                onConfirmReceive={handleBuyerConfirmReceived}
                                            />
                                        </CardContent>
                                    </Card>
                                )}

                                {/* STEP 4: RATING */}
                                {currentStatus === OrderStatus.Completed && (
                                    <Card className="ring-2 ring-yellow-400 shadow-md bg-yellow-50/30">
                                        <CardHeader>
                                            <CardTitle className="text-lg flex items-center gap-2">
                                                <span>4. Đánh giá giao dịch</span>
                                                <span className="text-xs font-normal text-gray-500">(Đã hoàn tất)</span>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <RatingSection
                                                myRating={myRating}
                                                theirRating={theirRating}
                                                partnerName={partnerName}
                                                onAdd={addRating}
                                                onUpdate={updateRating}
                                            />
                                        </CardContent>
                                    </Card>
                                )}
                            </>
                        )}
                    </div>

                    {/* Sidebar - Always Visible */}
                    <div className="space-y-6">
                        {/* Cancel Button - Only for Seller in Waiting Phase */}
                        {isSeller && !order.paymentInvoiceUrl && currentStatus === OrderStatus.WaitingForPayment && (
                            <button
                                onClick={() => setShowCancelDialog(true)}
                                className="w-full py-3 text-red-600 font-bold text-sm bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                            >
                                Hủy đơn hàng
                            </button>
                        )}
                        <OrderSidebar isSeller={isSeller} order={order} />
                    </div>
                </div>
            </div>

            {/* Cancel Dialog */}
            {showCancelDialog && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-6 rounded-lg max-w-sm w-full shadow-xl">
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </div>
                        <h3 className="font-bold text-lg text-center mb-2">Xác nhận hủy đơn?</h3>
                        <p className="text-sm text-gray-500 text-center mb-6">Hành động này sẽ chấm dứt giao dịch ngay lập tức và không thể hoàn tác.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setShowCancelDialog(false)} className="flex-1 py-2 border rounded font-medium hover:bg-gray-50 text-gray-700">Quay lại</button>
                            <button onClick={() => { cancelOrder(); setShowCancelDialog(false); }} className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium">Xác nhận Hủy</button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

// ============================================
// NEW COMPONENT: CancelledOrderView
// ============================================

function CancelledOrderView({ isSeller, order, partnerName }) {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <Card className="border-red-100 bg-red-50/50 shadow-none">
                <CardContent className="pt-8 pb-8 flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4 ring-4 ring-red-50">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Đơn hàng đã bị hủy</h2>

                    <p className="text-gray-600 max-w-lg mx-auto mb-6">
                        {isSeller ? (
                            <span>Bạn đã hủy đơn hàng này vào lúc <span className="font-medium text-gray-900"></span>. Giao dịch đã được đóng lại.</span>
                        ) : (
                            <span>Rất tiếc, đơn hàng đã bị hủy bởi người bán <span className="font-bold">{partnerName}</span>. Nếu bạn đã thực hiện chuyển khoản, vui lòng liên hệ ngay với bộ phận hỗ trợ.</span>
                        )}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md justify-center">
                        <Link to="/" className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                            Tìm sản phẩm khác
                        </Link>
                        {!isSeller && (
                            <button className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none shadow-sm">
                                Liên hệ hỗ trợ
                            </button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Refund Info Section (Optional - only show if payment existed) */}
            {order.paymentInvoiceUrl && (
                <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-start gap-3">
                    <div className="flex-shrink-0 text-blue-500 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="text-sm">
                        <h4 className="font-bold text-gray-900">Thông tin thanh toán</h4>
                        <p className="text-gray-500 mt-1">
                            Hệ thống ghi nhận bạn đã gửi bằng chứng thanh toán. Do đơn hàng bị hủy, vui lòng kiểm tra lại tài khoản hoặc thỏa thuận hoàn tiền với người bán.
                        </p>
                        <a href={order.paymentInvoiceUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline mt-2 inline-block font-medium">
                            Xem lại ảnh chuyển khoản
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}

// ============================================
// OTHER SUB-COMPONENTS (Keep existing logic mostly same)
// ============================================

// 1. PaymentSection
// ... (các phần import giữ nguyên)

function PaymentSection({ isSeller, order, onBuyerSubmit, onSellerConfirm, isActive }) {
    const hasData = !!order.paymentInvoiceUrl;
    const canEdit = !isSeller && isActive;
    const [formData, setFormData] = useState({ address: order.shippingAddress || "", phone: order.shippingPhone || "" });
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(order.paymentInvoiceUrl);

    // TRẠNG THÁI LOADING MỚI
    const [isSubmitting, setIsSubmitting] = useState(false);
    console.log(order);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file && !preview) return alert("Vui lòng chọn ảnh chuyển khoản");

        setIsSubmitting(true); // Bắt đầu loading
        try {
            await onBuyerSubmit({ address: formData.address, phoneNumber: formData.phone, paymentImage: file });
        } catch (error) {
            console.error(error);
            // Xử lý lỗi nếu cần
        } finally {
            setIsSubmitting(false); // Kết thúc loading dù thành công hay thất bại
        }
    };
    // ... (Phần hiển thị hasData giữ nguyên code cũ)
    if (!hasData && isSeller) {
        return (

            <div className="space-y-4">
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed">
                    <p className="text-gray-500">Đang chờ người mua gửi thông tin thanh toán...</p>
                </div>
            </div>
        )
    }
    if (hasData && !canEdit) {
        // Copy lại phần code hiển thị hasData cũ của bạn ở đây...
        return (
            <div className="space-y-4">
                {/* ...Code cũ hiển thị thông tin... */}

                <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded border">
                    <div><span className="text-gray-500 text-xs font-bold block mb-1">ĐỊA CHỈ GIAO HÀNG</span><p className="font-medium text-gray-900">{order.shippingAddress}</p></div>
                    <div><span className="text-gray-500 text-xs font-bold block mb-1">SỐ ĐIỆN THOẠI</span><p className="font-medium text-gray-900">{order.shippingPhone}</p></div>
                </div>
                <div>
                    <span className="block text-gray-500 text-xs font-bold mb-2">BIÊN LAI CHUYỂN KHOẢN</span>
                    <a href={order.paymentInvoiceUrl} target="_blank" rel="noreferrer" className="block w-fit">
                        <img src={order.paymentInvoiceUrl} alt="Bill" className="h-32 object-contain border bg-white rounded shadow-sm hover:opacity-90 transition-opacity" />
                    </a>
                </div>

                {isSeller && isActive && (
                    <div className="pt-4 border-t mt-2">
                        <button onClick={onSellerConfirm} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2">
                            <span>✓ Xác nhận thanh toán</span>
                        </button>
                    </div>
                )}
                {!isSeller && isActive && (
                    <div className="bg-blue-50 text-blue-800 text-sm p-3 rounded-lg flex items-center gap-2 justify-center border border-blue-100">
                        Đang chờ người bán xác nhận...
                    </div>
                )}
            </div>
        );
    }
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500">Địa chỉ nhận hàng</label>
                    <input
                        placeholder="VD: 123 Đường Lê Lợi..."
                        value={formData.address}
                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                        className="p-3 border rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:bg-gray-100"
                        required
                        disabled={isSubmitting} // Disable khi đang gửi
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500">Số điện thoại</label>
                    <input
                        placeholder="VD: 0912..."
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        className="p-3 border rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:bg-gray-100"
                        required
                        disabled={isSubmitting}
                    />
                </div>
            </div>
            <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500">Ảnh chụp màn hình chuyển khoản</label>
                <div className={`border-2 border-dashed border-gray-300 p-6 rounded-lg text-center cursor-pointer relative transition-all group ${isSubmitting ? 'bg-gray-50 opacity-50 cursor-not-allowed' : 'hover:bg-blue-50 hover:border-blue-300'}`}>
                    <input
                        type="file"
                        disabled={isSubmitting}
                        onChange={(e) => { const f = e.target.files[0]; if (f) { setFile(f); setPreview(URL.createObjectURL(f)); } }}
                        className="absolute inset-0 opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                    />
                    {preview ? (
                        <div className="relative z-0">
                            <img src={preview} alt="Pre" className="h-32 mx-auto object-contain rounded shadow-sm" />
                            {!isSubmitting && <p className="text-xs text-gray-400 mt-2">Nhấn để thay đổi ảnh</p>}
                        </div>
                    ) : (
                        <div className="text-gray-400 group-hover:text-blue-500 transition-colors">
                            {/* Icon upload cũ */}
                            <svg className="mx-auto h-10 w-10 mb-2" stroke="currentColor" fill="none" viewBox="0 0 48 48"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            <span className="text-sm font-medium">Tải lên ảnh xác thực</span>
                        </div>
                    )}
                </div>
            </div>

            {/* NÚT SUBMIT VỚI LOADING SPINNER */}
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isSubmitting ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang gửi thông tin...
                    </>
                ) : (
                    "Gửi thông tin"
                )}
            </button>
        </form>
    );
}

// 2. ShippingSection
function ShippingSection({ isSeller, order, onSellerUpload, isActive }) {
    const existingImage = order.shippingInvoiceImageUrl || order.shippingInvoiceUrl;
    const hasData = !!existingImage;
    const [isEditing, setIsEditing] = useState(false);
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);

    // View Mode
    if (hasData && !isEditing) {
        return (
            <div className="space-y-3">
                <div className="flex justify-between items-center bg-green-50 p-2 rounded border border-green-100">
                    <p className="text-sm text-green-700 font-bold flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                        Đã cập nhật mã vận đơn
                    </p>
                    {isSeller && isActive && (
                        <button onClick={() => { setIsEditing(true); setFile(null); setPreview(null); }} className="text-xs text-blue-600 font-medium hover:underline">Thay đổi ảnh</button>
                    )}
                </div>
                <a href={existingImage} target="_blank" rel="noreferrer"><img src={existingImage} alt="Shipping Bill" className="w-full h-48 object-cover rounded-lg border shadow-sm hover:opacity-95" /></a>
            </div>
        );
    }

    // Form Mode (Seller Only)
    if (!isSeller) return (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-400 italic mb-2">Người bán đang chuẩn bị hàng và sẽ sớm cập nhật vận đơn...</p>
            <svg className="w-10 h-10 text-gray-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
        </div>
    );

    return (
        <div className="space-y-4">
            <div className="border-2 border-dashed border-purple-200 p-6 rounded-lg text-center relative hover:bg-purple-50 transition-colors group cursor-pointer">
                <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files[0]; if (f) { setFile(f); setPreview(URL.createObjectURL(f)); } }} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                {preview ? <img src={preview} className="h-40 mx-auto object-contain rounded" alt="Preview" /> : (
                    <div className="py-4">
                        <svg className="mx-auto h-12 w-12 text-purple-300 group-hover:text-purple-500 mb-2 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        <span className="text-purple-600 font-bold block">Tải ảnh vận đơn / Đóng gói</span>
                        <span className="text-xs text-gray-400">Click để chọn ảnh</span>
                    </div>
                )}
            </div>
            <div className="flex gap-2">
                {hasData && <button onClick={() => setIsEditing(false)} className="flex-1 bg-white border border-gray-300 py-2 rounded-lg text-sm hover:bg-gray-50 text-gray-700 font-medium">Hủy</button>}
                <button disabled={!file} onClick={async () => { await onSellerUpload({ shippingInvoiceImage: file }); setIsEditing(false); }} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm">
                    Cập nhật vận đơn
                </button>
            </div>
        </div>
    );
}

// 3. ReceivingSection
function ReceivingSection({ isSeller, isCompleted, onConfirmReceive }) {
    if (isCompleted) {
        return (
            <div className="bg-green-50 text-green-800 p-4 rounded-lg text-center font-bold border border-green-200 flex flex-col items-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-2">
                    <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                Đơn hàng đã hoàn tất thành công!
            </div>
        );
    }

    if (isSeller) {
        return (
            <div className="text-center py-6 bg-gray-50 rounded-lg">
                <p className="text-gray-500 font-medium">Đang chờ người mua xác nhận...</p>
                <p className="text-xs text-gray-400 mt-1">Trạng thái sẽ tự động cập nhật khi người mua xác nhận.</p>
            </div>
        );
    }

    return (
        <div className="text-center space-y-4">
            <p className="text-sm text-gray-600">Nếu bạn đã nhận được hàng và kiểm tra không có vấn đề gì, hãy xác nhận để hoàn tất giao dịch.</p>
            <button onClick={onConfirmReceive} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-green-200 hover:shadow-green-300 transform hover:-translate-y-0.5 transition-all">
                Đã nhận được hàng (Hoàn tất)
            </button>
        </div>
    );
}

// 4. RatingSection (No changes needed, kept as previous)
function RatingSection({ myRating, theirRating, partnerName, onAdd, onUpdate }) {
    const [ratingType, setRatingType] = useState(myRating?.ratingType || 1);
    const [comment, setComment] = useState(myRating?.comment || "");
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (myRating) {
            setRatingType(myRating.ratingType);
            setComment(myRating.comment || "");
        }
    }, [myRating]);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            if (myRating && myRating.id) {
                await onUpdate({ ratingId: myRating.id, ratingType, comment });
                setIsEditing(false);
            } else {
                await onAdd({ ratingType, comment });
            }
        } catch (e) {
            console.error("Rating error", e);
            alert("Có lỗi xảy ra khi đánh giá");
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStars = (type) => type === 1
        ? <span className="text-green-600 font-bold flex items-center gap-1 text-sm bg-green-50 px-2 py-1 rounded-full w-fit">👍 Hài lòng</span>
        : <span className="text-red-600 font-bold flex items-center gap-1 text-sm bg-red-50 px-2 py-1 rounded-full w-fit">👎 Không hài lòng</span>;

    return (
        <div className="space-y-6">
            {/* THEIR RATING */}
            {theirRating ? (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500 font-bold uppercase mb-2 tracking-wide">Đánh giá từ {partnerName}</p>
                    <div className="flex flex-col gap-2">
                        <div>{renderStars(theirRating.ratingType)}</div>
                        <p className="text-sm text-gray-700 italic bg-white p-3 rounded border border-gray-100">"{theirRating.comment || "Không có lời bình"}"</p>
                    </div>
                </div>
            ) : (
                <div className="bg-gray-50 p-4 rounded border border-dashed text-center text-sm text-gray-400 italic">
                    {partnerName} chưa đánh giá bạn.
                </div>
            )}

            <div className="border-t border-gray-100"></div>

            {/* MY RATING */}
            {!myRating || isEditing ? (
                <div className="bg-white rounded p-1">
                    <div className="flex justify-between items-center mb-3">
                        <p className="text-sm font-bold text-gray-800">
                            {myRating ? "Cập nhật đánh giá của bạn" : `Bạn đánh giá ${partnerName} thế nào?`}
                        </p>
                        {isEditing && <button onClick={() => setIsEditing(false)} className="text-xs text-gray-400 hover:text-gray-600">✕ Hủy</button>}
                    </div>

                    <div className="flex gap-3 mb-4">
                        <button onClick={() => setRatingType(1)} className={`flex-1 py-3 border rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${ratingType === 1 ? 'bg-green-50 border-green-500 text-green-700 ring-1 ring-green-500' : 'bg-white text-gray-400 hover:bg-gray-50'}`}>👍 Hài lòng</button>
                        <button onClick={() => setRatingType(-1)} className={`flex-1 py-3 border rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${ratingType === -1 ? 'bg-red-50 border-red-500 text-red-700 ring-1 ring-red-500' : 'bg-white text-gray-400 hover:bg-gray-50'}`}>👎 Không hài lòng</button>
                    </div>

                    <textarea className="w-full border p-3 rounded-lg text-sm focus:ring-2 ring-blue-400 outline-none min-h-[100px] mb-3 resize-none" placeholder="Nhập lời bình của bạn (tùy chọn)..." value={comment} onChange={e => setComment(e.target.value)} />

                    <button onClick={handleSubmit} disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg text-sm disabled:opacity-50 transition-colors shadow-sm">
                        {isSubmitting ? "Đang xử lý..." : (myRating ? "Lưu cập nhật" : "Gửi đánh giá")}
                    </button>
                </div>
            ) : (
                <div className="bg-white p-4 rounded-lg border border-yellow-200 relative shadow-sm">
                    <p className="text-xs text-gray-500 font-bold uppercase mb-2 tracking-wide">Đánh giá của bạn</p>
                    <div className="mb-3">{renderStars(myRating.ratingType)}</div>
                    <p className="text-sm text-gray-800 italic mb-4">"{myRating.comment || "Không có lời bình"}"</p>
                    <button onClick={() => setIsEditing(true)} className="text-xs text-blue-600 hover:text-blue-800 font-medium underline flex items-center gap-1">✎ Sửa đánh giá</button>
                </div>
            )}
        </div>
    );
}

// 5. OrderStepper
function OrderStepper({ steps, activeStepIndex, isCancelled }) {
    // Nếu cancelled, set progress full nhưng màu đỏ
    const progress = isCancelled ? 100 : (activeStepIndex / (steps.length - 1)) * 100;
    const barColor = isCancelled ? 'bg-red-500' : 'bg-green-500';

    return (
        <div className="flex justify-between relative px-2 mb-4">
            {/* Background Line */}
            <div className="absolute top-4 left-0 w-full h-1 bg-gray-200 -z-0 rounded"></div>
            {/* Active Line */}
            <div className={`absolute top-4 left-0 h-1 -z-0 rounded transition-all duration-500 ${barColor}`} style={{ width: `${progress}%` }}></div>

            {steps.map((step, index) => {
                const isCompleted = activeStepIndex > index;
                const isCurrent = activeStepIndex === index;
                let circleClass = 'bg-white border-gray-300 text-gray-400';

                if (isCancelled) {
                    // Nếu cancelled, tất cả các bước đã qua vẫn xanh, bước hiện tại thành đỏ (hoặc tất cả đỏ tùy logic)
                    // Ở đây để đơn giản: Xám hết, chỉ hiển thị trạng thái Cancelled ở UI chính
                    circleClass = 'bg-red-100 border-red-500 text-red-500';
                } else if (isCompleted || isCurrent) {
                    circleClass = 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-200';
                }

                return (
                    <div key={step.id} className="flex flex-col items-center relative z-10 bg-white px-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors duration-300 border-2 ${circleClass}`}>
                            {isCompleted ? "✓" : (isCancelled ? "✕" : step.id)}
                        </div>
                        <span className={`text-[10px] mt-2 font-bold uppercase hidden sm:block ${isCurrent && !isCancelled ? 'text-green-600' : 'text-gray-400'}`}>
                            {step.title}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

// 6. Sidebar
function OrderSidebar({ order, isSeller }) {
    const navigate = useNavigate();
    return (
        <Card className="shadow-sm sticky top-4 border-0 overflow-hidden">
            <div className="aspect-square w-full bg-gray-100 relative group">
                <img src={order.mainImageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Product" />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
            </div>
            <CardContent className="p-5">
                <h3 className="font-bold text-gray-900 line-clamp-2 text-lg mb-2">{order.productName}</h3>
                <p className="text-2xl font-bold text-blue-600 mb-4">{order.finalPrice?.toLocaleString()} đ</p>
                {
                    !isSeller &&
                    <div className="pt-4 border-t flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center font-bold text-gray-600 text-lg border shadow-sm">
                            {order.sellerName?.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-sm">
                            <p className="text-gray-400 text-xs uppercase tracking-wider font-bold">Người bán</p>
                            <p
                                className="font-bold text-gray-900"
                            >
                                <a
                                    href={`/profile/${order.sellerId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:underline"
                                >
                                    {order.sellerName}
                                </a>
                            </p></div>
                    </div>
                }
                {
                    isSeller &&
                    <div className="pt-4 border-t flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center font-bold text-gray-600 text-lg border shadow-sm">
                            {order.buyerName?.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-sm">
                            <p className="text-gray-400 text-xs uppercase tracking-wider font-bold">Người mua</p>
                            <p
                                className="font-bold text-gray-900"
                            >
                                <a
                                    href={`/profile/${order.buyerId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:underline"
                                >
                                    {order.buyerName}
                                </a>
                            </p> </div>
                    </div>
                }
            </CardContent>
        </Card>
    );
}