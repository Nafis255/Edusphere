"use client"; 

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  CheckCircle, Type, Clock, Activity, Calendar, Download, 
  Presentation, TextIcon, FileText, ArrowLeft, Loader2, ExternalLink 
} from 'lucide-react';
import { getMaterialDetail } from '@/actions/student-actions';
import { getMaterialStatus } from '@/actions/progress-actions'; // <-- Import baru
import CompleteButton from '@/components/course/CompleteButton'; // <-- Import komponen tombol

// Helper format tanggal
function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

// Komponen Sidebar Detail
function MaterialDetails({ material }: { material: any }) {
  let downloadUrl = material.fileUrl;
  let downloadName = material.title;

  return (
    <Card className="shadow-md h-fit">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Info Materi</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center">
          <Type className="h-5 w-5 text-gray-500 mr-3" />
          <div>
            <p className="text-sm text-gray-500">Tipe</p>
            <p className="font-medium text-gray-900">{material.type}</p>
          </div>
        </div>
        <div className="flex items-center">
          <Calendar className="h-5 w-5 text-gray-500 mr-3" />
          <div>
            <p className="text-sm text-gray-500">Diposting</p>
            <p className="font-medium text-gray-900">{formatDate(material.createdAt)}</p>
          </div>
        </div>

        {/* Tombol Download (Jika ada fileUrl) */}
        {downloadUrl && (
          <div className="pt-4 border-t border-gray-200">
            <a href={downloadUrl} target="_blank" rel="noopener noreferrer" download={downloadName} className="w-full">
              <Button variant="secondary" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Buka / Download
              </Button>
            </a>
          </div>
        )}
      </CardContent> 
    </Card>
  );
}

export default function MaterialDetailPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const materiId = params.materiId as string;

  const [material, setMaterial] = useState<any>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!materiId) return;
    async function loadData() {
      // Load Detail & Status secara paralel
      const [matData, statusData] = await Promise.all([
          getMaterialDetail(materiId),
          getMaterialStatus(materiId)
      ]);
      
      setMaterial(matData);
      setIsCompleted(statusData);
      setLoading(false);
    }
    loadData();
  }, [materiId]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-500" /></div>;
  if (!material) return <div className="text-center py-20">Materi tidak ditemukan.</div>;

  return (
    <div className="space-y-6">
        {/* Tombol Kembali */}
        <div>
            <Link href={`/courses/${courseId}/materi`} className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-1" /> Kembali ke Daftar Materi
            </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Kolom Kiri: Konten Utama */}
        <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-md overflow-hidden">
                <CardContent className="p-0">
                    
                    {/* --- VIEWER LOGIC --- */}
                    
{/* 1. LOGIKA VIDEO CERDAS + FALLBACK LINK */}
                    {material.type === 'VIDEO' && material.videoUrl && (
                        <div className="space-y-3"> {/* Wrapper dengan jarak */}
                            
                            {/* Player */}
                            <div className="aspect-video w-full bg-black rounded-lg overflow-hidden shadow-sm">
                                {(material.videoUrl.includes('youtube.com') || material.videoUrl.includes('youtu.be')) ? (
                                    <iframe
                                        className="w-full h-full"
                                        src={material.videoUrl.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")} 
                                        title={material.title}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                ) : (
                                    <video 
                                        controls 
                                        className="w-full h-full"
                                        src={material.videoUrl}
                                    >
                                        Browser Anda tidak mendukung tag video.
                                    </video>
                                )}
                            </div>

                            {/* 👇 TOMBOL ALTERNATIF (SOLUSI ANDA) 👇 */}
                            <div className="bg-blue-50 border border-blue-100 rounded-md p-3 flex items-center justify-between text-sm">
                                <span className="text-blue-800">
                                    Video tidak bisa diputar atau error?
                                </span>
                                <a 
                                    href={material.videoUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                                >
                                    Buka di Tab Baru <ExternalLink className="h-3 w-3" />
                                </a>
                            </div>

                        </div>
                    )}

                    {/* 2. PDF (Embed Object) */}
                    {material.type === 'PDF' && material.fileUrl && (
                        <div className="h-[80vh] w-full bg-gray-100">
                            <iframe
                                src={material.fileUrl}
                                className="w-full h-full"
                            />
                        </div>
                    )}

                    {/* 3. TEXT (Tampilan Artikel) */}
                    {material.type === 'TEXT' && (
                        <div className="p-8 bg-white min-h-[300px] prose max-w-none">
                            {/* whitespace-pre-wrap agar enter/baris baru terbaca */}
                            <p className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                                {material.textContent}
                            </p>
                        </div>
                    )}

                    {/* 4. PPT/WORD (Fallback Placeholder) */}
                    {['PPT', 'WORD'].includes(material.type) && (
                        <div className="h-64 flex flex-col items-center justify-center bg-gray-50 text-center p-6">
                            <FileText className="h-16 w-16 text-blue-300 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-700">Materi Dokumen</h3>
                            <p className="text-gray-500 mb-4 max-w-md">
                                File ini tidak dapat dipratinjau langsung di browser. Silakan unduh untuk melihatnya.
                            </p>
                            <a href={material.fileUrl} target="_blank" rel="noreferrer">
                                <Button>Download File</Button>
                            </a>
                        </div>
                    )}

                </CardContent>
            </Card>
            
            {/* Judul & Deskripsi di Bawah Konten */}
            <Card className="shadow-sm">
                <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <h1 className="text-2xl font-bold text-gray-900">{material.title}</h1>
                        {/* Tombol Selesai (Nanti kita aktifkan fungsinya) */}
                        <CompleteButton 
                            materialId={material.id} 
                            courseId={courseId} 
                            initialState={isCompleted} 
                        />
                    </div>
                    {material.description && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-sm text-gray-700 mb-2">Deskripsi</h3>
                            <p className="text-gray-600 text-sm">{material.description}</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>

        {/* Kolom Kanan: Sidebar */}
        <div className="lg:col-span-1 space-y-6">
            <MaterialDetails material={material} />
            
            {/* Catatan Pribadi (UI Only untuk sekarang) */}
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg">Catatan Pribadi</CardTitle>
                </CardHeader>
                <CardContent>
                    <textarea 
                        className="w-full h-32 p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Tulis catatan penting tentang materi ini..."
                    ></textarea>
                    <Button size="sm" className="mt-2 w-full" variant="ghost">Simpan Catatan</Button>
                </CardContent>
            </Card>
        </div>

        </div>
    </div>
  );
}