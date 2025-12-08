"use client";

import React, { useState, useEffect } from 'react';
import { Search, Bell, LogOut, Book, FileText, MessageSquare, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { logout } from '@/actions/auth-actions';
import { globalSearch } from '@/actions/search-actions'; // Import Search Action
import { getNotifications, markNotificationAsRead } from '@/actions/notification-actions'; // (Akan kita buat di Part 2)

export default function Topbar() {
  // --- STATE SEARCH ---
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // --- STATE NOTIFIKASI ---
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // 1. Debounce Search Effect
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.length >= 3) {
        setIsSearching(true);
        setShowResults(true);
        const results = await globalSearch(searchTerm);
        setSearchResults(results);
        setIsSearching(false);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 500); // Tunggu 500ms setelah user berhenti mengetik

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // 2. Fetch Notifications (Kita buat nanti di Part 2)
  useEffect(() => {
      async function loadNotif() {
          const data = await getNotifications();
          setNotifications(data);
      }
      loadNotif(); // Uncomment nanti

      const interval = setInterval(loadNotif, 30000);
      return () => clearInterval(interval);
  }, []);

  // Helper Icon
  const getIcon = (iconName: string) => {
      if (iconName === 'Book') return Book;
      if (iconName === 'FileText') return FileText;
      return MessageSquare;
  };

  const handleRead = async (notif: any) => {
      if (!notif.isRead) {
          await markNotificationAsRead(notif.id);
          setNotifications(prev => prev.map(n => n.id === notif.id ? {...n, isRead: true} : n));
      }
  };

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6 sticky top-0 z-20 border-gray-200">
      
      {/* Search Bar */}
      <div className="relative" onBlur={() => setTimeout(() => setShowResults(false), 200)}>
        <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Cari (min. 3 karakter)..."
          className="pl-10 pr-4 py-2 w-64 md:w-96 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => searchTerm.length >= 3 && setShowResults(true)}
        />
        
        {/* Dropdown Hasil */}
        {showResults && (
          <div className="absolute left-0 top-12 w-96 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
            {isSearching ? (
                <div className="p-4 text-center text-gray-500 flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Mencari...
                </div>
            ) : searchResults.length > 0 ? (
                <div className="divide-y divide-gray-100">
                    {searchResults.map((result, idx) => {
                        const Icon = getIcon(result.icon);
                        return (
                            <Link 
                                key={idx} 
                                href={result.href}
                                className="flex items-center space-x-3 p-3 hover:bg-blue-50 transition-colors"
                                onClick={() => setShowResults(false)}
                            >
                                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                    <Icon className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800 text-sm">{result.title}</p>
                                    <p className="text-xs text-gray-500">{result.type}</p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            ) : (
                <div className="p-4 text-center text-gray-500 text-sm">Tidak ada hasil ditemukan.</div>
            )}
          </div>
        )}
      </div>

      {/* Ikon Kanan */}
      <div className="flex items-center space-x-4">
<div className="relative">
          <button 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 rounded-full hover:bg-gray-100 text-gray-600"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full animate-pulse border-2 border-white"></span>
            )}
          </button>

          {/* Dropdown Notifikasi */}
          {isNotifOpen && (
            <div 
              className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-30"
              onMouseLeave={() => setIsNotifOpen(false)}
            >
              <div className="p-3 border-b bg-gray-50 flex justify-between items-center">
                <h3 className="font-semibold text-gray-700 text-sm">Notifikasi</h3>
                <span className="text-xs text-gray-500">{unreadCount} baru</span>
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                {notifications.length > 0 ? (
                    notifications.map((notif) => (
                        <Link 
                            key={notif.id} 
                            href={notif.link || "#"}
                            onClick={() => handleRead(notif)}
                            className={`block p-4 transition-colors ${notif.isRead ? 'bg-white text-gray-500' : 'bg-blue-50 text-gray-800'}`}
                        >
                            <p className="text-sm font-medium">{notif.title}</p>
                            <p className="text-xs mt-1 line-clamp-2">{notif.message}</p>
                            <p className="text-[10px] text-gray-400 mt-2 text-right">
                                {new Date(notif.createdAt).toLocaleString()}
                            </p>
                        </Link>
                    ))
                ) : (
                    <div className="p-4 text-center text-gray-400 text-sm">Tidak ada notifikasi.</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Tombol Logout */}
        <button
          onClick={() => logout()}
          className="flex items-center p-2 rounded-full hover:bg-red-50 text-gray-600 hover:text-red-600 transition-colors"
          title="Logout"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}