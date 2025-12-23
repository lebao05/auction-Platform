import React, { useState } from 'react';
import { Upload, X, AlertCircle, Check, ChevronLeft, DollarSign, Clock, Layout, FileText, Info } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useProduct } from '../../../contexts/ProductMagementContext';
import { useAdmin } from '../../../contexts/AdminContext';
import { formatPrice, parsePrice } from '../../../utils/FormatPriceExtension';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';

export default function PostProductPage() {
    const { createProduct, loading } = useProduct();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        productName: '',
        categoryId: '',
        startPrice: '',
        stepPrice: '',
        buyNowPrice: '',
        description: '',
        autoExtend: false,
        allowNewBidders: true
    });

    const [duration, setDuration] = useState({ days: 0, hours: 0 });
    const [images, setImages] = useState([]);
    const [errors, setErrors] = useState({});
    const { categories } = useAdmin();

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map(file => ({ id: Date.now() + Math.random(), file, preview: URL.createObjectURL(file) }));
        setImages(prev => [...prev, ...newImages].slice(0, 10));
    };

    const removeImage = (id) => setImages(prev => prev.filter(img => img.id !== id));

    const validateForm = () => {
        const newErrors = {};
        if (!formData.productName.trim()) newErrors.productName = 'Vui lòng nhập tên sản phẩm';
        if (!formData.categoryId) newErrors.categoryId = 'Vui lòng chọn danh mục';
        if (!formData.startPrice || formData.startPrice < 0) newErrors.startPrice = 'Giá khởi điểm không hợp lệ';
        if (!formData.stepPrice || formData.stepPrice <= 0) newErrors.stepPrice = 'Bước giá phải lớn hơn 0';
        if (!formData.description || formData.description === '<p><br></p>') newErrors.description = 'Vui lòng nhập mô tả sản phẩm';
        if (images.length < 3) newErrors.images = 'Vui lòng tải lên tối thiểu 3 ảnh';
        if (formData.buyNowPrice && parseFloat(formData.buyNowPrice) <= parseFloat(formData.startPrice)) {
            newErrors.buyNowPrice = 'Giá mua ngay phải lớn hơn giá khởi điểm';
        }

        const totalHours = duration.days * 24 + duration.hours;
        if (totalHours <= 0) newErrors.duration = 'Vui lòng nhập thời gian đấu giá';
        if (totalHours > 168) newErrors.duration = 'Không vượt quá 7 ngày (168h)';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const imagesPayload = images.map((img) => img.file);
            const payload = {
                name: formData.productName,
                startPrice: parseFloat(formData.startPrice),
                stepPrice: parseFloat(formData.stepPrice),
                buyNowPrice: formData.buyNowPrice ? parseFloat(formData.buyNowPrice) : null,
                allowAll: formData.allowNewBidders,
                description: formData.description,
                hours: duration.days * 24 + duration.hours,
                categoryId: formData.categoryId,
                images: imagesPayload,
                mainIndex: 0,
                isAutoRenewal: formData.autoExtend
            };
            await createProduct(payload);
            toast.success("Đăng sản phẩm thành công!");
            navigate("/product/manage");
        } catch (err) {
            toast.error('Đăng sản phẩm thất bại.');
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                    <div>
                        <button 
                            onClick={() => navigate("/product/manage")}
                            className="group flex cursor-pointer items-center text-slate-500 hover:text-slate-800 transition-colors mb-2 text-sm font-medium"
                        >
                            <ChevronLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
                            Quay lại quản lý
                        </button>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Đăng Sản Phẩm Mới</h1>
                        <p className="text-slate-500 mt-1">Bắt đầu phiên đấu giá mới với vài bước đơn giản.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Form Details */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Basic Info Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                                <Layout className="w-5 h-5 text-indigo-600" />
                                <h2 className="font-bold text-slate-800">Thông tin cơ bản</h2>
                            </div>
                            <div className="p-6 space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Tên sản phẩm *</label>
                                    <input
                                        type="text"
                                        name="productName"
                                        value={formData.productName}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 rounded-xl border transition-all outline-none focus:ring-4 focus:ring-indigo-50 ${errors.productName ? 'border-red-500' : 'border-slate-200 focus:border-indigo-500'}`}
                                        placeholder="Ví dụ: iPhone 15 Pro Max 256GB Gold"
                                    />
                                    {errors.productName && <p className="mt-1.5 text-xs text-red-500 flex items-center font-medium"><AlertCircle className="w-3 h-3 mr-1" /> {errors.productName}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Danh mục *</label>
                                    <select
                                        name="categoryId"
                                        value={formData.categoryId}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 rounded-xl border transition-all outline-none focus:ring-4 focus:ring-indigo-50 appearance-none bg-white ${errors.categoryId ? 'border-red-500' : 'border-slate-200 focus:border-indigo-500'}`}
                                    >
                                        <option value="">Chọn một danh mục</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    {errors.categoryId && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.categoryId}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Description Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-indigo-600" />
                                <h2 className="font-bold text-slate-800">Mô tả chi tiết</h2>
                            </div>
                            <div className="p-6">
                                <div className={`rounded-xl overflow-hidden border transition-all ${errors.description ? 'border-red-500' : 'border-slate-200'}`}>
                                    <ReactQuill
                                        theme="snow"
                                        value={formData.description}
                                        onChange={(v) => setFormData(p => ({ ...p, description: v }))}
                                        className="h-72 mb-12"
                                        placeholder="Mô tả chi tiết tình trạng, thông số kỹ thuật, phụ kiện kèm theo..."
                                    />
                                </div>
                                {errors.description && <p className="mt-2 text-xs text-red-500 font-medium">{errors.description}</p>}
                            </div>
                        </div>

                        {/* Image Gallery Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                                <Upload className="w-5 h-5 text-indigo-600" />
                                <h2 className="font-bold text-slate-800">Hình ảnh (Min: 3 - Max: 10)</h2>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                                    {images.map((img, idx) => (
                                        <div key={img.id} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                                            <img src={img.preview} alt="Preview" className="w-full h-full object-cover" />
                                            {idx === 0 && <span className="absolute top-1.5 left-1.5 bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full uppercase font-black">Main</span>}
                                            <button 
                                                type="button" 
                                                onClick={() => removeImage(img.id)}
                                                className="absolute top-1 right-1 bg-white/90 text-red-500 p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    {images.length < 10 && (
                                        <label className="aspect-square border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all group">
                                            <div className="p-3 bg-slate-100 rounded-full group-hover:bg-indigo-100 transition-colors">
                                                <Upload className="w-6 h-6 text-slate-400 group-hover:text-indigo-600" />
                                            </div>
                                            <span className="text-xs mt-2 text-slate-500 font-bold group-hover:text-indigo-600">Thêm ảnh</span>
                                            <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                                        </label>
                                    )}
                                </div>
                                {errors.images && <p className="mt-4 text-xs text-red-500 font-medium">{errors.images}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Pricing & Options */}
                    <div className="space-y-6">
                        
                        {/* Pricing Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden sticky top-24">
                            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-indigo-600" />
                                <h2 className="font-bold text-slate-800">Cấu hình đấu giá</h2>
                            </div>
                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Giá khởi điểm</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₫</span>
                                        <input
                                            type="text"
                                            value={formatPrice(formData.startPrice)}
                                            onChange={(e) => setFormData(p => ({ ...p, startPrice: parsePrice(e.target.value) }))}
                                            className="w-full pl-9 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 font-bold text-slate-800 outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500"
                                            placeholder="0"
                                        />
                                    </div>
                                    {errors.startPrice && <p className="mt-1 text-[10px] text-red-500 font-medium">{errors.startPrice}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Bước giá tối thiểu</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₫</span>
                                        <input
                                            type="text"
                                            value={formatPrice(formData.stepPrice)}
                                            onChange={(e) => setFormData(p => ({ ...p, stepPrice: parsePrice(e.target.value) }))}
                                            className="w-full pl-9 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 font-bold text-slate-800 outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500"
                                            placeholder="50,000"
                                        />
                                    </div>
                                    {errors.stepPrice && <p className="mt-1 text-[10px] text-red-500 font-medium">{errors.stepPrice}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Giá mua đứt (Tùy chọn)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₫</span>
                                        <input
                                            type="text"
                                            value={formatPrice(formData.buyNowPrice)}
                                            onChange={(e) => setFormData(p => ({ ...p, buyNowPrice: parsePrice(e.target.value) }))}
                                            className="w-full pl-9 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 font-bold text-slate-800 outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500"
                                            placeholder="Không có"
                                        />
                                    </div>
                                    {errors.buyNowPrice && <p className="mt-1 text-[10px] text-red-500 font-medium">{errors.buyNowPrice}</p>}
                                </div>

                                <div className="pt-4 border-t border-slate-100">
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-3">Thời gian kết thúc</label>
                                    <div className="grid grid-cols-2 gap-3 text-center">
                                        <div className="space-y-1">
                                            <input 
                                                type="number" 
                                                value={duration.days} 
                                                min="0" max="7"
                                                onChange={(e) => setDuration(p => ({ ...p, days: Math.min(7, parseInt(e.target.value) || 0) }))}
                                                className="w-full py-3 bg-slate-50 rounded-xl border border-slate-200 text-center font-bold" 
                                            />
                                            <span className="text-[10px] text-slate-400 font-bold uppercase">Ngày</span>
                                        </div>
                                        <div className="space-y-1">
                                            <input 
                                                type="number" 
                                                value={duration.hours} 
                                                min="0" max="23"
                                                onChange={(e) => setDuration(p => ({ ...p, hours: Math.min(23, parseInt(e.target.value) || 0) }))}
                                                className="w-full py-3 bg-slate-50 rounded-xl border border-slate-200 text-center font-bold" 
                                            />
                                            <span className="text-[10px] text-slate-400 font-bold uppercase">Giờ</span>
                                        </div>
                                    </div>
                                    {errors.duration && <p className="mt-2 text-center text-[10px] text-red-500 font-medium">{errors.duration}</p>}
                                </div>

                                <div className="space-y-4 pt-4 border-t border-slate-100">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative flex items-center">
                                            <input 
                                                type="checkbox" 
                                                checked={formData.autoExtend} 
                                                name="autoExtend"
                                                onChange={handleInputChange} 
                                                className="w-5 h-5 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500" 
                                            />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-700">Tự động gia hạn</p>
                                            <p className="text-[10px] text-slate-400 leading-tight">Thêm 10 phút nếu có bid vào phút chót</p>
                                        </div>
                                    </label>

                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            checked={formData.allowNewBidders} 
                                            name="allowNewBidders"
                                            onChange={handleInputChange} 
                                            className="w-5 h-5 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500" 
                                        />
                                        <div>
                                            <p className="text-sm font-bold text-slate-700">Người mua mới</p>
                                            <p className="text-[10px] text-slate-400 leading-tight">Cho phép tài khoản chưa có đánh giá</p>
                                        </div>
                                    </label>
                                </div>

                                <div className="pt-2">
                                    <button 
                                        type="submit" 
                                        disabled={loading}
                                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:bg-slate-300"
                                    >
                                        {loading ? "Đang xử lý..." : <><Check className="w-5 h-5" /> Đăng sản phẩm</>}
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => navigate("/product/manage")}
                                        className="w-full mt-3 py-3 text-slate-500 font-bold text-sm hover:text-slate-800 transition-colors"
                                    >
                                        Hủy bỏ
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Tip Box */}
                        <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
                            <h4 className="flex items-center gap-2 text-amber-800 font-bold text-sm mb-3">
                                <Info className="w-4 h-4" /> Mẹo cho người bán
                            </h4>
                            <ul className="text-xs text-amber-700 space-y-2 font-medium leading-relaxed">
                                <li className="flex gap-2"><span>•</span> Ảnh bìa (ảnh đầu tiên) đẹp sẽ tăng 40% tỉ lệ xem.</li>
                                <li className="flex gap-2"><span>•</span> Bước giá thấp giúp thu hút nhiều người tham gia hơn.</li>
                                <li className="flex gap-2"><span>•</span> Mô tả trung thực giúp tránh khiếu nại sau khi bán.</li>
                            </ul>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}