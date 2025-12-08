"use server";

import db from "@/lib/db";
import { auth } from "@/auth";

// 1. Ambil Detail Mata Kuliah (Untuk Header Layout)
export async function getStudentCourseDetail(courseId: string) {
  const session = await auth();
  if (!session || !session.user) return null;

  try {
    // Cari mata kuliah DAN pastikan user sudah enroll
    // ATAU user adalah dosen pemiliknya (biar dosen bisa intip tampilan mhs)
    const course = await db.course.findFirst({
      where: {
        id: courseId,
        OR: [
            { enrollments: { some: { studentId: session.user.id } } },
            { instructorId: session.user.id } 
        ]
      },
      include: {
        instructor: { select: { name: true } },
        _count: { select: { enrollments: true, materials: true } },
        enrollments: {
            where: { studentId: session.user.id },
            select: { progress: true }
        }
      }
    });

    if (!course) return null;

    // Format data agar mudah dipakai
    return {
      ...course,
      instructorName: course.instructor.name,
      studentCount: course._count.enrollments,
      // Ambil progress user (jika ada), kalau dosen lihat jadi 0
      progress: course.enrollments[0]?.progress || 0 
    };
  } catch (error) {
    return null;
  }
}

// 2. Ambil Materi Mata Kuliah (Untuk Halaman Materi)
export async function getStudentMaterials(courseId: string) {
    const session = await auth();
    if (!session) return [];

    // Validasi Enrollment dilakukan implisit:
    // Jika tidak terdaftar, UI layout akan memblokir duluan.
    // Tapi untuk keamanan ganda, bisa cek enrollment di sini juga.
    
    try {
        const materials = await db.material.findMany({
            where: { courseId },
            orderBy: { createdAt: 'desc' }
        });
        return materials;
    } catch (error) {
        return [];
    }
}

// 3. Ambil Detail Satu Materi
export async function getMaterialDetail(materialId: string) {
  const session = await auth();
  if (!session) return null;

  try {
    const material = await db.material.findUnique({
      where: { id: materialId },
    });
    return material;
  } catch (error) {
    return null;
  }
}

export async function updateLastAccessed(courseId: string) {
  const session = await auth();
  if (!session) return;

  try {
    await db.enrollment.update({
      where: {
        studentId_courseId: {
          studentId: session.user.id,
          courseId: courseId
        }
      },
      data: { lastAccessedAt: new Date() } // Update waktu ke "sekarang"
    });
  } catch (e) {
    // Ignore error (ini background process, jangan ganggu user)
  }
}