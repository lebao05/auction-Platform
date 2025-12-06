import { useState, useCallback } from "react";
import {
    handleSellerRequestApi,
    getSellerRequestsAsAdminApi,
} from "../services/user.service"

export function useSellerRequests() {
    const [sellerRequests, setSellerRequest] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // fetch list
    const fetchRequests = useCallback(async (query = "", createdDec = true, page = 1) => {
        setLoading(true);
        setError(null);
        console.log("Ok");
        try {
            const res = await getSellerRequestsAsAdminApi(query, createdDec, page);
            setSellerRequest(res);
            return res;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // accept / reject
    const handleRequest = useCallback(async (requestId, isAccepted) => {
        try {
            const res = await handleSellerRequestApi(requestId, isAccepted);
            setSellerRequest(prev =>
                prev.map(rq =>
                    rq.id === requestId
                        ? { ...rq, status: isAccepted ? 1 : 2 }
                        : rq
                )
            ); return res;
        } catch (err) {
            setError(err);
            throw err;
        }
    }, []);

    return {
        sellerRequests,
        loading,
        error,
        fetchRequests,
        handleRequest,
    };
}
