"use client"; 

import React from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  CheckCircle, 
  Type, 
  Clock, 
  Activity, 
  Calendar,
  Download,
  Presentation, 
  TextIcon,
  FileText          
} from 'lucide-react';

// Data
import { mockCourses } from '@/data/mockData';
import { Material } from '@/lib/types';

// ... (helper formatDate biarkan sama) ...
function formatDate(dateString: string) {
  try {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (e) {
    return dateString; 
  }
}

// Komponen untuk Sidebar Detail Materi
function MaterialDetails({ material }: { material: Material }) {
  
  // Logika untuk menentukan URL download -->
  let downloadUrl: string | undefined;
  let downloadFilename: string | undefined;

  if (material.type === 'PDF' && material.pdfUrl) {
    downloadUrl = material.pdfUrl;
    downloadFilename = `${material.title}.pdf`;
  } else if ((material.type === 'Word' || material.type === 'PPT') && material.documentUrl) {
    downloadUrl = material.documentUrl;
    // Ambil nama file asli dari URL
    downloadFilename = material.documentUrl.split('/').pop() || `${material.title}.file`;
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Detail Materi</CardTitle>
      </CardHeader>
      <CardContent>
        {/* List Detail */}
        <div className="space-y-4">
          {/* (Tipe, Durasi, Status) */}
          <div className="flex items-center">
            <Type className="h-5 w-5 text-gray-500 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Tipe</p>
              <p className="font-medium text-gray-900">{material.type}</p>
            </div>
          </div>
          {material.duration && (
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-gray-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Durasi</p>
                <p className="font-medium text-gray-900">{material.duration}</p>
              </div>
            </div>
          )}
          <div className="flex items-center">
            <Activity className="h-5 w-5 text-gray-500 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className={`font-medium ${material.isCompleted ? 'text-green-600' : 'text-orange-600'}`}>
                {material.isCompleted ? 'Selesai' : 'Belum Selesai'}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-gray-500 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Tanggal Upload</p>
              <p className="font-medium text-gray-900">{formatDate(material.uploadedAt)}</p>
            </div>
          </div>
        </div>

        {/* Tombol Download (PDF, Word, PPT) */}
        {downloadUrl && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <a href={downloadUrl} download={downloadFilename} className="w-full">
              <Button variant="secondary" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download Materi ({material.type})
              </Button>
            </a>
          </div>
        )}
      </CardContent> 
    </Card>
  );
}

// Halaman utama /materi/[materiId]
export default function MateriViewerPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const materiId = params.materiId as string;

  const course = mockCourses.find(c => c.id === courseId);
  const material = course?.materials.find(m => m.id === materiId);

  if (!material) return <div>Materi tidak ditemukan.</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Kolom Kiri: Konten Materi (Video/PDF) */}
      <div className="lg:col-span-2">
        <Card className="shadow-md">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">{material.title}</h2>
              <Button>
                <CheckCircle className="h-4 w-4 mr-2" />
                Tandai Selesai
              </Button>
            </div>

            {/* Logika Konten Viewer Diperbarui --> */}
            {material.type === 'Video' && material.videoUrl && (
              <div className="aspect-video">
                <iframe
                  className="w-full h-full rounded-lg"
                  src={material.videoUrl}
                  title={material.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
            
            {material.type === 'PDF' && material.pdfUrl && (
              <div className="h-[70vh]">
                <embed
                  src={material.pdfUrl}
                  type="application/pdf"
                  className="w-full h-full rounded-lg"
                />
              </div>
            )}
            
            {/* Tampilan untuk Teks */}
            {material.type === 'Text' && material.textContent && (
              <div className="p-4 bg-gray-50 rounded-lg min-h-[300px]">
                {/* 'whitespace-pre-wrap'*/
                }
                <p className="whitespace-pre-wrap font-sans text-base text-gray-800">
                  {material.textContent}
                </p>
              </div>
            )}

            {/* Tampilan untuk Word & PPT (Download Prompt) */}
            {(material.type === 'Word' || material.type === 'PPT') && material.documentUrl && (
              <div className="h-[50vh] flex flex-col items-center justify-center bg-gray-50 rounded-lg text-center p-6">
                {material.type === 'Word' ? 
                  <FileText className="h-16 w-16 text-blue-500" /> : 
                  <Presentation className="h-16 w-16 text-orange-500" />
                }
                <p className="mt-4 text-xl font-semibold text-gray-800">
                  Materi {material.type}
                </p>
                <p className="mt-2 text-gray-600">
                  Pratinjau tidak tersedia untuk file ini. Silakan download untuk melihat.
                </p>
                <a href={material.documentUrl} download={material.documentUrl.split('/').pop()}>
                  <Button className="mt-6">
                    <Download className="h-4 w-4 mr-2" />
                    Download {material.title}
                  </Button>
                </a>
              </div>
            )}
            
          </CardContent>
        </Card>
        
        {/* Deskripsi di bawah Video */}
        <Card className="mt-6 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Deskripsi</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              {material.description}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Kolom Kanan: Sidebar Detail */}
      <div className="lg:col-span-1 space-y-6">
        <MaterialDetails material={material} />
        
        {/* Catatan (Sesuai Desain) */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Catatan</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              className="w-full h-32 p-2 border-gray-200 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tulis catatan Anda di sini..."
            ></textarea>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}