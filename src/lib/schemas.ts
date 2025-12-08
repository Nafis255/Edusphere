import { z } from "zod";

// Skema untuk Login
export const LoginSchema = z.object({
  email: z.string().email({ message: "Email tidak valid" }),
  password: z.string().min(1, { message: "Password diperlukan" }),
});

// Skema untuk Register
export const RegisterSchema = z.object({
  name: z.string().min(1, { message: "Nama diperlukan" }),
  email: z.string().email({ message: "Email tidak valid" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
  role: z.enum(["MAHASISWA", "DOSEN"]), // Sesuai ENUM di Prisma
});