"use server";

import { z } from "zod";
import db from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { MaterialType } from "@prisma/client";

// Skema Validasi
const MaterialSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  // Pastikan enum valid
  type: z.nativeEnum(MaterialType), 
  description: z.string().optional(),
  // Izinkan string kosong atau undefined, lalu transform ke undefined jika kosong
  videoUrl: z.string().optional().or(z.literal("")), 
  fileUrl: z.string().optional().or(z.literal("")),
  textContent: z.string().optional().or(z.literal("")),
});

export async function createMaterial(courseId: string, formData: FormData) {
  const session = await auth();
  
  if (!session || session.user.role !== "DOSEN") {
    return { error: "Unauthorized" };
  }

  // Cek kepemilikan course
  const course = await db.course.findUnique({
    where: { id: courseId, instructorId: session.user.id }
  });

  if (!course) return { error: "Mata kuliah tidak ditemukan atau bukan milik Anda." };

  // Helper untuk membersihkan input kosong
  // formData.get mengembalikan 'null' jika field tidak ada di form HTML
  const getValue = (key: string) => {
    const value = formData.get(key);
    if (!value || value === "") return undefined;
    return value as string;
  };

  const rawData = {
    title: formData.get("title"),
    type: formData.get("type"), // Ini harus match dengan enum (VIDEO, PDF, dst)
    description: getValue("description"),
    videoUrl: getValue("videoUrl"),
    fileUrl: getValue("fileUrl"), 
    textContent: getValue("textContent"),
  };

  // Debugging: Cek apa yang sebenarnya diterima server
  console.log("Raw Data Material:", rawData);

  const validated = MaterialSchema.safeParse(rawData);

  if (!validated.success) {
    // Tampilkan error detail di console server untuk debugging
    console.error("Validation Error:", validated.error.flatten());
    return { error: "Input tidak valid. Pastikan semua field wajib diisi." };
  }

  const data = validated.data;

  // Validasi Tambahan: Pastikan field yang sesuai tipe terisi
  // Contoh: Kalau tipe VIDEO, videoUrl wajib ada
  if (data.type === "VIDEO" && !data.videoUrl) {
      return { error: "URL Video wajib diisi untuk tipe Video." };
  }
  if ((data.type === "PDF" || data.type === "PPT") && !data.fileUrl) {
      return { error: "URL File wajib diisi untuk tipe PDF/PPT." };
  }
  if (data.type === "TEXT" && !data.textContent) {
      return { error: "Konten teks wajib diisi." };
  }

  try {
    await db.material.create({
      data: {
        title: data.title,
        type: data.type,
        description: data.description || "",
        videoUrl: data.videoUrl, 
        fileUrl: data.fileUrl,   
        textContent: data.textContent,
        courseId: courseId,
      },
    });
  } catch (error) {
    console.error("Error creating material:", error);
    return { error: "Gagal menyimpan materi ke database." };
  }

  revalidatePath(`/manage/${courseId}/materi`);
  redirect(`/manage/${courseId}/materi`);
}

// ... (sisanya getMaterials dan deleteMaterial tetap sama) ...
export async function getMaterials(courseId: string) {
    const session = await auth();
    if (!session) return [];
  
    try {
      const materials = await db.material.findMany({
        where: { courseId },
        orderBy: { createdAt: 'desc' },
      });
      return materials;
    } catch (error) {
      return [];
    }
}
  
export async function deleteMaterial(materialId: string, courseId: string) {
    const session = await auth();
    if (!session || session.user.role !== "DOSEN") return { error: "Unauthorized" };

    try {
        await db.material.delete({
            where: { id: materialId }
        });
        revalidatePath(`/manage/${courseId}/materi`);
        return { success: true };
    } catch (error) {
        return { error: "Gagal menghapus" };
    }
}

// 4. Update Materi
export async function updateMaterial(materialId: string, courseId: string, formData: FormData) {
    const session = await auth();
    if (!session || session.user.role !== "DOSEN") return { error: "Unauthorized" };

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    // ... ambil field lain sesuai tipe ...

    try {
        await db.material.update({
            where: { id: materialId },
            data: { 
                title, 
                description,
                // Update field lain jika perlu (url, textContent, dll)
            }
        });
      } catch (error) {
        console.error("Error updating material:", error);
        return { error: "Gagal update." };
      }
    revalidatePath(`/manage/${courseId}/materi`);
    redirect(`/manage/${courseId}/materi`);
}

// 5. Ambil Detail Materi (Untuk Edit)
export async function getMaterialById(materialId: string) {
  const session = await auth();
  if (!session || session.user.role !== "DOSEN") return null;

  try {
    const material = await db.material.findUnique({
      where: { id: materialId },
    });
    return material;
  } catch (error) {
    return null;
  }
}