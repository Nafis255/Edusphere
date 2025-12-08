"use client"; 

import React from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FileInput, Calendar, Plus, Edit2, Trash2 } from 'lucide-react';
import { mockCourses } from '@/data/mockData';
import { Assignment } from '@/lib/types';

// Helper format tanggal
function formatDueDate(dateString: string) {
  return new Date(dateString).toLocaleString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}

// Komponen item tugas versi Dosen
function EditableAssignmentItem({ assignment }: { assignment: Assignment }) {
  return (
    <div className="block py-4 px-2 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileInput className="h-5 w-5 text-green-500" />
          <div>
            <p className="font-semibold text-gray-900">{assignment.title}</p>
            <div className="flex items-center gap-x-2 text-sm text-gray-500 mt-1">
              <Calendar className="h-4 w-4" />
              <span>Deadline: {formatDueDate(assignment.dueDate)}</span>
            </div>
          </div>
        </div>
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

// Halaman utama /manage/[courseId]/tugas
export default function ManageTugasPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const course = mockCourses.find(c => c.id === courseId);

  if (!course) return <div>Mata Kuliah tidak ditemukan.</div>;

  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold">Kelola Tugas: {course.title}</CardTitle>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Buat Tugas Baru
        </Button>
      </CardHeader>
      <CardContent className="px-4"> 
        {course.assignments.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {course.assignments.map(assignment => (
              <EditableAssignmentItem key={assignment.id} assignment={assignment} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-4">
            Belum ada tugas. Klik "Buat Tugas Baru" untuk memulai.
          </p>
        )}
      </CardContent>
    </Card>
  );
}