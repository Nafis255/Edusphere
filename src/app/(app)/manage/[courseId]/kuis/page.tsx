"use client"; 

import React from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  ClipboardCheck, 
  Clock,
  Plus,
  Edit2,
  Trash2
} from 'lucide-react';
import { mockCourses } from '@/data/mockData';
import { Quiz } from '@/lib/types';

// Komponen item kuis versi Dosen
function EditableQuizItem({ quiz }: { quiz: Quiz }) {
  return (
    <div className="block py-4 px-2 rounded-lg">
      <div className="flex items-center justify-between">
        {/* Info Kuis */}
        <div className="flex items-center space-x-3">
          <ClipboardCheck className="h-5 w-5 text-blue-400" />
          <div>
            <p className="font-semibold text-gray-900">{quiz.title}</p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500 mt-1">
              <span>{quiz.questions.length} Soal</span>
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {quiz.duration}
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

// Halaman utama /manage/[courseId]/kuis
export default function ManageKuisPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const course = mockCourses.find(c => c.id === courseId);

  if (!course) return <div>Mata Kuliah tidak ditemukan.</div>;

  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold">Kelola Kuis: {course.title}</CardTitle>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Tambah Kuis Baru
        </Button>
      </CardHeader>
      <CardContent className="px-4"> 
        {course.quizzes.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {course.quizzes.map(quiz => (
              <EditableQuizItem key={quiz.id} quiz={quiz} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-4">
            Belum ada kuis. Klik "Tambah Kuis Baru" untuk memulai.
          </p>
        )}
      </CardContent>
    </Card>
  );
}