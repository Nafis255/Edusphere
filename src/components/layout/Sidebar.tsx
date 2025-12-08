"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRole } from '@/contexts/RoleContext';
import { useSession } from 'next-auth/react'; // <-- 1. Import useSession
import { 
  LayoutDashboard, Book, LineChart, MessageSquare, Settings,
  GraduationCap, User, Edit, Users
} from 'lucide-react';

// Item Navigasi (Tetap Sama)
const navItemsMahasiswa = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/courses', label: 'Mata Kuliah', icon: Book },
  { href: '/analytics', label: 'Analytics', icon: LineChart },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/settings', label: 'Settings', icon: Settings },
];

const navItemsDosen = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/courses', label: 'Mata Kuliah', icon: Book },
  { href: '/manage', label: 'Manajemen', icon: Edit },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/settings', label: 'Settings', icon: Settings },
];

const navItemsAdmin = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Manajemen User', icon: Users },
  { href: '/admin/courses', label: 'Manajemen MK', icon: Book },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { role } = useRole(); 
  const { data: session } = useSession(); // <-- 2. Ambil data session

  // Tentukan nav items berdasarkan role
  const navItems = role === 'admin' ? navItemsAdmin : (role === 'dosen' ? navItemsDosen : navItemsMahasiswa);
  
  // Ambil data user dari session (Real Data)
  const user = session?.user;

  // Helper untuk Avatar: Gunakan gambar user jika ada, atau generate inisial dari nama
  const avatarSrc = user?.image 
    ? user.image 
    : `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random&color=fff`;

  return (
    <aside className="w-64 bg-white shadow-md flex flex-col border-r sticky top-0 h-screen border-gray-200">
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b px-4 border-gray-200">
        <GraduationCap className="h-8 w-8 text-blue-500" />
        <span className="text-xl font-bold ml-2 text-gray-900">Edusphere</span>
      </div>

      {/* Navigasi */}
      <nav className="flex-1 mt-4 px-2">
        <ul className="space-y-1">
          {navItems.map((item) => {
            // Logika Active State yang diperbaiki
            const isActive = item.href === '/dashboard' 
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link 
                  href={item.href} 
                  className={`
                    flex items-center px-4 py-3 rounded-lg transition-colors text-sm font-medium
                    ${isActive 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <item.icon className={`h-5 w-5 mr-3 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Profil User (Bagian Bawah) */}
      <div className="border-t p-4 border-gray-200 bg-gray-50/50">
        <Link href="/profile" className="flex items-center group">
          <img 
            src={avatarSrc} 
            alt="Avatar" 
            className="w-10 h-10 rounded-full object-cover border border-gray-200 group-hover:border-blue-400 transition-colors"
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/40x40/E2E8F0/A0AEC0?text=U'; }}
          />
          <div className="ml-3 overflow-hidden">
            <p className="font-semibold text-sm text-gray-900 truncate group-hover:text-blue-600 transition-colors">
              {user?.name || "Pengguna"}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {role || "Role"}
            </p>
          </div>
        </Link>
      </div>
    </aside>
  );
}