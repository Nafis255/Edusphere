"use server";

import db from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// 1. Ambil Setting User
export async function getUserSettings() {
  const session = await auth();
  if (!session || !session.user) return null;

  try {
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { enableCourseNotif: true, role: true }
    });
    return user;
  } catch (error) {
    return null;
  }
}

// 2. Update Setting Notifikasi
export async function toggleCourseNotification(isEnabled: boolean) {
  const session = await auth();
  if (!session || !session.user) return { error: "Unauthorized" };

  try {
    await db.user.update({
      where: { id: session.user.id },
      data: { enableCourseNotif: isEnabled }
    });
    
    revalidatePath("/settings");
    return { success: true };
  } catch (error) {
    return { error: "Gagal menyimpan pengaturan." };
  }
}

// ... (imports dan kode user settings yang lama) ...

// --- ADMIN SETTINGS ---

// 3. Ambil Config Global
export async function getSystemConfig() {
  // Cek apakah user adalah admin
  const session = await auth();
  
  // Jika user biasa coba akses, kembalikan default (aman)
  if (!session || session.user.role !== "ADMIN") {
      return { allowRegistration: true, maintenanceMode: false };
  }

  try {
    // Upsert: Cari config, kalau belum ada buat baru (default)
    const config = await db.systemConfig.upsert({
      where: { id: "global" },
      update: {},
      create: { id: "global" }
    });
    return config;
  } catch (error) {
    return null;
  }
}

// 4. Update Config Global (Hanya Admin)
export async function updateSystemConfig(key: 'allowRegistration' | 'maintenanceMode', value: boolean) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") return { error: "Unauthorized" };

  try {
    await db.systemConfig.update({
      where: { id: "global" },
      data: { [key]: value } // Dynamic key update
    });
    
    revalidatePath("/settings");
    return { success: true };
  } catch (error) {
    return { error: "Gagal update sistem." };
  }
}