"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ClipboardCheck, Clock, ChevronRight, Loader2 } from 'lucide-react';
import { getStudentQuizzes } from '@/actions/student-quiz-actions';

export default function StudentQuizListPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(!courseId) return;
    async function loadData() {
        const data = await getStudentQuizzes(courseId);
        setQuizzes(data);
        setLoading(false);
    }
    loadData();
  }, [courseId]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-500" /></div>;

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Daftar Kuis</CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        {quizzes.length > 0 ? (
          <div className="space-y-4">
            {quizzes.map((quiz) => (
              <div 
                key={quiz.id}
                className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start space-x-4 mb-4 md:mb-0">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <ClipboardCheck className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{quiz.title}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1 space-x-4">
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {quiz.duration} Menit
                      </span>
                      <span>{quiz.questions.length} Soal</span>
                    </div>
                  </div>
                </div>

                <Link href={`/courses/${courseId}/kuis/${quiz.id}`}>
                  <Button className="w-full md:w-auto">
                    Mulai Kuis
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">
            Belum ada kuis untuk mata kuliah ini.
          </p>
        )}
      </CardContent>
    </Card>
  );
}