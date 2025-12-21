import { useEffect, useState, useCallback } from "react";
import { getAllCategoryApi } from "../services/category.service";

export function useCategory() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await getAllCategoryApi();
            setCategories(data);
        } catch (err) {
            console.error("Failed to load categories:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    return {
        categories,   // danh mục 2 cấp
        loading,
        error,
        refresh: fetchCategories,
    };
}
