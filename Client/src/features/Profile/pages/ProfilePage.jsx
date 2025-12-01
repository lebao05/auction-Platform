import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/Tabs";
import { ProfileInfo } from "../components/ProfileInfo";
import { ProfileRatings } from "../components/ProfileRatings";
import { ProfileWishlist } from "../components/ProfileWishlist";
import { ProfileAuctions } from "../components/ProfileAuction";
import { ProfileSettings } from "../components/ProfileSettings";
import { UserIcon, Star, Heart, Gavel, Settings } from "lucide-react";
import { Header } from "../../../components/layout/Header";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("info");

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-6xl px-4">
        {/* Profile Header */}
        <div className="mb-8 flex items-center gap-4 rounded-lg bg-white p-6 shadow">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-500">
            <UserIcon className="h-10 w-10 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Hồ Sơ Cá Nhân</h1>
            <p className="text-gray-500">
              Quản lý thông tin và hoạt động đấu giá của bạn
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 gap-2 bg-white p-2 shadow rounded">
            <TabsTrigger value="info" className="flex items-center gap-2">
              <UserIcon className="h-4 w-4" />{" "}
              <span className="hidden sm:inline">Thông tin</span>
            </TabsTrigger>
            <TabsTrigger value="ratings" className="flex items-center gap-2">
              <Star className="h-4 w-4" />{" "}
              <span className="hidden sm:inline">Đánh giá</span>
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />{" "}
              <span className="hidden sm:inline">Yêu thích</span>
            </TabsTrigger>
            <TabsTrigger value="auctions" className="flex items-center gap-2">
              <Gavel className="h-4 w-4" />{" "}
              <span className="hidden sm:inline">Đấu giá</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />{" "}
              <span className="hidden sm:inline">Cài đặt</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="info">
              <ProfileInfo />
              <ProfileAuctions />

            </TabsContent>
            <TabsContent value="ratings">
              <ProfileRatings />
            </TabsContent>
            <TabsContent value="wishlist">
              <ProfileWishlist />
            </TabsContent>
            <TabsContent value="auctions">
              <ProfileAuctions />
            </TabsContent>
            <TabsContent value="settings">
              <ProfileSettings />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
