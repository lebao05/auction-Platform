"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getAllCategoryApi, addCategoryApi, deleteCategoryApi, updateCategoryApi } from "../services/category.service";

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // ======================
    useEffect(() => {
        refreshCategories();
    }, []);

    // ======================
    // FETCH ALL CATEGORIES
    // ======================
    const refreshCategories = async () => {
        setLoading(true);
        try {
            const data = await getAllCategoryApi();
            setCategories(data);
        } catch (err) {
            console.error("Failed to load categories:", err);
        } finally {
            setLoading(false);
        }
    };

    // ======================
    // ADD CATEGORY
    // ======================
    const addCategory = async ({ name, parentId }) => {
        setLoading(true);
        try {
            await addCategoryApi({ name, parentId });
            await refreshCategories(); // auto reload
            return true;
        } catch (error) {
            console.error("Failed to add category:", error);
            return false;
        } finally {
            setLoading(false);
        }
    };
    const updateCategory = async ({ name, parentId, id }) => {
        setLoading(true);
        try {
            await updateCategoryApi({ name, parentId, id });
            await refreshCategories(); // auto reload
            return true;
        } catch (error) {
            console.error("Failed to update category:", error);
            return false;
        } finally {
            setLoading(false);
        }
    };
    const deleteCategory = async (id) => {
        setLoading(true);
        try {
            await deleteCategoryApi(id);
            await refreshCategories(); // auto reload
            return true;
        } catch (error) {
            console.error("Failed to delete category:", error);
            return false;
        } finally {
            setLoading(false);
        }
    }
    return (
        <AdminContext.Provider
            value={{
                categories,
                loading,
                refreshCategories,
                addCategory, updateCategory, deleteCategory
            }}
        >
            {children}
        </AdminContext.Provider>
    );
}

// ======================
// CUSTOM HOOK
// ======================
export function useAdmin() {
    const ctx = useContext(AdminContext);
    if (!ctx) throw new Error("useAdmin must be used inside AdminProvider");
    return ctx;
}
