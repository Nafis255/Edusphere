"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import db from "@/lib/db";
import { signIn, signOut } from "@/auth"; // Import auth helpers
import { AuthError } from "next-auth";
import { sendVerificationEmail } from "@/lib/mail"; 

// --- SCHEMA DEFINITIONS ---

// Schema Login
const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password diperlukan"),
});

// Schema Register (Validasi .ac.id)
const RegisterSchema = z.object({
  name: z.string().min(1, "Nama diperlukan"),
  email: z.string().email()
    .refine((val) => val.endsWith(".ac.id"), {
      message: "Hanya email kampus (.ac.id) yang diperbolehkan.",
    }),
  password: z.string().min(6, "Password minimal 6 karakter"),
  role: z.enum(["MAHASISWA", "DOSEN"]),
});

// Helper Generate OTP (6 Digit)
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();


// --- 1. ACTION REGISTER (Kirim OTP) ---
export async function register(values: z.infer<typeof RegisterSchema>) {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: validatedFields.error.issues[0].message };
  }

  const { email, password, name, role } = validatedFields.data;

  const config = await db.systemConfig.findUnique({ where: { id: "global" } });
  
  // Jika config ada DAN allowRegistration = false
  if (config && !config.allowRegistration) {
      return { error: "Pendaftaran sedang ditutup oleh Admin." };
  }

  // Cek user sudah ada atau belum
  const existingUser = await db.user.findUnique({ where: { email } });
  if (existingUser) return { error: "Email sudah digunakan!" };

  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Generate Academic ID Dummy
  const academicIdDummy = role === "MAHASISWA" ? `MHS-${Date.now()}` : `DSN-${Date.now()}`;

  // Simpan User (emailVerified: null)
  await db.user.create({
    data: {
      name, 
      email, 
      password: hashedPassword, 
      role, 
      academicId: academicIdDummy,
      avatarUrl: `https://ui-avatars.com/api/?name=${name}`,
      emailVerified: null, // Belum verifikasi
    },
  });

  // Generate & Simpan OTP
  const token = generateOtp();
  const expires = new Date(new Date().getTime() + 10 * 60 * 1000); // 10 menit

  // Hapus token lama user ini jika ada (bersih-bersih)
  await db.verificationToken.deleteMany({ where: { email } });

  await db.verificationToken.create({
    data: { email, token, expires }
  });

  // Kirim Email
  try {
    await sendVerificationEmail(email, token);
    return { success: true, email }; 
  } catch (error) {
    console.error("Mail Error:", error);
    return { error: "Gagal mengirim email verifikasi." };
  }
}


// --- 2. ACTION VERIFIKASI OTP ---
export async function verifyOtp(email: string, token: string) {
  const existingToken = await db.verificationToken.findFirst({
    where: { email, token }
  });

  if (!existingToken) {
    return { error: "Kode OTP salah!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { error: "Kode OTP sudah kadaluarsa!" };
  }

  const existingUser = await db.user.findUnique({ where: { email } });
  if (!existingUser) return { error: "Email tidak ditemukan" };

  // Update User jadi Verified
  await db.user.update({
    where: { id: existingUser.id },
    data: { 
      emailVerified: new Date(),
      email: existingToken.email 
    }
  });

  // Hapus Token
  await db.verificationToken.delete({ where: { id: existingToken.id } });

  return { success: true };
}


// --- 3. ACTION LOGIN ---
export async function login(values: z.infer<typeof LoginSchema>) {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Input tidak valid!" };
  }

  const { email, password } = validatedFields.data;

  try {
    // redirect: false agar frontend bisa handle refresh/hard reload
    await signIn("credentials", {
      email,
      password,
      redirect: false, 
    });
    
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Email atau password salah!" };
        default:
          return { error: "Terjadi kesalahan sistem!" };
      }
    }
    throw error;
  }
}


// --- 4. ACTION LOGOUT ---
export async function logout() {
  await signOut({ redirectTo: "/" });
}