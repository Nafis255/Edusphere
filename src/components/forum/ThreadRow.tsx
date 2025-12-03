"use client"; // Perlu 'use client' karena ada onError

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { MessageSquare, ThumbsUp } from 'lucide-react';
import { ForumThread } from '@/lib/types'; // Impor tipe datanya

interface ThreadRowProps {
  courseId: string | null; // Buat courseId opsional untuk forum global
  thread: ForumThread;
}

export default function ThreadRow({ courseId, thread }: ThreadRowProps) {
  const { author, title, content, repliesCount, likesCount, createdAt } = thread;

  // Tentukan link. Jika tidak ada courseId (global), link bisa beda
  // Untuk sekarang, kita asumsikan semua thread tetap butuh courseId
  // (Logika ini perlu disempurnakan jika ada thread global)
  const linkHref = courseId 
    ? `/courses/${courseId}/forum/${thread.id}` 
    : `/forum/${thread.id}`; // Asumsi link global (bisa diubah)
  
  // Untuk demo, kita hardcode courseId jika tidak ada
  const finalLink = `/courses/${courseId || 'web-lanjut'}/forum/${thread.id}`;


  return (
    <Link href={finalLink} className="block">
      <Card className="shadow-sm hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-5">
          <div className="flex space-x-4">
            {/* Avatar Penulis */}
            <img
              src={author.avatarUrl}
              alt={author.name}
              className="w-10 h-10 rounded-full"
              onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/40x40/E2E8F0/A0AEC0?text=${author.name.charAt(0)}`; }}
            />
            {/* Konten Thread */}
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-900">{author.name}</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${author.role === 'Dosen' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                  {author.role}
                </span>
                <span className="text-sm text-gray-500">· {createdAt}</span>
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 mt-1">
                {title}
              </h3>
              
              <p className="text-gray-600 mt-2 text-sm">
                {content.substring(0, 150)}...
              </p>

              <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                <span className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1.5" />
                  {repliesCount} replies
                </span>
                <span className="flex items-center">
                  <ThumbsUp className="h-4 w-4 mr-1.5" />
                  {likesCount} likes
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}