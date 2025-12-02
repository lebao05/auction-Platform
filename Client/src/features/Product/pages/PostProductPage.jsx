import React, { useState } from 'react';
import { Upload, X, Plus, AlertCircle, Check } from 'lucide-react';

export default function PostProductPage() {
    const [formData, setFormData] = useState({
        productName: '',
        category: '',
        subCategory: '',
        startPrice: '',
        stepPrice: '',
        buyNowPrice: '',
        description: '',
        autoExtend: false,
        allowNewBidders: true
    });

    const [images, setImages] = useState([]);
    const [errors, setErrors] = useState({});

    const categories = {
        'electronics': {
            name: 'Điện tử',
            subcategories: ['Điện thoại di động', 'Máy tính xách tay', 'Máy tính bảng', 'Tai nghe']
        },
        'fashion': {
            name: 'Thời trang',
            subcategories: ['Giày', 'Đồng hồ', 'Túi xách', 'Quần áo']
        },
        'home': {
            name: 'Đồ gia dụng',
            subcategories: ['Nội thất', 'Đồ điện', 'Trang trí']
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map(file => ({
            id: Date.now() + Math.random(),
            file,
            preview: URL.createObjectURL(file)
        }));
        setImages(prev => [...prev, ...newImages].slice(0, 10));
    };

    const removeImage = (id) => {
        setImages(prev => prev.filter(img => img.id !== id));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.productName.trim()) newErrors.productName = 'Vui lòng nhập tên sản phẩm';
        if (!formData.category) newErrors.category = 'Vui lòng chọn danh mục';
        if (!formData.subCategory) newErrors.subCategory = 'Vui lòng chọn danh mục con';
        if (!formData.startPrice || formData.startPrice <= 0) newErrors.startPrice = 'Giá khởi điểm phải lớn hơn 0';
        if (!formData.stepPrice || formData.stepPrice <= 0) newErrors.stepPrice = 'Bước giá phải lớn hơn 0';
        if (!formData.description.trim()) newErrors.description = 'Vui lòng nhập mô tả sản phẩm';
        if (images.length < 3) newErrors.images = 'Vui lòng tải lên tối thiểu 3 ảnh';

        if (formData.buyNowPrice && parseFloat(formData.buyNowPrice) <= parseFloat(formData.startPrice)) {
            newErrors.buyNowPrice = 'Giá mua ngay phải lớn hơn giá khởi điểm';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log('Form submitted:', formData, images);
            alert('Đăng sản phẩm thành công!');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Đăng Sản Phẩm Đấu Giá</h1>
                    <p className="text-gray-600 mb-8">Vui lòng điền đầy đủ thông tin sản phẩm của bạn</p>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Product Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Tên sản phẩm <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="productName"
                                value={formData.productName}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.productName ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="VD: iPhone 15 Pro Max 256GB"
                            />
                            {errors.productName && (
                                <p className="mt-1 text-sm text-red-500 flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-1" />
                                    {errors.productName}
                                </p>
                            )}
                        </div>

                        {/* Category Selection */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Danh mục <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={(e) => {
                                        handleInputChange(e);
                                        setFormData(prev => ({ ...prev, subCategory: '' }));
                                    }}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.category ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                >
                                    <option value="">Chọn danh mục</option>
                                    {Object.entries(categories).map(([key, cat]) => (
                                        <option key={key} value={key}>{cat.name}</option>
                                    ))}
                                </select>
                                {errors.category && (
                                    <p className="mt-1 text-sm text-red-500 flex items-center">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {errors.category}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Danh mục con <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="subCategory"
                                    value={formData.subCategory}
                                    onChange={handleInputChange}
                                    disabled={!formData.category}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${errors.subCategory ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                >
                                    <option value="">Chọn danh mục con</option>
                                    {formData.category && categories[formData.category].subcategories.map(sub => (
                                        <option key={sub} value={sub}>{sub}</option>
                                    ))}
                                </select>
                                {errors.subCategory && (
                                    <p className="mt-1 text-sm text-red-500 flex items-center">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {errors.subCategory}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Pricing */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Giá khởi điểm (VNĐ) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="startPrice"
                                    value={formData.startPrice}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.startPrice ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="10,000,000"
                                    min="0"
                                />
                                {errors.startPrice && (
                                    <p className="mt-1 text-sm text-red-500 flex items-center">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {errors.startPrice}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Bước giá (VNĐ) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="stepPrice"
                                    value={formData.stepPrice}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.stepPrice ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="100,000"
                                    min="0"
                                />
                                {errors.stepPrice && (
                                    <p className="mt-1 text-sm text-red-500 flex items-center">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {errors.stepPrice}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Giá mua ngay (VNĐ)
                                </label>
                                <input
                                    type="number"
                                    name="buyNowPrice"
                                    value={formData.buyNowPrice}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.buyNowPrice ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="15,000,000"
                                    min="0"
                                />
                                {errors.buyNowPrice && (
                                    <p className="mt-1 text-sm text-red-500 flex items-center">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {errors.buyNowPrice}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Hình ảnh sản phẩm <span className="text-red-500">*</span>
                                <span className="text-gray-500 font-normal ml-2">(Tối thiểu 3 ảnh, tối đa 10 ảnh)</span>
                            </label>

                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                                {images.map((img, index) => (
                                    <div key={img.id} className="relative group">
                                        <img
                                            src={img.preview}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                                        />
                                        {index === 0 && (
                                            <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                                                Ảnh đại diện
                                            </div>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => removeImage(img.id)}
                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}

                                {images.length < 10 && (
                                    <label className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                        <span className="text-sm text-gray-500">Tải ảnh lên</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>

                            {errors.images && (
                                <p className="mt-1 text-sm text-red-500 flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-1" />
                                    {errors.images}
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Mô tả sản phẩm <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="8"
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.description ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Mô tả chi tiết về sản phẩm: tình trạng, xuất xứ, lý do bán, phụ kiện kèm theo..."
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-500 flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-1" />
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        {/* Options */}
                        <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Tùy chọn đấu giá</h3>

                            <div className="flex items-start">
                                <input
                                    type="checkbox"
                                    id="autoExtend"
                                    name="autoExtend"
                                    checked={formData.autoExtend}
                                    onChange={handleInputChange}
                                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="autoExtend" className="ml-3">
                                    <div className="text-sm font-medium text-gray-700">Tự động gia hạn</div>
                                    <div className="text-sm text-gray-500">
                                        Tự động gia hạn thêm 10 phút khi có lượt đấu giá mới trong 5 phút cuối
                                    </div>
                                </label>
                            </div>

                            <div className="flex items-start">
                                <input
                                    type="checkbox"
                                    id="allowNewBidders"
                                    name="allowNewBidders"
                                    checked={formData.allowNewBidders}
                                    onChange={handleInputChange}
                                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="allowNewBidders" className="ml-3">
                                    <div className="text-sm font-medium text-gray-700">Cho phép người mua mới</div>
                                    <div className="text-sm text-gray-500">
                                        Cho phép người mua chưa có đánh giá tham gia đấu giá
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex gap-4 pt-6 border-t">
                            <button
                                type="submit"
                                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
                            >
                                <Check className="w-5 h-5 mr-2" />
                                Đăng sản phẩm
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    if (confirm('Bạn có chắc muốn hủy? Tất cả thông tin sẽ bị mất.')) {
                                        setFormData({
                                            productName: '',
                                            category: '',
                                            subCategory: '',
                                            startPrice: '',
                                            stepPrice: '',
                                            buyNowPrice: '',
                                            description: '',
                                            autoExtend: false,
                                            allowNewBidders: true
                                        });
                                        setImages([]);
                                        setErrors({});
                                    }
                                }}
                                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                            >
                                Hủy
                            </button>
                        </div>
                    </form>
                </div>

                {/* Info Box */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                        <AlertCircle className="w-5 h-5 mr-2" />
                        Lưu ý khi đăng sản phẩm
                    </h4>
                    <ul className="text-sm text-blue-700 space-y-1 ml-7">
                        <li>• Đảm bảo hình ảnh rõ nét, thể hiện đầy đủ sản phẩm</li>
                        <li>• Mô tả chính xác tình trạng và thông tin sản phẩm</li>
                        <li>• Giá khởi điểm và bước giá hợp lý để thu hút người mua</li>
                        <li>• Bạn có thể bổ sung thông tin sau khi đăng nhưng không được thay đổi mô tả cũ</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}