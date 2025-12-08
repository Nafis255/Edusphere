"use server";

import db from "@/lib/db";
import { auth } from "@/auth";

export async function getDosenStats() {
  const session = await auth();
  
  if (!session || !session.user || session.user.role !== "DOSEN") {
    return { error: "Unauthorized" };
  }

  const dosenId = session.user.id;

  try {
    // 1. Statistik Angka (Kode Lama - Tetap)
    const totalCourses = await db.course.count({ where: { instructorId: dosenId } });
    
    const totalMaterials = await db.material.count({
      where: { course: { instructorId: dosenId } },
    });

    const totalStudents = await db.enrollment.count({
      where: { course: { instructorId: dosenId } },
    });

    const totalQuizzes = await db.quiz.count({
      where: { course: { instructorId: dosenId } },
    });

    // --- LOGIKA BARU DI BAWAH INI ---

    // 2. Ambil 3 Mata Kuliah Terbaru
    const recentCourses = await db.course.findMany({
        where: { instructorId: dosenId },
        take: 3,
        orderBy: { updatedAt: 'desc' },
        include: {
            _count: { select: { enrollments: true, materials: true } }
        }
    });

    // 3. Simulasikan "Aktivitas Terbaru" (Activity Feed)
    // Kita gabungkan data 'Enrollment Baru' dan 'Submission Tugas Baru'
    
    const recentEnrollments = await db.enrollment.findMany({
        where: { course: { instructorId: dosenId } },
        take: 5,
        orderBy: { enrolledAt: 'desc' },
        include: { student: { select: { name: true } }, course: { select: { title: true } } }
    });

    const recentSubmissions = await db.submission.findMany({
        where: { assignment: { course: { instructorId: dosenId } } },
        take: 5,
        orderBy: { submittedAt: 'desc' },
        include: { student: { select: { name: true } }, assignment: { select: { title: true } } }
    });

    // Gabungkan dan format menjadi satu array 'activities'
    const activities = [
        ...recentEnrollments.map(e => ({
            id: `enroll-${e.id}`,
            text: `Mahasiswa "${e.student.name}" mendaftar di kelas "${e.course.title}"`,
            time: e.enrolledAt,
            type: 'ENROLL'
        })),
        ...recentSubmissions.map(s => ({
            id: `sub-${s.id}`,
            text: `Mahasiswa "${s.student.name}" mengumpulkan tugas "${s.assignment.title}"`,
            time: s.submittedAt,
            type: 'SUBMIT'
        }))
    ];

    // Urutkan lagi gabungan tersebut berdasarkan waktu terbaru
    activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    
    // Ambil 5 teratas saja
    const recentActivities = activities.slice(0, 5).map(a => ({
        ...a,
        time: a.time.toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' }) // Format waktu
    }));

    return {
      success: true,
      data: {
        totalCourses,
        totalStudents,
        totalMaterials,
        totalQuizzes,
        recentCourses,    // <-- Data Baru
        recentActivities  // <-- Data Baru
      },
    };
  } catch (error) {
    console.error("Error fetching stats:", error);
    return { error: "Gagal mengambil data statistik." };
  }
}