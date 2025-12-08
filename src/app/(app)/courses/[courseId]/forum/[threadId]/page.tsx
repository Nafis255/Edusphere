"use client";

import React, { useEffect, useState, useTransition } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, MessageSquare, Send, Loader2 } from 'lucide-react';
import { getThreadDetail, createReply } from '@/actions/forum-actions';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

// Komponen Item Post (Dipakai untuk Thread Utama & Balasan)
function ForumPost({ post, isMain = false }: { post: any, isMain?: boolean }) {
  const dateStr = new Date(post.createdAt).toLocaleDateString() + ' ' + new Date(post.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  
  return (
    <Card className={`shadow-sm ${isMain ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''}`}>
      <CardContent className="p-5">
        <div className="flex space-x-4">
          <img
            src={post.author.avatarUrl || `https://placehold.co/40x40?text=${post.author.name.charAt(0)}`}
            alt={post.author.name}
            className="w-10 h-10 rounded-full object-cover bg-gray-200"
          />
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-gray-900">{post.author.name}</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${post.author.role === 'DOSEN' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                {post.author.role}
              </span>
              <span className="text-sm text-gray-500">· {dateStr}</span>
            </div>
            
            {isMain && (
              <h1 className="text-xl font-bold text-gray-900 mt-2 mb-2">
                {post.title}
              </h1>
            )}

            <p className="text-gray-800 mt-2 whitespace-pre-wrap leading-relaxed">
              {post.content}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ThreadDetailPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const threadId = params.threadId as string;
  const { data: session } = useSession();

  const [thread, setThread] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState("");
  const [isPending, startTransition] = useTransition();

  // Load Data
  async function loadData() {
    const data = await getThreadDetail(threadId);
    setThread(data);
    setLoading(false);
  }

  useEffect(() => {
    if (threadId) loadData();
  }, [threadId]);

  // Handle Reply
  const handleReply = (e: React.FormEvent) => {
      e.preventDefault();
      if (!replyContent.trim()) return;

      const formData = new FormData();
      formData.append("content", replyContent);

      startTransition(async () => {
          const res = await createReply(threadId, courseId, formData);
          if (res.success) {
            setReplyContent(""); 
            loadData(); 
            // GANTI alert DENGAN:
            toast.success("Balasan Terkirim");
          } else {
            toast.error("Gagal Mengirim", { description: res.error });
          }
      });
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-500" /></div>;
  if (!thread) return <div className="text-center py-20">Diskusi tidak ditemukan.</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      {/* Back Button */}
      <Link href={`/courses/${courseId}/forum`} className="flex items-center text-sm text-gray-500 hover:text-gray-700 w-fit">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Kembali ke Forum
      </Link>

      {/* Thread Utama */}
      <ForumPost post={thread} isMain={true} />

      {/* Divider */}
      <div className="flex items-center gap-2 py-2">
        <MessageSquare className="h-4 w-4 text-gray-400" />
        <span className="text-sm font-medium text-gray-500">{thread.replies.length} Balasan</span>
      </div>

      {/* List Balasan */}
      <div className="space-y-4">
        {thread.replies.map((reply: any) => (
          <ForumPost key={reply.id} post={reply} />
        ))}
      </div>

      {/* Form Balasan */}
      <Card className="shadow-md border-t-4 border-t-blue-500 mt-8">
        <CardContent className="p-5">
          <h3 className="font-semibold text-gray-700 mb-4">Tulis Balasan</h3>
          <form onSubmit={handleReply}>
            <div className="flex gap-4">
                <img 
                    src={session?.user?.image || `https://placehold.co/40x40?text=${session?.user?.name?.charAt(0)}`} 
                    className="w-10 h-10 rounded-full bg-gray-200"
                />
                <div className="flex-1 space-y-2">
                    <textarea
                        className="w-full h-24 p-3 border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="Ketikan balasan Anda di sini..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        required
                    ></textarea>
                    <div className="flex justify-end">
                        <Button type="submit" disabled={isPending}>
                            {isPending ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                            Kirim Balasan
                        </Button>
                    </div>
                </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}