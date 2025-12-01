"use client"

import { Clock, User } from "lucide-react"
import { Card } from "../../../components/ui/Card"

export function BidHistory({ bids }) {
  return (
    <div className="space-y-3">
      {bids.map((bid, index) => (
        <Card key={index} className="p-4 flex items-start gap-4">
          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="font-medium">{bid.bidder}</p>
              <p className="font-bold text-primary">
                {(bid.amount / 1000000).toFixed(1)}M đ
              </p>
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <Clock className="h-4 w-4" />
              {bid.timestamp}
            </p>
          </div>
        </Card>
      ))}
    </div>
  )
}
