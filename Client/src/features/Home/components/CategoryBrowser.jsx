"use client";

import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo, useState, useCallback } from "react";
import { useCategory } from "../../../hooks/useCategory";

export function CategoryBrowser() {
  const { categories: rawCategories, loading, error } = useCategory();

  const groupedCategories = useMemo(
    () => groupCategories(rawCategories),
    [rawCategories]
  );

  // track expanded parents
  const [expanded, setExpanded] = useState(() => new Set());

  const toggle = useCallback((id) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  if (loading) return <div className="text-sm text-muted-foreground">Loading...</div>;
  if (error) return <div className="text-sm text-red-500">Failed to load categories</div>;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Danh mục
      </h3>

      <div className="space-y-1">
        {groupedCategories.map((category) => {
          const isOpen = expanded.has(category.id);

          return (
            <div key={category.id} className="space-y-1">
              {/* Parent */}
              <button
                type="button"
                onClick={() => toggle(category.id)}
                className="flex w-full items-center cursor-pointer gap-2 rounded-md px-3 py-2 text-sm font-medium
                           hover:bg-accent hover:text-accent-foreground transition"
              >
                <span className="text-left">{category.name}</span>

                {category.children.length > 0 && (
                  <ChevronRight
                    className={`ml-auto h-4 w-4 opacity-50 transition-transform
                      ${isOpen ? "rotate-90" : ""}`}
                  />
                )}
              </button>

              {/* Children */}
              {isOpen && category.children.length > 0 && (
                <div className="space-y-1 pl-4">
                  {category.children.map((child) => (
                    <Link
                      key={child.id}
                      to={`/category/${category.slug}/${child.slug}`}
                      className="block rounded px-2 py-1 text-xs text-muted-foreground
                                 hover:text-foreground hover:bg-accent transition"
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

function groupCategories(rawCategories = []) {
  const map = new Map();

  // tạo parent trước
  rawCategories.forEach((item) => {
    if (!item.parent) {
      map.set(item.id, {
        id: item.id,
        name: item.name,
        slug: slugify(item.name),
        children: [],
      });
    }
  });

  // gắn children
  rawCategories.forEach((item) => {
    if (item.parent) {
      const parent = map.get(item.parent.id);
      if (parent) {
        parent.children.push({
          id: item.id,
          name: item.name,
          slug: slugify(item.name),
        });
      }
    }
  });

  return Array.from(map.values());
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
}