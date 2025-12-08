"use client"; 

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  PlayCircle, 
  FileText, 
  Calendar, 
  Presentation,
  TextIcon,
  Plus,
  Edit2,
  Trash2
} from 'lucide-react';
import { mockCourses } from '@/data/mockData';
import { Material } from '@/lib/types';

// (Helper format tanggal)
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

// Komponen item materi versi Dosen (dengan tombol edit/hapus)
function EditableMaterialItem({ material }: { material: Material }) {
  
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
    <div className="block py-4 px-2 rounded-lg">
      <div className="flex items-center justify-between">
        {/* Info Materi */}
        <div className="flex items-center space-x-3">
          {icon}
          <div>
            <p className="font-semibold text-gray-900">{material.title}</p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500 mt-1">
              <span>{material.type}</span>
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(material.uploadedAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Tombol Aksi Dosen (UI Only) */}
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" className="text-blue-600 hover:bg-blue-100">
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-red-600 hover:bg-red-100">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Halaman utama /manage/[courseId]/materi
export default function ManageMateriPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const course = mockCourses.find(c => c.id === courseId);

  if (!course) return <div>Mata Kuliah tidak ditemukan.</div>;

  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold">Kelola Materi: {course.title}</CardTitle>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Tambah Materi Baru
        </Button>
      </CardHeader>
      <CardContent className="px-4"> 
        {course.materials.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {course.materials.map(material => (
              <EditableMaterialItem key={material.id} material={material} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-4">
            Belum ada materi. Klik "Tambah Materi Baru" untuk memulai.
          </p>
        )}
      </CardContent>
    </Card>
  );
}