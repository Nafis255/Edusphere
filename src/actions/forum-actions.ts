"use server";

import { z } from "zod";
import db from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// 1. Ambil Daftar Thread
export async function getThreads(courseId: string) {
  const session = await auth();
  if (!session) return [];

  try {
    const threads = await db.thread.findMany({
      where: { courseId },
      include: {
        author: { select: { name: true, role: true, avatarUrl: true } },
        _count: { select: { replies: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    return threads;
  } catch (error) {
    return [];
  }
}

// 2. Buat Thread Baru
const ThreadSchema = z.object({
  title: z.string().min(5, "Judul minimal 5 karakter"),
  content: z.string().min(10, "Konten minimal 10 karakter"),
});

export async function createThread(courseId: string, formData: FormData) {
  const session = await auth();
  if (!session || !session.user) return { error: "Unauthorized" };

  const rawData = {
    title: formData.get("title"),
    content: formData.get("content"),
  };

  const validated = ThreadSchema.safeParse(rawData);
  if (!validated.success) return { error: "Input tidak valid." };

  try {
    await db.thread.create({
      data: {
        title: validated.data.title,
        content: validated.data.content,
        courseId,
        authorId: session.user.id,
      }
    });
  } catch (error) {
    return { error: "Gagal membuat thread." };
  }

  revalidatePath(`/courses/${courseId}/forum`);
  redirect(`/courses/${courseId}/forum`);
}

// 3. Ambil Detail Thread + Balasan
export async function getThreadDetail(threadId: string) {
  const session = await auth();
  if (!session) return null;

  try {
    const thread = await db.thread.findUnique({
      where: { id: threadId },
      include: {
        author: { select: { name: true, role: true, avatarUrl: true } },
        replies: {
          include: {
            author: { select: { name: true, role: true, avatarUrl: true } }
          },
          orderBy: { createdAt: 'asc' } // Balasan lama di atas
        }
      }
    });
    return thread;
  } catch (error) {
    return null;
  }
}

// 4. Kirim Balasan (Reply)
export async function createReply(threadId: string, courseId: string, formData: FormData) {
  const session = await auth();
  if (!session || !session.user) return { error: "Unauthorized" };

  const content = formData.get("content") as string;
  if (!content || content.length < 3) return { error: "Balasan terlalu pendek." };

  try {
    await db.reply.create({
      data: {
        content,
        threadId,
        authorId: session.user.id,
      }
    });
    
    revalidatePath(`/courses/${courseId}/forum/${threadId}`);
    return { success: true };
  } catch (error) {
    return { error: "Gagal mengirim balasan." };
  }
}