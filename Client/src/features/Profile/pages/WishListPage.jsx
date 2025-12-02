import { ProfileWishlist } from "../components/ProfileWishlist";

export default function WishlistPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <h1 className="text-2xl font-bold mb-6">Danh Sách Yêu Thích</h1>

            <ProfileWishlist />
        </div>
    );
}
