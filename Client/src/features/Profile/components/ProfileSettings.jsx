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
import {
  Eye,
  EyeOff,
  Lock,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";

export function ProfileSettings() {
  const { changePassword } = useAuth();

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

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  /* ===========================
     CHANGE PASSWORD
     =========================== */
  const handleChangePassword = async () => {
    setError(null);
    setSuccess(null);

    const { oldPassword, newPassword, confirmPassword } = passwordForm;

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Mật khẩu mới phải có ít nhất 8 ký tự.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setSubmitting(true);

    const ok = await changePassword({ oldPassword, newPassword });

    setSubmitting(false);

    if (!ok) {
      setError("Mật khẩu cũ không đúng hoặc có lỗi xảy ra.");
      return;
    }

    setSuccess("Đổi mật khẩu thành công 🎉");

    setPasswordForm({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Đổi Mật Khẩu
          </CardTitle>
          <CardDescription>
            Thay đổi mật khẩu tài khoản của bạn. Mật khẩu được mã hóa bằng bcrypt.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* ERROR */}
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          {/* SUCCESS */}
          {success && (
            <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              <CheckCircle2 className="h-4 w-4" />
              {success}
            </div>
          )}

          {/* OLD PASSWORD */}
          <div>
            <Label>Mật Khẩu Cũ</Label>
            <div className="relative mt-2">
              <Input
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
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPasswords.old ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* NEW PASSWORD */}
          <div>
            <Label>Mật Khẩu Mới</Label>
            <div className="relative mt-2">
              <Input
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
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPasswords.new ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <Label>Xác Nhận Mật Khẩu Mới</Label>
            <div className="relative mt-2">
              <Input
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
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPasswords.confirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <Button
            onClick={handleChangePassword}
            disabled={submitting}
            className="w-full"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang cập nhật...
              </>
            ) : (
              "Cập Nhật Mật Khẩu"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
