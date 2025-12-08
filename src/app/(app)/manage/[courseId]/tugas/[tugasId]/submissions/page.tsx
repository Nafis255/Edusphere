"use client";

import React, { useEffect, useState, useTransition } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ArrowLeft, ExternalLink, Save, Loader2, User, FileText } from 'lucide-react';
import { getAssignmentSubmissions, gradeSubmission } from '@/actions/assignment-actions';
import { toast } from 'sonner';

export default function GradingPage() {
  const params = useParams();
  const tugasId = params.tugasId as string;
  const courseId = params.courseId as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // State lokal untuk nilai yang sedang diedit { submissionId: value }
  const [grades, setGrades] = useState<Record<string, number>>({});

  useEffect(() => {
    async function loadData() {
        const res: any = await getAssignmentSubmissions(tugasId);
        if (res) {
            setData(res);
            // Isi state awal grades
            const initialGrades: Record<string, number> = {};
            res.submissions.forEach((sub: any) => {
                if (sub.grade !== null) initialGrades[sub.id] = sub.grade;
            });
            setGrades(initialGrades);
        }
        setLoading(false);
    }
    loadData();
  }, [tugasId]);

  const handleGradeChange = (subId: string, value: string) => {
      setGrades(prev => ({ ...prev, [subId]: parseInt(value) || 0 }));
  };

  const handleSaveGrade = (subId: string, studentName: string) => {
      const score = grades[subId];
      if (score < 0 || score > 100) {
          toast.warning("Nilai Invalid", {
              description: "Silakan masukkan nilai yang valid antara 0 - 100."
          });
          return;
      }

      startTransition(async () => {
          const res = await gradeSubmission(subId, score);
          if (res.success) {
            toast.success("Nilai Tersimpan", {
                description: `Nilai untuk ${studentName} berhasil diupdate menjadi ${score}.`
            });
          } else {
            toast.error("Gagal Menyimpan", {
                description: "Terjadi kesalahan saat menyimpan nilai."
            });
          }
      });
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-500" /></div>;
  if (!data) return <div>Data tidak ditemukan.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href={`/manage/${courseId}/tugas`}>
          <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
        </Link>
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Penilaian Tugas</h1>
            <p className="text-gray-500 text-sm">{data.title}</p>
        </div>
      </div>

      <Card className="shadow-md">
        <CardHeader>
            <CardTitle>Daftar Pengumpulan ({data.submissions.length})</CardTitle>
        </CardHeader>
        <CardContent>
            {data.submissions.length === 0 ? (
                <div className="text-center py-10 text-gray-500">Belum ada mahasiswa yang mengumpulkan.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-700 uppercase font-medium">
                            <tr>
                                <th className="px-4 py-3">Mahasiswa</th>
                                <th className="px-4 py-3">Waktu Kumpul</th>
                                <th className="px-4 py-3">Link / File</th>
                                <th className="px-4 py-3">Nilai (0-100)</th>
                                <th className="px-4 py-3">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {data.submissions.map((sub: any) => (
                                <tr key={sub.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                                {sub.student.avatarUrl ? (
                                                    <img src={sub.student.avatarUrl} className="w-full h-full object-cover" />
                                                ) : <User className="h-4 w-4 text-gray-500" />}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{sub.student.name}</p>
                                                <p className="text-xs text-gray-500">{sub.student.academicId}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        {new Date(sub.submittedAt).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-col gap-2">
                                            {/* 1. Tampilkan Link jika ada */}
                                            {sub.linkUrl && (
                                                <a 
                                                    href={sub.linkUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline flex items-center gap-1 text-xs"
                                                    title={sub.linkUrl}
                                                >
                                                    <ExternalLink className="h-3 w-3" /> 
                                                    Buka Link
                                                </a>
                                            )}

                                            {/* 2. Tampilkan File jika ada (INI YANG BARU) */}
                                            {sub.fileUrl && (
                                                <a 
                                                    href={sub.fileUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-green-600 hover:underline flex items-center gap-1 text-xs"
                                                    title="Download File"
                                                >
                                                    <FileText className="h-3 w-3" /> 
                                                    Lihat File
                                                </a>
                                            )}

                                            {/* 3. Jika kosong */}
                                            {!sub.linkUrl && !sub.fileUrl && (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Input 
                                            type="number" 
                                            min="0" max="100" 
                                            className="w-20"
                                            value={grades[sub.id] ?? ""}
                                            onChange={(e) => handleGradeChange(sub.id, e.target.value)}
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        <Button 
                                            size="sm" 
                                            variant="secondary"
                                            onClick={() => handleSaveGrade(sub.id, sub.student.name)}
                                            disabled={isPending}
                                        >
                                            <Save className="h-4 w-4" />
                                        </Button>
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