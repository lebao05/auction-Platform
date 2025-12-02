import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck, CheckCircle2, Loader2, RefreshCw } from "lucide-react";

export const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Form, 2: OTP, 3: Success
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    address: "",
  });

  // OTP State
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [recaptchaVerified, setRecaptchaVerified] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (!recaptchaVerified) {
      alert("Please verify you are not a robot.");
      return;
    }

    setLoading(true);
    // Simulate API call to check email uniqueness and send OTP
    setTimeout(() => {
      setLoading(false);
      setStep(2); // Move to OTP step
    }, 1500);
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate OTP verification API
    setTimeout(() => {
      setLoading(false);
      setStep(3); // Move to Success step
    }, 1500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
        
        {/* Back Button (Only show in Step 1) */}
        {step === 1 && (
          <button
            onClick={() => navigate(-1)}
            className="absolute top-6 left-6 text-gray-400 hover:text-black transition-colors flex items-center gap-1 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        )}

        {/* --- STEP 1: REGISTRATION FORM --- */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right duration-300">
            <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">Create Account</h2>
            <p className="text-center text-gray-500 mb-6 text-sm">Join AuctionHub to start bidding</p>

            <form onSubmit={handleSignupSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block mb-1.5 text-sm font-medium text-gray-700" htmlFor="fullName">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Nguyễn Văn A"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block mb-1.5 text-sm font-medium text-gray-700" htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="name@example.com"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block mb-1.5 text-sm font-medium text-gray-700" htmlFor="password">
                  Mật khẩu <span className="text-red-500">*</span>
                </label>
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
                <p className="text-xs text-gray-400 mt-1">Mật khẩu sẽ được mã hóa an toàn (bcrypt).</p>
              </div>

              {/* Address */}
              <div>
                <label className="block mb-1.5 text-sm font-medium text-gray-700" htmlFor="address">
                  Địa chỉ
                </label>
                <input
                  id="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Số nhà, đường, quận/huyện..."
                  required
                />
              </div>

              {/* Mock reCaptcha */}
              <div 
                className={`mt-4 border rounded-md p-3 flex items-center gap-3 bg-gray-50 cursor-pointer transition-colors ${recaptchaVerified ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}
                onClick={() => setRecaptchaVerified(!recaptchaVerified)}
              >
                <div className={`w-6 h-6 border-2 rounded flex items-center justify-center ${recaptchaVerified ? 'bg-green-500 border-green-500' : 'bg-white border-gray-400'}`}>
                  {recaptchaVerified && <CheckCircle2 className="w-4 h-4 text-white" />}
                </div>
                <label className="text-sm text-gray-600 select-none cursor-pointer flex-1">
                  I'm not a robot (reCaptcha)
                </label>
                <ShieldCheck className="w-8 h-8 text-gray-300" />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 cursor-pointer py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors flex justify-center items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Đăng ký"}
              </button>
            </form>
            
            <p className="text-center mt-6 text-sm text-gray-600">
              Already have an account? <span onClick={() => navigate("/login")} className="text-blue-600 font-semibold cursor-pointer hover:underline">Log in</span>
            </p>
          </div>
        )}

        {/* --- STEP 2: OTP VERIFICATION --- */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right duration-300 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Xác thực OTP</h2>
            <p className="text-gray-500 mb-8 text-sm">
              Mã xác nhận đã được gửi đến email <br/> <span className="font-semibold text-gray-800">{formData.email}</span>
            </p>

            <form onSubmit={handleOtpSubmit}>
              <div className="flex justify-center gap-2 mb-8">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={data}
                    onChange={(e) => handleOtpChange(e.target, index)}
                    onFocus={(e) => e.target.select()}
                    className="w-10 h-12 border-2 border-gray-300 rounded-lg text-center text-xl font-bold focus:border-blue-500 focus:outline-none transition-colors"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors flex justify-center items-center gap-2 shadow-md"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Xác nhận"}
              </button>
            </form>

            <button 
              onClick={() => setStep(1)} 
              className="mt-6 text-sm text-gray-500 hover:text-blue-600 flex items-center justify-center gap-1 mx-auto"
            >
              <ArrowLeft className="w-3 h-3" /> Quay lại đăng ký
            </button>
          </div>
        )}

        {/* --- STEP 3: SUCCESS --- */}
        {step === 3 && (
          <div className="animate-in zoom-in duration-300 text-center py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Đăng ký thành công!</h2>
            <p className="text-gray-500 mb-8">
              Tài khoản của bạn đã được tạo. Hãy đăng nhập để bắt đầu tham gia đấu giá.
            </p>
            
            <button
              onClick={() => navigate("/login")}
              className="w-full py-3 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition-all shadow-md"
            >
              Đến trang Đăng nhập
            </button>
          </div>
        )}

      </div>
    </div>
  );
};