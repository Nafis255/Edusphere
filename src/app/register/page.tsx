"use client"; 

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Mail, Lock, User, Users, ChevronDown, Loader2, KeyRound } from 'lucide-react';
import { register, verifyOtp } from '@/actions/auth-actions'; // Import action baru

export default function RegisterPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  
  // State untuk kontrol Step
  const [step, setStep] = useState<1 | 2>(1);
  const [otp, setOtp] = useState("");
  
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'MAHASISWA' as 'MAHASISWA' | 'DOSEN',
  });

  // Handler Step 1: Daftar & Kirim Email
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault(); 
    setError(''); setSuccess('');

    startTransition(async () => {
      const data = await register(formData);
      if (data.error) {
        setError(data.error);
      } else if (data.success) {
        setSuccess("Kode OTP telah dikirim ke email Anda.");
        setStep(2); // Pindah ke layar OTP
      }
    });
  };

  // Handler Step 2: Verifikasi OTP
  const handleVerify = (e: React.FormEvent) => {
      e.preventDefault();
      setError(''); setSuccess('');

      startTransition(async () => {
          const data = await verifyOtp(formData.email, otp);
          if (data.error) {
              setError(data.error);
          } else {
              setSuccess("Akun berhasil diverifikasi! Mengalihkan...");
              setTimeout(() => {
                  router.push('/'); // Ke Login
              }, 2000);
          }
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-blue-100 p-4 rounded-full w-fit">
            <Users className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle className="text-3xl font-bold mt-4 text-gray-900">
            {step === 1 ? "Buat Akun Baru" : "Verifikasi Email"}
          </CardTitle>
          <p className="text-gray-600">
            {step === 1 ? "Daftar ke Edusphere" : `Kode dikirim ke ${formData.email}`}
          </p>
        </CardHeader>
        <CardContent>
          
          {/* TAMPILAN STEP 1: FORM DATA */}
          {step === 1 && (
              <form onSubmit={handleRegister} className="space-y-4">
                
                {/* Nama */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                  <div className="relative mt-1">
                    <User className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      disabled={isPending}
                      type="text"
                      required
                      placeholder="Nama Anda"
                      className="pl-10 pr-4 py-2 w-full bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email Kampus (.ac.id)</label>
                  <div className="relative mt-1">
                    <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      disabled={isPending}
                      type="email"
                      required
                      placeholder="nama@kampus.ac.id"
                      className="pl-10 pr-4 py-2 w-full bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
                
                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <div className="relative mt-1">
                    <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      disabled={isPending}
                      type="password"
                      required
                      placeholder="••••••••"
                      className="pl-10 pr-4 py-2 w-full bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                  </div>
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Peran</label>
                  <div className="relative mt-1">
                    <select
                      disabled={isPending}
                      className="appearance-none w-full bg-gray-50 border border-gray-300 rounded-lg py-2 px-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value as 'MAHASISWA' | 'DOSEN'})}
                    >
                      <option value="MAHASISWA">Mahasiswa</option>
                      <option value="DOSEN">Dosen</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </div>
                </div>
                
                {error && <div className="p-3 bg-red-100 text-red-600 text-sm rounded-md">{error}</div>}

                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending ? <Loader2 className="animate-spin" /> : 'Daftar & Kirim OTP'}
                </Button>
              </form>
          )}

          {/* TAMPILAN STEP 2: INPUT OTP */}
          {step === 2 && (
              <form onSubmit={handleVerify} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 text-center mb-2">Masukkan 6 digit kode</label>
                    <div className="relative">
                        <KeyRound className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            disabled={isPending}
                            type="text"
                            maxLength={6}
                            required
                            placeholder="123456"
                            className="pl-10 pr-4 py-3 w-full bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-center text-2xl tracking-widest font-mono"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))} // Hanya angka
                        />
                    </div>
                  </div>

                  {error && <div className="p-3 bg-red-100 text-red-600 text-sm rounded-md text-center">{error}</div>}
                  {success && <div className="p-3 bg-green-100 text-green-600 text-sm rounded-md text-center">{success}</div>}

                  <Button type="submit" disabled={isPending} className="w-full">
                    {isPending ? <Loader2 className="animate-spin" /> : 'Verifikasi Akun'}
                  </Button>

                  <div className="text-center">
                      <button 
                        type="button"
                        onClick={() => setStep(1)}
                        className="text-sm text-gray-500 hover:text-blue-600"
                        disabled={isPending}
                      >
                          Salah email? Kembali
                      </button>
                  </div>
              </form>
          )}

          <div className="text-center mt-4 border-t pt-4">
            <p className="text-sm text-gray-600">
              Sudah punya akun?{' '}
              <Link href="/" className="font-medium text-blue-600 hover:underline">
                Login di sini
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}