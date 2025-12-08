"use server";

import db from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// Middleware Check Admin
async function checkAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session;
}

// 1. Get Global Stats
export async function getAdminStats() {
  try {
    await checkAdmin();

    // Jalankan query paralel biar cepat
    const [totalUsers, totalDosen, totalMahasiswa, totalCourses] = await db.$transaction([
      db.user.count(),
      db.user.count({ where: { role: "DOSEN" } }),
      db.user.count({ where: { role: "MAHASISWA" } }),
      db.course.count(),
    ]);

    return {
      totalUsers,
      totalDosen,
      totalMahasiswa,
      totalCourses
    };
  } catch (error) {
    return null;
  }
}

// 2. Get All Users (untuk tabel)
export async function getAllUsers() {
  try {
    await checkAdmin();
    return await db.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        academicId: true,
        avatarUrl: true,
        createdAt: true,
      }
    });
  } catch (error) {
    return [];
  }
}

// 3. Delete User
export async function deleteUser(userId: string) {
  try {
    await checkAdmin();
    await db.user.delete({ where: { id: userId } });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    return { error: "Gagal menghapus user." };
  }
}

// 4. Get All Courses (untuk tabel admin)
export async function getAllCoursesAdmin() {
    try {
        await checkAdmin();
        return await db.course.findMany({
            include: {
                instructor: { select: { name: true } },
                _count: { select: { enrollments: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
    } catch (error) {
        return [];
    }
}

// 5. Delete Course (Admin Force Delete)
export async function deleteCourseAdmin(courseId: string) {
    try {
        await checkAdmin();
        await db.course.delete({ where: { id: courseId } });
        revalidatePath("/admin/courses");
        return { success: true };
    } catch (error) {
        return { error: "Gagal menghapus mata kuliah." };
    }
}