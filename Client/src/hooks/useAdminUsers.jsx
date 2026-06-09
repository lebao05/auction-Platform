import { useState, useEffect, useCallback } from "react";
import {
    getAllUsersApi,
    resetPasswordAsAdminAPi,
    banUserApi
} from "../services/user.service";

export function useAdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch all users
    useEffect(() => {
        let cancelled = false;

        const fetchUsers = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await getAllUsersApi();
                if (!cancelled) {
                    setUsers(data);
                }
            } catch (err) {
                if (!cancelled) setError(err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchUsers();

        return () => {
            cancelled = true;
        };
    }, []);

    // Reset password as admin
    const resetPassword = useCallback(async (userId) => {
        setActionLoading(true);
        setError(null);
        try {
            await resetPasswordAsAdminAPi({ UserId: userId });
            return true;
        } catch (err) {
            setError(err);
            return false;
        } finally {
            setActionLoading(false);
        }
    }, []);

    // Ban user as admin
    const banUser = useCallback(async (userId) => {
        setActionLoading(true);
        setError(null);

        try {
            await banUserApi({ UserId: userId });

            // Optimistic update: remove banned user from list
            setUsers(prev => prev.filter(u => u.id !== userId));

            return true;
        } catch (err) {
            setError(err);
            return false;
        } finally {
            setActionLoading(false);
        }
    }, []);

    const refetch = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getAllUsersApi();
            setUsers(data);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        users,
        loading,
        actionLoading,
        error,
        resetPassword,
        banUser,
        refetch
    };
}
