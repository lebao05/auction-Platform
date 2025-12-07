"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getMySellerRequestApi, getUserProfileApi, requestSellerApi, updateUserProfileApi } from "../services/user.service";
import { loginApi } from "../services/auth.service";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sellerRequest, setSellerRequest] = useState({});

    // Load token on first run
    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        if (savedToken) {
            setToken(savedToken);
            refreshProfile(savedToken);
        } else {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user == null) return;
        getSellerRequest();
    }, [user])
    const requestSeller = async () => {
        try {
            setLoading(true);
            await requestSellerApi();
            const res = await getMySellerRequestApi();
            setSellerRequest(res);
        }
        catch (err) {
            // console.error(err);
        }
        finally {
            setLoading(false);
        }

    }
    const getSellerRequest = async () => {
        if (user == null) return;
        try {
            setLoading(true);
            const res = await getMySellerRequestApi();
            setSellerRequest(res);
        }
        catch (err) {
            // console.error(err);
        }
        finally {
            setLoading(false);
        }

    }

    // -------------------------
    // LOGIN
    // -------------------------
    const login = async (email, password) => {
        setLoading(true);

        try {
            const data = await loginApi(email, password);
            const jwt = data;
            localStorage.setItem("token", jwt);
            setToken(jwt);
            await refreshProfile(jwt);
            return true;
        } catch (err) {
            setLoading(false);
            return false;
        }
    };

    // -------------------------
    // REFRESH PROFILE
    // -------------------------
    const refreshProfile = async (overrideToken) => {
        setLoading(true);

        try {
            const jwt = overrideToken || token;
            if (!jwt) {
                setLoading(false);
                return;
            }

            const profile = await getUserProfileApi();
            console.log("Fetched user profile:", profile);
            setUser(profile);
        } catch (error) {
            logout();
        } finally {
            setLoading(false);
        }
    };
    //UPDATE USER INFO
    const updateInfo = async ({ fullName, dateOfBirth, phoneNumber, address, email }) => {
        setLoading(true);
        try {
            await updateUserProfileApi({ fullName, dateOfBirth, phoneNumber, address, email });
            setUser(pre => pre ? { ...pre, fullName, dateOfBirth, phoneNumber, address, email } : null);
            return true;
        } catch (error) {
            console.error("Failed to update user info:", error);
            return false;
        }
        finally {
            setLoading(false);
        }
    }
    // -------------------------
    // LOGOUT
    // -------------------------
    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider
            value={{ user, token, loading, sellerRequest, login, logout, refreshProfile, updateInfo, requestSeller, getMySellerRequestApi }}>
            {children}
        </AuthContext.Provider>
    );
}

// -------------------------
// CUSTOM HOOK
// -------------------------
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}
