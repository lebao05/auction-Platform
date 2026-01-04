import { Link, useNavigate } from "react-router-dom";
import {
  MessageCircle,
  ChevronRight,
  Heart,
  Star,
  History,
  Store,
  Settings,
  LogOut,
  PlusCircle
} from "lucide-react";
import { useState } from "react";
import { SellerRequestModal } from "../../features/Home/components/SellerRequestModal";
import { useAuth } from "../../contexts/AuthContext";
import { useChat } from "../../contexts/chatContext";

export function Header() {
  const navigate = useNavigate();
  const { user, logout, sellerRequest } = useAuth();

  const {
    unreadCount,
    conversations,
    isChatListOpen,
    setIsChatListOpen,
    openChatById
  } = useChat();

  const [openProfile, setOpenProfile] = useState(false);
  const [requestModal, setRequestModal] = useState(false);

  // Toggle Profile (Closes Chat)
  const toggleProfile = () => {
    setOpenProfile(!openProfile);
    setIsChatListOpen(false);
  };

  // Toggle Chat (Closes Profile)
  const toggleChat = () => {
    setIsChatListOpen(!isChatListOpen);
    setOpenProfile(false);
  };

  // Helper to format date like "10:30" or "Yesterday"
  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();

    return isToday
      ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : date.toLocaleDateString([], { month: 'numeric', day: 'numeric' });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 font-sans">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">

        {/* Logo */}
        <Link to="/" className="group flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-lg">
            <Store className="text-white h-6 w-6" />
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900 group-hover:text-primary transition-colors">
            AuctionHub
          </span>
        </Link>

        {/* Icons Area */}
        <div className="relative flex items-center gap-3">

          {/* Create Product Button */}
          <button
            onClick={() => navigate("/product/create")}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-xl mr-2"
          >
            <PlusCircle className="h-4 w-4 text-yellow-400" />
            <span className="text-sm">Đăng sản phẩm</span>
          </button>

          {/* Chat Icon & Dropdown */}
          <div className="relative">
            <button
              onClick={toggleChat}
              className={`relative p-2.5 rounded-full transition-all duration-200 ${isChatListOpen ? "bg-primary/10 text-primary" : "text-slate-500 hover:bg-slate-100"
                }`}
            >
              <MessageCircle className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full border-2 border-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Chat Dropdown */}
            {isChatListOpen && (
              <div className="absolute right-0 mt-3 w-80 bg-white shadow-2xl rounded-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex justify-between items-center p-4 border-b border-slate-50 bg-slate-50/50">
                  <p className="font-bold text-slate-800 text-base">Tin nhắn</p>
                  {unreadCount > 0 && (
                    <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">{unreadCount} mới</span>
                  )}
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {conversations.length === 0 ? (
                    <div className="py-10 text-center">
                      <MessageCircle className="h-10 w-10 text-slate-200 mx-auto mb-2" />
                      <p className="text-slate-400 text-xs">Chưa có cuộc trò chuyện nào.</p>
                    </div>
                  ) : (
                    // --- UPDATED CONVERSATION LIST MAPPING ---
                    conversations.map((conv) => (
                      <div
                        key={conv.id}
                        onClick={() => openChatById(conv.id)}
                        className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 transition-colors"
                      >
                        {/* Avatar: Uses OtherAvatarUrl from DTO */}
                        <div className="relative shrink-0">
                          <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border border-slate-100">
                            {conv.otherAvatarUrl ? (
                              <img src={conv.otherAvatarUrl} alt={conv.otherFullName} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-600 font-bold uppercase">
                                {conv.otherFullName || "?"}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline mb-0.5">
                            {/* Name: Uses OtherFullName from DTO */}
                            <p className="text-sm font-bold text-slate-800 truncate pr-2">
                              {conv.otherFullName}
                            </p>
                            {/* Time: Uses LastMessageAt from DTO */}
                            <span className="text-[10px] text-slate-400 shrink-0">
                              {formatTime(conv.lastMessageAt || conv.createdAt)}
                            </span>
                          </div>

                          {/* Message Preview */}
                          <p className={`text-xs truncate ${!conv.lastMessagePreview ? 'text-slate-400 italic' : 'text-slate-500'}`}>
                            {conv.lastMessagePreview ? (
                              <>
                                {/* Check if 'I' sent the last message */}
                                {conv.lastMessagePreview.senderId === user?.userId ? (
                                  <span className="font-semibold text-slate-800">Bạn: </span>
                                ) : <span className="font-semibold text-slate-800">{conv.otherFullName}: </span>
                                }

                                {/* Handle Message Content or Image Type */}
                                {conv.lastMessagePreview.messageType === 2 // Assuming 1 = Image in your Enum
                                  ? <span className="italic text-slate-400">Đã gửi một file</span>
                                  : conv.lastMessagePreview.content
                                }
                              </>
                            ) : (
                              "Bắt đầu cuộc trò chuyện"
                            )}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {conversations.length > 0 && (
                  <div className="p-2 text-center border-t border-slate-50 bg-slate-50/30">
                    <button className="text-xs font-bold text-primary hover:underline">Xem tất cả</button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Authentication Buttons */}
          {!user && (
            <div className="flex items-center gap-2 ml-2">
              <button onClick={() => navigate("/signin")} className="text-slate-600 font-semibold px-4 py-2 hover:text-primary transition-colors">
                Đăng Nhập
              </button>
              <button onClick={() => navigate("/signup")} className="bg-primary text-white font-bold px-6 py-2 rounded-full hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                Đăng Ký
              </button>
            </div>
          )}

          {/* User Profile Dropdown (Existing logic maintained) */}
          {user && (
            <div className="relative ml-2">
              <button
                onClick={toggleProfile}
                className={`flex items-center gap-2 p-1 pr-3 rounded-full transition-all border ${openProfile ? "bg-slate-900 border-slate-900 text-white" : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                  }`}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/20">
                  <img src="https://github.com/shadcn.png" alt="User" className="w-full h-full object-cover" />
                </div>
                <span className="text-xs font-bold hidden md:block">{user.fullName || "User"}</span>
              </button>

              {openProfile && (
                <div className="absolute right-0 mt-3 w-80 max-h-[85vh] overflow-y-auto bg-white shadow-2xl rounded-2xl border border-slate-100 z-50 scrollbar-hide animate-in fade-in slide-in-from-top-2">
                  <div className="relative p-6 text-center border-b border-slate-50">
                    <div className="flex flex-col items-center">
                      <div onClick={() => navigate(`/profile/${user.userId}`)} className="w-20 h-20 cursor-pointer rounded-full p-1 border-4 border-slate-50 shadow-inner mb-3 overflow-hidden">
                        <img src="https://github.com/shadcn.png" alt="User" className="w-full h-full rounded-full object-cover hover:scale-110 transition-transform" />
                      </div>
                      <h3 className="font-black text-slate-800 text-lg leading-tight">{user.fullName}</h3>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-3">
                    <p className="px-5 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cá nhân</p>
                    <MenuItem icon={<Heart size={18} className="text-rose-500" />} label="Tin đăng đã lưu" />
                    <MenuItem icon={<History size={18} className="text-blue-500" />} label="Lịch sử giao dịch" />
                  </div>

                  {/* Seller Logic */}
                  <div className="py-3 bg-slate-50/50">
                    <p className="px-5 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cửa hàng</p>
                    <div className="px-4 mt-1">
                      {(!sellerRequest || (sellerRequest?.status === 2)) && (
                        <button onClick={() => setRequestModal(true)} className="w-full flex items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all group">
                          <div className="flex items-center gap-3">
                            <Store className="w-4 h-4 text-slate-400 group-hover:text-primary" />
                            <span className="text-sm font-bold text-slate-700 group-hover:text-primary">Trở thành Seller</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary" />
                        </button>
                      )}
                      {sellerRequest?.status === 0 && (
                        <div className="w-full text-center px-4 py-3 bg-amber-50 border border-amber-100 rounded-xl text-amber-700 text-xs font-bold italic">Đang chờ duyệt Seller...</div>
                      )}
                      {sellerRequest?.status === 1 && (
                        <button onClick={() => setRequestModal(true)} className="w-full flex items-center justify-between px-4 py-3 bg-emerald-50 border border-emerald-100 rounded-xl hover:bg-emerald-100 transition-all group">
                          <div className="flex items-center gap-3">
                            <Store className="w-4 h-4 text-emerald-600" />
                            <span className="text-sm font-bold text-emerald-700">Quản lý bán hàng</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-emerald-400" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="py-3 mb-2">
                    <p className="px-5 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Hệ thống</p>
                    <MenuItem icon={<Settings size={18} />} label="Cài đặt tài khoản" onClick={() => navigate("/user/setting")} />
                    <MenuItem onClick={() => logout()} icon={<LogOut size={18} className="text-rose-500" />} label="Đăng xuất" textClassName="text-rose-500 font-bold" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <SellerRequestModal isOpen={requestModal} onClose={() => setRequestModal(false)} />
    </header>
  );
}

function MenuItem({ icon, label, onClick, textClassName }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition-all group"
    >
      <div className={`flex items-center gap-3 ${textClassName || "text-slate-600 group-hover:text-slate-900"}`}>
        <span className="transition-transform group-hover:scale-110">{icon}</span>
        <span className="text-sm font-semibold">{label}</span>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
    </button>
  );
}