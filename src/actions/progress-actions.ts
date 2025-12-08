"use server";

import db from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function toggleMaterialCompletion(materialId: string, courseId: string, isCompleted: boolean) {
  const session = await auth();
  if (!session) return { error: "Unauthorized" };

  const studentId = session.user.id;

  try {
    // 1. Update/Upsert status materi
    // Jika belum ada record -> Buat baru. Jika ada -> Update.
    await db.materialProgress.upsert({
      where: {
        studentId_materialId: {
          studentId,
          materialId
        }
      },
      update: { isCompleted },
      create: {
        studentId,
        materialId,
        isCompleted
      }
    });

    // 2. HITUNG ULANG PROGRESS KURSUS
    // Hitung total materi di kursus ini
    const totalMaterials = await db.material.count({
      where: { courseId }
    });

    // Hitung materi yang SUDAH selesai oleh user ini di kursus ini
    const completedMaterials = await db.materialProgress.count({
      where: {
        studentId,
        isCompleted: true,
        material: { courseId } // Relasi ke material -> course
      }
    });

    // Hitung persentase (0 - 100)
    const progressPercentage = totalMaterials === 0 
      ? 0 
      : Math.round((completedMaterials / totalMaterials) * 100);

    // 3. Update tabel Enrollment
    await db.enrollment.update({
      where: {
        studentId_courseId: {
          studentId,
          courseId
        }
      },
      data: { progress: progressPercentage }
    });

    revalidatePath(`/courses/${courseId}`);
    return { success: true, progress: progressPercentage };

  } catch (error) {
    console.error("Progress Error:", error);
    return { error: "Gagal update progress." };
  }
}

// Helper untuk cek status materi saat load halaman
export async function getMaterialStatus(materialId: string) {
    const session = await auth();
    if (!session) return false;

    const progress = await db.materialProgress.findUnique({
        where: {
            studentId_materialId: {
                studentId: session.user.id,
                materialId
            }
        }
    });

    return progress?.isCompleted || false;
}