"use server";

import db from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// 1. Ambil Daftar Kuis di Mata Kuliah
export async function getStudentQuizzes(courseId: string) {
  const session = await auth();
  if (!session) return [];

  try {
    const quizzes = await db.quiz.findMany({
      where: { courseId },
      include: {
        questions: { select: { id: true } }, // Hanya hitung jumlah soal
        // (Nanti bisa tambah relasi ke QuizResult untuk cek apakah sudah dikerjakan)
      }
    });
    return quizzes;
  } catch (error) {
    return [];
  }
}

// 2. Ambil Soal Kuis (DENGAN CEK ATTEMPT)
export async function getQuizQuestionsForStudent(quizId: string) {
    const session = await auth();
    if (!session) return null;

    try {
        // Cek apakah user SUDAH pernah mengerjakan
        const existingAttempt = await db.quizAttempt.findUnique({
            where: {
                studentId_quizId: {
                    studentId: session.user.id,
                    quizId: quizId
                }
            }
        });

        // Jika sudah ada attempt, kita kembalikan status khusus
        if (existingAttempt) {
            return { 
                completed: true, 
                result: existingAttempt // Kirim hasil yang sudah ada
            };
        }

        // Jika belum, ambil soal seperti biasa
        const quiz = await db.quiz.findUnique({
            where: { id: quizId },
            include: {
                questions: {
                    select: {
                        id: true,
                        text: true,
                        options: true,
                        type: true
                    },
                    orderBy: { id: 'asc' }
                }
            }
        });
        return quiz; // completed: undefined/false
    } catch (error) {
        return null;
    }
}

// 3. Submit & Simpan ke DB
export async function submitQuizAttempt(quizId: string, answers: Record<string, string>) {
    const session = await auth();
    if (!session) return { error: "Unauthorized" };

    try {
        // Cek lagi (Double protection) biar gak bisa submit 2x lewat API
        const existing = await db.quizAttempt.findUnique({
            where: {
                studentId_quizId: {
                    studentId: session.user.id,
                    quizId: quizId
                }
            }
        });

        if (existing) return { error: "Anda sudah mengerjakan kuis ini!" };

        // Hitung Skor
        const quiz = await db.quiz.findUnique({
            where: { id: quizId },
            include: { questions: true }
        });

        if (!quiz) return { error: "Kuis tidak ditemukan" };

        let correctCount = 0;
        const totalQuestions = quiz.questions.length;

        quiz.questions.forEach((q) => {
            const userAnswer = answers[q.id];
            if (userAnswer && userAnswer === q.correctAnswer) {
                correctCount++;
            }
        });

        const score = Math.round((correctCount / totalQuestions) * 100);

        // SIMPAN KE DATABASE
        await db.quizAttempt.create({
            data: {
                studentId: session.user.id,
                quizId: quizId,
                score,
                correct: correctCount,
                total: totalQuestions,
            }
        });

        return { 
            success: true, 
            result: { score, correctCount, totalQuestions }
        };

    } catch (error) {
        console.error(error);
        return { error: "Gagal mengirim jawaban." };
    }
}