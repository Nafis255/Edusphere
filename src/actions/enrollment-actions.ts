"use server";

import db from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// 1. Ambil Kursus yang SUDAH diambil Mahasiswa
export async function getEnrolledCourses() {
  const session = await auth();
  if (!session || session.user.role !== "MAHASISWA") return [];

  try {
    const enrollments = await db.enrollment.findMany({
      where: { studentId: session.user.id },
      include: {
        course: {
          include: {
            instructor: { select: { name: true } }, // Ambil nama dosen
            _count: { select: { materials: true, assignments: true } } // Hitung materi
          }
        }
      }
    });
    
    // Ratakan struktur data agar lebih mudah dipakai di frontend
    return enrollments.map(e => ({
      ...e.course,
      progress: e.progress,
      enrolledAt: e.enrolledAt,
      instructorName: e.course.instructor.name
    }));
  } catch (error) {
    return [];
  }
}

// 2. Ambil Kursus yang BELUM diambil (Katalog)
export async function getAvailableCourses() {
  const session = await auth();
  if (!session) return [];

  try {
    // Cari kursus di mana user BELUM terdaftar
    const courses = await db.course.findMany({
      where: {
        enrollments: {
          none: { studentId: session.user.id }
        }
      },
      include: {
        instructor: { select: { name: true } },
        _count: { select: { enrollments: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return courses.map(c => ({
      ...c,
      instructorName: c.instructor.name,
      studentCount: c._count.enrollments
    }));
  } catch (error) {
    return [];
  }
}

// 3. Action Enroll (Daftar Mata Kuliah)
// ... (kode lama)

// Update fungsi enrollCourse agar menerima 'key' opsional
export async function enrollCourse(courseId: string, enrollmentKey?: string) {
  const session = await auth();
  if (!session || session.user.role !== "MAHASISWA") return { error: "Unauthorized" };

  try {
    // 1. Ambil info course untuk cek kunci
    const course = await db.course.findUnique({
        where: { id: courseId }
    });

    if (!course) return { error: "Kursus tidak ditemukan" };

    // 2. Cek Enrollment Key
    if (course.enrollmentKey) {
        // Jika course punya kunci, user WAJIB kirim kunci yang benar
        if (!enrollmentKey || enrollmentKey !== course.enrollmentKey) {
            return { error: "Kunci pendaftaran salah atau diperlukan." };
        }
    }

    // ... (Logika cek existing enrollment & create enrollment SAMA seperti sebelumnya)
    const existing = await db.enrollment.findUnique({
        where: { studentId_courseId: { studentId: session.user.id, courseId } }
    });
    if (existing) return { error: "Sudah terdaftar." };

    await db.enrollment.create({
        data: { studentId: session.user.id, courseId, progress: 0 }
    });

  } catch (error) {
    return { error: "Gagal mendaftar." };
  }

  revalidatePath("/courses");
  return { success: true };
}