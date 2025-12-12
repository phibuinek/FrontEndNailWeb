'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { Lock, Eye, EyeOff, CheckCircle, XCircle, ArrowLeft, Shield, KeyRound } from 'lucide-react';
import { changePasswordRequest } from '@/store/slices/authSlice';

const translations = {
  EN: {
    title: "Change Password",
    subtitle: "Update your password to keep your account secure",
    currentPassword: "Current Password",
    newPassword: "New Password",
    confirmPassword: "Confirm Password",
    changePasswordBtn: "Change Password",
    cancel: "Cancel",
    backToProfile: "Back to Profile",
    passwordChanged: "Password changed successfully!",
    passwordMismatch: "New passwords do not match",
    passwordRequired: "All fields are required",
    passwordTooShort: "Password must be at least 6 characters",
    passwordSame: "New password must be different from current password",
    back: "Back"
  },
  VI: {
    title: "Đổi Mật Khẩu",
    subtitle: "Cập nhật mật khẩu để bảo vệ tài khoản của bạn",
    currentPassword: "Mật Khẩu Hiện Tại",
    newPassword: "Mật Khẩu Mới",
    confirmPassword: "Xác Nhận Mật Khẩu",
    changePasswordBtn: "Đổi Mật Khẩu",
    cancel: "Hủy",
    backToProfile: "Quay Lại Hồ Sơ",
    passwordChanged: "Đổi mật khẩu thành công!",
    passwordMismatch: "Mật khẩu mới không khớp",
    passwordRequired: "Vui lòng điền đầy đủ thông tin",
    passwordTooShort: "Mật khẩu phải có ít nhất 6 ký tự",
    passwordSame: "Mật khẩu mới phải khác mật khẩu hiện tại",
    back: "Quay lại"
  }
};

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const router = useRouter();
  const { language } = useLanguage();
  const t = translations[language];
  const dispatch = useDispatch();
  const { loading: authLoading, error: authError } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const username = localStorage.getItem('username');
    
    if (!token || !username) {
      router.push('/login');
      return;
    }
  }, [router]);

  useEffect(() => {
    if (isSubmitting) {
      if (authError) {
        setPasswordError(authError);
        setPasswordSuccess(false);
        setIsSubmitting(false);
      } else if (!authLoading && !authError) {
        // Success case
        setPasswordSuccess(true);
        setPasswordError('');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setIsSubmitting(false);
        setTimeout(() => {
          router.push('/profile');
        }, 2000);
      }
    }
  }, [authLoading, authError, isSubmitting, router]);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError(t.passwordRequired);
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError(t.passwordTooShort);
      return;
    }

    if (newPassword === currentPassword) {
      setPasswordError(t.passwordSame);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(t.passwordMismatch);
      return;
    }

    setIsSubmitting(true);
    dispatch(changePasswordRequest({
      oldPassword: currentPassword,
      newPassword: newPassword
    }));
  };

  return (
    <div className="min-h-screen bg-vintage-cream dark:bg-vintage-dark transition-colors duration-500 flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden py-12">
        {/* Decorative Background Elements */}
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-vintage-gold/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-vintage-rose/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-lg space-y-8 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Link href="/profile" className="hover:text-vintage-gold transition-colors flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              {t.backToProfile}
            </Link>
          </div>

          <div className="bg-white dark:bg-vintage-dark/80 backdrop-blur-sm p-8 sm:p-10 rounded-2xl shadow-xl border border-vintage-border dark:border-vintage-border/20">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-vintage-gold/10 rounded-full mb-4">
                <Shield className="w-8 h-8 text-vintage-gold" />
              </div>
              <h2 className="font-serif text-3xl font-bold text-vintage-dark dark:text-vintage-gold tracking-tight">
                {t.title}
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {t.subtitle}
              </p>
            </div>

            {/* Success Message */}
            {passwordSuccess && (
              <div className="mb-6 flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-800 dark:text-green-300">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{t.passwordChanged}</p>
              </div>
            )}

            {/* Error Message */}
            {passwordError && (
              <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-300">
                <XCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{passwordError}</p>
              </div>
            )}

            {/* Form */}
            <form className="space-y-6" onSubmit={handleChangePassword}>
              {/* Current Password */}
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-vintage-dark dark:text-vintage-cream mb-2">
                  {t.currentPassword}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyRound className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-2.5 border border-vintage-border dark:border-vintage-border/30 rounded-lg bg-vintage-paper/30 dark:bg-vintage-dark/50 text-vintage-dark dark:text-vintage-cream placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-vintage-gold/50 focus:border-vintage-gold transition-all duration-200"
                    placeholder={t.currentPassword}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
                  >
                    {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-vintage-dark dark:text-vintage-cream mb-2">
                  {t.newPassword}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-2.5 border border-vintage-border dark:border-vintage-border/30 rounded-lg bg-vintage-paper/30 dark:bg-vintage-dark/50 text-vintage-dark dark:text-vintage-cream placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-vintage-gold/50 focus:border-vintage-gold transition-all duration-200"
                    placeholder={t.newPassword}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Must be at least 6 characters
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-vintage-dark dark:text-vintage-cream mb-2">
                  {t.confirmPassword}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-2.5 border border-vintage-border dark:border-vintage-border/30 rounded-lg bg-vintage-paper/30 dark:bg-vintage-dark/50 text-vintage-dark dark:text-vintage-cream placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-vintage-gold/50 focus:border-vintage-gold transition-all duration-200"
                    placeholder={t.confirmPassword}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={authLoading || isSubmitting}
                  className="flex-1 px-6 py-3 bg-vintage-gold text-white rounded-lg hover:bg-vintage-gold/90 transition-all duration-300 font-medium shadow-lg shadow-vintage-gold/20 hover:shadow-vintage-gold/40 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {authLoading || isSubmitting ? '...' : t.changePasswordBtn}
                </button>
                <Link
                  href="/profile"
                  className="px-6 py-3 border border-vintage-border dark:border-vintage-border/30 text-vintage-dark dark:text-vintage-cream rounded-lg hover:bg-gray-50 dark:hover:bg-vintage-border/10 transition-colors font-medium text-center"
                >
                  {t.cancel}
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

