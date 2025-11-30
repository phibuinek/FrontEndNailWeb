'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { User, Lock, UserPlus } from 'lucide-react';
import { registerRequest } from '@/store/slices/authSlice';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const router = useRouter();

  const handleRegister = (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }
    
    dispatch(registerRequest({ username, pass: password, router }));
  };

  useEffect(() => {
      if (error) {
          alert(`Registration failed: ${error}`);
      }
  }, [error]);

  return (
    <div className="min-h-screen bg-vintage-cream dark:bg-vintage-dark transition-colors duration-500 flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-vintage-gold/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-vintage-rose/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-md space-y-8 relative z-10">
          <div className="bg-white dark:bg-vintage-dark/80 backdrop-blur-sm p-8 sm:p-10 rounded-2xl shadow-xl border border-vintage-border dark:border-vintage-border/20">
            <div className="text-center mb-10">
              <h2 className="font-serif text-3xl font-bold text-vintage-dark dark:text-vintage-gold tracking-tight">
                Create Account
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Join us to start shopping
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleRegister}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-vintage-dark dark:text-vintage-cream mb-1">
                    Username
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
                      placeholder="Choose a username"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-vintage-dark dark:text-vintage-cream mb-1">
                    Password
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
                      placeholder="Create a password"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-vintage-dark dark:text-vintage-cream mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 border border-vintage-border dark:border-vintage-border/30 rounded-lg bg-vintage-paper/30 dark:bg-vintage-dark/50 text-vintage-dark dark:text-vintage-cream placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-vintage-gold/50 focus:border-vintage-gold transition-all duration-200"
                      placeholder="Confirm your password"
                    />
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full py-3 text-base font-medium shadow-lg shadow-vintage-gold/20 hover:shadow-vintage-gold/40 transition-all duration-300 flex items-center justify-center gap-2"
                disabled={loading}
              >
                <UserPlus className="w-5 h-5" />
                {loading ? 'Creating Account...' : 'Sign Up'}
              </Button>

              <div className="relative mt-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-vintage-dark/80 text-gray-500">
                    Already have an account?
                  </span>
                </div>
              </div>

              <p className="mt-4 text-center text-sm">
                <a href="/login" className="font-medium text-vintage-gold hover:text-vintage-gold-hover transition-colors">
                  Sign in instead
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
