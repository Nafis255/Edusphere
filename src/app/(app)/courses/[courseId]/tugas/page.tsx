"use client"; 

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FileInput, Calendar, AlertCircle, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import { getStudentAssignments } from '@/actions/student-assignment-actions'; // <-- Import action baru

// Helper format tanggal
function formatDueDate(date: Date) {
  return new Date(date).toLocaleString('id-ID', {
    day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
  });
}

export default function StudentTugasPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(!courseId) return;
    async function loadData() {
        const data = await getStudentAssignments(courseId);
        setAssignments(data);
        setLoading(false);
    }
    loadData();
  }, [courseId]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-500" /></div>;

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Daftar Tugas</CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        {assignments.length > 0 ? (
          <div className="space-y-4">
            {assignments.map((assignment) => {
              // Cek status
              const submission = assignment.submissions[0]; // Ambil submission pertama (jika ada)
              const isSubmitted = !!submission;
              const isLate = new Date() > new Date(assignment.dueDate);
              
              let statusText = "Belum Dikumpulkan";
              let statusColor = "text-gray-500";
              let StatusIcon = AlertCircle;

              if (isSubmitted) {
                  statusText = submission.grade ? `Dinilai: ${submission.grade}/100` : "Sudah Dikumpulkan";
                  statusColor = "text-green-600";
                  StatusIcon = CheckCircle;
              } else if (isLate) {
                  statusText = "Terlambat";
                  statusColor = "text-red-500";
              }

              return (
                <div 
                  key={assignment.id}
                  className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  {/* Info Kiri */}
                  <div className="flex items-start space-x-4 mb-4 md:mb-0">
                    <div className={`p-3 rounded-full ${isSubmitted ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <FileInput className={`h-6 w-6 ${isSubmitted ? 'text-green-600' : 'text-gray-500'}`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{assignment.title}</h3>
                      <div className="flex flex-wrap items-center gap-x-4 text-sm text-gray-500 mt-1">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1.5" />
                          Deadline: {formatDueDate(assignment.dueDate)}
                        </span>
                        <span className={`flex items-center font-medium ${statusColor}`}>
                          <StatusIcon className="h-4 w-4 mr-1.5" />
                          {statusText}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Tombol Kanan */}
                  <Link href={`/courses/${courseId}/tugas/${assignment.id}`}>
                    <Button variant={isSubmitted ? "secondary" : "primary"}>
                      {isSubmitted ? "Lihat Submission" : "Kerjakan Tugas"}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
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