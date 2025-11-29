// src/data/mockData.ts
import { User, Course, DashboardStats, BookRecommendation, ForumThread } from '@/lib/types';

// --- DATA PENGGUNA (USER) ---
export const mockStudentUser: User = {
  id: 'user_siti_rahayu',
  name: 'Siti Rahayu',
  email: 'siti@student.edusphere.com',
  avatarUrl: '/avatars/siti.png', 
  role: 'Mahasiswa',
  academicId: '13020210001',
};

// --- DATA PENGGUNA TAMBAHAN UNTUK PESERTA ---
export const mockDosen: User = {
  id: 'user_budi',
  name: 'Dr. Budi Santoso',
  email: 'budi@dosen.edusphere.com',
  avatarUrl: '/avatars/dosen.png',
  role: 'Dosen',
  academicId: '0012345678',
};

export const mockStudent2: User = {
  id: 'user_ahmad',
  name: 'Ahmad Fauzi',
  email: 'ahmad@student.edusphere.com',
  avatarUrl: '/avatars/ahmad.png',
  role: 'Mahasiswa',
  academicId: '13020210002',
};

export const mockStudent3: User = {
  id: 'user_rina',
  name: 'Rina Wijaya',
  email: 'rina@student.edusphere.com',
  avatarUrl: '/avatars/rina.png',
  role: 'Mahasiswa',
  academicId: '13020210003',
};

// --- DATA DASHBOARD ---
export const mockDashboardStats: DashboardStats = {
  enrolledCourses: 5,
  avgScore: 85.2,
  totalHours: 127,
  certificates: 2,
};

// --- DATA KURSUS (COURSES) ---
export const mockCourses: Course[] = [
  {
id: 'web-lanjut',
    title: 'Pemrograman Web Lanjut',
    instructorName: 'Dr. Budi Santoso',
    imageUrl: '/images/course-web.jpg',
    coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80', 
    semester: 'Ganjil 2024/2025',
    studentCount: 234,
    progress: 65,
    materials: [
      {
        id: 'm1',
        type: 'Video',
        title: 'State Management dengan Context API',
        duration: '30 menit',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', 
        description: 'Mengelola state global aplikasi React tanpa library eksternal.',
        isCompleted: true,
        uploadedAt: '2025-11-01',
      },
      {
        id: 'm2',
        type: 'PDF',
        title: 'React Hooks Deep Dive',
        pdfUrl: '/files/dummy.pdf', 
        description: 'Membahas useEffect, useState, dan custom hooks.',
        isCompleted: false,
        uploadedAt: '2025-11-03',
      },
      {
        id: 'm3',
        type: 'PPT',
        title: 'Presentasi UI/UX Principles',
        documentUrl: '/files/dummy-slides.pptx', 
        description: 'Slide presentasi mengenai prinsip-prinsip dasar UI/UX.',
        isCompleted: false,
        uploadedAt: '2025-11-05',
      },
      {
        id: 'm4',
        type: 'Word',
        title: 'Dokumen Spesifikasi Proyek',
        documentUrl: '/files/dummy-spec.docx', 
        isCompleted: false,
        uploadedAt: '2025-11-06',
        description: 'Template dokumen untuk spesifikasi fungsional proyek.',
      },
      {
        id: 'm5',
        type: 'Text',
        title: 'Catatan Penting & Kumpulan Link',
        textContent: 'Ini adalah catatan teks sederhana.\n\nAnda bisa menambahkan link di sini:\n\nhttps://google.com\n\nhttps://nextjs.org\n\nPastikan untuk mereview materi sebelumnya.',
        description: 'Beberapa catatan penting dan link referensi eksternal.',
        isCompleted: false,
        uploadedAt: '2025-11-07',
      }
    ],
    quizzes: [
      {
        id: 'q1',
        title: 'Quiz React Fundamentals',
        duration: '30 Menit',
        questions: [
          {
            id: 'q1-1',
            questionText: 'Apa fungsi utama dari useState hook?',
            type: 'Pilihan Ganda',
            options: [
              'Mengelola side effects',
              'Mengelola state component',
              'Melakukan HTTP requests',
              'Mengelola routing',
            ],
            correctAnswer: 'Mengelola state component',
          },
          {
            id: 'q1-2',
            questionText: 'Manakah yang BUKAN merupakan React Hook?',
            type: 'Pilihan Ganda',
            options: ['useState', 'useEffect', 'useClass', 'useCallback'],
            correctAnswer: 'useClass',
          },
          {
            id: 'q1-3',
            questionText: 'useEffect dependency array yang kosong ([]) berarti...',
            type: 'Pilihan Ganda',
            options: [
              'Jalankan setiap render',
              'Jalankan hanya sekali saat mount',
              'Jalankan saat unmount',
              'Menyebabkan infinite loop',
            ],
            correctAnswer: 'Jalankan hanya sekali saat mount',
          },
        ],
      },
    ],
    forumThreads: [
      {
        id: 't1',
        title: 'Bagaimana cara optimal menggunakan useEffect?',
        content: 'Saya masih bingung kapan harus menggunakan useEffect dan bagaimana menghindari infinite loop. Ada yang bisa jelaskan?',
        author: mockStudentUser,
        createdAt: '2 jam yang lalu',
        repliesCount: 2,
        likesCount: 15,
        replies: [
          {
            id: 'r1',
            author: mockDosen,
            content: 'useEffect digunakan untuk side effects seperti fetch data atau subscribe events. Pastikan untuk memberikan dependency array yang tepat untuk menghindari infinite loop.',
            createdAt: '1 jam yang lalu',
            likesCount: 8,
          },
          {
            id: 'r2',
            author: mockStudent2,
            content: 'Tambahan: gunakan empty array [] jika ingin effect hanya run sekali saat mount.',
            createdAt: '45 menit yang lalu',
            likesCount: 5,
          },
        ],
      },
    ],
    participants: [
      mockDosen,
      mockStudentUser, 
      mockStudent2,
      mockStudent3
    ],
    assignments: [
      {
        id: 'a1',
        title: 'Tugas 1: HTML & CSS',
        description: 'Buatlah replika halaman login Edusphere menggunakan HTML & CSS murni. Kumpulkan dalam bentuk file .zip.',
        dueDate: '2025-11-20T23:59',
      },
      {
        id: 'a2',
        title: 'Tugas 2: React Components',
        description: 'Buat komponen Card dan Button yang reusable dengan React. Kumpulkan link ke repository GitHub Anda.',
        dueDate: '2025-11-28T23:59',
      }
    ],
  },
  {
id: 'data-science',
    title: 'Data Science & Analytics',
    instructorName: 'Dr. Budi Santoso',
    imageUrl: '/images/course-data.jpg',
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    semester: 'Ganjil 2024/2025',
    studentCount: 180,
    progress: 40,
    materials: [],
    quizzes: [],
    forumThreads: [],
    participants: [ 
      mockDosen,
      mockStudentUser
    ],
    assignments: [],
    
  },
  {
id: 'mobile-app',
    title: 'Mobile App Development',
    instructorName: 'Dr. Budi Santoso',
    imageUrl: '/images/course-mobile.jpg',
    coverImage: 'https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1200&q=80',
    semester: 'Genap 2024',
    studentCount: 150,
    progress: 0,
    materials: [],
    quizzes: [],
    forumThreads: [],
    participants: [ 
      mockDosen,
      mockStudentUser,
      mockStudent2
    ],
    assignments: [],
  },
];

// --- DATA UNTUK HALAMAN FORUM (LIST) ---
export const mockForumList: ForumThread[] = [
  ...mockCourses[0].forumThreads, 
  {
    id: 't2',
    title: 'Rekomendasi library untuk form validation?',
    content: 'Saya sedang develop form yang cukup kompleks. Ada rekomendasi library yang bagus?',
    author: mockStudent3,
    createdAt: '5 jam yang lalu',
    repliesCount: 1,
    likesCount: 10,
    replies: [],
  },
];

// --- DATA REKOMENDASI BUKU (MOCK GOOGLE BOOKS API) ---
export const mockBookRecommendations: BookRecommendation[] = [
  {
    id: 'book1',
    title: 'Eloquent JavaScript',
    author: 'Marijn Haverbeke',
    imageUrl: '/images/book-eloquent.jpg',
  },
  {
    id: 'book2',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    imageUrl: '/images/book-clean.jpg',
  },
  {
    id: 'book3',
    title: 'Design Patterns',
    author: 'Gang of Four',
    imageUrl: '/images/book-design.jpg',
  },
    {
    id: 'book4',
    title: 'Design Patterns',
    author: 'Gang of Four',
    imageUrl: '/images/book-design.jpg',
  },
];

// --- DATA UNTUK INFO CARD DASHBOARD ---
export const mockUpcomingDeadlines = [
  { id: 'd1', title: 'Quiz TypeScript', subtitle: 'Web Development', badge: '2 hari lagi' },
  { id: 'd2', title: 'Assignment Data Analysis', subtitle: 'Data Science', badge: '5 hari lagi' },
  { id: 'd3', title: 'Project Final', subtitle: 'Mobile Development', badge: '1 minggu lagi' },
];

export const mockRecentAchievements = [
  { id: 'a1', title: 'Completed React Fundamentals', subtitle: '2 hari lalu' },
  { id: 'a2', title: 'Score 95 on TypeScript Quiz', subtitle: '3 hari lalu' },
  { id: 'a3', title: 'Finished 10 Materials', subtitle: '1 minggu lalu' },
];

// --- DATA UNTUK HALAMAN ANALYTICS GLOBAL ---
export const mockGlobalAnalytics = {
  // Data untuk chart progres mata kuliah
  courseProgressData: [
    { name: 'Web Lanjut', progress: 65 },
    { name: 'Data Science', progress: 40 },
    { name: 'Mobile App', progress: 0 },
  ],
  // Data untuk chart skor kuis
  quizScoreData: [
    { name: 'Quiz 1', score: 80 },
    { name: 'Quiz 2', score: 95 },
    { name: 'Quiz 3', score: 70 },
  ],
  // Data untuk waktu belajar
  studyTimeData: [
    { day: 'Sen', hours: 2 },
    { day: 'Sel', hours: 3.5 },
    { day: 'Rab', hours: 1.5 },
    { day: 'Kam', hours: 4 },
    { day: 'Jum', hours: 2.5 },
    { day: 'Sab', hours: 5 },
    { day: 'Min', hours: 1 },
  ]
};

// --- DATA STATISTIK UNTUK HALAMAN ANALYTICS ---
export const mockAnalyticsStats = {
  completedCourses: 0,
  inProgressCourses: 6,
  totalStudyHours: 23.7,
  averageProgress: 49,
};

// --- DATA BARU UNTUK NOTIFIKASI DROPDOWN ---
export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    title: 'Materi Baru Tersedia',
    description: 'Materi "React Router & Navigation" sudah bisa diakses',
    timestamp: '10 menit yang lalu',
    isRead: false, 
  },
  {
    id: 'n2',
    title: 'Quiz Selesai',
    description: 'Anda mendapat nilai 85 pada Quiz React Fundamentals',
    timestamp: '2 jam yang lalu',
    isRead: false,
  },
  {
    id: 'n3',
    title: 'Deadline Mendekati',
    description: 'Quiz TypeScript Basics akan ditutup dalam 2 hari',
    timestamp: '1 hari yang lalu',
    isRead: true, 
  },
];

// --- DATA UNTUK DASHBOARD DOSEN ---
export const mockDosenStats = {
  totalCourses: 3,
  totalStudents: 152, 
  totalMaterials: 25,
  totalQuizzes: 6,
};

// Data untuk aktivitas terbaru (Dosen)
export const mockDosenActivity = [
  { id: 'a1', text: 'Mahasiswa "Siti Rahayu" submit Quiz React Fundamentals', time: '15 menit yang lalu' },
  { id: 'a2', text: 'Diskusi baru di "Pemrograman Web Lanjut"', time: '1 jam yang lalu' },
  { id: 'a3', text: '12 mahasiswa baru mendaftar di "Data Science"', time: '3 jam yang lalu' },
];

// --- DATA USER ADMIN ---
export const mockAdmin: User = {
  id: 'user_admin',
  name: 'Admin Edusphere',
  email: 'admin@edusphere.com',
  avatarUrl: '/avatars/admin.png', 
  role: 'Admin',
  academicId: 'ADMIN-001',
};

// --- DATA UNTUK DASHBOARD ADMIN ---
export const mockAdminStats = {
  totalUsers: 156, 
  totalDosen: 4,
  totalMahasiswa: 152,
  totalCourses: 8, 
};

// --- DATA UNTUK MANAJEMEN USER ADMIN ---
export const mockAllUsers: User[] = [
  mockStudentUser,
  mockDosen,
  mockStudent2,
  mockStudent3,
  mockAdmin,
  {
    id: 'user_dummy_1',
    name: 'Budi Hartono',
    email: 'budi.h@student.edusphere.com',
    avatarUrl: '/avatars/dummy1.png',
    role: 'Mahasiswa',
    academicId: '13020210004',
  },
  {
    id: 'user_dummy_2',
    name: 'Prof. Dr. Irawan',
    email: 'irawan@dosen.edusphere.com',
    avatarUrl: '/avatars/dummy2.png',
    role: 'Dosen',
    academicId: '0098765432',
  },
];