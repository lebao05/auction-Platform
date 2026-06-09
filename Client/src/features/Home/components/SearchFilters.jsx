import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { X, Search, LayoutGrid, ChevronDown, ArrowUpDown } from "lucide-react";
import { useCategory } from "../../../hooks/useCategory";
import { Button } from "../../../components/ui/Button";
import { useSearchProducts } from "../../../hooks/useSearchProducts";

/* ================= CONSTANTS ================= */
const SORT_OPTIONS = [
  { value: "newest", label: "Mới nhất" },
  { value: "endingSoon", label: "Sắp kết thúc" },
  { value: "priceascsending", label: "Giá tăng dần" },
  { value: "pricedecsending", label: "Giá giảm dần" },
];

/* ================= COMPONENT ================= */
export default function SearchFilters({ setSearchFilter }) {
  const { categories = [] } = useCategory();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    keyword: "",
    categoryId: "",
    sortBy: "", // Mặc định để trống (không chọn)
  });
  useEffect(() => {
    const initFilters = {
      keyword: searchParams.get("q") || "",
      categoryId: searchParams.get("categoryId") || "",
      sortBy: searchParams.get("sort") || "",
    };
    setSearchFilter(initFilters);
    setFilters(initFilters);
  }, [searchParams]);

  // Xử lý danh mục thành dạng cây để hiển thị trong select
  const flattenedCategories = useMemo(() => {
    const result = [];
    const parents = categories.filter((c) => !c.parent);
    parents.forEach((parent) => {
      result.push({ ...parent, isChild: false });
      const children = categories.filter((c) => c.parent?.id === parent.id);
      children.forEach((child) => {
        result.push({ ...child, isChild: true });
      });
    });
    return result;
  }, [categories]);

  const updateFilters = (patch) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  };

  const applySearch = () => {
    const params = {};
    if (filters.keyword) params.q = filters.keyword;
    if (filters.categoryId) params.categoryId = filters.categoryId;
    if (filters.sortBy) params.sort = filters.sortBy;

    setSearchParams(params);
  };

  return (
    <div className="w-full space-y-5">
      {/* 1. THANH SEARCH BAR (UI cao cấp: Danh mục bên trái + Input + Nút Search) */}
      <div className="flex w-full items-center bg-white border border-slate-300 rounded-xl shadow-sm focus-within:border-black focus-within:ring-4 focus-within:ring-black/5 transition-all duration-200 overflow-hidden">

        {/* VÙNG DANH MỤC (BÊN TRÁI) */}
        <div className="relative flex items-center shrink-0 border-r border-slate-200 bg-slate-50/50 hover:bg-slate-100 transition-colors">
          <LayoutGrid className="absolute left-4 h-4 w-4 text-slate-600 pointer-events-none" />
          <select
            value={filters.categoryId}
            onChange={(e) => updateFilters({ categoryId: e.target.value })}
            className="h-12 pl-11 pr-9 bg-transparent text-[14px] font-bold text-slate-900 appearance-none cursor-pointer focus:outline-none min-w-[150px] max-w-[200px]"
          >
            <option value="">Tất cả danh mục</option>
            {flattenedCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.isChild ? `   ${cat.name}` : cat.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 h-4 w-4 text-slate-400 pointer-events-none" />
        </div>

        {/* VÙNG INPUT (GIỮA) */}
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Bạn đang tìm sản phẩm gì..."
            value={filters.keyword}
            onChange={(e) => updateFilters({ keyword: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && applySearch()}
            className="w-full h-12 px-5 bg-transparent border-none focus:ring-0 text-slate-900 placeholder:text-slate-400 font-medium"
          />
        </div>

        {/* NÚT TÌM KIẾM (BÊN PHẢI) */}
        <div className="px-2 shrink-0">
          <button
            onClick={applySearch}
            className="h-9 cursor-pointer px-5 rounded-lg bg-slate-900 hover:bg-gray-500 text-white transition-all flex items-center gap-2 active:scale-95 shadow-sm"
          >
            <Search className="h-4 w-4" />
            <span className="font-bold text-sm hidden sm:inline">Tìm kiếm</span>
          </button>
        </div>
      </div>

      {/* 2. THANH PHỤ (Chip bộ lọc & Sắp xếp) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">

        {/* CHIPS BỘ LỌC ĐANG HOẠT ĐỘNG */}
        <div className="flex flex-wrap gap-2">
          {filters.keyword && (
            <Chip label={`"${filters.keyword}"`} onRemove={() => updateFilters({ keyword: "" })} />
          )}
          {filters.categoryId && (
            <Chip
              label={categories.find(c => c.id === filters.categoryId)?.name}
              onRemove={() => updateFilters({ categoryId: "" })}
            />
          )}
        </div>

        {/* BỘ CHỌN SẮP XẾP (Mặc định không chọn) */}
        <div className="flex items-center gap-2 self-end">
          <span className="text-sm text-slate-500 font-medium whitespace-nowrap">Sắp xếp:</span>
          <div className="relative flex items-center group">
            <select
              value={filters.sortBy}
              onChange={(e) => {
                const newVal = e.target.value;
                updateFilters({ sortBy: newVal });
                // Cập nhật URL ngay lập tức khi chọn
                const newParams = Object.fromEntries(searchParams);
                if (newVal) newParams.sort = newVal; else delete newParams.sort;
                setSearchParams(newParams);
              }}
              className="pl-3 pr-8 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-900 appearance-none cursor-pointer hover:border-slate-400 focus:border-black outline-none transition-all shadow-sm"
            >
              <option value="">Mặc định</option>
              {SORT_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <ArrowUpDown className="absolute right-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none group-hover:text-slate-600" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= CHIP COMPONENT ================= */
function Chip({ label, onRemove }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 text-slate-900 rounded-full shadow-sm animate-in fade-in zoom-in duration-200">
      <span className="text-xs font-bold leading-none">{label}</span>
      <button
        onClick={onRemove}
        className="text-slate-400 hover:text-black transition-colors"
      >
        <X size={14} strokeWidth={2.5} />
      </button>
    </div>
  );
}