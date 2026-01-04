"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../../components/ui/Card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/Tabs";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { ThumbsUp, ThumbsDown, Edit2, Check, X, MessageSquare } from "lucide-react";

export function ProfileRatings({ ratings = [], user, isYou, updateRating }) {
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [editType, setEditType] = useState(1);

  // 1. Phân loại đánh giá dựa trên userId
  // Đánh giá mà người xem nhìn thấy khi vào profile (mọi người đánh giá chủ profile này)
  const receivedRatings = ratings.filter(r => r.ratedUserId === user?.userId);
  
  // Đánh giá mà chính người dùng hiện tại đã đi viết cho người khác (chỉ quan tâm khi isYou = true)
  const givenRatings = ratings.filter(r => r.raterId === user?.userId);

  // 2. Tính toán thống kê từ những gì nhận được
  const positiveCount = receivedRatings.filter(r => r.ratingType === 1).length;
  const negativeCount = receivedRatings.filter(r => r.ratingType === -1).length;

  const handleStartEdit = (rating) => {
    setEditingId(rating.id);
    setEditValue(rating.comment);
    setEditType(rating.ratingType);
  };

  const handleSaveEdit = async (id) => {
    // Gọi hàm updateRating từ props với object chứa data mới
    await updateRating({ 
      ratingId: id, 
      comment: editValue, 
      ratingType: editType 
    });
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Khối thống kê tổng quan */}
      <Card>
        <CardHeader>
          <CardTitle>Chỉ số uy tín</CardTitle>
          <CardDescription>Dựa trên {receivedRatings.length} phản hồi từ cộng đồng</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-100 rounded-xl">
            <div>
              <p className="text-sm text-green-600 font-medium">Tích cực</p>
              <p className="text-3xl font-bold text-green-700">{positiveCount}</p>
            </div>
            <ThumbsUp className="h-8 w-8 text-green-500 opacity-50" />
          </div>
          <div className="flex items-center justify-between p-4 bg-red-50 border border-red-100 rounded-xl">
            <div>
              <p className="text-sm text-red-600 font-medium">Tiêu cực</p>
              <p className="text-3xl font-bold text-red-700">{negativeCount}</p>
            </div>
            <ThumbsDown className="h-8 w-8 text-red-500 opacity-50" />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="received">
        <TabsList className="w-full bg-gray-100 p-1">
          <TabsTrigger value="received" className="flex-1">Đánh giá nhận được</TabsTrigger>
          {isYou && <TabsTrigger value="given" className="flex-1">Đánh giá bạn đã gửi</TabsTrigger>}
        </TabsList>

        {/* Tab 1: Hiển thị những gì người khác đánh giá về profile này */}
        <TabsContent value="received" className="space-y-4 mt-4">
          {receivedRatings.length > 0 ? (
            receivedRatings.map((r) => (
              <Card key={r.id} className="overflow-hidden border-l-4 border-l-blue-500">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                        {r.raterName?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{r.raterName}</p>
                        <p className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleDateString("vi-VN")}</p>
                      </div>
                    </div>
                    <Badge className={r.ratingType === 1 ? "bg-green-500 text-green-700" : "bg-red-100 text-red-700"}>
                      {r.ratingType === 1 ? "+1 Tích cực" : "-1 Tiêu cực"}
                    </Badge>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg flex gap-2">
                    <MessageSquare className="h-4 w-4 text-gray-400 mt-1 shrink-0" />
                    <p className="text-sm text-gray-700 italic">
                      {r.comment || "Người dùng không để lại bình luận."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed">
              <p className="text-gray-400">Chưa có đánh giá nào được gửi đến.</p>
            </div>
          )}
        </TabsContent>

        {/* Tab 2: Hiển thị những gì CHÍNH BẠN đã đánh giá người khác (Có nút Sửa) */}
        {isYou && (
          <TabsContent value="given" className="space-y-4 mt-4">
            <div className="bg-blue-50 p-3 rounded-md mb-4 text-xs text-blue-700">
               💡 Bạn có thể chỉnh sửa nội dung phản hồi bất cứ lúc nào để cập nhật trải nghiệm giao dịch.
            </div>
            {givenRatings.map((r) => (
              <Card key={r.id} className={editingId === r.id ? "ring-2 ring-blue-500" : ""}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-semibold text-gray-600 text-truncate">
                      Giao dịch với: <span className="text-blue-600">{r.ratedUserName}</span>
                    </span>
                    
                    {editingId !== r.id ? (
                      <Button variant="outline" size="sm" onClick={() => handleStartEdit(r)} className="h-8">
                        <Edit2 className="h-3.5 w-3.5 mr-1" /> Sửa
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button size="sm" className="h-8 bg-green-600 hover:bg-green-700" onClick={() => handleSaveEdit(r.id)}>
                          <Check className="h-3.5 w-3.5 mr-1" /> Lưu
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 text-red-600" onClick={() => setEditingId(null)}>
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {editingId === r.id ? (
                    <div className="space-y-3">
                      <div className="flex gap-4">
                         <label className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-md border cursor-pointer transition ${editType === 1 ? 'bg-green-50 border-green-500 text-green-700' : 'bg-white'}`}>
                            <input type="radio" className="hidden" name="type" onChange={() => setEditType(1)} checked={editType === 1}/>
                            <ThumbsUp className="h-4 w-4" /> Tích cực
                         </label>
                         <label className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-md border cursor-pointer transition ${editType === -1 ? 'bg-red-50 border-red-500 text-red-700' : 'bg-white'}`}>
                            <input type="radio" className="hidden" name="type" onChange={() => setEditType(-1)} checked={editType === -1}/>
                            <ThumbsDown className="h-4 w-4" /> Tiêu cực
                         </label>
                      </div>
                      <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        placeholder="Nhập phản hồi của bạn..."
                        className="bg-white"
                      />
                    </div>
                  ) : (
                    <div className="flex items-start gap-3">
                       <div className={`p-2 rounded-full ${r.ratingType === 1 ? 'bg-green-100' : 'bg-red-100'}`}>
                          {r.ratingType === 1 ? <ThumbsUp className="h-4 w-4 text-green-600" /> : <ThumbsDown className="h-4 w-4 text-red-600" />}
                       </div>
                       <p className="text-sm text-gray-700 mt-1 italic">"{r.comment || "Không có bình luận"}"</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}