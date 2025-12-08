import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@/auth"; 

const f = createUploadthing();

export const ourFileRouter = {
  // 1. Route Dosen (Materi) - Tetap
  courseAttachment: f({
    pdf: { maxFileSize: "32MB", maxFileCount: 1 },
    text: { maxFileSize: "64KB", maxFileCount: 1 }, 
    video: { maxFileSize: "256MB", maxFileCount: 1 },
    image: { maxFileSize: "4MB", maxFileCount: 1 },
    blob: { maxFileSize: "32MB", maxFileCount: 1 }, 
  })
    .middleware(async () => {
      const session = await auth();
      if (!session || session.user.role !== "DOSEN") throw new Error("Unauthorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Dosen upload:", file.url);
    }),

  // 2. Route Mahasiswa (Tugas) - BARU
  studentSubmission: f({
    pdf: { maxFileSize: "16MB", maxFileCount: 1 },
    image: { maxFileSize: "4MB", maxFileCount: 1 },
    // Izinkan semua jenis file (ZIP, RAR, DOCX, dll)
    blob: { maxFileSize: "32MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      const session = await auth();
      // Cek apakah user adalah Mahasiswa
      if (!session || session.user.role !== "MAHASISWA") throw new Error("Unauthorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Mahasiswa upload:", file.url);
    }),

  profileImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await auth();
      // Cukup cek login saja, tidak perlu cek role spesifik
      if (!session) throw new Error("Unauthorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Avatar upload by:", metadata.userId, "URL:", file.url);
    }), 

} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;