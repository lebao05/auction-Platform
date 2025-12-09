"use client"

import { Clock, User } from "lucide-react"
import { Card } from "../../../components/ui/Card"

// ⏳ Format time difference
function formatTimeDifference(dateString) {
  const now = new Date()
  const past = new Date(dateString)

  const diffMs = now - past
  const diffMin = Math.floor(diffMs / 60000)
  const diffHr = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHr / 24)

  if (diffMin < 60) return `${diffMin} minute${diffMin !== 1 ? "s" : ""} ago`

  if (diffHr < 24) return `${diffHr} hour${diffHr !== 1 ? "s" : ""} ago`

  if (diffDay < 7) return `${diffDay} day${diffDay !== 1 ? "s" : ""} ago`

  return past.toLocaleString()
}

export function BidHistory({ bids }) {
  return (
    <div className="space-y-3">
      {bids.map((bid) => (
        <Card key={bid.id} className="p-4 flex items-start gap-4">

          {/* USER ICON */}
          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <User className="h-5 w-5 text-primary" />
          </div>

          {/* CONTENT */}
          <div className="flex-1 min-w-0">

            {/* NAME + AMOUNT */}
            <div className="flex items-center justify-between gap-2">
              <p className="font-medium">{bid.userName}</p>

              <p className="font-bold text-primary">
                {(bid.bidAmount / 1000000).toFixed(1)}M đ
              </p>
            </div>

            {/* TIME AGO */}
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <Clock className="h-4 w-4" />
              {formatTimeDifference(bid.createdAt)}
            </p>
          </div>

        </Card>
      ))}
    </div>
  )
}
