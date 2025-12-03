"use client"; 

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  ArrowLeft, 
  Calendar, 
  AlertCircle, 
  CheckCircle, 
  UploadCloud,
  FileText
} from 'lucide-react';
import { mockCourses } from '@/data/mockData';

// Helper format tanggal
function formatDueDate(dateString: string) {
  return new Date(dateString).toLocaleString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}

// Helper untuk status (dummy)
// Kita anggap 'Belum Selesai'
const dummyStatus = {
  text: 'Belum Selesai',
  color: 'text-gray-500',
  icon: AlertCircle,
  grade: 'Belum Dinilai'
};

// Halaman utama /courses/[courseId]/tugas/[tugasId]
export default function TugasDetailPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const tugasId = params.tugasId as string;

  const course = mockCourses.find(c => c.id === courseId);
  const assignment = course?.assignments.find(a => a.id === tugasId);

  if (!assignment) return <div>Tugas tidak ditemukan.</div>;

  return (
    <div className="space-y-6">
      {/* Tombol Kembali */}
      <div>
        <Link href={`/courses/${courseId}/tugas`} className="flex items-center text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali ke Daftar Tugas
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Kolom Kiri: Deskripsi & Upload */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Kartu Deskripsi Tugas */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">{assignment.title}</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Gunakan 'whitespace-pre-wrap' untuk menjaga format teks (newline) */}
              <p className="text-gray-700 whitespace-pre-wrap">
                {assignment.description}
              </p>
            </CardContent>
          </Card>

          {/* Kartu Upload (UI Only) */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Upload File Tugas</CardTitle>
              <CardDescription>Upload file .zip, .pdf, .docx, atau link GitHub di text.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Fake Drag-n-Drop Zone */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-center">
                <UploadCloud className="h-12 w-12 text-gray-400" />
                <p className="mt-2 text-gray-600">
                  Tarik file ke sini, atau
                </p>
                <Button variant="secondary" className="mt-2">
                  <FileText className="h-4 w-4 mr-2" />
                  Pilih File
                </Button>
              </div>
              {/* Atau bisa juga upload link */}
              <textarea
                className="w-full h-24 p-2 border-gray-200 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Atau tempel link (misal: GitHub, Google Drive) di sini..."
              ></textarea>
            </CardContent>
          </Card>

        </div>

        {/* Kolom Kanan: Status */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-md sticky top-24">
            <CardHeader>
              <CardTitle>Status Pengumpulan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-gray-500 mr-3 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Deadline</p>
                  <p className="font-semibold text-gray-900">{formatDueDate(assignment.dueDate)}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <dummyStatus.icon className={`h-5 w-5 ${dummyStatus.color} mr-3 mt-1`} />
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p className={`font-semibold ${dummyStatus.color}`}>{dummyStatus.text}</p>
                </div>
              </div>

              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-gray-500 mr-3 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Nilai</p>
                  <p className="font-semibold text-gray-900">{dummyStatus.grade}</p>
                </div>
              </div>

              <Button className="w-full mt-4">
                Submit Tugas
              </Button>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}