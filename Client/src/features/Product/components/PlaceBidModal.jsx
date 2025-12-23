import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "../../../components/ui/Button";

export function PlaceBidModal({ currentBid, onClose, onSubmit }) {
    const automaticBidAmount = currentBid + 100000; // fixed automatic bid
    const [confirmed, setConfirmed] = useState(false);

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl animate-in fade-in-50 zoom-in-50">

                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Place Your Bid</h2>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <p className="text-sm text-gray-600 mb-2">Current highest bid:</p>
                <p className="text-2xl font-bold text-primary mb-4">
                    {currentBid} đ
                </p>

                <p className="text-sm text-gray-600 mb-2">Your bid will be automatically placed at:</p>
                <p className="text-2xl font-bold text-primary mb-4">{automaticBidAmount} đ</p>

                {/* Confirmation Checkbox */}
                <label className="flex items-center gap-2 mb-4 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={confirmed}
                        onChange={(e) => setConfirmed(e.target.checked)}
                        className="w-4 h-4"
                    />
                    <span className="text-lg"><b>I confirm to place this bid</b></span>
                </label>

                {/* Footer */}
                <div className="mt-6 flex gap-3">
                    <Button variant="outline" className="flex-1 bg-transparent" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        className="flex-1"
                        onClick={() => onSubmit(automaticBidAmount)}
                        disabled={!confirmed}
                    >
                        Place Bid
                    </Button>
                </div>
            </div>
        </div>
    );
}
