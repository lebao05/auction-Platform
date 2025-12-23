import { Card, CardContent } from "../../../components/ui/Card";
import { Search, MapPin } from "lucide-react";
import { useState } from "react";
import { SearchBar } from "./SearchBar";


export default function MarketplaceUI({ categories }) {
  const [showAll, setShowAll] = useState(false);


  return (
    <div className="w-full text-gray-800">
      <SearchBar categories={categories} />
    </div>
  );
}