import { LayoutDashboard, Grid, Package, Users, LogOut } from "lucide-react";
import { Button } from "../../../components/ui/Button";

export function AdminSidebar({ activeSection, onSectionChange }) {
    const navItems = [
        { id: "overview", label: "Hệ thống", icon: LayoutDashboard },
        { id: "categories", label: "Danh Mục", icon: Grid },
        { id: "products", label: "Sản Phẩm", icon: Package },
        { id: "users", label: "Người Dùng", icon: Users },
    ];

    return (
        <div className="w-64 border-r border-border bg-card relative">
            <div className="p-6">
                <a href="/" className="text-2xl font-bold text-primary">
                    AuctionHub
                </a>
                <p className="text-xs text-muted-foreground mt-1">Admin Panel</p>
            </div>

            <nav className="space-y-2 px-3 py-6">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Button
                            key={item.id}
                            variant="customize"
                            onClick={() => onSectionChange(item.id)}
                            className={`w-full flex bg-black hover:bg-gray-400 items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeSection === item.id
                                ? "bg-white text-black text-primary-foreground"
                                : "text-foreground text-white"
                                }`}
                        >
                            <Icon className="h-5 w-5" />
                            <span className="text-sm font-medium">{item.label}</span>
                        </Button>
                    );
                })}
            </nav>

            <div className="border-t boder-gray border-border p-3 absolute bottom-0 w-64">
                <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                    <LogOut className="h-4 w-4" />
                    Đăng Xuất
                </Button>
            </div>
        </div>
    );
}
