"use client"

import { useState } from "react"
import { ProfileInfo } from "../components/ProfileInfo"
import { ProfileRatings } from "../components/ProfileRatings"
import { ProfileWishlist } from "../components/ProfileWishlist"
import { ProfileAuctions } from "../components/ProfileAuction"
import { UserIcon, Star, Heart, Gavel, Settings } from "lucide-react"
import { useAuth } from "../../../contexts/AuthContext"

export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState("info")
  const { user, updateInfo } = useAuth();
  if (user == null) return null;
  const menuItems = [
    { id: "info", label: "Thông tin", icon: <UserIcon className="h-5 w-5" /> },
    { id: "ratings", label: "Đánh giá", icon: <Star className="h-5 w-5" /> },
    { id: "wishlist", label: "Yêu thích", icon: <Heart className="h-5 w-5" /> },
    { id: "auctions", label: "Đấu giá", icon: <Gavel className="h-5 w-5" /> },
  ]

  const renderContent = () => {
    switch (activeSection) {
      case "info":
        return <ProfileInfo user={user} updateInfo={updateInfo} />
      case "ratings":
        return <ProfileRatings />
      case "wishlist":
        return <ProfileWishlist />
      case "auctions":
        return <ProfileAuctions />
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
              <UserIcon className="h-10 w-10 text-white" />
            </div>
            <h2 className="mt-2 text-lg font-bold text-gray-900">Hồ Sơ Cá Nhân</h2>
            <p className="text-gray-500 text-sm text-center">Quản lý thông tin và hoạt động đấu giá của bạn</p>
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
        <div className="flex-1 bg-white rounded-lg shadow p-6">{renderContent()}</div>
      </div>
    </div>
  )
}
