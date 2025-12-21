"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
    addToWatchListApi,
    deleteFromWatchListApi,
    getAllLikedProductsApi
} from "../services/product.service";

const WatchListContext = createContext(null);

export default function WatchListProvider({ children }) {
    const [likedProducts, setLikedProducts] = useState([]);

    const fetchWatchList = async () => {
        try {
            const data = await getAllLikedProductsApi();
            setLikedProducts(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchWatchList();
    }, []);

    const addToWatchList = async ({ productId }) => {
        try {
            await addToWatchListApi({ productId });
            if (likedProducts.some(lp => lp.productId == productId))
                setLikedProducts(pre => pre.map(lp => lp.productId != productId ? lp : { ...lp, isDeleted: false }))
            else
                await fetchWatchList();
        }
        catch (err) {
            console.error(err);
        }
    };

    const deleteFromWatchList = async ({ productId }) => {
        try {
            await deleteFromWatchListApi({ productId });
            setLikedProducts(prev =>
                prev.map(lp =>
                    lp.productId === productId
                        ? { ...lp, isDeleted: true }
                        : lp
                )
            );
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <WatchListContext.Provider
            value={{
                likedProducts,
                addToWatchList,
                deleteFromWatchList,
                fetchWatchList
            }}
        >
            {children}
        </WatchListContext.Provider>
    );
}

// -------------------------
// CUSTOM HOOK
// -------------------------
export function useWatchList() {
    const ctx = useContext(WatchListContext);
    if (!ctx) {
        throw new Error("useWatchList must be used inside WatchListProvider");
    }
    return ctx;
}
