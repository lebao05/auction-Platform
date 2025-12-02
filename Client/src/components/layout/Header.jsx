import { Link } from "react-router-dom";
import {
  ShoppingCart,
  User,
  Menu,
  Bell,
  MessageCircle,
  Edit2,
  ChevronRight,
  Heart,
  Bookmark,
  Clock,
  Star,
  Coins,
  Crown,
  ShieldCheck,
  History,
  Store,
  Sparkles,      // Icon cho Chợ Tốt ưu đãi
  Ticket,        // Icon cho Ưu đãi của tôi
  Settings,      // Icon Cài đặt
  Headphones,    // Icon Trợ giúp
  MessageSquare, // Icon Đóng góp ý kiến
  LogOut         // Icon Đăng xuất
} from "lucide-react";
import { Button } from "../ui/Button";
import { useState } from "react";
import { SellerRequestModal } from "../../features/Home/components/SellerRequestModal";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openNotif, setOpenNotif] = useState(false);
  const [openChat, setOpenChat] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [requestModal, setRequestModal] = useState(false);
  const toggleProfile = () => {
    setOpenProfile(!openProfile);
    setOpenNotif(false);
    setOpenChat(false);
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm font-sans">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-primary">
          AuctionHub
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8">
          <Link to="/browse" className="text-sm font-medium hover:text-primary transition">
            Browse
          </Link>
          <Link to="/selling" className="text-sm font-medium hover:text-primary transition">
            Sell
          </Link>
          <Link to="/my-bids" className="text-sm font-medium hover:text-primary transition">
            My Bids
          </Link>
        </nav>

        {/* Icons Area */}
        <div className="relative flex items-center gap-4">
          <Button variant="customized" className="bg-yellow-500 hover:bg-yellow-400 cursor-pointer text-white md:text-black font-medium" size="icon">
            Đăng sản phẩm
          </Button>

          {/* Chat */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setOpenChat(!openChat);
                setOpenNotif(false);
                setOpenProfile(false);
              }}
            >
              <MessageCircle className="h-5 w-5" />
            </Button>
            {openChat && (
              <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-md border p-3 text-sm z-50">
                <p className="font-medium mb-2">Recent Chats</p>
                <p className="text-gray-500 text-xs">No messages yet.</p>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setOpenNotif(!openNotif);
                setOpenChat(false);
                setOpenProfile(false);
              }}
            >
              <Bell className="h-5 w-5" />
            </Button>
            {openNotif && (
              <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-md border p-3 text-sm z-50">
                <p className="font-medium mb-2">Notifications</p>
                <p className="text-gray-500 text-xs">No new notifications.</p>
              </div>
            )}
          </div>

          {/* Cart */}
          <Button variant="ghost" size="icon">
            <ShoppingCart className="h-5 w-5" />
          </Button>

          {/* --- USER PROFILE DROPDOWN START --- */}
          <div className="relative">
            <Button
              variant="customize"
              size="icon"
              onClick={toggleProfile}
              className={`transition-colors ${openProfile
                ? "bg-blue-300 text-white hover:bg-blue-400"
                : "bg-blue-500 text-white hover:bg-blue-600"
                }`}            >
              <User className="h-5 w-5" />
            </Button>

            {openProfile && (
              // Added max-h and overflow-y-auto to handle the long menu
              <div className="absolute right-0 mt-2 w-80 max-h-[85vh] overflow-y-auto bg-white shadow-xl rounded-xl border border-gray-100 z-50 scrollbar-thin scrollbar-thumb-gray-200">

                {/* 1. Header: Avatar & Name */}
                <div className="flex flex-col items-center pt-6 pb-4 bg-white">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center text-white overflow-hidden">
                      <img src="https://github.com/shadcn.png" alt="User" className="w-full h-full object-cover" />
                    </div>
                    <button className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow border cursor-pointer hover:bg-gray-50">
                      <Edit2 className="w-3 h-3 text-gray-600" />
                    </button>
                  </div>

                  <h3 className="mt-2 font-bold text-gray-800">Bảo Lê</h3>

                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="flex">
                      {/* 5 Filled Stars */}
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <span className="font-semibold text-gray-700">5.0</span>
                      <span className="text-gray-400">(12 đánh giá)</span>
                    </div>
                  </div>
                </div>

                <div className="h-[1px] bg-gray-100 mx-4"></div>

                {/* 3. Tiện ích (Utilities) */}
                <div className="py-2">
                  <p className="px-4 py-1 text-xs font-semibold text-gray-400 uppercase">Tiện ích</p>
                  <MenuItem icon={<Heart size={18} />} label="Tin đăng đã lưu" />
                  <MenuItem icon={<Bookmark size={18} />} label="Tìm kiếm đã lưu" />
                  <MenuItem icon={<Clock size={18} />} label="Lịch sử xem tin" />
                  <MenuItem icon={<Star size={18} />} label="Đánh giá từ tôi" />
                  <MenuItem icon={<History size={18} />} label="Lịch sử giao dịch" />
                </div>

                <div className="h-[1px] bg-gray-100 mx-4"></div>

                {/* 4. Dịch vụ trả phí (Paid Services) */}
                <div className="py-2 bg-gray-50/30">
                  <p className="px-4 py-1 text-xs font-semibold text-gray-400 uppercase">Dịch vụ trả phí</p>
                  <div className="px-3 mt-2 mb-1">
                    <button className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition shadow-sm group">
                      <div className="flex items-center gap-3" onClick={() => setRequestModal(true)}>
                        <Store className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Đăng kí trở thành Seller</span>
                      </div>
                      <span className="bg-gray-100 text-[10px] font-semibold px-2 py-1 rounded text-gray-600 group-hover:bg-gray-200">Tạo ngay</span>
                    </button>             <button className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition shadow-sm group">
                      <div className="flex items-center gap-3" onClick={() => setRequestModal(true)}>
                        <Store className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Quản lí sản phẩm đăng</span>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="h-[1px] bg-gray-100 mx-4"></div>

                {/* 6. Khác (New Section) */}
                <div className="py-2">
                  <p className="px-4 py-1 text-xs font-semibold text-gray-400 uppercase">Khác</p>
                  <MenuItem icon={<Settings size={18} />} label="Cài đặt tài khoản" />
                  <MenuItem
                    icon={<LogOut size={18} className="text-red-500" />}
                    label="Đăng xuất"
                    textClassName="text-red-500 font-medium"
                  />
                </div>

              </div>
            )}
          </div>
          {/* --- USER PROFILE DROPDOWN END --- */}

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <SellerRequestModal isOpen={requestModal} onClose={() => setRequestModal(false)} />
      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t shadow-sm">
          <nav className="flex flex-col p-4 gap-3">
            <Link to="/browse" className="text-sm font-medium">Browse</Link>
            <Link to="/selling" className="text-sm font-medium">Sell</Link>
            <Link to="/my-bids" className="text-sm font-medium">My Bids</Link>
          </nav>
        </div>
      )}
    </header>
  );
}

// Updated Helper Component to support custom text colors
function MenuItem({ icon, label, onClick, textClassName }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition group"
    >
      <div className={`flex items-center gap-3 ${textClassName || "text-gray-600 group-hover:text-gray-900"}`}>
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500" />
    </button>
  );
}