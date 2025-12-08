"use client";

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { ArrowLeft, Loader2, Save, X, FileText, CheckCircle, Link as LinkIcon, UploadCloud } from 'lucide-react';
import { createMaterial } from '@/actions/material-actions';
import { UploadButton } from '@/lib/uploadthing';
import { toast } from 'sonner';

export default function CreateMaterialPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  
  const [isPending, startTransition] = useTransition();
  const [type, setType] = useState("VIDEO"); 
  
  // State untuk mode input file (UPLOAD atau URL)
  const [inputMode, setInputMode] = useState<'UPLOAD' | 'URL'>('UPLOAD');

  // State hasil
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [uploadedName, setUploadedName] = useState("");

  const handleSubmit = (formData: FormData) => {
    // Validasi Manual
    // Jika tipe butuh file tapi URL kosong
    if (['PDF', 'PPT', 'WORD'].includes(type) && !uploadedUrl) {
        toast.error("File Kosong", { description: "Silakan upload file atau masukkan link." });
        return;
    }
    if (type === 'VIDEO' && !formData.get("videoUrl")) {
        toast.error("Link Video Kosong");
        return;
    }

    startTransition(async () => {
        const result = await createMaterial(courseId, formData);
        if (result?.error) {
            toast.error("Gagal", { description: result.error });
        } else {
            toast.success("Berhasil", { description: "Materi berhasil ditambahkan." });
        }
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Link href={`/manage/${courseId}/materi`}>
          <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Tambah Materi Baru</h1>
      </div>

      <Card className="shadow-md">
        <CardHeader><CardTitle>Detail Materi</CardTitle></CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            
            {/* Tipe Materi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Materi</label>
              <select 
                name="type" 
                className="w-full bg-white border border-gray-300 rounded-md py-2 px-3 focus:ring-2 focus:ring-blue-500"
                value={type}
                onChange={(e) => {
                    setType(e.target.value);
                    setUploadedUrl(""); 
                    setUploadedName("");
                    setInputMode("UPLOAD"); // Reset ke default upload
                }}
              >
                <option value="VIDEO">Video (YouTube)</option>
                <option value="PDF">Dokumen PDF</option>
                <option value="PPT">Presentasi (PPT)</option>
                <option value="WORD">Dokumen Word</option>
                <option value="TEXT">Teks / Artikel</option>
              </select>
            </div>

            {/* Judul */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Judul Materi</label>
              <Input name="title" required placeholder="Contoh: Pengenalan React Hooks" />
            </div>

            {/* --- LOGIKA DINAMIS --- */}
            
            {/* --- LOGIKA VIDEO (HYBRID) --- */}
            {type === 'VIDEO' && (
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">Sumber Video</label>
                        {/* Tombol Switch Mode */}
                        <button 
                            type="button"
                            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                            onClick={() => {
                                setInputMode(prev => prev === 'UPLOAD' ? 'URL' : 'UPLOAD');
                                setUploadedUrl(""); 
                            }}
                        >
                            {inputMode === 'UPLOAD' ? (
                                <>Gunakan Link YouTube <LinkIcon className="h-3 w-3" /></>
                            ) : (
                                <>Upload Video MP4 <UploadCloud className="h-3 w-3" /></>
                            )}
                        </button>
                    </div>

                    {/* Hidden Input agar terkirim sebagai 'videoUrl' ke server */}
                    <input type="hidden" name="videoUrl" value={uploadedUrl} />

                    {inputMode === 'UPLOAD' ? (
                        // MODE 1: UPLOADTHING (MP4)
                        !uploadedUrl ? (
                            <div className="border border-gray-300 rounded-md p-6 bg-gray-50 flex flex-col items-center justify-center text-center">
                                <UploadButton
                                    endpoint="courseAttachment"
                                    onClientUploadComplete={(res) => {
                                        if (res && res[0]) {
                                            setUploadedUrl(res[0].url);
                                            setUploadedName(res[0].name);
                                            toast.success("Video Berhasil Diupload!");
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
                                    content={{
                                        button({ ready }) { return ready ? "Pilih Video" : "Memuat..."; },
                                        allowedContent({ fileTypes }) { return `Format: MP4, MOV (Max 256MB)`; }
                                    }}
                                />
                            </div>
                        ) : (
                            // Tampilan Sukses Upload
                            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
                                <div className="flex items-center space-x-3 text-sm">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                    <span className="text-green-800 truncate max-w-[200px]">{uploadedName || "Video Terupload"}</span>
                                </div>
                                <Button 
                                    type="button" 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
                                    onClick={() => { setUploadedUrl(""); setUploadedName(""); }}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        )
                    ) : (
                        // MODE 2: INPUT URL YOUTUBE
                        <Input 
                            placeholder="https://www.youtube.com/watch?v=..." 
                            value={uploadedUrl}
                            onChange={(e) => setUploadedUrl(e.target.value)}
                        />
                    )}
                </div>
            )}

            {/* 2. Jika FILE (PDF/PPT/WORD), Tampilkan Pilihan Hybrid */}
            {['PDF', 'PPT', 'WORD'].includes(type) && (
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">File Materi</label>
                        {/* Tombol Switch Mode */}
                        <button 
                            type="button"
                            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                            onClick={() => {
                                setInputMode(prev => prev === 'UPLOAD' ? 'URL' : 'UPLOAD');
                                setUploadedUrl(""); // Reset value saat ganti mode
                            }}
                        >
                            {inputMode === 'UPLOAD' ? (
                                <>Gunakan Link Eksternal (G-Drive) <LinkIcon className="h-3 w-3" /></>
                            ) : (
                                <>Upload File Langsung <UploadCloud className="h-3 w-3" /></>
                            )}
                        </button>
                    </div>
                    
                    {/* Input Hidden untuk mengirim data final ke server */}
                    <input type="hidden" name="fileUrl" value={uploadedUrl} />

                    {inputMode === 'UPLOAD' ? (
                        // MODE 1: UPLOADTHING
                        !uploadedUrl ? (
                            <div className="border border-gray-300 rounded-md p-6 bg-gray-50 flex flex-col items-center justify-center text-center">
                                <UploadButton
                                    endpoint="courseAttachment"
                                    onClientUploadComplete={(res) => {
                                        if (res && res[0]) {
                                            setUploadedUrl(res[0].url);
                                            setUploadedName(res[0].name);
                                            toast.success("Upload Berhasil!");
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
                                    content={{
                                        button({ ready }) { return ready ? "Pilih File" : "Memuat..."; },
                                        allowedContent({ fileTypes }) { return `Format: ${fileTypes.join(', ')} (Max 32MB)`; }
                                    }}
                                />
                            </div>
                        ) : (
                            // Tampilan File Sukses
                            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
                                <div className="flex items-center space-x-3 text-sm">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                    <span className="text-green-800 truncate max-w-[200px]">{uploadedName || "File Terupload"}</span>
                                </div>
                                <Button 
                                    type="button" 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
                                    onClick={() => { setUploadedUrl(""); setUploadedName(""); }}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        )
                    ) : (
                        // MODE 2: INPUT URL MANUAL
                        <Input 
                            placeholder={`https://example.com/file.${type.toLowerCase()}`} 
                            value={uploadedUrl}
                            onChange={(e) => setUploadedUrl(e.target.value)}
                        />
                    )}
                </div>
            )}

            {/* 3. Jika TEXT, tetap Textarea */}
            {type === 'TEXT' && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Konten Teks</label>
                    <textarea 
                        name="textContent" 
                        className="w-full min-h-[150px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="Tulis materi Anda di sini..."
                    />
                </div>
            )}

            {/* Deskripsi */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi (Opsional)</label>
                <Input name="description" placeholder="Penjelasan singkat..." />
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isPending}>
                {isPending ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                Simpan Materi
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}