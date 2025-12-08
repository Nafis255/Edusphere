"use server";

import { z } from "zod";
import db from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Skema Validasi
const CourseSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  semester: z.string().min(1, "Semester harus diisi"),
  coverImage: z.string().url("URL gambar tidak valid").optional().or(z.literal("")),
});

export async function createCourse(formData: FormData) {
  const session = await auth();
  
  if (!session || session.user.role !== "DOSEN") {
    return { error: "Unauthorized" };
  }

  // Ambil data dari form
  const rawData = {
    title: formData.get("title"),
    description: formData.get("description"),
    semester: formData.get("semester"),
    coverImage: formData.get("coverImage"),
  };

  // Validasi
  const validatedFields = CourseSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return { error: "Input tidak valid. Periksa kembali data Anda." };
  }

  const { title, description, semester, coverImage } = validatedFields.data;

  try {
    // Simpan ke DB
    await db.course.create({
      data: {
        title,
        description,
        semester,
        coverImage: coverImage || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80", // Default image
        instructorId: session.user.id,
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    return { error: "Gagal membuat mata kuliah." };
  }

  // Refresh cache halaman manage
  revalidatePath("/manage");
  
  // Redirect kembali ke halaman manage
  redirect("/manage");
}

export async function getMyCourses() {
  const session = await auth();
  
  if (!session || !session.user) return [];

  try {
    const courses = await db.course.findMany({
      where: {
        instructorId: session.user.id,
      },
      include: {
        _count: {
          select: {
            enrollments: true, // Hitung jumlah mahasiswa
            materials: true,
            quizzes: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      }
    });
    return courses;
  } catch (error) {
    return [];
  }
}

export async function getCourseById(courseId: string) {
  const session = await auth();
  if (!session || !session.user) return null;

  try {
    const course = await db.course.findUnique({
      where: {
        id: courseId,
        instructorId: session.user.id, // Pastikan hanya pemilik yang bisa akses
      },
    });
    return course;
  } catch (error) {
    console.error("Error fetching course:", error);
    return null;
  }
}

// ... (imports lama)

// --- TAMBAHAN DI BAWAH ---

// 3. Update Mata Kuliah (Settings)
export async function updateCourse(courseId: string, formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== "DOSEN") return { error: "Unauthorized" };

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const semester = formData.get("semester") as string;
  const coverImage = formData.get("coverImage") as string;
  const enrollmentKey = formData.get("enrollmentKey") as string;

  if (!title || title.length < 3) return { error: "Judul minimal 3 karakter." };

  try {
    await db.course.update({
      where: { 
        id: courseId,
        instructorId: session.user.id // Pastikan milik sendiri
      },
      data: {
        title,
        description,
        semester,
        coverImage: coverImage || undefined,
        enrollmentKey: enrollmentKey || null, // Kosongkan jika user menghapus
      }
    });

    revalidatePath(`/manage/${courseId}/settings`);
    revalidatePath(`/manage`); // Update juga list di dashboard
    return { success: true };
  } catch (error) {
    return { error: "Gagal mengupdate pengaturan." };
  }
}

// 4. Hapus Mata Kuliah
export async function deleteCourse(courseId: string) {
    const session = await auth();
    if (!session || session.user.role !== "DOSEN") return { error: "Unauthorized" };

    try {
        await db.course.delete({
            where: { 
                id: courseId,
                instructorId: session.user.id 
            }
        });
        revalidatePath("/manage");
        return { success: true };
    } catch (error) {
        return { error: "Gagal menghapus mata kuliah." };
    }
}