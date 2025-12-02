"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "../../../components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card"

export function OrderChat({ buyer, seller }) {
    const [messages, setMessages] = useState([
        {
            id: "1",
            sender: "seller",
            text: "Xin chào! Tôi đã sẵn sàng gửi hàng. Bạn có thể thanh toán trong 24h không?",
            timestamp: "14:30",
        },
        {
            id: "2",
            sender: "buyer",
            text: "Được, tôi sẽ chuyển tiền ngay hôm nay",
            timestamp: "14:45",
        },
    ])

    const [newMessage, setNewMessage] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            setIsTyping(true)

            const message = {
                id: String(messages.length + 1),
                sender: "buyer",
                text: newMessage,
                timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
            }
            setMessages([...messages, message])
            setNewMessage("")

            // Simulate seller typing response
            setTimeout(() => {
                setIsTyping(false)
            }, 1500)
        }
    }

    return (
        <Card className="sticky top-4">
            <CardHeader>
                <CardTitle className="text-lg">Chat với người bán</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col h-96">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === "buyer" ? "justify-end" : "justify-start"}`}>
                            <div
                                className={`max-w-xs px-3 py-2 rounded-lg ${msg.sender === "buyer" ? "bg-primary text-primary-foreground" : "bg-card border border-border"
                                    }`}
                            >
                                <p className="text-sm">{msg.text}</p>
                                <p
                                    className={`text-xs mt-1 ${msg.sender === "buyer" ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                                >
                                    {msg.timestamp}
                                </p>
                            </div>
                        </div>
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="max-w-xs px-3 py-2 rounded-lg bg-card border border-border">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Nhập tin nhắn..."
                        className="flex-1 px-3 py-2 bg-card border border-border rounded-md text-sm text-foreground placeholder-muted-foreground"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    />
                    <Button
                        onClick={handleSendMessage}
                        size="sm"
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                        Gửi
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
