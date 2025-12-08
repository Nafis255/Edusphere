"use server";

import db from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// 1. Ambil Detail Tugas & Status Pengumpulan User
export async function getAssignmentDetailForStudent(assignmentId: string) {
  const session = await auth();
  if (!session) return null;

  try {
    const assignment = await db.assignment.findUnique({
      where: { id: assignmentId },
      include: {
        // Cek apakah user ini sudah pernah submit
        submissions: {
          where: { studentId: session.user.id },
          take: 1,
        }
      }
    });
    
    return assignment;
  } catch (error) {
    return null;
  }
}

// 2. Submit Tugas (Updated)
export async function submitAssignment(assignmentId: string, formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== "MAHASISWA") {
    return { error: "Unauthorized" };
  }

  const linkUrl = formData.get("linkUrl") as string;
  const fileUrl = formData.get("fileUrl") as string; // <-- Ambil File URL

  // Validasi: Harus ada salah satu (Link atau File)
  if (!linkUrl && !fileUrl) {
    return { error: "Harap sertakan Link atau File tugas." };
  }

  try {
    const existingSubmission = await db.submission.findFirst({
      where: { assignmentId, studentId: session.user.id }
    });

    if (existingSubmission) {
      // Update
      await db.submission.update({
        where: { id: existingSubmission.id },
        data: {
          linkUrl: linkUrl || null, // Reset jika kosong
          fileUrl: fileUrl || null, // Reset jika kosong
          submittedAt: new Date(),
        }
      });
    } else {
      // Create
      await db.submission.create({
        data: {
          assignmentId,
          studentId: session.user.id,
          linkUrl: linkUrl || undefined,
          fileUrl: fileUrl || undefined,
        }
      });
    }

    revalidatePath(`/courses/[courseId]/tugas/${assignmentId}`);
    return { success: true };

  } catch (error) {
    console.error("Submission error:", error);
    return { error: "Gagal mengumpulkan tugas." };
  }
}

// 3. Ambil Daftar Tugas untuk Mahasiswa
export async function getStudentAssignments(courseId: string) {
  const session = await auth();
  if (!session) return [];

  try {
    const assignments = await db.assignment.findMany({
      where: { courseId },
      orderBy: { dueDate: 'asc' },
      include: {
        // Cek status submission user ini
        submissions: {
          where: { studentId: session.user.id },
          select: { id: true, submittedAt: true, grade: true }
        }
      }
    });
    return assignments;
  } catch (error) {
    return [];
  }
}