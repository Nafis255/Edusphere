"use client"; 

import React, { useEffect, useState, useTransition } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  ArrowLeft, Calendar, AlertCircle, CheckCircle, 
  Link as LinkIcon, Loader2, UploadCloud, FileText, X
} from 'lucide-react';
import { getAssignmentDetailForStudent, submitAssignment } from '@/actions/student-assignment-actions';
import { UploadButton } from '@/lib/uploadthing'; // Import UploadThing
import { toast } from 'sonner';

function formatDueDate(date: Date) {
  return new Date(date).toLocaleString('id-ID', {
    day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
  });
}

export default function StudentAssignmentDetailPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const tugasId = params.tugasId as string;

  const [assignment, setAssignment] = useState<any>(null);
  const [submission, setSubmission] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [isPending, startTransition] = useTransition();
  
  // State Input Hybrid
  const [inputMode, setInputMode] = useState<'LINK' | 'FILE'>('FILE'); // Default Upload
  const [linkUrl, setLinkUrl] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [fileName, setFileName] = useState(""); // Nama file untuk display

  // Fetch Data
  useEffect(() => {
    if(!tugasId) return;
    async function loadData() {
        const data = await getAssignmentDetailForStudent(tugasId);
        if (data) {
            setAssignment(data);
            if (data.submissions && data.submissions.length > 0) {
                const sub = data.submissions[0];
                setSubmission(sub);
                // Pre-fill data lama
                if (sub.fileUrl) {
                    setFileUrl(sub.fileUrl);
                    setInputMode('FILE');
                    setFileName("File Tugas Sebelumnya");
                } else if (sub.linkUrl) {
                    setLinkUrl(sub.linkUrl);
                    setInputMode('LINK');
                }
            }
        }
        setLoading(false);
    }
    loadData();
  }, [tugasId]);

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      // Validasi Manual
      if (inputMode === 'LINK' && !linkUrl) {
          toast.error("Link Kosong", { description: "Harap masukkan URL tugas Anda." });
          return;
      }
      if (inputMode === 'FILE' && !fileUrl) {
          toast.error("File Kosong", { description: "Harap upload file tugas Anda." });
          return;
      }

      const formData = new FormData();
      // Kirim hanya salah satu sesuai mode
      if (inputMode === 'LINK') formData.append("linkUrl", linkUrl);
      if (inputMode === 'FILE') formData.append("fileUrl", fileUrl);

      startTransition(async () => {
          const res = await submitAssignment(tugasId, formData);
          if (res.success) {
              toast.success("Tugas Dikumpulkan! ✅");
              // Refresh data lokal
              setSubmission({ 
                  ...submission, 
                  linkUrl: inputMode === 'LINK' ? linkUrl : null,
                  fileUrl: inputMode === 'FILE' ? fileUrl : null,
                  submittedAt: new Date(),
                  grade: null 
              });
          } else {
              toast.error("Gagal", { description: res.error });
          }
      });
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-500" /></div>;
  if (!assignment) return <div className="text-center py-20">Tugas tidak ditemukan.</div>;

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
    <div className="space-y-6">
      <div>
        <Link href={`/courses/${courseId}/tugas`} className="flex items-center text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali ke Daftar Tugas
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Kolom Kiri: Detail & Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">{assignment.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                {assignment.description}
              </div>
            </CardContent>
          </Card>

          {/* Kartu Pengumpulan */}
          <Card className="shadow-md">
            <CardHeader>
              <div className="flex justify-between items-center">
                  <CardTitle>Pengumpulan Tugas</CardTitle>
                  
                  {/* SWITCH MODE */}
                  <button 
                      type="button"
                      className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                      onClick={() => {
                          setInputMode(prev => prev === 'FILE' ? 'LINK' : 'FILE');
                      }}
                  >
                      {inputMode === 'FILE' ? (
                          <>Ganti ke Mode Link <LinkIcon className="h-3 w-3" /></>
                      ) : (
                          <>Ganti ke Mode File <UploadCloud className="h-3 w-3" /></>
                      )}
                  </button>
              </div>
              <CardDescription>
                {inputMode === 'FILE' ? "Upload file dokumen (PDF, Word, Zip)." : "Masukkan link eksternal (GDrive, GitHub)."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* MODE 1: UPLOAD FILE */}
                {inputMode === 'FILE' && (
                    <div>
                        {!fileUrl ? (
                            <div className="border border-gray-300 rounded-md p-6 bg-gray-50 flex flex-col items-center justify-center text-center">
                                <UploadButton
                                    endpoint="studentSubmission" // Gunakan endpoint baru
                                    onClientUploadComplete={(res) => {
                                        if (res && res[0]) {
                                            setFileUrl(res[0].url);
                                            setFileName(res[0].name);
                                            toast.success("File Terupload!");
                                        }
                                    }}
                                    onUploadError={(error: Error) => {
                                        toast.error(`Gagal: ${error.message}`);
                                    }}
                                    appearance={{
                                        button: "bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors",
                                        container: "w-auto", 
                                        allowedContent: "text-xs text-gray-500 mt-1"
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
                                <div className="flex items-center space-x-3 text-sm">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                    <span className="text-green-800 truncate max-w-[200px]">{fileName || "File Tugas"}</span>
                                </div>
                                <Button 
                                    type="button" 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
                                    onClick={() => { setFileUrl(""); setFileName(""); }}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {/* MODE 2: INPUT LINK */}
                {inputMode === 'LINK' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Link Tugas</label>
                        <div className="relative">
                            <LinkIcon className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                            <Input 
                                value={linkUrl}
                                onChange={(e) => setLinkUrl(e.target.value)}
                                placeholder="https://docs.google.com/..." 
                                className="pl-9"
                            />
                        </div>
                    </div>
                )}

                <Button type="submit" disabled={isPending} className="w-full">
                    {isPending ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                    {isSubmitted ? "Update Pengumpulan" : "Kumpulkan Tugas"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Kolom Kanan: Status Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-md sticky top-24">
            <CardHeader>
              <CardTitle>Status Tugas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Deadline</p>
                  <p className="font-semibold text-gray-900">{formatDueDate(assignment.dueDate)}</p>
                </div>
              </div>
              <div className="flex items-start">
                <StatusIcon className={`h-5 w-5 ${statusColor} mr-3 mt-0.5`} />
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p className={`font-semibold ${statusColor}`}>{statusText}</p>
                  {isSubmitted && submission.submittedAt && (
                      <p className="text-xs text-gray-400 mt-1">
                          Dikirim: {formatDueDate(submission.submittedAt)}
                      </p>
                  )}
                </div>
              </div>
              {/* Jika file ada, tampilkan preview link */}
              {isSubmitted && submission.fileUrl && (
                  <div className="pt-2 border-t mt-2">
                      <a href={submission.fileUrl} target="_blank" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                          <FileText className="h-3 w-3" /> Lihat File Saya
                      </a>
                  </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}