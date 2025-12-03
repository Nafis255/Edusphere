"use client"; 

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // <-- 1. Pastikan Link diimpor
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { GraduationCap, Mail, Lock } from 'lucide-react';
// (Kita menggunakan <input> biasa di file ini, bukan komponen <Input>)

export default function LoginPage() {
  const router = useRouter(); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Fungsi "dummy" login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault(); 
    
    let roleToSet: 'mahasiswa' | 'dosen' | 'admin' = 'mahasiswa'; 

    if (email.includes('siti@student')) {
      roleToSet = 'mahasiswa';
    } else if (email.includes('budi@dosen')) {
      roleToSet = 'dosen';
    } else if (email.includes('admin@edusphere')) {
      roleToSet = 'admin';
    } else {
      roleToSet = 'mahasiswa';
    }
    
    localStorage.setItem('edusphere-role', roleToSet);
    router.push('/dashboard'); 
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-blue-100 p-4 rounded-full w-fit">
            <GraduationCap className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle className="text-3xl font-bold mt-4 text-gray-900">
            Selamat Datang
          </CardTitle>
          <p className="text-gray-600">Login ke Edusphere</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Input Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative mt-1">
                <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="email"
                  type="email"
                  required
                  className="pl-10 pr-4 py-2 w-full bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            {/* Input Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative mt-1">
                <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="password"
                  type="password"
                  required
                  className="pl-10 pr-4 py-2 w-full bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            
            <Button type="submit" className="w-full text-lg font-semibold py-3">
              Login
            </Button>
          </form>

          {/* Info Akun Demo */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
            <h4 className="font-semibold text-gray-800">Demo Accounts:</h4>
            <p className="text-sm text-gray-600 mt-2">
              <strong>Mahasiswa:</strong> siti@student.edusphere.com
            </p>
            <p className="text-sm text-gray-600">
              <strong>Dosen:</strong> budi@dosen.edusphere.com
            </p>
            <p className="text-sm text-gray-600">
              <strong>Admin:</strong> admin@edusphere.com
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <strong>Password:</strong> (bebas)
            </p>
          </div>
          
          {/* --- 2. TAMBAHKAN BLOK INI --- */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Belum punya akun?{' '}
              <Link href="/register" className="font-medium text-blue-600 hover:underline">
                Daftar di sini
              </Link>
            </p>
          </div>
          {/* --- AKHIR TAMBAHAN --- */}

        </CardContent>
      </Card>
    </div>
  );
}