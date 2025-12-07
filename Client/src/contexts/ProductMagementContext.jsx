import { createContext, useContext, useEffect, useState } from "react";
import { createProductApi, getProductsForSellerApi } from "../services/product.service";
import { useAuth } from "./AuthContext";

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
    const { user } = useAuth();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    // -----------------------------------------
    // LOAD ALL PRODUCTS FOR THIS SELLER
    // -----------------------------------------
    const loadSellerProducts = async () => {
        if (user == null) return;
        try {
            setLoading(true);
            const data = await getProductsForSellerApi();
            setProducts(data);
        } catch (err) {
            console.error("Failed to load seller products:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user == null) return;
        loadSellerProducts();
    }, [user]);

    // -----------------------------------------
    // CREATE PRODUCT
    // -----------------------------------------
    const createProduct = async ({
        name,
        buyNowPrice,
        startPrice,
        stepPrice,
        allowAll,
        description,
        hours,
        categoryId,
        images,
        mainIndex,
        isAutoRenewal
    }) => {
        try {
            setLoading(true);
            const created = await createProductApi({
                name,
                buyNowPrice,
                startPrice,
                stepPrice,
                allowAll,
                description,
                hours,
                categoryId,
                images,
                mainIndex, 
                isAutoRenewal
            });

            // refresh list
            await loadSellerProducts();

            return created; // product ID
        } catch (err) {
            console.error("Failed to create product:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProductContext.Provider value={{
            products,
            loading,
            createProduct,
            loadSellerProducts
        }}>
            {children}
        </ProductContext.Provider>
    );
}


export function useProduct() {
    const ctx = useContext(ProductContext);
    if (!ctx) throw new Error("useProduct must be used inside ProductProvider");
    return ctx;
}
