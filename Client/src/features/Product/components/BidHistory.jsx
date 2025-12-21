"use client"

import { useState } from "react"
import { Clock, User, X } from "lucide-react"
import { Card } from "../../../components/ui/Card"

function formatTimeDifference(dateString) {
  const now = new Date()
  const past = new Date(dateString)

  const diffMs = now - past
  const diffMin = Math.floor(diffMs / 60000)
  const diffHr = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHr / 24)

  if (diffMin < 60) return `${diffMin} phút trước`
  if (diffHr < 24) return `${diffHr} giờ trước`
  if (diffDay < 7) return `${diffDay} ngày trước`
  return past.toLocaleString()
}

export function BidHistory({ bids, handleAddToBlackList }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedBid, setSelectedBid] = useState(null)

  const openModal = (bid) => {
    setSelectedBid(bid)
    setModalOpen(true)
  }

  const closeModal = () => {
    setSelectedBid(null)
    setModalOpen(false)
  }

  const cancelBid = () => {
    handleAddToBlackList({ bidderId: selectedBid.userId })
    setSelectedBid(null)
    closeModal()
  }

  return (
    <div className="space-y-3">
      {bids.map((bid) => (
        <Card key={bid.id} className="p-4 flex items-start gap-4">
          {/* ICON NGƯỜI DÙNG */}
          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <User className="h-5 w-5 text-primary" />
          </div>

          {/* NỘI DUNG */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="font-medium">{bid.userName}</p>
              <p className="font-bold text-primary">
                {(bid.bidAmount / 1000000).toFixed(1)}M đ
              </p>
            </div>

            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <Clock className="h-4 w-4" />
              {formatTimeDifference(bid.createdAt)}
            </p>

            {/* NÚT HỦY ĐẤU GIÁ */}
            <button
              onClick={() => openModal(bid)}
              className="mt-2 cursor-pointer text-red-600 hover:underline flex items-center gap-1"
            >
              <X className="w-4 h-4" /> Từ chối ra giá
            </button>
          </div>
        </Card>
      ))}

      {/* MODAL XÁC NHẬN */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 w-80">
            <h3 className="text-lg font-semibold mb-4">Xác nhận hủy</h3>
            <p className="mb-6">
              Bạn có chắc muốn tứ chối đấu giá của{" "}
              <span className="font-bold">{selectedBid.userName}</span>
              ?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 cursor-pointer rounded-md border border-gray-300"
              >
                Hủy
              </button>
              <button
                onClick={cancelBid}
                className="px-4 py-2 cursor-pointer rounded-md bg-red-600 text-white"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
