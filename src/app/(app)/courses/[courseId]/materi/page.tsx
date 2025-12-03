"use client"; 

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { 
  PlayCircle, 
  FileText, 
  Calendar, 
  Presentation, // <-- BARU: Ikon PPT
  TextIcon          // <-- BARU: Ikon Teks
} from 'lucide-react'; 
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

// Komponen untuk satu item materi
function MaterialItem({ courseId, material }: { courseId: string, material: Material }) {
  
  // <-- BARU: Logika Ikon Diperbarui -->
  const getIcon = () => {
    switch (material.type) {
      case 'Video': return <PlayCircle className="h-5 w-5 text-blue-400" />;
      case 'PDF': return <FileText className="h-5 w-5 text-red-400" />;
      case 'PPT': return <Presentation className="h-5 w-5 text-orange-400" />;
      case 'Word': return <FileText className="h-5 w-5 text-blue-500" />;
      case 'Text': return <TextIcon className="h-5 w-5 text-gray-400" />;
      default: return <FileText className="h-5 w-5 text-gray-400" />;
    }
  };
  const icon = getIcon();

  return (
    <Link 
      href={`/courses/${courseId}/materi/${material.id}`}
      className="block py-4 px-2 rounded-lg hover:bg-gray-100 transition-colors"
    >
      <div className="flex items-center justify-between">
        {/* Kiri: Ikon, Judul, Info */}
        <div className="flex items-center space-x-3">
          {icon} {/* <-- Variabel ikon baru digunakan di sini */}
          <div>
            <p className="font-semibold text-gray-900">{material.title}</p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500 mt-1">
              <span>
                {material.type} {material.duration ? `(${material.duration})` : ''}
              </span>
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(material.uploadedAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Kanan: Status Selesai */}
        {material.isCompleted && (
          <span className="text-xs font-medium text-green-600 bg-green-100 px-2.5 py-0.5 rounded-full">
            Selesai
          </span>
        )}
      </div>
    </Link>
  );
}

// ... (Sisa file page.tsx biarkan sama persis) ...
export default function MateriPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const course = mockCourses.find(c => c.id === courseId);

  if (!course) return <div>Mata Kuliah tidak ditemukan.</div>;

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Course Materials</CardTitle>
      </CardHeader>
      <CardContent className="px-4"> 
        {course.materials.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {course.materials.map(material => (
              <MaterialItem key={material.id} courseId={courseId} material={material} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-4">
            Belum ada materi untuk mata kuliah ini.
          </p>
        )}
      </CardContent>
    </Card>
  );
}