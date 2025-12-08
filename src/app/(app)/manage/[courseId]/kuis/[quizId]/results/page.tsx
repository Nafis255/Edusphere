"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, User, Trophy, Loader2 } from 'lucide-react';
import { getQuizResults } from '@/actions/quiz-actions';

export default function QuizResultsPage() {
  const params = useParams();
  const quizId = params.quizId as string;
  const courseId = params.courseId as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
        const res = await getQuizResults(quizId);
        setData(res);
        setLoading(false);
    }
    loadData();
  }, [quizId]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-500" /></div>;
  if (!data) return <div>Data tidak ditemukan.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/manage/${courseId}/kuis`}>
            <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
        </Link>
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Rekap Nilai</h1>
            <p className="text-gray-500 text-sm">{data.quizTitle}</p>
        </div>
      </div>

      <Card className="shadow-md">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Daftar Mahasiswa ({data.results.length})
            </CardTitle>
        </CardHeader>
        <CardContent>
            {data.results.length === 0 ? (
                <div className="text-center py-10 text-gray-500">Belum ada mahasiswa yang mengerjakan.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-700 uppercase font-medium">
                            <tr>
                                <th className="px-4 py-3">Peringkat</th>
                                <th className="px-4 py-3">Mahasiswa</th>
                                <th className="px-4 py-3">Benar / Total</th>
                                <th className="px-4 py-3">Waktu Selesai</th>
                                <th className="px-4 py-3">Skor Akhir</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {data.results.map((res: any, idx: number) => (
                                <tr key={res.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-bold text-gray-500">#{idx + 1}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                                {res.student.avatarUrl ? (
                                                    <img src={res.student.avatarUrl} className="w-full h-full object-cover" />
                                                ) : <User className="h-4 w-4 text-gray-500" />}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{res.student.name}</p>
                                                <p className="text-xs text-gray-500">{res.student.academicId}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        {res.correct} / {res.total}
                                    </td>
                                    <td className="px-4 py-3 text-gray-500">
                                        {new Date(res.completedAt).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${res.score >= 70 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {res.score}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}