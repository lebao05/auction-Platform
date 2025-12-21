"use client"

import { useEffect, useState } from "react"
import { LayoutDashboard } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card"
import { AdminSidebar } from "../../Admin/components/AdminSidebar"
import { AdminCategories } from "../../Admin/components/AdminCategories"
import { AdminProducts } from "../../Admin/components/AdminProducts"
import { AdminUsers } from "../../Admin/components/AdminUsers"
import { useAdmin } from "../../../contexts/AdminContext"
import { Input } from "../../../components/ui/Input"
import { toast } from "react-toastify"

export default function AdminPage() {
    const [activeSection, setActiveSection] = useState("overview")
    const { systemSetting, updateSystemSetting, getSystemSettings } = useAdmin()
    const [tempValues, setTempValues] = useState({})

    const labelMap = {
        ExtraRenewalTime: "Thời gian gia hạn",
        RenewalTriggerTime: "Thời gian kích hoạt gia hạn",
        RemainingTriggerTime: "Thời gian còn lại kích hoạt gia hạn",
        NewProductTime: "Thời gian sản phẩm mới",
    }

    useEffect(() => {
        getSystemSettings()
    }, [])

    useEffect(() => {
        const initialValues = {}
        systemSetting.forEach(item => {
            initialValues[item.systemKey] = item.systemVaue
        })
        setTempValues(initialValues)
    }, [systemSetting])

    async function handleUpdate(settingKey, settingValue) {
        try {
            await updateSystemSetting({ systemKey: settingKey, systemValue: Number(settingValue) });
            toast.success("Cập nhật thành công")
        } catch {
            toast.error("Đã xảy ra lỗi!")
        }
    }

    return (
        <div className="flex min-h-screen bg-background">
            <AdminSidebar activeSection={activeSection} onSectionChange={setActiveSection} />

            <main className="flex-1 overflow-auto">
                <div className="border-b border-border bg-card p-6">
                    <div className="flex items-center gap-3">
                        <LayoutDashboard className="h-8 w-8 text-primary" />
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">Quản Trị Viên</h1>
                            <p className="text-sm text-muted-foreground">Quản lý hệ thống AuctionHub</p>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    {activeSection === "overview" && (
                        <div className="grid gap-6">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                {/* Card Thống kê */}
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">Tổng Danh Mục</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-3xl font-bold text-foreground">12</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">Tổng Sản Phẩm</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-3xl font-bold text-foreground">1,248</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">Người Dùng</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-3xl font-bold text-foreground">3,421</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">Yêu Cầu Nâng Cấp</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-3xl font-bold text-primary">8</p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* System Setting */}
                            <div className="bg-card border border-border rounded-lg p-6">
                                {systemSetting.map((item) => (
                                    <Card key={item.systemKey} className="mb-2 shadow-sm border border-gray-200">
                                        <CardContent className="py-3">
                                            <div className="flex items-center justify-between">
                                                {/* Label + Input */}
                                                <div className="flex items-center gap-4">
                                                    <label className="text-sm font-medium text-gray-700 w-48">
                                                        {labelMap[item.systemKey] ?? item.systemKey}
                                                    </label>
                                                    <div className="flex items-center w-35 gap-2">
                                                        <Input
                                                            value={tempValues[item.systemKey] || ""}
                                                            type="number"
                                                            onChange={(e) =>
                                                                setTempValues({
                                                                    ...tempValues,
                                                                    [item.systemKey]: e.target.value
                                                                })
                                                            }
                                                        />
                                                        <span className="text-sm text-gray-500">phút</span>
                                                    </div>
                                                </div>

                                                {/* Update Button */}
                                                <button
                                                    className="
                                                        px-4 py-1.5 
                                                        bg-gray-600 
                                                        hover:bg-gray-700 
                                                        text-white 
                                                        text-sm
                                                        rounded-md 
                                                        shadow
                                                        transition
                                                        cursor-pointer
                                                    "
                                                    onClick={() =>
                                                        handleUpdate(
                                                            item.systemKey,
                                                            tempValues[item.systemKey] ?? item.systemVaue
                                                        )
                                                    }
                                                >
                                                    Update
                                                </button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeSection === "categories" && <AdminCategories />}
                    {activeSection === "products" && <AdminProducts />}
                    {activeSection === "users" && <AdminUsers />}
                </div>
            </main>
        </div>
    )
}
