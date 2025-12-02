import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/Card"
import { Button } from "../../../components/ui/Button"
import { OrderStepper } from "../components/OrderStepper"
import { OrderChat } from "../components/OrderChat"
import { OrderSummary } from "../components/OrderSummary"
import { CancelOrderDialog } from "../components/CancelOrderDialog"

// Mock data
const mockOrder = {
    id: "ORD-001",
    productName: 'Vintage Apple iMac 27" - Still Working Perfect',
    productImage: "/vintage-imac.jpg",
    winningBid: 850,
    status: "payment_pending",
    buyer: { name: "Nguyễn Văn A", avatar: "/user-avatar.jpg" },
    seller: { name: "Trần Thị B", avatar: "/seller-avatar.jpg" },
    steps: [
        { id: 1, title: "Payment", description: "Buyer provides payment invoice and shipping address", completed: false },
        { id: 2, title: "Confirmation", description: "Seller confirms payment and sends shipping invoice", completed: false },
        { id: 3, title: "Delivery", description: "Buyer confirms receipt of goods", completed: false },
        { id: 4, title: "Rating", description: "Both rate the transaction", completed: false },
    ],
}

export default function OrderPage() {
    const [currentStep, setCurrentStep] = useState(0)
    const [order, setOrder] = useState(mockOrder)
    const [showCancelDialog, setShowCancelDialog] = useState(false)

    const handleCancelOrder = () => {
        console.log("[v0] Order cancelled by seller")
        setShowCancelDialog(false)
    }

    return (
        <main className="min-h-screen bg-background py-8">
            <div className="mx-auto max-w-7xl px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground">Hoàn tất đơn hàng</h1>
                    <p className="text-muted-foreground">Đơn hàng #{order.id}</p>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Left Column */}
                    <div className="lg:col-span-2">
                        <Card className="mb-8">
                            <CardHeader>
                                <CardTitle>Tiến trình đơn hàng</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <OrderStepper steps={order.steps} currentStep={currentStep} />
                            </CardContent>
                        </Card>

                        {/* Seller Cancel Button */}
                        {order.seller.name === "Trần Thị B" && currentStep < 3 && (
                            <div className="mb-6 p-4 bg-destructive/5 border border-destructive/20 rounded-lg flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-destructive mb-1">Là người bán?</p>
                                    <p className="text-xs text-muted-foreground">
                                        Bạn có thể hủy giao dịch bất cứ lúc nào. Điều này sẽ -1 cho người mua.
                                    </p>
                                </div>
                                <Button variant="destructive" size="sm" onClick={() => setShowCancelDialog(true)}>
                                    Hủy giao dịch
                                </Button>
                            </div>
                        )}

                        {/* Step Content */}
                        <Card className="mb-8">
                            <CardHeader>
                                <CardTitle>{order.steps[currentStep].title}</CardTitle>
                                <CardDescription>{order.steps[currentStep].description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {currentStep === 0 && <PaymentStep order={order} onNext={() => setCurrentStep(1)} />}
                                {currentStep === 1 && <ConfirmationStep order={order} onNext={() => setCurrentStep(2)} />}
                                {currentStep === 2 && <DeliveryStep order={order} onNext={() => setCurrentStep(3)} />}
                                {currentStep === 3 && <RatingStep order={order} />}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        <OrderChat buyer={order.buyer} seller={order.seller} />
                        <OrderSummary order={order} />
                    </div>
                </div>
            </div>

            {/* Cancel Dialog */}
            <CancelOrderDialog
                isOpen={showCancelDialog}
                onClose={() => setShowCancelDialog(false)}
                onConfirm={handleCancelOrder}
                isSeller={true}
            />
        </main>
    )
}

// Payment Step
function PaymentStep({ order, onNext }) {
    const [formData, setFormData] = useState({ invoiceNumber: "", address: "", phone: "" })

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("[v0] Payment data submitted:", formData)
        onNext()
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-foreground mb-2">Số hoá đơn thanh toán</label>
                <input
                    type="text"
                    placeholder="VD: INV-2024-001"
                    className="w-full px-3 py-2 bg-card border border-border rounded-md text-foreground placeholder-muted-foreground"
                    value={formData.invoiceNumber}
                    onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-2">Địa chỉ giao hàng</label>
                <textarea
                    placeholder="Nhập địa chỉ giao hàng đầy đủ"
                    className="w-full px-3 py-2 bg-card border border-border rounded-md text-foreground placeholder-muted-foreground"
                    rows={3}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-2">Số điện thoại</label>
                <input
                    type="tel"
                    placeholder="+84 9xx xxx xxx"
                    className="w-full px-3 py-2 bg-card border border-border rounded-md text-foreground placeholder-muted-foreground"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
            </div>

            <Button onClick={onNext} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Tiếp tục
            </Button>
        </form>
    )
}

// Confirmation Step
function ConfirmationStep({ order, onNext }) {
    const [invoiceUploaded, setInvoiceUploaded] = useState(false)

    return (
        <div className="space-y-4">
            <p className="text-foreground">Người bán xác nhận đã nhận tiền và gửi hoá đơn vận chuyển</p>
            <div>
                <label className="block text-sm font-medium text-foreground mb-2">Hoá đơn vận chuyển</label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={() => setInvoiceUploaded(true)}
                        className="hidden"
                        id="invoice-upload"
                    />
                    <label htmlFor="invoice-upload" className="cursor-pointer block">
                        <p className="text-muted-foreground">Tải lên hoá đơn vận chuyển</p>
                        {invoiceUploaded && <p className="text-primary mt-2">✓ Đã tải lên</p>}
                    </label>
                </div>
            </div>

            <Button onClick={onNext} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Tiếp tục
            </Button>
        </div>
    )
}

// Delivery Step
function DeliveryStep({ order, onNext }) {
    return (
        <div className="space-y-4">
            <p className="text-foreground">Xác nhận bạn đã nhận được hàng</p>

            <div className="bg-card p-4 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-2">Hàng được gửi qua:</p>
                <p className="text-foreground font-medium">GHN Express - TRK: GHN123456789</p>
            </div>

            <div className="flex items-center gap-4">
                <input type="checkbox" id="confirm-delivery" className="w-4 h-4" />
                <label htmlFor="confirm-delivery" className="text-foreground">
                    Tôi xác nhận đã nhận được hàng đúng như mô tả
                </label>
            </div>

            <Button onClick={onNext} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Xác nhận đã nhận hàng
            </Button>
        </div>
    )
}

// Rating Step
function RatingStep({ order }) {
    const [rating, setRating] = useState(null)
    const [comment, setComment] = useState("")
    const [submitted, setSubmitted] = useState(false)
    const [isEditing, setIsEditing] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("[v0] Rating submitted:", { rating, comment })
        setSubmitted(true)
    }

    if (submitted && !isEditing) {
        return (
            <div className="text-center py-8">
                <div className="text-4xl mb-4">✓</div>
                <p className="text-foreground font-medium mb-2">Cảm ơn bạn đã đánh giá!</p>
                <p className="text-muted-foreground mb-6">
                    Đánh giá của bạn sẽ giúp xây dựng lòng tin trong cộng đồng. Bạn có thể chỉnh sửa đánh giá sau khi gửi.
                </p>
                <Button variant="outline" onClick={() => setIsEditing(true)} className="bg-transparent">
                    Chỉnh sửa đánh giá
                </Button>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-foreground mb-3">Đánh giá giao dịch</label>
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={() => setRating(1)}
                        className={`flex-1 py-3 rounded-lg border-2 transition-all ${rating === 1
                            ? "border-primary bg-primary/10 text-primary font-bold"
                            : "border-border bg-card text-foreground hover:border-primary/50"
                            }`}
                    >
                        +1 Tốt
                    </button>
                    <button
                        type="button"
                        onClick={() => setRating(-1)}
                        className={`flex-1 py-3 rounded-lg border-2 transition-all ${rating === -1
                            ? "border-destructive bg-destructive/10 text-destructive font-bold"
                            : "border-border bg-card text-foreground hover:border-destructive/50"
                            }`}
                    >
                        -1 Xấu
                    </button>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-2">Nhận xét ngắn</label>
                <textarea
                    placeholder="Chia sẻ trải nghiệm của bạn với giao dịch này"
                    className="w-full px-3 py-2 bg-card border border-border rounded-md text-foreground placeholder-muted-foreground"
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                />
            </div>

            <div className="bg-muted/50 border border-border rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                    <strong>Lưu ý:</strong> Đánh giá của bạn sẽ giúp xây dựng lòng tin trong cộng đồng. Bạn có thể chỉnh sửa đánh giá sau khi gửi.
                </p>
            </div>

            <Button
                type="submit"
                disabled={rating === null}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
                Gửi đánh giá
            </Button>
        </form>
    )
}
