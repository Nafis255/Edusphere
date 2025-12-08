"use client"; 

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation'; // <-- 1. Kembalikan useRouter
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { GraduationCap, Mail, Lock, Loader2 } from 'lucide-react';
import { login } from '@/actions/auth-actions';

export default function LoginPage() {
  const router = useRouter(); // <-- 2. Init router
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault(); 
    setError('');

    startTransition(async () => {
      // 3. Panggil action login
      const data = await login({ email, password });

      if (data?.error) {
        setError(data.error);
      } else if (data?.success) {
        // 4. JIKA SUKSES:
        // Refresh router untuk update Session Context
        //router.refresh(); 
        // Redirect manual ke dashboard
        //router.push("/dashboard");
        window.location.href = "/dashboard";
      }
    });
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
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <div className="relative mt-1">
                <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  disabled={isPending}
                  type="email"
                  required
                  className="pl-10 pr-4 py-2 w-full bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 disabled:opacity-50"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative mt-1">
                <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  disabled={isPending}
                  type="password"
                  required
                  className="pl-10 pr-4 py-2 w-full bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 disabled:opacity-50"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            
            {error && <div className="p-3 bg-red-100 text-red-500 text-sm rounded-md">{error}</div>}

            <Button type="submit" disabled={isPending} className="w-full text-lg font-semibold py-3 flex items-center justify-center">
              {isPending ? <Loader2 className="animate-spin" /> : 'Login'}
            </Button>
          </form>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Belum punya akun?{' '}
              <Link href="/register" className="font-medium text-blue-600 hover:underline">
                Daftar di sini
              </Link>
            </p>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}