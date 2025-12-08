// src/lib/types.ts

// Tipe untuk pengguna (user)
export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string; // URL ke gambar avatar
  role: 'Mahasiswa' | 'Dosen' | 'Admin';
  academicId: string;
};

// Tipe untuk materi (konten)
export type Material = {
  id: string;
  type: 'Video' | 'PDF' | 'PPT' | 'Word' | 'Text'; // <-- DIPERBARUI
  title: string;
  duration?: string; // e.g., "30 menit" (opsional)
  videoUrl?: string; // e.g., YouTube embed URL
  pdfUrl?: string; // e.g., URL ke file PDF dummy
  documentUrl?: string;  // <-- BARU: untuk Word & PPT
  textContent?: string;  // <-- BARU: untuk Text
  description: string;
  isCompleted: boolean;
  uploadedAt: string;
};

// Tipe untuk soal kuis
export type QuizQuestion = {
  id: string;
  questionText: string;
  type: 'Pilihan Ganda' | 'Benar/Salah';
  options: string[];
  correctAnswer: string;
};

// Tipe untuk kuis
export type Quiz = {
  id: string;
  title: string;
  duration: string;
  questions: QuizQuestion[];
};

// Tipe untuk thread forum
export type ForumThread = {
  id: string;
  title: string;
  content: string;
  author: User;
  createdAt: string; // e.g., "2 jam yang lalu"
  repliesCount: number;
  likesCount: number;
  replies: ForumReply[];
};

// Tipe untuk balasan forum
export type ForumReply = {
  id: string;
  author: User;
  content: string;
  createdAt: string;
  likesCount: number;
};

// Update tipe Course
export type Course = {
  id: string;
  title: string;
  instructorName: string;
  imageUrl: string;
  coverImage: string; // <--- BARU (Banner)
  semester: string;   // <--- BARU
  studentCount: number; // <--- BARU
  progress: number;
  materials: Material[];
  quizzes: Quiz[];
  forumThreads: ForumThread[];
  participants: User[];
  assignments: Assignment[];
};

// Tipe untuk data di dashboard
export type DashboardStats = {
  enrolledCourses: number;
  avgScore: number;
  totalHours: number;
  certificates: number;
};

// Tipe untuk buku rekomendasi (Google Books API Mock)
export type BookRecommendation = {
  id: string;
  title: string;
  author: string;
  imageUrl: string;
};

// TIPE BARU UNTUK NOTIFIKASI
export type Notification = {
  id: string;
  title: string;
  description: string;
  timestamp: string; // e.g., "10 menit yang lalu"
  isRead: boolean;
};

// 1. TIPE BARU UNTUK TUGAS
export type Assignment = {
  id: string;
  title: string;
  description: string;
  dueDate: string; // Tanggal deadline, e.g., "2025-11-20T23:59"
};
