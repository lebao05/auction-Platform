import { useEffect, useState } from "react";
import { getProfileOfAUserApi } from "../services/user.service";
import { getProductRelatedtoUserApi, getRatingsRelatedToUserApi } from "../services/product.service";
import { updateRatingApi } from "../services/order.service";

export function useUserView(userId) {
    const [profile, setProfile] = useState(null);
    const [products, setProducts] = useState([]);
    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(false);

    /* ================= FETCH FUNCTIONS ================= */

    const fetchProfile = async () => {
        const data = await getProfileOfAUserApi({ userId });
        setProfile(data);
    };

    const fetchProducts = async () => {
        const data = await getProductRelatedtoUserApi({ userId });
        setProducts(data);
    };

    const fetchRatings = async () => {
        const data = await getRatingsRelatedToUserApi({ userId });
        setRatings(data);
    };

    const fetchAll = async () => {
        setLoading(true);
        try {
            await Promise.all([
                fetchProfile(),
                fetchProducts(),
                fetchRatings(),
            ]);
        } finally {
            setLoading(false);
        }
    };


    const updateRating = async ({ ratingId, comment, ratingType }) => {
        await updateRatingApi({ ratingId, comment, ratingType });
        await fetchRatings(); // refresh only ratings
    };


    useEffect(() => {
        if (!userId) return;
        fetchAll();
    }, [userId]);

    return {
        profile,
        products,
        ratings,
        loading,

        // exposed functions
        fetchProfile,
        fetchProducts,
        fetchRatings,
        updateRating,
    };
}
