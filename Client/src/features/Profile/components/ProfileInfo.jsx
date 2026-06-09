"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Label } from "../../../components/ui/Label";
import { Edit2, Save, X } from "lucide-react";

export function ProfileInfo({ user, updateInfo, IsYou }) {
  if (user == null) return null;
  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState(user);
  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setTempData(user);
    setIsEditing(false);
  };
  const handleSave = () => {
    updateInfo(tempData);
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setTempData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Thông Tin Cá Nhân</CardTitle>
            <CardDescription>
              {IsYou ? "Quản lý thông tin tài khoản của bạn" : "Thông tin chi tiết người dùng"}
            </CardDescription>
          </div>
          {/* Chỉ hiển thị nút Chỉnh sửa nếu IsYou là true và không trong chế độ edit */}
          {IsYou && !isEditing && (
            <Button variant="outline" onClick={handleEdit}>
              <span className="flex items-center">
                <Edit2 className="mr-2 h-4 w-4" /> Chỉnh sửa
              </span>
            </Button>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">Họ Tên</Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={tempData.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                />
              ) : (
                <p className="mt-2 text-sm font-medium text-gray-900">
                  {user.fullName}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={tempData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              ) : (
                <p className="mt-2 text-sm font-medium text-gray-900">
                  {user.email}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="birthDate">Ngày Sinh</Label>
              {isEditing ? (
                <Input
                  id="birthDate"
                  type="date"
                  // Đồng nhất key với dateOfBirth
                  value={tempData.dateOfBirth?.split('T')[0] || ""}
                  onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                />
              ) : (
                <p className="mt-2 text-sm font-medium text-gray-900">
                  {user.dateOfBirth
                    ? new Date(user.dateOfBirth).toLocaleDateString("vi-VN")
                    : "Chưa cập nhật"}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Số Điện Thoại</Label>
              {isEditing ? (
                <Input
                  id="phone"
                  value={tempData.phoneNumber}
                  onChange={(e) => handleChange("phoneNumber", e.target.value)}
                />
              ) : (
                <p className="mt-2 text-sm font-medium text-gray-900">
                  {user.phoneNumber || "Chưa cập nhật"}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="address">Địa Chỉ</Label>
              {isEditing ? (
                <Input
                  id="address"
                  value={tempData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                />
              ) : (
                <p className="mt-2 text-sm font-medium text-gray-900">
                  {user.address || "Chưa cập nhật"}
                </p>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-3 pt-4">
              <Button onClick={handleSave} className="flex-1">
                <Save className="mr-2 h-4 w-4" /> Lưu Thay Đổi
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="flex-1"
              >
                <X className="mr-2 h-4 w-4" /> Hủy
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}