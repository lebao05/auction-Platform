import { Card, CardContent } from "../../../components/ui/Card";
import { Search, MapPin } from "lucide-react";
import { useState } from "react";
import { SearchBar } from "./SearchBar";


export default function MarketplaceUI() {
  const [showAll, setShowAll] = useState(false);


  return (
    <div className="w-full bg-gray-50 text-gray-800">
      <div className="w-full bg-yellow-300 py-8 flex justify-center text-3xl font-bold">
        Giá tốt, gần bạn, chốt nhanh!
      </div>
      <SearchBar />
    </div>
  );
}