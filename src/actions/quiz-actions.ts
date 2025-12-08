"use server";

import { z } from "zod";
import db from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { QuestionType } from "@prisma/client";

// Skema Validasi
const QuizSchema = z.object({
  title: z.string().min(3, "Judul kuis minimal 3 karakter"),
  duration: z.coerce.number().min(5, "Durasi minimal 5 menit"), // coerce mengubah string input ke number
});

export async function createQuiz(courseId: string, formData: FormData) {
  const session = await auth();
  
  if (!session || session.user.role !== "DOSEN") {
    return { error: "Unauthorized" };
  }

  // 1. Cek kepemilikan course
  const course = await db.course.findUnique({
    where: { id: courseId, instructorId: session.user.id }
  });

  if (!course) return { error: "Mata kuliah tidak ditemukan." };

  // 2. Validasi Input
  const rawData = {
    title: formData.get("title"),
    duration: formData.get("duration"),
  };

  const validated = QuizSchema.safeParse(rawData);

  if (!validated.success) {
    return { error: "Input tidak valid. Pastikan judul dan durasi terisi benar." };
  }

  const { title, duration } = validated.data;

  try {
    // 3. Simpan ke DB
    await db.quiz.create({
      data: {
        title,
        duration,
        courseId,
      },
    });
  } catch (error) {
    console.error("Error creating quiz:", error);
    return { error: "Gagal membuat kuis." };
  }

  revalidatePath(`/manage/${courseId}/kuis`);
  redirect(`/manage/${courseId}/kuis`);
}

export async function getQuizzes(courseId: string) {
  const session = await auth();
  if (!session) return [];

  try {
    const quizzes = await db.quiz.findMany({
      where: { courseId },
      include: {
        _count: {
          select: { questions: true } // Kita hitung jumlah soalnya
        }
      },
      orderBy: { createdAt: 'desc' },
    });
    return quizzes;
  } catch (error) {
    return [];
  }
}

export async function deleteQuiz(quizId: string, courseId: string) {
    const session = await auth();
    if (!session || session.user.role !== "DOSEN") return { error: "Unauthorized" };

    try {
        await db.quiz.delete({
            where: { id: quizId }
        });
        revalidatePath(`/manage/${courseId}/kuis`);
        return { success: true };
    } catch (error) {
        return { error: "Gagal menghapus kuis" };
    }
}

// --- BARU: FUNGSI UNTUK SOAL (QUESTIONS) ---

const QuestionSchema = z.object({
  text: z.string().min(5, "Pertanyaan minimal 5 karakter"),
  type: z.nativeEnum(QuestionType),
  correctAnswer: z.string().min(1, "Kunci jawaban harus dipilih"),
});

export async function createQuestion(quizId: string, formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== "DOSEN") return { error: "Unauthorized" };

  // Ambil opsi jawaban manual
  const optionA = formData.get("optionA") as string;
  const optionB = formData.get("optionB") as string;
  const optionC = formData.get("optionC") as string;
  const optionD = formData.get("optionD") as string;

  // Bersihkan opsi kosong & buat array
  const options = [optionA, optionB, optionC, optionD].filter(opt => opt && opt.trim() !== "");

  if (options.length < 2) {
    return { error: "Minimal harus ada 2 pilihan jawaban." };
  }

  const rawData = {
    text: formData.get("text"),
    type: "PILIHAN_GANDA", // Hardcode dulu untuk kesederhanaan
    correctAnswer: formData.get("correctAnswer"), 
  };

  const validated = QuestionSchema.safeParse(rawData);

  if (!validated.success) return { error: "Input soal tidak valid." };
  const { text, type, correctAnswer } = validated.data;

  // Validasi: Kunci jawaban harus ada di dalam opsi
  if (!options.includes(correctAnswer)) {
      return { error: "Kunci jawaban harus sama persis dengan salah satu opsi." };
  }

  try {
    await db.question.create({
      data: {
        text,
        type,
        options,
        correctAnswer,
        quizId,
      },
    });
    
    // Refresh halaman edit agar soal baru muncul
    // Note: Path ini dinamis, revalidatePath agak tricky dengan dynamic route bertingkat
    // Kita gunakan kembalian { success: true } agar frontend yang refresh.
    return { success: true };

  } catch (error) {
    console.error(error);
    return { error: "Gagal menyimpan soal." };
  }
}

export async function getQuizWithQuestions(quizId: string) {
    const session = await auth();
    if (!session) return null;

    try {
        const quiz = await db.quiz.findUnique({
            where: { id: quizId },
            include: { 
                questions: {
                    orderBy: { id: 'asc' } // Urutkan berdasarkan waktu buat
                } 
            }
        });
        return quiz;
    } catch (error) {
        return null;
    }
}

export async function deleteQuestion(questionId: string) {
    const session = await auth();
    if (!session || session.user.role !== "DOSEN") return { error: "Unauthorized" };

    try {
        await db.question.delete({ where: { id: questionId } });
        return { success: true };
    } catch (error) {
        return { error: "Gagal menghapus soal" };
    }
}

// 4. Ambil Rekap Nilai Mahasiswa
export async function getQuizResults(quizId: string) {
  const session = await auth();
  if (!session || session.user.role !== "DOSEN") return null;

  try {
    const results = await db.quizAttempt.findMany({
      where: { quizId },
      include: {
        student: {
          select: { name: true, academicId: true, avatarUrl: true }
        }
      },
      orderBy: { score: 'desc' } // Urutkan dari nilai tertinggi
    });
    
    // Kita juga butuh judul kuis untuk header
    const quizInfo = await db.quiz.findUnique({
        where: { id: quizId },
        select: { title: true }
    });

    return { results, quizTitle: quizInfo?.title };
  } catch (error) {
    return null;
  }
}