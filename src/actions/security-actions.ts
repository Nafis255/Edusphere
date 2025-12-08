"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import db from "@/lib/db";
import { auth, signOut } from "@/auth";
import { revalidatePath } from "next/cache";

// Schema Validasi Ganti Password
const ChangePasswordSchema = z.object({
  oldPassword: z.string().min(1, "Password lama diperlukan"),
  newPassword: z.string().min(6, "Password baru minimal 6 karakter"),
});

// 1. Ganti Password
export async function changePassword(formData: FormData) {
  const session = await auth();
  if (!session || !session.user) return { error: "Unauthorized" };

  const rawData = {
    oldPassword: formData.get("oldPassword"),
    newPassword: formData.get("newPassword"),
  };

  const validated = ChangePasswordSchema.safeParse(rawData);
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const { oldPassword, newPassword } = validated.data;

  try {
    // Ambil password lama dari DB
    const user = await db.user.findUnique({ where: { id: session.user.id } });
    if (!user || !user.password) return { error: "User tidak ditemukan." };

    // Cek Password Lama
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return { error: "Password lama salah." };

    // Hash Password Baru
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update DB
    await db.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword }
    });

    return { success: true };
  } catch (error) {
    return { error: "Gagal mengganti password." };
  }
}

// 2. Hapus Akun Sendiri
export async function deleteMyAccount() {
  const session = await auth();
  if (!session || !session.user) return { error: "Unauthorized" };

  try {
    await db.user.delete({
      where: { id: session.user.id }
    });
    
    // Tidak perlu return success karena kita akan logout
  } catch (error) {
    return { error: "Gagal menghapus akun." };
  }
  
  // Logout paksa setelah hapus akun
  await signOut({ redirectTo: "/" });
}