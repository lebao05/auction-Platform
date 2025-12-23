import { Search, LayoutGrid, ChevronDown } from "lucide-react";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export function SearchBar({ categories = [] }) {
  const [keyword, setKeyword] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const navigate = useNavigate();
  const flattenedCategories = useMemo(() => {
    const result = [];
    const parents = categories.filter((c) => !c.parent);
    parents.forEach((parent) => {
      result.push({ ...parent, isChild: false });
      const children = categories.filter((c) => c.parent && c.parent.id === parent.id);
      children.forEach((child) => {
        result.push({ ...child, isChild: true });
      });
    });
    return result;
  }, [categories]);

  const handleSearch = () => {
    navigate(`/search?q=${keyword}&categoryId=${selectedCategoryId}`)
  };

  return (
    <div className="flex my-6 w-full max-w-4xl mx-auto px-4">
      {/* Container: Nền trắng tuyệt đối, viền xám mảnh, chữ đen */}
      <div className="flex w-full items-center bg-white border border-slate-300 rounded-xl shadow-sm focus-within:border-black focus-within:ring-1 focus-within:ring-black/5 transition-all duration-200 overflow-hidden">

        {/* BÊN TRÁI: Chọn danh mục */}
        <div className="relative flex items-center shrink-0 border-r border-slate-200 bg-white">
          <div className="absolute left-4 pointer-events-none text-slate-900">
            <LayoutGrid className="h-4 w-4" />
          </div>

          <select
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="h-12 pl-10 pr-10 bg-transparent text-[14px] font-bold text-slate-900 appearance-none cursor-pointer focus:outline-none min-w-[150px] hover:bg-slate-50 transition-colors"
          >
            <option value="" className="font-normal text-slate-500">Tất cả danh mục</option>
            {flattenedCategories.map((cat) => (
              <option key={cat.id} value={cat.id} className="text-black py-2">
                {cat.isChild ? `   ${cat.name}` : cat.name}
              </option>
            ))}
          </select>

          <div className="absolute right-3 pointer-events-none text-slate-400">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>

        {/* GIỮA: Input tìm kiếm */}
        <div className="flex-1 relative">
          <Input
            placeholder="Tìm kiếm sản phẩm, thương hiệu..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-12 bg-transparent w-full text-base px-5 text-slate-900 placeholder:text-slate-400 font-medium shadow-none"
          />
        </div>

        {/* BÊN PHẢI: Nút bấm màu đen trắng (Minimalism) */}
        <div className="px-2 shrink-0">
          <button
            onClick={handleSearch}
            className="h-9 px-5 rounded-lg bg-slate-900 hover:bg-gray-600 cursor-pointer text-white transition-all flex items-center gap-2 active:scale-95"
          >
            <Search className="h-4 w-4" />
            <span className="font-semibold text-sm">Tìm kiếm</span>
          </button>
        </div>
      </div>
    </div>
  );
}