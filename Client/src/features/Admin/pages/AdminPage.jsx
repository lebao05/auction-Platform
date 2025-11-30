"use client"

import { useState } from "react"
import { LayoutDashboard } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card"
import { AdminSidebar } from "../../Admin/components/AdminSidebar"
import { AdminCategories } from "../../Admin/components/AdminCategories"
import { AdminProducts } from "../../Admin/components/AdminProducts"
import { AdminUsers } from "../../Admin/components/AdminUsers"

export default function AdminPage() {
    const [activeSection, setActiveSection] = useState("overview")

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
