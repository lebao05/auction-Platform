"use client";

import { useState } from "react";
import { Button } from "../../../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card"

export function CancelOrderDialog({ isOpen, onClose, onConfirm, isSeller }) {
    const [reason, setReason] = useState("");

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
                <CardHeader>
                    <CardTitle>{isSeller ? "Hủy giao dịch" : "Yêu cầu hủy"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Lý do</label>
                        <textarea
                            placeholder={
                                isSeller
                                    ? "Giải thích lý do hủy giao dịch..."
                                    : "Giải thích lý do yêu cầu hủy..."
                            }
                            className="w-full px-3 py-2 bg-card border border-border rounded-md text-foreground placeholder-muted-foreground text-sm"
                            rows={4}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                    </div>

                    {isSeller && (
                        <div className="bg-destructive/10 border border-destructive/50 rounded-lg p-3">
                            <p className="text-xs text-destructive">
                                <strong>Chú ý:</strong> Nếu bạn hủy, bạn sẽ nhận -1 điểm đánh giá cho người thắng cuộc
                            </p>
                        </div>
                    )}

                    <div className="flex gap-2">
                        <Button onClick={onClose} variant="outline" className="flex-1 bg-transparent">
                            Không
                        </Button>
                        <Button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Xác nhận hủy
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}