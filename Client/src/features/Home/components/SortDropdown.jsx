import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/DropdownMenu";
import { Button } from "../../../components/ui/Button";
import { ChevronDown } from "lucide-react";

const sortOptions = [
  { value: "newest", label: "Mới nhất" },
  { value: "ending-soon", label: "Kết thúc sớm" },
  { value: "price-low", label: "Giá thấp đến cao" },
  { value: "price-high", label: "Giá cao đến thấp" },
  { value: "most-bids", label: "Nhiều lượt đấu thầu" },
];

export function SortDropdown({ onSort, sortBy }) {
  const currentLabel =
    sortOptions.find((opt) => opt.value === sortBy)?.label || "Sắp xếp";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 bg-transparent">
          {currentLabel}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {sortOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onSort(option.value)}
            className={sortBy === option.value ? "bg-accent" : ""}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
