import { useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { formatDateTimeFull } from "../../../utils/DateTimeExtension";

export default function ProductQnA({
    questions = [],
    isSeller,
    onAskQuestion,
    onAnswerQuestion,
}) {
    const [questionText, setQuestionText] = useState("");
    const [answerText, setAnswerText] = useState({});
    const [loading, setLoading] = useState(false);

    const handleAsk = async () => {
        if (!questionText.trim()) return;
        setLoading(true);
        await onAskQuestion?.(questionText);
        setQuestionText("");
        setLoading(false);
    };

    const handleAnswer = async (id) => {
        if (!answerText[id]?.trim()) return;
        setLoading(true);
        await onAnswerQuestion?.(id, answerText[id]);
        setAnswerText((prev) => ({ ...prev, [id]: "" }));
        setLoading(false);
    };

    return (
        <div className="space-y-6">
            {/* ================= ASK QUESTION ================= */}
            <div className="rounded-lg border border-gray-200 bg-white p-4">
                <h3 className="mb-3 flex items-center gap-2 font-semibold">
                    <MessageCircle className="h-5 w-5 text-blue-500" />
                    Hỏi người bán
                </h3>

                <textarea
                    rows={3}
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    placeholder="Nhập câu hỏi của bạn..."
                    className="w-full resize-none rounded-md border border-gray-300 p-3 text-sm focus:border-blue-500 focus:outline-none"
                />

                <div className="mt-3 flex justify-end">
                    <button
                        onClick={handleAsk}
                        disabled={loading}
                        className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50"
                    >
                        <Send className="h-4 w-4" />
                        Gửi câu hỏi
                    </button>
                </div>
            </div>

            {/* ================= QUESTION LIST ================= */}
            <div className="space-y-4">
                {questions.length === 0 && (
                    <p className="text-sm text-gray-500">
                        Chưa có câu hỏi nào cho sản phẩm này.
                    </p>
                )}

                {questions.map((q) => (
                    <div
                        key={q.id}
                        className="rounded-lg border border-gray-200 bg-white p-4"
                    >
                        {/* Question */}
                        <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
                                Q
                            </div>

                            <div className="flex-1">
                                <p className="text-sm font-medium">{q.content}</p>
                                <p className="mt-1 text-xs text-gray-400">
                                    {q.userName} • {formatDateTimeFull(q.createdAt)}
                                </p>
                            </div>
                        </div>

                        {/* Answer */}
                        {q.answer && (
                            <div className="mt-4 flex items-start gap-3 pl-12">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-semibold text-green-600">
                                    A
                                </div>

                                <div className="flex-1 rounded-md bg-green-50 p-3">
                                    <p className="text-sm">{q.answer}</p>
                                    <p className="mt-1 text-xs text-gray-400">
                                        Người bán • {formatDateTimeFull(q.answeredAt)}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Seller reply box */}
                        {isSeller && !q.answer && (
                            <div className="mt-4 pl-12">
                                <textarea
                                    rows={2}
                                    value={answerText[q.id] || ""}
                                    onChange={(e) =>
                                        setAnswerText((prev) => ({
                                            ...prev,
                                            [q.id]: e.target.value,
                                        }))
                                    }
                                    placeholder="Trả lời câu hỏi..."
                                    className="w-full resize-none rounded-md border border-gray-300 p-2 text-sm focus:border-green-500 focus:outline-none"
                                />

                                <div className="mt-2 flex justify-end">
                                    <button
                                        onClick={() => handleAnswer(q.id)}
                                        disabled={loading}
                                        className="rounded-md bg-green-600 px-3 py-1.5 text-sm text-white hover:bg-green-500 disabled:opacity-50"
                                    >
                                        Trả lời
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
