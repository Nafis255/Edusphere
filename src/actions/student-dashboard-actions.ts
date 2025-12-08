"use server";

import db from "@/lib/db";
import { auth } from "@/auth";

export async function getStudentDashboardStats() {
  const session = await auth();
  if (!session || session.user.role !== "MAHASISWA") {
    return { error: "Unauthorized" };
  }

  const studentId = session.user.id;

  try {
    // ... (Logika 1-4 yang lama: Enrolled, AvgScore, Pending, RecentCourses TETAP ADA) ...
    // ... (Salin kode lama bagian atas di sini atau biarkan saja) ...
    
    // --- KODE LAMA (Ringkasan) ---
    const enrolledCount = await db.enrollment.count({ where: { studentId } });
    
    // Hitung Avg Score (Gabungan Tugas & Kuis)
    const assignmentGrades = await db.submission.findMany({
        where: { studentId, grade: { not: null } },
        select: { grade: true }
    });
    const quizGrades = await db.quizAttempt.findMany({
        where: { studentId },
        select: { score: true }
    });
    const allGrades = [...assignmentGrades.map(s => s.grade || 0), ...quizGrades.map(q => q.score)];
    const avgScore = allGrades.length > 0 ? Math.round(allGrades.reduce((a, b) => a + b, 0) / allGrades.length) : 0;

    // Hitung Pending Assignments
    const enrollments = await db.enrollment.findMany({ where: { studentId }, select: { courseId: true } });
    const courseIds = enrollments.map(e => e.courseId);
    
    const totalAssignments = await db.assignment.count({
        where: { 
            courseId: { in: courseIds },
            dueDate: { gte: new Date() } // Hanya hitung yang belum lewat deadline
        }
    });
    const submittedAssignments = await db.submission.count({ where: { studentId } });
    const pendingAssignments = Math.max(0, totalAssignments - submittedAssignments);

    // Hitung Completed Materials
    const completedMaterials = await db.materialProgress.count({ where: { studentId, isCompleted: true } });

    // Recent Courses
    const recentEnrollments = await db.enrollment.findMany({
        where: { studentId },
        orderBy: { lastAccessedAt: 'desc' },
        take: 3,
        include: { course: { include: { instructor: { select: { name: true } } } } }
    });
    const recentCourses = recentEnrollments.map(e => ({
        id: e.course.id,
        title: e.course.title,
        instructorName: e.course.instructor.name,
        imageUrl: e.course.coverImage,
        progress: e.progress
    }));
    // --- AKHIR KODE LAMA ---


    // --- 5. LOGIKA BARU: UPCOMING DEADLINES ---
    const upcomingAssignments = await db.assignment.findMany({
        where: {
            courseId: { in: courseIds }, // Dari kursus yang diambil
            dueDate: { gte: new Date() }, // Deadline belum lewat
            submissions: { none: { studentId } } // Belum dikumpulkan
        },
        orderBy: { dueDate: 'asc' }, // Urutkan deadline terdekat
        take: 3, // Ambil 3
        include: { course: { select: { title: true } } }
    });

    // Format data deadline untuk InfoCard
    const upcomingDeadlines = upcomingAssignments.map(a => {
        const diffTime = new Date(a.dueDate).getTime() - new Date().getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const badge = diffDays === 0 ? "Hari ini" : `${diffDays} hari lagi`;
        
        return {
            id: a.id,
            title: a.title,
            subtitle: a.course.title,
            badge: badge
        };
    });


    // --- 6. LOGIKA BARU: RECENT ACHIEVEMENTS ---
    // Kita anggap "Achievement" adalah Kuis dengan nilai >= 80 atau Materi yang baru selesai
    
    // Ambil Kuis Nilai Tinggi
    const highScores = await db.quizAttempt.findMany({
        where: { studentId, score: { gte: 80 } },
        orderBy: { completedAt: 'desc' },
        take: 3,
        include: { quiz: true }
    });

    // Format achievement
    const recentAchievements = highScores.map(q => ({
        id: q.id,
        title: `Nilai ${q.score} di ${q.quiz.title}`,
        subtitle: `Diselesaikan pada ${new Date(q.completedAt).toLocaleDateString('id-ID')}`,
        // Tidak pakai badge khusus
    }));

    return {
      success: true,
      stats: {
        enrolledCourses: enrolledCount,
        avgScore,
        pendingAssignments,
        completedMaterials
      },
      recentCourses,
      upcomingDeadlines, // <-- Kirim data baru
      recentAchievements // <-- Kirim data baru
    };

  } catch (error) {
    console.error("Dashboard error:", error);
    return { error: "Gagal memuat data." };
  }
}