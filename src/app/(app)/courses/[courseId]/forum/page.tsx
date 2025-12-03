"use client"; // Karena kita akan filter

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MessageSquare, Plus } from 'lucide-react';
import { mockForumList } from '@/data/mockData'; // <-- Impor daftar forum global
import ThreadRow from '@/components/forum/ThreadRow'; // <-- Impor komponen

export default function GlobalForumPage() {
  // Untuk saat ini, kita tampilkan semua thread dari mockForumList
  // Kita perlu menebak courseId untuk link-nya (ini limitasi mock data)
  const allThreads = mockForumList;
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Forum Global</h1>
          <p className="text-gray-600">Semua diskusi dari mata kuliah Anda</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Buat Thread Baru
        </Button>
      </div>

      {/* Search Bar */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="relative">
            <MessageSquare className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari di semua diskusi..."
              className="pl-10 pr-4 py-2 w-full bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Daftar Thread */}
      <div className="space-y-4">
        {allThreads.length > 0 ? (
          allThreads.map(thread => (
            <ThreadRow key={thread.id} courseId="web-lanjut" thread={thread} />
          ))
        ) : (
          <Card>
            <CardContent className="p-8">
              <p className="text-center text-gray-500">Belum ada diskusi di forum ini.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}