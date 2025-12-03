"use client"; 

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link'; // <-- Pastikan Link diimpor
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FileInput, Calendar, AlertCircle } from 'lucide-react';
import { mockCourses } from '@/data/mockData';

// ... (Helper formatDueDate dan getStatus tetap sama) ...
function formatDueDate(dateString: string) {
  return new Date(dateString).toLocaleString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}
function getStatus(dueDate: string) {
  const now = new Date();
  const due = new Date(dueDate);
  if (now > due) return { text: 'Terlambat', color: 'text-red-500' };
  const diffTime = Math.abs(due.getTime() - now.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays <= 3) return { text: `Tersisa ${diffDays} hari`, color: 'text-orange-500' };
  return { text: 'Belum Selesai', color: 'text-gray-500' };
}


// Halaman utama /courses/[courseId]/tugas
export default function TugasListPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const course = mockCourses.find(c => c.id === courseId);

  if (!course) return <div>Mata Kuliah tidak ditemukan.</div>;

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Daftar Tugas</CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        {course.assignments.length > 0 ? (
          <div className="space-y-4">
            {course.assignments.map((assignment) => {
              const status = getStatus(assignment.dueDate);
              return (
                <div 
                  key={assignment.id}
                  className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between hover:bg-gray-100 transition-colors"
                >
                  {/* ... (Info tugas di kiri) ... */}
                  <div className="flex items-start space-x-4 mb-4 md:mb-0">
                    <div className="p-3 bg-green-100 rounded-full">
                      <FileInput className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{assignment.title}</h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Calendar className="h-4 w-4 mr-1.5" />
                        <span>Deadline: {formatDueDate(assignment.dueDate)}</span>
                      </div>
                      <div className={`flex items-center text-sm font-medium mt-1 ${status.color}`}>
                        <AlertCircle className="h-4 w-4 mr-1.5" />
                        <span>Status: {status.text}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* --- PERBAIKAN DI SINI --- */}
                  {/* Ganti Button menjadi Link yang membungkus Button */}
                  <Link href={`/courses/${courseId}/tugas/${assignment.id}`}>
                    <Button>Lihat Detail & Upload</Button>
                  </Link>

                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">
            Belum ada tugas untuk mata kuliah ini.
          </p>
        )}
      </CardContent>
    </Card>
  );
}