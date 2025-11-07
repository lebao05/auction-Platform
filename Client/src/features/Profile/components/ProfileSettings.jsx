"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Label } from "../../../components/ui/Label";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

export function ProfileSettings() {
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [emailForm, setEmailForm] = useState({
    email: "nguyenvana@email.com",
    verificationCode: "",
    isAwaitingVerification: false,
  });

  const handleChangePassword = () => {
    if (
      !passwordForm.oldPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return;
    }

    setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
  };

  const handleSendOTP = () => {
    setEmailForm((prev) => ({ ...prev, isAwaitingVerification: true }));
  };

  const handleVerifyOTP = () => {
    setEmailForm({
      email: "",
      verificationCode: "",
      isAwaitingVerification: false,
    });
  };

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Đổi Mật Khẩu
          </CardTitle>
          <CardDescription>
            Thay đổi mật khẩu tài khoản của bạn. Mật khẩu được mã hóa bằng
            bcrypt
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Old Password */}
          <div>
            <Label htmlFor="oldPassword">Mật Khẩu Cũ</Label>
            <div className="relative mt-2">
              <Input
                id="oldPassword"
                type={showPasswords.old ? "text" : "password"}
                placeholder="Nhập mật khẩu cũ"
                value={passwordForm.oldPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    oldPassword: e.target.value,
                  }))
                }
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords((prev) => ({ ...prev, old: !prev.old }))
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPasswords.old ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <Label htmlFor="newPassword">Mật Khẩu Mới</Label>
            <div className="relative mt-2">
              <Input
                id="newPassword"
                type={showPasswords.new ? "text" : "password"}
                placeholder="Nhập mật khẩu mới"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
                }
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords((prev) => ({ ...prev, new: !prev.new }))
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPasswords.new ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <Label htmlFor="confirmPassword">Xác Nhận Mật Khẩu Mới</Label>
            <div className="relative mt-2">
              <Input
                id="confirmPassword"
                type={showPasswords.confirm ? "text" : "password"}
                placeholder="Xác nhận mật khẩu mới"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords((prev) => ({
                    ...prev,
                    confirm: !prev.confirm,
                  }))
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPasswords.confirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <Button onClick={handleChangePassword} className="w-full">
            Cập Nhật Mật Khẩu
          </Button>
        </CardContent>
      </Card>

      {/* Email Verification / Change Email */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Xác Nhận Email
          </CardTitle>
          <CardDescription>
            Xác nhận hoặc thay đổi email của bạn
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!emailForm.isAwaitingVerification ? (
            <>
              <div>
                <Label htmlFor="email">Email Hiện Tại</Label>
                <Input
                  id="email"
                  type="email"
                  value={emailForm.email}
                  readOnly
                  className="mt-2"
                />
              </div>
              <Button onClick={handleSendOTP} className="w-full">
                Gửi Mã OTP
              </Button>
            </>
          ) : (
            <>
              <div>
                <Label htmlFor="verificationCode">Mã Xác Nhận OTP</Label>
                <Input
                  id="verificationCode"
                  placeholder="Nhập mã OTP từ email"
                  value={emailForm.verificationCode}
                  onChange={(e) =>
                    setEmailForm((prev) => ({
                      ...prev,
                      verificationCode: e.target.value,
                    }))
                  }
                  className="mt-2"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleVerifyOTP} className="flex-1">
                  Xác Nhận
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    setEmailForm((prev) => ({
                      ...prev,
                      isAwaitingVerification: false,
                      verificationCode: "",
                    }))
                  }
                  className="flex-1"
                >
                  Hủy
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Forgot Password */}
      <Card>
        <CardHeader>
          <CardTitle>Quên Mật Khẩu</CardTitle>
          <CardDescription>Yêu cầu đặt lại mật khẩu qua email</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full bg-transparent">
            Yêu Cầu Đặt Lại Mật Khẩu
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
