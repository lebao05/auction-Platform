import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  {
    name: "Electronics",
    subcategories: ["Mobile Phones", "Laptops", "Tablets"],
  },
  {
    name: "Fashion",
    subcategories: ["Shoes", "Watches", "Clothing"],
  },
  {
    name: "Home & Garden",
    subcategories: ["Furniture", "Decor", "Kitchen"],
  },
  {
    name: "Sports & Outdoors",
    subcategories: ["Equipment", "Apparel", "Accessories"],
  },
];

export function CategoryBrowser() {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Categories
      </h3>
      <div className="space-y-1">
        {categories.map((category) => (
          <div key={category.name} className="space-y-1">
            {/* Main Category Link */}
            <Link
              to={`/category/${category.name.toLowerCase()}`}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition"
            >
              {category.name}
              <ChevronRight className="h-4 w-4 ml-auto opacity-50" />
            </Link>

            {/* Subcategory Links */}
            <div className="space-y-1 pl-4">
              {category.subcategories.map((sub) => (
                <Link
                  key={sub}
                  to={`/category/${category.name.toLowerCase()}/${sub.toLowerCase()}`}
                  className="block text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded transition"
                >
                  {sub}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
