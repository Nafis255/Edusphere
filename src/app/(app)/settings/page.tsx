"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Switch } from '@/components/ui/Switch';
import { Input } from '@/components/ui/Input'; // <-- Impor Input
import { useTheme } from '@/contexts/ThemeContext';
import { useRole } from '@/contexts/RoleContext';
import { Bell, Palette, Globe, Shield, Settings2 } from 'lucide-react'; // <-- Impor ikon baru

// Komponen helper (tetap sama)
function SettingsRow({ title, description, children }: { title: string, description: string, children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0 border-b border-gray-200 py-4 last:border-b-0">
      <div>
        <h4 className="font-medium text-gray-900">{title}</h4>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <div>
        {children}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { role } = useRole(); 

  // --- State Notifikasi (tetap ada) ---
  const [emailNotifMhs, setEmailNotifMhs] = useState(true);
  const [pushNotifMhs, setPushNotifMhs] = useState(false);
  const [courseUpdates, setCourseUpdates] = useState(true);
  
  const [emailNotifDosen, setEmailNotifDosen] = useState(true);
  const [quizSubmissions, setQuizSubmissions] = useState(true);
  const [newForumPosts, setNewForumPosts] = useState(false);

  // --- State BARU untuk Admin ---
  const [newUserNotif, setNewUserNotif] = useState(true);
  const [errorNotif, setErrorNotif] = useState(true);
  const [allowRegistration, setAllowRegistration] = useState(true);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900">Pengaturan</h1>
      
      {/* 1. Pengaturan Tampilan (Sama untuk semua) */}
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center space-x-3">
          <Palette className="h-6 w-6 text-blue-500" />
          <div>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Sesuaikan bagaimana Edusphere terlihat.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <SettingsRow
            title="Dark Mode"
            description="Toggle antara light dan dark theme"
          >
            <Switch 
              checked={theme === 'dark'}
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
            />
          </SettingsRow>
        </CardContent>
      </Card>

      {/* 2. Pengaturan Notifikasi (Dinamis) */}
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center space-x-3">
          <Bell className="h-6 w-6 text-green-500" />
          <div>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              {role === 'admin' ? 'Atur notifikasi platform' : 'Atur preferensi notifikasi Anda.'}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {/* Tampilan untuk MAHASISWA */}
          {role === 'mahasiswa' && (
            <>
              <SettingsRow title="Email Notifications" description="Terima email update tentang mata kuliah Anda.">
                <Switch checked={emailNotifMhs} onCheckedChange={setEmailNotifMhs} />
              </SettingsRow>
              <SettingsRow title="Push Notifications" description="Dapatkan notifikasi push di perangkat Anda.">
                <Switch checked={pushNotifMhs} onCheckedChange={setPushNotifMhs} />
              </SettingsRow>
              <SettingsRow title="Course Updates" description="Notifikasi saat materi baru ditambahkan.">
                <Switch checked={courseUpdates} onCheckedChange={setCourseUpdates} />
              </SettingsRow>
            </>
          )}

          {/* Tampilan untuk DOSEN */}
          {role === 'dosen' && (
            <>
              <SettingsRow title="Email Notifications" description="Terima email rangkuman aktivitas mingguan.">
                <Switch checked={emailNotifDosen} onCheckedChange={setEmailNotifDosen} />
              </SettingsRow>
              <SettingsRow title="Quiz Submissions" description="Notifikasi saat mahasiswa mengumpulkan kuis.">
                <Switch checked={quizSubmissions} onCheckedChange={setQuizSubmissions} />
              </SettingsRow>
              <SettingsRow title="New Forum Posts" description="Notifikasi saat ada thread baru di forum Anda.">
                <Switch checked={newForumPosts} onCheckedChange={setNewForumPosts} />
              </SettingsRow>
            </>
          )}
          
          {/* --- Tampilan BARU untuk ADMIN --- */}
          {role === 'admin' && (
            <>
              <SettingsRow title="New User Registration" description="Kirim email notifikasi saat ada user baru mendaftar.">
                <Switch checked={newUserNotif} onCheckedChange={setNewUserNotif} />
              </SettingsRow>
              <SettingsRow title="Platform Errors" description="Notifikasi jika terjadi error kritis pada platform.">
                <Switch checked={errorNotif} onCheckedChange={setErrorNotif} />
              </SettingsRow>
            </>
          )}

        </CardContent>
      </Card>

      {/* --- Kartu BARU khusus ADMIN --- */}
      {role === 'admin' && (
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center space-x-3">
            <Settings2 className="h-6 w-6 text-purple-500" />
            <div>
              <CardTitle>Pengaturan Platform</CardTitle>
              <CardDescription>Kelola pengaturan global Edusphere.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Situs
              </label>
              <Input type="text" defaultValue="Edusphere" />
            </div>
            <SettingsRow
              title="Izinkan Pendaftaran Baru"
              description="Izinkan mahasiswa dan dosen membuat akun baru."
            >
              <Switch checked={allowRegistration} onCheckedChange={setAllowRegistration} />
            </SettingsRow>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Google Books API Key
              </label>
              <Input type="password" defaultValue="dummy_api_key_**********" />
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* 3. Pengaturan Bahasa & Privasi (Tetap Sama) */}
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center space-x-3">
          <Globe className="h-6 w-6 text-orange-500" />
          <div>
            <CardTitle>Language & Region</CardTitle>
            <CardDescription>Atur bahasa dan regional Anda.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm font-medium mb-2">Language</p>
          <select className="w-full md:w-auto bg-white border border-gray-300 rounded-lg py-2 px-4 pr-8 focus:outline-none">
            <option>English</option>
            <option>Bahasa Indonesia</option>
          </select>
        </CardContent>
      </Card>
      
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center space-x-3">
          <Shield className="h-6 w-6 text-red-500" />
          <div>
            <CardTitle>Privacy & Security</CardTitle>
            <CardDescription>Atur password dan keamanan akun.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button variant="secondary">Change Password</Button>
          <Button variant="secondary">Two-Factor Authentication</Button>
          <Button variant="secondary" className="text-red-600 hover:bg-red-100">Delete Account</Button>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}