"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MessageSquare, Plus, Loader2 } from 'lucide-react';
import { getThreads } from '@/actions/forum-actions';
import ThreadRow from '@/components/forum/ThreadRow'; // Komponen yang sudah ada

export default function ForumListPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  
  const [threads, setThreads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(!courseId) return;
    async function loadData() {
        const data = await getThreads(courseId);
        // Mapping agar sesuai dengan props ThreadRow yang lama
        const mapped = data.map((t: any) => ({
            ...t,
            repliesCount: t._count.replies,
            createdAt: new Date(t.createdAt).toLocaleDateString()
        }));
        setThreads(mapped);
        setLoading(false);
    }
    loadData();
  }, [courseId]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-500" /></div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Forum Diskusi</h1>
          <p className="text-gray-600">Diskusikan topik pembelajaran dengan dosen dan mahasiswa lain</p>
        </div>
        <Link href={`/courses/${courseId}/forum/create`}>
            <Button>
            <Plus className="h-4 w-4 mr-2" />
            Buat Thread Baru
            </Button>
        </Link>
      </div>

      {/* Daftar Thread */}
      <div className="space-y-4">
        {threads.length > 0 ? (
          threads.map(thread => (
            <ThreadRow key={thread.id} courseId={courseId} thread={thread} />
          ))
        ) : (
          <Card>
            <CardContent className="p-10 text-center">
              <MessageSquare className="h-10 w-10 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">Belum ada diskusi di forum ini.</p>
              <p className="text-sm text-gray-400">Jadilah yang pertama memulai topik!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}