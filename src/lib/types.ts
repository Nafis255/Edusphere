// Tipe untuk pengguna (user)
export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string; 
  role: 'Mahasiswa' | 'Dosen' | 'Admin';
  academicId: string;
};

// Tipe untuk materi (konten)
export type Material = {
  id: string;
  type: 'Video' | 'PDF' | 'PPT' | 'Word' | 'Text'; 
  title: string;
  duration?: string; // "30 menit" (opsional)
  videoUrl?: string; // YouTube embed URL
  pdfUrl?: string; // URL ke file PDF dummy
  documentUrl?: string;  // untuk Word & PPT
  textContent?: string;  // untuk Text
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
  createdAt: string; // "2 jam yang lalu"
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
  coverImage: string; 
  semester: string;   
  studentCount: number; 
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
  timestamp: string; // "10 menit yang lalu"
  isRead: boolean;
};

// 1. TIPE BARU UNTUK TUGAS
export type Assignment = {
  id: string;
  title: string;
  description: string;
  dueDate: string; // Tanggal deadline, "2025-11-20T23:59"
};
