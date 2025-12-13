'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { User, Lock, XCircle, AlertCircle } from 'lucide-react';
import { loginRequest } from '@/store/slices/authSlice';
import { useLanguage } from '@/context/LanguageContext';

const translations = {
  EN: {
    welcomeBack: "Welcome Back",
    signInAccess: "Sign in to access your account",
    username: "Username",
    password: "Password",
    enterUsername: "Enter your username",
    enterPassword: "Enter your password",
    rememberMe: "Remember me",
    forgotPassword: "Forgot password?",
    signingIn: "Signing in...",
    signIn: "Sign in",
    orContinue: "Or continue with",
    noAccount: "Don't have an account?",
    signUp: "Sign up"
  },
  VI: {
    welcomeBack: "Chào Mừng Trở Lại",
    signInAccess: "Đăng nhập để truy cập tài khoản của bạn",
    username: "Tên Đăng Nhập",
    password: "Mật Khẩu",
    enterUsername: "Nhập tên đăng nhập",
    enterPassword: "Nhập mật khẩu",
    rememberMe: "Ghi nhớ đăng nhập",
    forgotPassword: "Quên mật khẩu?",
    signingIn: "Đang đăng nhập...",
    signIn: "Đăng Nhập",
    orContinue: "Hoặc tiếp tục với",
    noAccount: "Chưa có tài khoản?",
    signUp: "Đăng ký"
  }
};

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated, role } = useSelector((state) => state.auth);
  const router = useRouter();
  const { language } = useLanguage();
  const t = translations[language];

  const handleLogin = (e) => {
    e.preventDefault();
    // Remove router from payload to fix non-serializable error
    dispatch(loginRequest({ username, pass: password }));
  };

  // Handle navigation based on auth state changes
  useEffect(() => {
      if (isAuthenticated) {
          if (role === 'admin') {
              router.push('/admin/dashboard');
          } else {
              router.push('/');
          }
      }
  }, [isAuthenticated, role, router]);


  return (
    <div className="min-h-screen bg-vintage-cream dark:bg-vintage-dark transition-colors duration-500 flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-vintage-gold/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-vintage-rose/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-md space-y-8 relative z-10">
          <div className="bg-vintage-cream dark:bg-vintage-dark/80 backdrop-blur-sm p-8 sm:p-10 rounded-2xl shadow-xl border border-vintage-border dark:border-vintage-border/20">
            <div className="text-center mb-10">
              <h2 className="font-serif text-3xl font-bold text-vintage-dark dark:text-vintage-gold tracking-tight">
                {t.welcomeBack}
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {t.signInAccess}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-300">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleLogin}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-vintage-dark dark:text-vintage-cream mb-1">
                    {t.username}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 border border-vintage-border dark:border-vintage-border/30 rounded-lg bg-vintage-paper/30 dark:bg-vintage-dark/50 text-vintage-dark dark:text-vintage-cream placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-vintage-gold/50 focus:border-vintage-gold transition-all duration-200"
                      placeholder={t.enterUsername}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-vintage-dark dark:text-vintage-cream mb-1">
                    {t.password}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 border border-vintage-border dark:border-vintage-border/30 rounded-lg bg-vintage-paper/30 dark:bg-vintage-dark/50 text-vintage-dark dark:text-vintage-cream placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-vintage-gold/50 focus:border-vintage-gold transition-all duration-200"
                      placeholder={t.enterPassword}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-vintage-gold focus:ring-vintage-gold border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-gray-600 dark:text-gray-400 cursor-pointer">
                    {t.rememberMe}
                  </label>
                </div>
                <a href="#" className="font-medium text-vintage-gold hover:text-vintage-gold-hover transition-colors cursor-pointer">
                  {t.forgotPassword}
                </a>
              </div>

              <Button 
                type="submit" 
                className="w-full py-3 text-base font-medium shadow-lg shadow-vintage-gold/20 hover:shadow-vintage-gold/40 transition-all duration-300"
                disabled={loading}
              >
                {loading ? t.signingIn : t.signIn}
              </Button>

              <div className="relative mt-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-vintage-cream dark:bg-vintage-dark/80 text-gray-500">
                    {t.orContinue}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-6">
                 <button type="button" className="flex items-center justify-center px-4 py-2 border border-vintage-border dark:border-vintage-border/30 rounded-lg shadow-sm bg-white dark:bg-vintage-dark hover:bg-gray-50 dark:hover:bg-vintage-border/10 transition-colors">
                   <span className="text-sm font-medium text-vintage-dark dark:text-vintage-cream">Google</span>
                 </button>
                 <button type="button" className="flex items-center justify-center px-4 py-2 border border-vintage-border dark:border-vintage-border/30 rounded-lg shadow-sm bg-white dark:bg-vintage-dark hover:bg-gray-50 dark:hover:bg-vintage-border/10 transition-colors">
                   <span className="text-sm font-medium text-vintage-dark dark:text-vintage-cream">Facebook</span>
                 </button>
              </div>

              <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                {t.noAccount}{' '}
                <a href="/register" className="font-medium text-vintage-gold hover:text-vintage-gold-hover transition-colors cursor-pointer">
                  {t.signUp}
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
