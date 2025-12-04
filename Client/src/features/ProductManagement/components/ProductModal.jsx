"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/Dialog"
import { Button } from "../../../components/ui/Button"
import { Input } from "../../../components/ui/Input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/"
import { X } from "lucide-react"


const CATEGORIES = ["Điện tử", "Thời trang", "Ô tô", "Bất động sản", "Nội thất", "Khác"]

export default function ProductModal({ isOpen, onClose, onSave, product }) {
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        startPrice: "",
        buyNowPrice: "",
        stepPrice: "",
        description: "",
        images: [""],
        status: "active" ,
        bids: 0,
        currentPrice: "",
        endDate: "",
    })

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                category: product.category,
                startPrice: product.startPrice.toString(),
                buyNowPrice: product.buyNowPrice?.toString() || "",
                stepPrice: product.stepPrice.toString(),
                description: product.description,
                images: product.images,
                status: product.status,
                bids: product.bids,
                currentPrice: product.currentPrice.toString(),
                endDate: product.endDate.toISOString().split("T")[0],
            })
        } else {
            setFormData({
                name: "",
                category: "",
                startPrice: "",
                buyNowPrice: "",
                stepPrice: "",
                description: "",
                images: [""],
                status: "active",
                bids: 0,
                currentPrice: "",
                endDate: "",
            })
        }
    }, [product, isOpen])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleImageChange = (index, value) => {
        const newImages = [...formData.images]
        newImages[index] = value
        setFormData((prev) => ({ ...prev, images: newImages }))
    }

    const addImageField = () => {
        setFormData((prev) => ({
            ...prev,
            images: [...prev.images, ""],
        }))
    }

    const removeImageField = (index) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }))
    }

    const handleSubmit = () => {
        if (!formData.name || !formData.category || !formData.startPrice || !formData.stepPrice) {
            alert("Vui lòng điền đầy đủ thông tin bắt buộc")
            return
        }

        const endDate = new Date(formData.endDate)
        if (isNaN(endDate.getTime())) {
            alert("Ngày kết thúc không hợp lệ")
            return
        }

        const currentPrice = formData.currentPrice
            ? Number.parseInt(formData.currentPrice)
            : Number.parseInt(formData.startPrice)

        onSave({
            name: formData.name,
            category: formData.category,
            startPrice: Number.parseInt(formData.startPrice),
            buyNowPrice: formData.buyNowPrice ? Number.parseInt(formData.buyNowPrice) : undefined,
            stepPrice: Number.parseInt(formData.stepPrice),
            description: formData.description,
            images: formData.images.filter((img) => img.trim() !== ""),
            status: formData.status,
            bids: formData.bids,
            currentPrice,
            endDate,
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl bg-slate-800 border-slate-700 text-white">
                <DialogHeader>
                    <DialogTitle>{product ? "Cập nhật sản phẩm" : "Đăng sản phẩm mới"}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 max-h-96 overflow-y-auto pr-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Tên sản phẩm <span className="text-red-400">*</span>
                        </label>
                        <Input
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Nhập tên sản phẩm"
                            className="bg-slate-700 border-slate-600 text-white"
                        />
                    </div>

                    {/* Category and Step Price */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Danh mục <span className="text-red-400">*</span>
                            </label>
                            <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                                <SelectTrigger className="bg-slate-700 border-slate-600">
                                    <SelectValue placeholder="Chọn danh mục" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-700 border-slate-600">
                                    {CATEGORIES.map((cat) => (
                                        <SelectItem key={cat} value={cat} className="text-white">
                                            {cat}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Bước giá (VNĐ) <span className="text-red-400">*</span>
                            </label>
                            <Input
                                type="number"
                                name="stepPrice"
                                value={formData.stepPrice}
                                onChange={handleInputChange}
                                placeholder="100000"
                                className="bg-slate-700 border-slate-600 text-white"
                            />
                        </div>
                    </div>

                    {/* Start Price and Buy Now Price */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Giá khởi điểm (VNĐ) <span className="text-red-400">*</span>
                            </label>
                            <Input
                                type="number"
                                name="startPrice"
                                value={formData.startPrice}
                                onChange={handleInputChange}
                                placeholder="10000000"
                                className="bg-slate-700 border-slate-600 text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Giá mua ngay (VNĐ)</label>
                            <Input
                                type="number"
                                name="buyNowPrice"
                                value={formData.buyNowPrice}
                                onChange={handleInputChange}
                                placeholder="15000000"
                                className="bg-slate-700 border-slate-600 text-white"
                            />
                        </div>
                    </div>

                    {/* Current Price and End Date */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Giá hiện tại (VNĐ)</label>
                            <Input
                                type="number"
                                name="currentPrice"
                                value={formData.currentPrice}
                                onChange={handleInputChange}
                                placeholder="Sẽ bằng giá khởi điểm"
                                className="bg-slate-700 border-slate-600 text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Ngày kết thúc <span className="text-red-400">*</span>
                            </label>
                            <Input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleInputChange}
                                className="bg-slate-700 border-slate-600 text-white"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Mô tả sản phẩm</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Nhập mô tả chi tiết về sản phẩm"
                            className="bg-slate-700 border-slate-600 text-white min-h-20"
                        />
                    </div>

                    {/* Images */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium">
                                Hình ảnh (Tối thiểu 3 ảnh) <span className="text-red-400">*</span>
                            </label>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={addImageField}
                                className="text-slate-300 border-slate-600 hover:bg-slate-700 bg-transparent"
                            >
                                Thêm ảnh
                            </Button>
                        </div>
                        <div className="space-y-2">
                            {formData.images.map((img, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        value={img}
                                        onChange={(e) => handleImageChange(index, e.target.value)}
                                        placeholder={`URL ảnh ${index + 1}`}
                                        className="bg-slate-700 border-slate-600 text-white"
                                    />
                                    {formData.images.length > 1 && (
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => removeImageField(index)}
                                            className="text-red-400 hover:text-red-300 hover:bg-slate-700"
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 justify-end pt-4 border-t border-slate-700">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                    >
                        Hủy
                    </Button>
                    <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white">
                        {product ? "Cập nhật" : "Đăng sản phẩm"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
