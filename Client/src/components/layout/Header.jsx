import { Link, useNavigate } from "react-router-dom";
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
  History,
  Store,
  Settings,      // Icon Cài đặt
  LogOut         // Icon Đăng xuất
} from "lucide-react";
import { Button } from "../ui/Button";
import { useState } from "react";
import { SellerRequestModal } from "../../features/Home/components/SellerRequestModal";
import { useAuth } from "../../contexts/AuthContext";

export function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [openNotif, setOpenNotif] = useState(false);
  const [openChat, setOpenChat] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [requestModal, setRequestModal] = useState(false);

  const { sellerRequest } = useAuth();
  const toggleProfile = () => {
    setOpenProfile(!openProfile);
    setOpenNotif(false);
    setOpenChat(false);
  };
  console.log(sellerRequest);
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm font-sans">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-primary">
          AuctionHub
        </Link>


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
          {!user && (<>
            <Button variant="customize" className="bg-yellow-300 hover:bg-yellow-500 cursor-pointer"
              size="icon" onClick={() => navigate("/signin")}>
              Đăng Nhập
            </Button>
            <Button variant="customize" className="bg-yellow-300 hover:bg-yellow-500 cursor-pointer"
              size="icon" onClick={() => navigate("/signup")}>
              Đăng Ký
            </Button>
          </>
          )}
          {user && (
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
                        {
                          (!sellerRequest) && (
                            (
                              <div className="flex items-center gap-3" onClick={() => setRequestModal(true)}>
                                <Store className="w-4 h-4 text-gray-500" />
                                <span className="text-sm font-medium text-gray-700">Đăng kí trở thành Seller</span>
                              </div>
                            )
                          )
                        }
                        {
                          sellerRequest?.status == 0 && (
                            (
                              <div className="flex items-center gap-3" >
                                <span className="text-sm font-medium text-gray-700">Đang chờ duyệt Seller</span>
                              </div>
                            )
                          )
                        }
                        {
                          (sellerRequest?.status == 2 && (DateTime.UtcNow - sellerRequest.CreatedAt).TotalDays >= 14) && (
                            (
                              <div className="flex items-center gap-3" onClick={() => setRequestModal(true)}>
                                <Store className="w-4 h-4 text-gray-500" />
                                <span className="text-sm font-medium text-gray-700">Đăng kí trở thành Seller</span>
                              </div>
                            )
                          )
                        }
                      </button>
                      {
                        sellerRequest?.status == 1 && (
                          <button className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition shadow-sm group">
                            <div className="flex items-center gap-3" onClick={() => setRequestModal(true)}>
                              <Store className="w-4 h-4 text-gray-500" />
                              <span className="text-sm font-medium text-gray-700">Quản lí sản phẩm đăng</span>
                            </div>
                          </button>
                        )
                      }
                    </div>
                  </div>

                  <div className="h-[1px] bg-gray-100 mx-4"></div>

                  {/* 6. Khác (New Section) */}
                  <div className="py-2">
                    <p className="px-4 py-1 text-xs font-semibold text-gray-400 uppercase">Khác</p>
                    <MenuItem icon={<Settings size={18} />} label="Cài đặt tài khoản"
                      onClick={() => navigate("/user/setting")} />
                    <MenuItem
                      onClick={() => logout()}
                      icon={<LogOut size={18} className="text-red-500" />}
                      label="Đăng xuất"
                      textClassName="text-red-500 font-medium"
                    />
                  </div>

                </div>
              )}
            </div>
          )}
          {/* --- USER PROFILE DROPDOWN START --- */}
        </div>
      </div>
      <SellerRequestModal isOpen={requestModal} onClose={() => setRequestModal(false)} />
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