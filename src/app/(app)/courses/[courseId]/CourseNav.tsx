"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, ClipboardCheck, MessageSquare, FileInput } from 'lucide-react';

const courseNavItems = [
  { href: '/materi', label: 'Materials', icon: BookOpen },
  { href: '/kuis', label: 'Quizzes', icon: ClipboardCheck },
  { href: '/tugas', label: 'Assignments', icon: FileInput },
  { href: '/forum', label: 'Forum', icon: MessageSquare },
];

export function CourseNav({ courseId }: { courseId: string }) {
  const pathname = usePathname();

  return (
    <div className="bg-white p-1 rounded-full shadow-sm inline-flex overflow-x-auto max-w-full">
      {courseNavItems.map((item) => {
        const href = `/courses/${courseId}${item.href}`;
        const isActive = pathname.startsWith(href);
        
        return (
          <Link
            key={item.label}
            href={href}
            className={`
              flex items-center space-x-2 px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
              ${isActive
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }
            `}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}