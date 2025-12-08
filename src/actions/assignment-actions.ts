"use server";

import { z } from "zod";
import db from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createNotificationInternal } from "@/actions/notification-actions";

// Skema Validasi
const AssignmentSchema = z.object({
  title: z.string().min(3, "Judul tugas minimal 3 karakter"),
  description: z.string().min(10, "Deskripsi instruksi minimal 10 karakter"),
  dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Tanggal deadline tidak valid",
  }),
});

export async function createAssignment(courseId: string, formData: FormData) {
  const session = await auth();
  
  if (!session || session.user.role !== "DOSEN") {
    return { error: "Unauthorized" };
  }

  // Cek kepemilikan course
  const course = await db.course.findUnique({
    where: { id: courseId, instructorId: session.user.id }
  });

  if (!course) return { error: "Mata kuliah tidak ditemukan." };

  const rawData = {
    title: formData.get("title"),
    description: formData.get("description"),
    dueDate: formData.get("dueDate"),
  };

  const validated = AssignmentSchema.safeParse(rawData);

  if (!validated.success) {
    return { error: "Input tidak valid. Pastikan semua field terisi." };
  }

  const { title, description, dueDate } = validated.data;

  try {
    await db.assignment.create({
      data: {
        title,
        description,
        dueDate: new Date(dueDate), // Konversi string ke Date Object
        courseId,
      },
    });
  } catch (error) {
    console.error("Error creating assignment:", error);
    return { error: "Gagal membuat tugas." };
  }

  revalidatePath(`/manage/${courseId}/tugas`);
  redirect(`/manage/${courseId}/tugas`);
}

export async function getAssignments(courseId: string) {
  const session = await auth();
  if (!session) return [];

  try {
    const assignments = await db.assignment.findMany({
      where: { courseId },
      orderBy: { dueDate: 'asc' }, // Urutkan berdasarkan deadline terdekat
      include: {
        _count: {
            select: { submissions: true } // Hitung berapa siswa yang sudah kumpul
        }
      }
    });
    return assignments;
  } catch (error) {
    return [];
  }
}

export async function deleteAssignment(assignmentId: string, courseId: string) {
    const session = await auth();
    if (!session || session.user.role !== "DOSEN") return { error: "Unauthorized" };

    try {
        await db.assignment.delete({
            where: { id: assignmentId }
        });
        revalidatePath(`/manage/${courseId}/tugas`);
        return { success: true };
    } catch (error) {
        return { error: "Gagal menghapus tugas" };
    }
}

// 1. Ambil Semua Submission untuk Tugas Tertentu
export async function getAssignmentSubmissions(assignmentId: string) {
  const session = await auth();
  if (!session || session.user.role !== "DOSEN") return [];

  try {
    // Ambil detail tugas + daftar submission + data mahasiswanya
    const assignment = await db.assignment.findUnique({
      where: { id: assignmentId },
      include: {
        submissions: {
          include: {
            student: {
              select: { name: true, email: true, avatarUrl: true, academicId: true }
            }
          },
          orderBy: { submittedAt: 'desc' }
        }
      }
    });
    return assignment;
  } catch (error) {
    return null;
  }
}

// 2. Beri Nilai (Grading)
export async function gradeSubmission(submissionId: string, grade: number) {
    // ... (kode auth check)

    try {
        // 1. Update Nilai (Kode Lama)
        const submission = await db.submission.update({
            where: { id: submissionId },
            data: { grade: grade },
            include: { assignment: true } // Include assignment untuk ambil judul & courseId
        });
        
        // 2. KIRIM NOTIFIKASI KE MAHASISWA (Kode Baru)
        await createNotificationInternal(
            submission.studentId,
            "Tugas Dinilai",
            `Tugas "${submission.assignment.title}" telah dinilai. Anda mendapat skor ${grade}.`,
            `/courses/${submission.assignment.courseId}/tugas/${submission.assignmentId}`
        );

        revalidatePath(`/manage`); 
        return { success: true };
    } catch (error) {
        return { error: "Gagal menyimpan nilai." };
    }
}

// 4. Update Tugas
export async function updateAssignment(assignmentId: string, courseId: string, formData: FormData) {
    const session = await auth();
    if (!session || session.user.role !== "DOSEN") return { error: "Unauthorized" };

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const dueDate = formData.get("dueDate") as string;

    try {
        await db.assignment.update({
            where: { id: assignmentId },
            data: { title, description, dueDate: new Date(dueDate) }
        });
      } catch (error) {
        console.error("Error updating assignment:", error);
        return { error: "Gagal update." };
      }
    revalidatePath(`/manage/${courseId}/tugas`);
    redirect(`/manage/${courseId}/tugas`);
}

// 5. Ambil Detail Tugas (Untuk Edit)
export async function getAssignmentById(assignmentId: string) {
  const session = await auth();
  if (!session || session.user.role !== "DOSEN") return null;

  try {
    const assignment = await db.assignment.findUnique({
      where: { id: assignmentId },
    });
    return assignment;
  } catch (error) {
    return null;
  }
}