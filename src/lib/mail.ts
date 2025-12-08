import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Masukkan email gmail anda di .env
    pass: process.env.EMAIL_PASS, // Masukkan App Password gmail anda di .env
  },
});

export const sendVerificationEmail = async (email: string, token: string) => {
  const mailOptions = {
    from: '"Edusphere Security" <no-reply@edusphere.com>',
    to: email,
    subject: "Verifikasi Akun Edusphere",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Verifikasi Email Anda</h2>
        <p>Gunakan kode OTP berikut untuk menyelesaikan pendaftaran:</p>
        <h1 style="color: #2563eb; letter-spacing: 5px;">${token}</h1>
        <p>Kode ini akan kadaluarsa dalam 10 menit.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};