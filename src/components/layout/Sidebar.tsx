"use client";  

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRole } from '@/contexts/RoleContext'; 
import { 
  LayoutDashboard, Book, LineChart, MessageSquare, Settings,
  GraduationCap, User, Edit, Users 
} from 'lucide-react';
import { mockStudentUser, mockDosen, mockAdmin } from '@/data/mockData'; 

// Definisikan item navigasi
const navItemsMahasiswa = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/courses', label: 'Mata Kuliah', icon: Book },
  { href: '/forum', label: 'Forum', icon: MessageSquare },
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

  // Nav items & user berdasarkan role
  const navItems = role === 'admin' ? navItemsAdmin : (role === 'dosen' ? navItemsDosen : navItemsMahasiswa);
  const currentUser = role === 'admin' ? mockAdmin : (role === 'dosen' ? mockDosen : mockStudentUser);

  return (
    <aside className="w-64 bg-white shadow-md flex flex-col border-r sticky top-0 h-screen border-gray-200">
      <div className="h-16 flex items-center justify-center border-b px-4 border-gray-200">
        <GraduationCap className="h-8 w-8 text-blue-500" />
        <span className="text-xl font-bold ml-2 text-gray-900">Edusphere</span>
      </div>

      <nav className="flex-1 mt-4">
        <ul>
          {navItems.map((item) => {
            let finalIsActive = false;
            if (pathname.startsWith('/courses/')) {
              if (item.href === '/courses') finalIsActive = true;
              else if (item.href !== '/courses') finalIsActive = false;
            } else {
              finalIsActive = pathname.startsWith(item.href) && pathname !== '/' ;
              if (item.href === '/dashboard' && pathname !== '/dashboard') finalIsActive = false;
            }

            return (
              <li key={item.href} className="px-4 py-1">
                <Link 
                  href={item.href} 
                  className={`
                    flex items-center p-3 rounded-lg transition-colors
                    ${finalIsActive 
                      ? 'bg-blue-500 text-white shadow-lg' 
                      : 'text-gray-600 hover:bg-gray-100'
                    }
                  `}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="ml-4 font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t p-4 border-gray-200">
        <div className="flex items-center">
          <img 
            src={currentUser.avatarUrl} 
            alt="Avatar" 
            className="w-10 h-10 rounded-full"
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/40x40/E2E8F0/A0AEC0?text=S'; }}
          />
          <div className="ml-3">
            <p className="font-semibold text-sm text-gray-900">{currentUser.name}</p> 
            <p className="text-xs text-gray-500">{currentUser.role}</p> 
          </div>
        </div>
      </div>
    </aside>
  );
}