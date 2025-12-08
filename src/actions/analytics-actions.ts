"use server";

import db from "@/lib/db";
import { auth } from "@/auth";

export async function getStudentAnalytics() {
  const session = await auth();
  if (!session || session.user.role !== "MAHASISWA") {
    return null;
  }

  const studentId = session.user.id;

  try {
    // 1. STATISTIK UTAMA (Cards)
    const enrollments = await db.enrollment.findMany({
      where: { studentId },
      include: { course: { select: { title: true } } }
    });

    const completedCourses = enrollments.filter(e => e.progress === 100).length;
    const inProgressCourses = enrollments.filter(e => e.progress < 100).length;
    
    // Hitung rata-rata progress total
    const totalProgress = enrollments.reduce((acc, curr) => acc + curr.progress, 0);
    const averageProgress = enrollments.length > 0 ? Math.round(totalProgress / enrollments.length) : 0;

    // Hitung total materi selesai
    const totalMaterialsDone = await db.materialProgress.count({
        where: { studentId, isCompleted: true }
    });

    const stats = {
        completedCourses,
        inProgressCourses,
        averageProgress,
        totalMaterialsDone // Pengganti Study Hours
    };

    // 2. DATA UNTUK CHART PROGRES KURSUS
    // Format: { name: 'Judul Kursus', progress: 80 }
    const courseProgressData = enrollments.map(e => ({
        name: e.course.title.length > 15 ? e.course.title.substring(0, 15) + '...' : e.course.title, // Singkat judul biar muat di chart
        progress: e.progress
    }));

    // 3. DATA UNTUK CHART NILAI KUIS
    // Ambil 5 kuis terakhir yang dikerjakan
    const quizAttempts = await db.quizAttempt.findMany({
        where: { studentId },
        orderBy: { completedAt: 'asc' }, // Urutkan berdasarkan waktu pengerjaan
        take: 5,
        include: { quiz: { select: { title: true } } }
    });

    const quizScoreData = quizAttempts.map(q => ({
        name: q.quiz.title.length > 10 ? q.quiz.title.substring(0, 10) + '...' : q.quiz.title,
        score: q.score
    }));

    return {
        stats,
        courseProgressData,
        quizScoreData
    };

  } catch (error) {
    console.error("Analytics Error:", error);
    return null;
  }
}