"use server";

import db from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// 1. Ambil Notifikasi User
export async function getNotifications() {
  const session = await auth();
  if (!session) return [];

  try {
    return await db.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 10 // Ambil 10 terbaru
    });
  } catch (error) {
    return [];
  }
}

// 2. Tandai Sudah Dibaca
export async function markNotificationAsRead(notifId: string) {
    const session = await auth();
    if (!session) return;

    try {
        await db.notification.update({
            where: { id: notifId, userId: session.user.id },
            data: { isRead: true }
        });
        revalidatePath("/"); // Refresh UI global
        return { success: true };
    } catch (error) {
        return { error: "Gagal update" };
    }
}

// 3. Helper Internal: Buat Notifikasi (Updated)
// Ini dipanggil oleh action lain (misal saat Dosen memberi nilai)
export async function createNotificationInternal(userId: string, title: string, message: string, link: string) {
    try {
        // 1. Cek Preferensi User
        const user = await db.user.findUnique({
            where: { id: userId },
            select: { enableCourseNotif: true }
        });

        // Jika user tidak ditemukan ATAU mematikan notifikasi -> BATALKAN
        if (!user || !user.enableCourseNotif) {
            return; 
        }

        // 2. Buat Notifikasi
        await db.notification.create({
            data: { userId, title, message, link }
        });
    } catch (e) {
        console.error("Gagal buat notifikasi", e);
    }
}

