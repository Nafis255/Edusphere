"use server";

import db from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// 1. Ambil Data Profil & Statistik
export async function getUserProfile() {
  const session = await auth();
  if (!session || !session.user) return null;

  try {
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: {
        _count: {
          select: {
            enrollments: true,   // Jumlah kelas yang diambil (Mahasiswa)
            coursesOwned: true,  // Jumlah kelas yang diajar (Dosen)
            quizAttempts: true,  // Jumlah kuis dikerjakan
          }
        }
      }
    });

    if (!user) return null;

    // Kita hitung statistik sederhana untuk ditampilkan
    const stats = {
      coursesCount: user.role === 'DOSEN' ? user._count.coursesOwned : user._count.enrollments,
      quizCount: user._count.quizAttempts,
      joinedAt: user.createdAt,
    };

    return { ...user, stats };
  } catch (error) {
    return null;
  }
}

// 2. Update Data Profil
export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session || !session.user) return { error: "Unauthorized" };

  const name = formData.get("name") as string;
  const bio = formData.get("bio") as string;
  const avatarUrl = formData.get("avatarUrl") as string;
  const academicId = formData.get("academicId") as string;

  if (!name || name.trim().length < 3) {
    return { error: "Nama minimal 3 karakter." };
  }

  try {
    await db.user.update({
      where: { id: session.user.id },
      data: {
        name,
        bio,
        avatarUrl: avatarUrl || undefined, // Jika kosong, jangan update (atau set null)
        academicId: academicId || undefined,
      }
    });

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    return { error: "Gagal mengupdate profil." };
  }
}