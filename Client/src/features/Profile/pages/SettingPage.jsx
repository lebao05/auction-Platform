import { ProfileInfo } from "../components/ProfileInfo";
import { ProfileSettings } from "../components/ProfileSettings";

export default function SettingPage() {
    return (
        <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
            <h1 className="text-2xl font-bold">Cài Đặt Tài Khoản</h1>

            {/* Editable personal info */}
            <ProfileInfo />

            {/* Password, email verification, forgot password */}
            <ProfileSettings />
        </div>
    );
}