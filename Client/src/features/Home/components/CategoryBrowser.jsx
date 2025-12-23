"use client";

import { ChevronRight, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo, useState, useCallback } from "react";

export function CategoryBrowser({ rawCategories, loading, error }) {
  const groupedCategories = useMemo(
    () => groupCategories(rawCategories),
    [rawCategories]
  );

  const [expanded, setExpanded] = useState(() => new Set());

  const toggle = useCallback((id, e) => {
    // Ngăn chặn sự kiện click lan ra ngoài làm ảnh hưởng đến Link
    e.preventDefault();
    e.stopPropagation();
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  if (loading) return <div className="text-sm text-slate-400">Đang tải...</div>;
  if (error) return <div className="text-sm text-red-500">Lỗi tải danh mục</div>;

  return (
    <div className="space-y-4">
      <h3 className="text-[12px] font-bold uppercase tracking-[0.1em] text-slate-900 border-b pb-2 border-slate-100">
        Danh mục sản phẩm
      </h3>

      <div className="flex flex-col space-y-0.5">
        {groupedCategories.map((category) => {
          const isOpen = expanded.has(category.id);
          const hasChildren = category.children.length > 0;

          return (
            <div key={category.id} className="group">
              <div className="flex items-center justify-between rounded-lg hover:bg-slate-50 transition-all duration-200">
                {/* 1. Vùng Click vào chữ để Navigate */}
                <Link
                  to={`/search?categoryId=${category.id}`}
                  className="flex-1 px-3 py-2 text-[14px] font-bold text-slate-800 hover:text-black transition-colors"
                >
                  {category.name}
                </Link>

                {/* 2. Vùng Click vào Icon để Mở rộng (chỉ hiện nếu có con) */}
                {hasChildren && (
                  <button
                    type="button"
                    onClick={(e) => toggle(category.id, e)}
                    className="p-2 cursor-pointer mr-1 rounded-md hover:bg-slate-200 text-slate-400 hover:text-slate-900 transition-all"
                  >
                    {isOpen ? (
                      <ChevronDown className="h-4 w-4" strokeWidth={3} />
                    ) : (
                      <ChevronRight className="h-4 w-4" strokeWidth={3} />
                    )}
                  </button>
                )}
              </div>

              {/* Children List */}
              {isOpen && hasChildren && (
                <div className="mt-1 ml-4 space-y-0.5 border-l-2 border-slate-100 pl-2 animate-in slide-in-from-top-1 duration-200">
                  {category.children.map((child) => (
                    <Link
                      key={child.id}
                      to={`/search?categoryId=${child.id}`}
                      className="block rounded-md px-3 py-1.5 text-[13px] font-medium text-slate-500 hover:text-black hover:bg-slate-50 transition-all"
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Giữ nguyên các hàm helper bên dưới
function groupCategories(rawCategories = []) {
  const map = new Map();
  rawCategories.forEach((item) => {
    if (!item.parent) {
      map.set(item.id, {
        id: item.id,
        name: item.name,
        children: [],
      });
    }
  });
  rawCategories.forEach((item) => {
    if (item.parent) {
      const parent = map.get(item.parent.id);
      if (parent) {
        parent.children.push({
          id: item.id,
          name: item.name,
        });
      }
    }
  });
  return Array.from(map.values());
}