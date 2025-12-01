import { Card, CardContent } from "../../../components/ui/Card";
import { Search, MapPin } from "lucide-react";
import { useState } from "react";
import { SearchBar } from "./SearchBar";


export default function MarketplaceUI() {
  const [showAll, setShowAll] = useState(false);
  const visibleCategories = showAll ? categories : categories.slice(0, 6);


  return (
    <div className="w-full bg-gray-50 text-gray-800">
      <div className="w-full bg-yellow-300 py-8 flex justify-center text-3xl font-bold">
        Giá tốt, gần bạn, chốt nhanh!
      </div>


      <SearchBar />


      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6 p-4 max-w-6xl mx-auto transition-all duration-300"
        style={{ maxHeight: showAll ? '500px' : '180px', overflow: 'hidden' }}>
        {visibleCategories.map((item, index) => (
          <Card key={index} className="shadow hover:shadow-lg transition cursor-pointer">
            <CardContent className="flex flex-col items-center p-4 gap-2 text-center">
              <div className="text-3xl">{item.icon}</div>
              <p className="text-sm font-medium text-gray-700">{item.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>


      <div className="flex justify-center mb-10">
        {(
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium"
          >
            {showAll ? "Thu gọn" : "Xem thêm"}
          </button>
        )}
      </div>
    </div>
  );
}
const categories = [
  { label: "Bất động sản", icon: "🏠" },
  { label: "Xe cộ", icon: "🚗" },
  { label: "Thú cưng", icon: "🐶" },
  { label: "Nội thất", icon: "🛋️" },
  { label: "Giải trí", icon: "🎸" },
  { label: "Mẹ và bé", icon: "🧸" },
  { label: "Dịch vụ", icon: "🧳" },
  { label: "Cho tặng miễn phí", icon: "🎁" },
  { label: "Việc làm", icon: "👷" },
  { label: "Đồ điện tử", icon: "📱" },
  { label: "Điện lạnh", icon: "🧊" },
  { label: "Đồ dùng văn phòng", icon: "🖨️" },
  { label: "Thời trang", icon: "👕" },
  { label: "Thực phẩm", icon: "🥑" },
  { label: "Chăm sóc nhà cửa", icon: "🔧" },
  { label: "Tất cả danh mục", icon: "📚" }
];