"use client";

import { useState, useMemo } from "react";
import { MessageCircle, Send, Reply, User, MessageSquareText, Pencil, X, Check } from "lucide-react";
import { formatDateTimeFull } from "../../../utils/DateTimeExtension";
import { useAuth } from "../../../contexts/AuthContext";

/**
 * COMPONENT CHÍNH: ProductQnA
 */
export default function ProductQnA({
    comments = [],
    isSeller,
    editComment,
    addComment
}) {
    const [activeReplyId, setActiveReplyId] = useState(null);
    const [textValue, setTextValue] = useState("");
    const [loading, setLoading] = useState(false);

    // 1. Xây dựng cây comment từ mảng phẳng
    const commentTree = useMemo(() => {
        const map = {};
        const roots = [];

        comments.forEach(c => {
            map[c.id] = { ...c, children: [] };
        });

        comments.forEach(c => {
            if (c.parentId && map[c.parentId]) {
                map[c.parentId].children.push(map[c.id]);
            } else {
                roots.push(map[c.id]);
            }
        });

        const sortNodes = (nodes, isRoot) => {
            nodes.sort((a, b) => {
                const timeA = new Date(a.createdAt).getTime();
                const timeB = new Date(b.createdAt).getTime();
                return isRoot ? timeB - timeA : timeA - timeB;
            });
            nodes.forEach(node => sortNodes(node.children, false));
        };

        sortNodes(roots, true);
        return roots;
    }, [comments]);

    const handleAction = async (parentId = null) => {
        if (!textValue.trim()) return;
        setLoading(true);
        try {
            await addComment({ parentId, content: textValue });
            setTextValue("");
            setActiveReplyId(null);
        } catch (error) {
            console.error("Lỗi khi gửi bình luận:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Form đặt câu hỏi chính */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/10">
                <div className="flex items-center gap-2 mb-3 text-gray-800">
                    <MessageSquareText className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-sm">Hỏi người bán về sản phẩm này</span>
                </div>
                <div className="relative">
                    <textarea
                        value={activeReplyId === null ? textValue : ""}
                        onChange={(e) => {
                            setActiveReplyId(null);
                            setTextValue(e.target.value);
                        }}
                        placeholder="Câu hỏi của bạn là gì?..."
                        className="w-full min-h-[100px] p-4 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-blue-500 outline-none transition-all resize-none text-sm"
                    />
                    <div className="flex justify-end mt-3">
                        <button
                            onClick={() => handleAction(null)}
                            disabled={loading || !textValue.trim()}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium flex items-center gap-2 transition-all disabled:opacity-50 text-sm"
                        >
                            <Send size={16} />
                            {loading ? "Đang gửi..." : "Gửi câu hỏi"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Danh sách các câu hỏi & phản hồi */}
            <div className="space-y-2">
                {commentTree.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
                        <MessageCircle className="w-12 h-12 text-gray-200 mb-2" />
                        <p className="text-gray-400 text-sm italic">Chưa có thắc mắc nào.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-100">
                        {commentTree.map((comment) => (
                            <CommentItem
                                key={comment.id}
                                comment={comment}
                                isSeller={isSeller}
                                activeReplyId={activeReplyId}
                                setActiveReplyId={setActiveReplyId}
                                textValue={textValue}
                                setTextValue={setTextValue}
                                handleAction={handleAction}
                                editComment={editComment}
                                loading={loading}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

/**
 * COMPONENT CON: Từng mục bình luận
 */
function CommentItem({
    comment,
    level = 0,
    isSeller,
    activeReplyId,
    setActiveReplyId,
    textValue,
    setTextValue,
    handleAction,
    editComment,
    loading
}) {
    // LẤY USER TRỰC TIẾP TỪ AUTH CONTEXT ĐỂ TRÁNH LỖI "UNDEFINED"
    const { user } = useAuth(); 
    
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(comment.content);
    const [editLoading, setEditLoading] = useState(false);

    const isReplying = activeReplyId === comment.id;

    // KIỂM TRA QUYỀN: Chỉ cho phép sửa nếu userId trong comment khớp với userId người dùng đang đăng nhập
    const canEdit = user && String(user.userId) === String(comment.userId);

    const handleUpdate = async () => {
        if (!editValue.trim() || editValue === comment.content) {
            setIsEditing(false);
            return;
        }
        setEditLoading(true);
        try {
            await editComment({ commentId: comment.id, content: editValue });
            setIsEditing(false);
        } catch (error) {
            console.error("Comment Updating Error:", error);
        } finally {
            setEditLoading(false);
        }
    };

    return (
        <div className={`transition-all ${level === 0 ? "p-5" : "pt-4 pl-4 md:pl-8 border-l-2 border-gray-100 ml-4 md:ml-6 mt-3"}`}>
            <div className="flex gap-4">
                <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs border-2 shadow-sm ${level > 0 ? "w-8 h-8" : ""} ${
                    comment.fullName === "Người bán" 
                    ? "bg-amber-50 text-amber-600 border-amber-100" 
                    : "bg-blue-50 text-blue-600 border-blue-100"
                }`}>
                    <User size={level > 0 ? 14 : 18} />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2 flex-wrap mb-1">
                        <span className={`font-bold text-gray-900 truncate ${level > 0 ? "text-xs" : "text-sm"}`}>
                            {comment.fullName}
                            {comment.fullName === "Người bán" && (
                                <span className="ml-2 px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] rounded border border-amber-200">SELLER</span>
                            )}
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium italic">
                            {formatDateTimeFull(comment.createdAt)}
                        </span>
                    </div>

                    {isEditing ? (
                        <div className="mt-2 space-y-2 animate-in fade-in duration-200">
                            <textarea
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="w-full min-h-[60px] p-3 text-sm bg-white border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500/10 outline-none resize-none"
                                autoFocus
                            />
                            <div className="flex justify-end gap-2">
                                <button onClick={() => setIsEditing(false)} className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-100 rounded-md">
                                    <X size={14} /> Hủy
                                </button>
                                <button onClick={handleUpdate} disabled={editLoading} className="bg-amber-600 text-white px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1">
                                    {editLoading ? "..." : <><Check size={14} /> Lưu</>}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-700 text-sm leading-relaxed break-words">{comment.content}</p>
                    )}

                    {!isEditing && (
                        <div className="flex items-center gap-4 mt-2">
                            <button
                                onClick={() => {
                                    setActiveReplyId(isReplying ? null : comment.id);
                                    setTextValue("");
                                }}
                                className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-400 hover:text-blue-600 transition-colors uppercase"
                            >
                                <Reply size={12} />
                                {isReplying ? "Đóng" : "Phản hồi"}
                            </button>

                            {/* CHỈ HIỂN THỊ NÚT SỬA NẾU LÀ CHỦ SỞ HỮU COMMENT */}
                            {canEdit && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-400 hover:text-amber-600 transition-colors uppercase"
                                >
                                    <Pencil size={11} /> Chỉnh sửa
                                </button>
                            )}
                        </div>
                    )}

                    {isReplying && (
                        <div className="mt-3 animate-in fade-in slide-in-from-top-1">
                            <textarea
                                autoFocus
                                value={textValue}
                                onChange={(e) => setTextValue(e.target.value)}
                                placeholder={`Phản hồi cho ${comment.fullName}...`}
                                className="w-full min-h-[70px] p-3 text-sm bg-gray-50 border border-blue-200 rounded-lg outline-none resize-none"
                            />
                            <div className="flex justify-end mt-2">
                                <button
                                    onClick={() => handleAction(comment.id)}
                                    disabled={loading || !textValue.trim()}
                                    className="bg-gray-900 text-white px-4 py-1.5 rounded-md text-[11px] font-bold"
                                >
                                    {loading ? "Đang gửi..." : "Gửi phản hồi"}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* RENDER ĐỆ QUY: Không cần truyền user xuống vì bên trong đã dùng useAuth() */}
                    {comment.children?.map((child) => (
                        <CommentItem
                            key={child.id}
                            comment={child}
                            level={level + 1}
                            isSeller={isSeller}
                            activeReplyId={activeReplyId}
                            setActiveReplyId={setActiveReplyId}
                            textValue={textValue}
                            setTextValue={setTextValue}
                            handleAction={handleAction}
                            editComment={editComment}
                            loading={loading}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}