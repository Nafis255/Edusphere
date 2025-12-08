"use server";

import db from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// 1. Ambil Peserta
export async function getCourseParticipants(courseId: string) {
  const session = await auth();
  if (!session) return [];

  try {
    const participants = await db.enrollment.findMany({
      where: { courseId },
      include: {
        student: { select: { id: true, name: true, email: true, academicId: true, avatarUrl: true } }
      },
      orderBy: { enrolledAt: 'desc' }
    });
    return participants;
  } catch (error) {
    return [];
  }
}

// 2. Kick Peserta
export async function removeParticipant(studentId: string, courseId: string) {
    const session = await auth();
    // Hanya dosen pemilik yang boleh kick
    if (!session || session.user.role !== "DOSEN") return { error: "Unauthorized" };

    try {
        await db.enrollment.delete({
            where: {
                studentId_courseId: {
                    studentId,
                    courseId
                }
            }
        });
        revalidatePath(`/manage/${courseId}/peserta`);
        return { success: true };
    } catch (error) {
        return { error: "Gagal menghapus peserta." };
    }
}