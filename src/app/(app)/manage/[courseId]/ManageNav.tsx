"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Edit, ClipboardCheck, Settings, FileInput, Users } from 'lucide-react';

const manageNavItems = [
  { href: '/materi', label: 'Kelola Materi', icon: Edit },
  { href: '/kuis', label: 'Kelola Kuis', icon: ClipboardCheck },
  { href: '/tugas', label: 'Kelola Tugas', icon: FileInput },
  { href: '/peserta', label: 'Peserta', icon: Users },
  { href: '/settings', label: 'Pengaturan', icon: Settings },
];

export function ManageNav({ courseId }: { courseId: string }) {
  const pathname = usePathname();

  return (
    <nav className="bg-white rounded-lg shadow-sm">
      <div className="flex space-x-1 p-1 overflow-x-auto">
        {manageNavItems.map((item) => {
          const href = `/manage/${courseId}${item.href}`;
          // Cek apakah path saat ini diawali dengan href menu ini
          const isActive = pathname.startsWith(href);
          
          return (
            <Link
              key={item.label}
              href={href}
              className={`
                flex items-center space-x-2 px-4 py-2.5 rounded-md font-medium text-sm whitespace-nowrap
                transition-colors
                ${isActive
                  ? 'bg-blue-500 text-white shadow'
                  : 'text-gray-600 hover:bg-gray-100'
                }
              `}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}