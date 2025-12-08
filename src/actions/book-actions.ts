"use server";

import db from "@/lib/db";
import { auth } from "@/auth";

// Tipe data untuk hasil buku
export type BookData = {
  id: string;
  title: string;
  author: string;
  imageUrl: string;
  link: string;
};

export async function getBookRecommendations() {
  const session = await auth();
  if (!session || session.user.role !== "MAHASISWA") return [];

  try {
    // 1. Cari topik yang relevan (berdasarkan mata kuliah yang diambil)
    const enrollments = await db.enrollment.findMany({
      where: { studentId: session.user.id },
      include: { course: { select: { title: true } } },
      take: 1, // Ambil 1 mata kuliah terakhir untuk dijadikan keyword utama
      orderBy: { lastAccessedAt: 'desc' }
    });

    // Default keyword jika belum ambil kelas
    let keyword = "computer science"; 
    
    if (enrollments.length > 0) {
      // Ambil judul kursus, misal "Pemrograman Web Lanjut"
      keyword = enrollments[0].course.title; 
    }

    // 2. Panggil Google Books API
    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
    if (!apiKey) {
        console.error("GOOGLE_BOOKS_API_KEY belum diset di .env");
        return [];
    }

    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(keyword)}&maxResults=4&key=${apiKey}&printType=books`
    );

    if (!response.ok) return [];

    const data = await response.json();

    if (!data.items) return [];

    // 3. Format Data
    const books: BookData[] = data.items.map((item: any) => {
        const info = item.volumeInfo;
        return {
            id: item.id,
            title: info.title || "Tanpa Judul",
            // Ambil penulis pertama atau 'Unknown'
            author: info.authors ? info.authors[0] : "Unknown Author",
            // Ambil gambar thumbnail (gunakan https agar aman)
            imageUrl: info.imageLinks?.thumbnail?.replace('http:', 'https:') || "https://placehold.co/128x196?text=No+Cover",
            link: info.previewLink || info.infoLink
        };
    });

    return books;

  } catch (error) {
    console.error("Error fetching books:", error);
    return [];
  }
}