'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, pass: password }),
      });

      if (!response.ok) {
        throw new Error('Đăng nhập thất bại');
      }

      const data = await response.json();

      if (data.role === 'admin') {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('userRole', data.role);
        localStorage.setItem('username', data.username);
        router.push('/admin/dashboard');
      } else {
        alert('Bạn không có quyền truy cập Admin');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Tên đăng nhập hoặc mật khẩu không đúng');
    }
  };

  return (
    <div className="min-h-screen bg-vintage-cream flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md border border-vintage-border w-full max-w-md">
          <h1 className="text-2xl font-serif font-bold text-vintage-dark mb-6 text-center">Admin Login</h1>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-vintage-border rounded focus:outline-none focus:border-vintage-gold"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-vintage-border rounded focus:outline-none focus:border-vintage-gold"
            />
          </div>

          <Button type="submit" className="w-full">Login</Button>
        </form>
      </div>
    </div>
  );
}

