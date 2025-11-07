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

export function ProfileInfo() {
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "Nguyễn Văn A",
    email: "nguyenvana@email.com",
    birthDate: "1990-05-15",
    phone: "+84912345678",
    address: "123 Đường ABC, TP. Hồ Chí Minh",
  });

  const [tempData, setTempData] = useState(formData);

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => setIsEditing(false);
  const handleSave = () => {
    setFormData(tempData);
    setIsEditing(false);
    alert("Thông tin cá nhân đã được cập nhật"); // simple toast replacement
  };

  const handleChange = (field, value) => {
    setTempData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Thông Tin Cá Nhân</CardTitle>
            <CardDescription>
              Quản lý thông tin tài khoản của bạn
            </CardDescription>
          </div>
          {!isEditing && (
            <Button variant="outline" onClick={handleEdit}>
              <Edit2 className="mr-2 h-4 w-4" /> Chỉnh sửa
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
                  value={tempData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              ) : (
                <p className="mt-2 text-sm font-medium text-gray-900">
                  {formData.name}
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
                  {formData.email}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="birthDate">Ngày Sinh</Label>
              {isEditing ? (
                <Input
                  id="birthDate"
                  type="date"
                  value={tempData.birthDate}
                  onChange={(e) => handleChange("birthDate", e.target.value)}
                />
              ) : (
                <p className="mt-2 text-sm font-medium text-gray-900">
                  {new Date(formData.birthDate).toLocaleDateString("vi-VN")}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Số Điện Thoại</Label>
              {isEditing ? (
                <Input
                  id="phone"
                  value={tempData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
              ) : (
                <p className="mt-2 text-sm font-medium text-gray-900">
                  {formData.phone}
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
                  {formData.address}
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
