import { useState } from "react";
import { Slider } from "../../../components/ui/Slider";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { X } from "lucide-react";

const CATEGORIES = ["Electronics", "Fashion", "Home", "Sports", "Books"];
const TIME_RANGES = [
  { value: "all", label: "Tất cả thời gian" },
  { value: "24h", label: "Kết thúc trong 24h" },
  { value: "48h", label: "Kết thúc trong 48h" },
  { value: "7d", label: "Kết thúc trong 7 ngày" },
];

export function SearchFilters({
  filters,
  onFiltersChange,
  onSearch,
  isCategory,
}) {
  const [searchInput, setSearchInput] = useState("");

  const handlePriceChange = (value) => {
    onFiltersChange({
      ...filters,
      priceRange: [value[0], value[1]],
    });
  };

  const handleCategoryChange = (category) => {
    onFiltersChange({
      ...filters,
      category: filters.category === category ? "" : category,
    });
  };

  const handleTimeChange = (timeRange) => {
    onFiltersChange({
      ...filters,
      timeRange: filters.timeRange === timeRange ? "all" : timeRange,
    });
  };

  const handleSearch = () => {
    onSearch(searchInput);
  };

  const handleReset = () => {
    setSearchInput("");
    onFiltersChange({
      priceRange: [0, 50000000],
      category: isCategory ? filters.category : "",
      timeRange: "all",
    });
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="flex gap-2">
        <Input
          placeholder="Tìm kiếm sản phẩm..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="flex-1"
        />
        <Button onClick={handleSearch}>Tìm kiếm</Button>
      </div>

      {/* Price Range Filter */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Khoảng giá</label>
          <Slider
            defaultValue={[filters.priceRange[0], filters.priceRange[1]]}
            min={0}
            max={50000000}
            step={1000000}
            onValueChange={handlePriceChange}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{(filters.priceRange[0] / 1000000).toFixed(0)}M</span>
            <span>{(filters.priceRange[1] / 1000000).toFixed(0)}M</span>
          </div>
        </div>

        {/* Time Range Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Thời gian</label>
          <select
            value={filters.timeRange}
            onChange={(e) => handleTimeChange(e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-background text-sm"
          >
            {TIME_RANGES.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter (only on search page) */}
        {!isCategory && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Danh mục</label>
            <select
              value={filters.category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-background text-sm"
            >
              <option value="">Tất cả danh mục</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat.toLowerCase()}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Active Filters Display */}
        {(filters.category || filters.timeRange !== "all") && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Bộ lọc hoạt động</label>
            <div className="flex flex-wrap gap-2">
              {filters.category && (
                <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full text-xs">
                  <span className="capitalize">{filters.category}</span>
                  <button
                    onClick={() => handleCategoryChange("")}
                    className="hover:text-primary ml-1"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              {filters.timeRange !== "all" && (
                <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full text-xs">
                  <span>
                    {
                      TIME_RANGES.find((r) => r.value === filters.timeRange)
                        ?.label
                    }
                  </span>
                  <button
                    onClick={() => handleTimeChange("all")}
                    className="hover:text-primary ml-1"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Reset Button */}
      {(filters.category || filters.timeRange !== "all" || searchInput) && (
        <div>
          <Button variant="outline" size="sm" onClick={handleReset}>
            Xoá tất cả bộ lọc
          </Button>
        </div>
      )}
    </div>
  );
}
