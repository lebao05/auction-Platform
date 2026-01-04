"use client";

import { useEffect, useState } from "react"
import { ProfileInfo } from "../components/ProfileInfo"
import { ProfileRatings } from "../components/ProfileRatings"
import { ProfileWishlist } from "../components/ProfileWishlist"
import { ProfileAuctions } from "../components/ProfileAuction"
// 1. Thêm icon MessageCircle
import { UserIcon, Star, Heart, Gavel, MessageCircle } from "lucide-react"
import { useAuth } from "../../../contexts/AuthContext"
// 2. Import Chat Context
import { useChat } from "../../../contexts/chatContext"
import { useParams, useNavigate } from "react-router-dom"
import { useUserView } from "../../../hooks/useUserViewing"

export default function ProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { profile, ratings, updateRating, products } = useUserView(userId);
  const { user, updateInfo } = useAuth();

  // 3. Lấy hàm tạo chat/mở chat từ Context
  // Giả sử bạn có hàm createConversation hoặc openChatWithUser trong context
  // Nếu chưa có, bạn cần viết API để lấy conversationId dựa trên userId này
  const { openChatWithUser } = useChat();

  const [activeSection, setActiveSection] = useState("info");

  const isOwnProfile = user != null && String(user.userId) === String(userId);

  useEffect(() => {
    if (!isOwnProfile && activeSection === "wishlist") {
      setActiveSection("info");
    }
  }, [isOwnProfile, activeSection]);

  // 4. Hàm xử lý khi bấm Nhắn tin
  const handleStartChat = async () => {
    if (!user) {
      navigate("/signin");
      return;
    }
    openChatWithUser(userId);
  };

  if (user == null && profile == null) return null;

  const menuItems = [
    { id: "info", label: "Thông tin", icon: <UserIcon className="h-5 w-5" /> },
    { id: "ratings", label: "Đánh giá", icon: <Star className="h-5 w-5" /> },
    { id: "wishlist", label: "Yêu thích", icon: <Heart className="h-5 w-5" />, private: true },
    { id: "auctions", label: "Đấu giá", icon: <Gavel className="h-5 w-5" /> },
  ].filter(item => !item.private || isOwnProfile);

  if (user == null && profile == null) return;

  const renderContent = () => {
    switch (activeSection) {
      case "info":
        return <ProfileInfo
          user={isOwnProfile ? user : profile}
          IsYou={isOwnProfile}
          updateInfo={updateInfo}
        />
      case "ratings":
        return <ProfileRatings ratings={ratings} user={user} updateRating={updateRating} isYou={isOwnProfile} />
      case "wishlist":
        return isOwnProfile ? <ProfileWishlist /> : null;
      case "auctions":
        return <ProfileAuctions products={products} isYou={isOwnProfile} user={user} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-6xl px-4 flex gap-6">
        {/* Sidebar */}
        <aside className="w-64 bg-white rounded-lg shadow p-4 flex flex-col gap-2">
          <div className="flex flex-col items-center mb-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-500">
              {profile?.avatarUrl ? (
                <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                <UserIcon className="h-10 w-10 text-white" />
              )}
            </div>
            <h2 className="mt-2 text-lg font-bold text-gray-900">
              {isOwnProfile ? "Hồ Sơ Cá Nhân" : (profile?.fullName || "Người dùng")}
            </h2>
            <p className="text-gray-500 text-sm text-center">
              {isOwnProfile
                ? "Quản lý thông tin và hoạt động của bạn"
                : `Xem thông tin của ${profile?.fullName || 'người dùng'}`}
            </p>

            {/* --- NÚT NHẮN TIN (Chỉ hiện khi user != null và không phải chính mình) --- */}
            {!isOwnProfile && user && (
              <button
                onClick={handleStartChat}
                className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-full font-semibold transition-all shadow-md active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                Nhắn tin
              </button>
            )}
            {/* --------------------------------------------------------------------- */}

          </div>

          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                className={`flex items-center gap-2 p-2 rounded-md w-full text-left transition ${activeSection === item.id
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "hover:bg-gray-100 text-gray-700"
                  }`}
                onClick={() => setActiveSection(item.id)}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1 bg-white rounded-lg shadow p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}