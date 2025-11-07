import { Link } from "react-router-dom";
import { ShoppingCart, User, Menu } from "lucide-react";
import { Button } from "../ui/Button";
import { useState } from "react";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-2xl font-bold text-primary">
          AuctionHub
        </Link>

        <nav className="hidden md:flex gap-8">
          <Link
            href="/browse"
            className="text-sm font-medium hover:text-primary transition"
          >
            Browse
          </Link>
          <Link
            href="/selling"
            className="text-sm font-medium hover:text-primary transition"
          >
            Sell
          </Link>
          <Link
            href="/my-bids"
            className="text-sm font-medium hover:text-primary transition"
          >
            My Bids
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <ShoppingCart className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
