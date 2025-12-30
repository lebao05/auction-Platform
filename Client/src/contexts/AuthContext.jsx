"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
    getMySellerRequestApi,
    getUserProfileApi,
    requestSellerApi,
    updateUserProfileApi,
} from "../services/user.service";
import { loginApi } from "../services/auth.service";
import Spinner from "../components/ui/Spinner";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sellerRequest, setSellerRequest] = useState(null);

    /* ===========================
       INITIAL AUTH CHECK
       =========================== */
    useEffect(() => {
        const bootstrapAuth = async () => {
            const savedToken = localStorage.getItem("token");

            if (!savedToken) {
                setLoading(false);
                return;
            }

            setToken(savedToken);

            try {
                const profile = await getUserProfileApi();
                setUser(profile);
            } catch (err) {
                logout();
            } finally {
                setLoading(false);
            }
        };

        bootstrapAuth();
    }, []);

    /* ===========================
       SELLER REQUEST
       =========================== */
    useEffect(() => {
        if (!user) return;

        const fetchSellerRequest = async () => {
            try {
                const res = await getMySellerRequestApi();
                setSellerRequest(res);
            } catch {
                setSellerRequest(null);
            }
        };

        fetchSellerRequest();
    }, [user]);

    /* ===========================
       LOGIN
       =========================== */
    const login = async (email, password) => {
        setLoading(true);
        try {
            const jwt = await loginApi(email, password);
            localStorage.setItem("token", jwt);
            setToken(jwt);

            const profile = await getUserProfileApi();
            setUser(profile);
            return true;
        } catch {
            return false;
        } finally {
            setLoading(false);
        }
    };

    /* ===========================
       UPDATE PROFILE
       =========================== */
    const updateInfo = async (payload) => {
        setLoading(true);
        try {
            await updateUserProfileApi(payload);
            setUser((prev) => (prev ? { ...prev, ...payload } : null));
            return true;
        } catch {
            return false;
        } finally {
            setLoading(false);
        }
    };

    /* ===========================
       REQUEST SELLER
       =========================== */
    const requestSeller = async () => {
        setLoading(true);
        try {
            await requestSellerApi();
            const res = await getMySellerRequestApi();
            setSellerRequest(res);
        } finally {
            setLoading(false);
        }
    };

    /* ===========================
       LOGOUT
       =========================== */
    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        setToken(null);
    };

    /* ===========================
       🔒 BLOCK RENDERING HERE
       =========================== */
    if (loading) {
        return (
            <Spinner />
        );
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                sellerRequest,
                login,
                logout,
                updateInfo,
                requestSeller,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

/* ===========================
   CUSTOM HOOK
   =========================== */
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}
