"use server";

import db from "@/lib/db";
import { auth } from "@/auth";

export async function globalSearch(query: string) {
  const session = await auth();
  if (!session || !query || query.trim().length < 3) return [];

  const searchTerm = query.trim();

  try {
    // Jalankan pencarian paralel
    const [courses, materials, threads] = await Promise.all([
      // 1. Cari Mata Kuliah
      db.course.findMany({
        where: {
          OR: [
            { title: { contains: searchTerm, mode: 'insensitive' } },
            { description: { contains: searchTerm, mode: 'insensitive' } }
          ]
        },
        take: 3,
        select: { id: true, title: true }
      }),

      // 2. Cari Materi
      db.material.findMany({
        where: {
          title: { contains: searchTerm, mode: 'insensitive' }
        },
        take: 3,
        include: { course: { select: { id: true } } } // Butuh ID course untuk link
      }),

      // 3. Cari Forum
      db.thread.findMany({
        where: {
          title: { contains: searchTerm, mode: 'insensitive' }
        },
        take: 3,
        select: { id: true, title: true, courseId: true }
      })
    ]);

    // Format hasil agar seragam untuk UI
    const results = [
      ...courses.map(c => ({ 
          type: 'Mata Kuliah', 
          title: c.title, 
          href: `/courses/${c.id}/materi`, 
          icon: 'Book' 
      })),
      ...materials.map(m => ({ 
          type: 'Materi', 
          title: m.title, 
          href: `/courses/${m.course.id}/materi/${m.id}`, 
          icon: 'FileText' 
      })),
      ...threads.map(t => ({ 
          type: 'Forum', 
          title: t.title, 
          href: `/courses/${t.courseId}/forum/${t.id}`, 
          icon: 'MessageSquare' 
      }))
    ];

    return results;

  } catch (error) {
    console.error("Search error:", error);
    return [];
  }
}