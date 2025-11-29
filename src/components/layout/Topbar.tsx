"use client";

import React, { useState } from 'react'; 
import { Search, Bell, Sun, Moon, LogOut, Book, ClipboardCheck, MessageSquare } from 'lucide-react'; // <-- Impor LogOut
import { useTheme } from '@/contexts/ThemeContext';
import { mockNotifications } from '@/data/mockData'; 
import { Notification } from '@/lib/types';
import Link from 'next/link';

// Data dummy untuk hasil pencarian
const mockSearchResults = [
  { type: 'Mata Kuliah', title: 'Pemrograman Web Lanjut', href: '/courses/web-lanjut', icon: Book },
  { type: 'Materi', title: 'React Hooks Deep Dive', href: '/courses/web-lanjut/materi/m2', icon: Book },
  { type: 'Kuis', title: 'Quiz React Fundamentals', href: '/courses/web-lanjut/kuis/q1', icon: ClipboardCheck },
  { type: 'Forum', title: 'Rekomendasi library form', href: '/courses/web-lanjut/forum/t2', icon: MessageSquare },
];

export default function Topbar() {
  const { theme, setTheme } = useTheme();
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowResults(e.target.value.length > 0);
  };

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6 sticky top-0 z-10 border-gray-200">
      
      <div 
        className="relative"
        onBlur={() => setTimeout(() => setShowResults(false), 200)} 
      >
        <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Cari mata kuliah, materi, atau forum..."
          className="pl-10 pr-4 py-2 w-80 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={() => setShowResults(searchTerm.length > 0)}
        />
        
        {showResults && (
          <div className="absolute left-0 top-12 w-96 bg-white rounded-lg shadow-lg border overflow-hidden">
            <div className="p-3 border-b">
              <p className="text-sm font-semibold">Hasil untuk "{searchTerm}"</p>
            </div>
            <div className="divide-y divide-gray-200">
              {mockSearchResults.map((result, idx) => {
                const Icon = result.icon;
                return (
                  <Link 
                    key={idx} 
                    href={result.href}
                    className="flex items-center space-x-3 p-3 hover:bg-gray-100"
                    onClick={() => setShowResults(false)} 
                  >
                    <Icon className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-semibold text-gray-800">{result.title}</p>
                      <p className="text-xs text-blue-500 font-medium">{result.type}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 rounded-full hover:bg-gray-100 text-gray-600"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 flex h-5 w-5">
              <span className="relative inline-flex items-center justify-center rounded-full h-5 w-5 bg-red-500 text-xs font-semibold text-white">
                2
              </span>
            </span>
          </button>

          {isNotifOpen && (
            <div 
              className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-lg border overflow-hidden z-20 "
              onMouseLeave={() => setIsNotifOpen(false)} 
            >
              <div className="p-4 border-b border-gray-300">
                <h3 className="text-lg font-semibold text-gray-900">Notifikasi</h3>
              </div>
              <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                {mockNotifications.map((notif) => (
                  <div key={notif.id} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-gray-800">{notif.title}</h4>
                      {!notif.isRead && (
                        <span className="h-2.5 w-2.5 bg-blue-500 rounded-full flex-shrink-0 ml-2 mt-1.5"></span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notif.description}</p>
                    <p className="text-xs text-gray-400 mt-2">{notif.timestamp}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>


        <Link href="/"> 
          <button
            className="flex items-center p-2 rounded-full hover:bg-gray-100 text-gray-600"
            aria-label="Logout"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </Link>
        
      </div>
    </header>
  );
}