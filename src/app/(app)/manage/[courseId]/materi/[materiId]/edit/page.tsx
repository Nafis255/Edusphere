"use client";

import React, { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { ArrowLeft, Loader2, Save, X, CheckCircle, FileText, Link as LinkIcon, UploadCloud } from 'lucide-react';
import { getMaterialById, updateMaterial } from '@/actions/material-actions';
import { UploadButton } from '@/lib/uploadthing'; // Import UploadThing
import { toast } from 'sonner'; // Import Toast

export default function EditMaterialPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const materiId = params.materiId as string;
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // State Form Dasar
  const [formData, setFormData] = useState({
    title: "",
    type: "VIDEO", // Default, nanti di-overwrite data DB
    description: "",
    textContent: ""
  });

  // State Khusus Upload/URL
  const [inputMode, setInputMode] = useState<'UPLOAD' | 'URL'>('UPLOAD');
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [uploadedName, setUploadedName] = useState("");

  // Load Data Lama
  useEffect(() => {
    async function loadData() {
        const data = await getMaterialById(materiId);
        if (data) {
            setFormData({
                title: data.title,
                type: data.type,
                description: data.description || "",
                textContent: data.textContent || ""
            });

            // LOGIKA PRE-FILL DATA URL
            if (data.type === 'VIDEO') {
                setUploadedUrl(data.videoUrl || "");
                // Deteksi cerdas: Jika link youtube, set mode URL. Jika utfs.io, set mode Upload
                if (data.videoUrl && (data.videoUrl.includes('youtube') || data.videoUrl.includes('youtu.be'))) {
                    setInputMode('URL');
                } else {
                    setInputMode('UPLOAD');
                    setUploadedName("Video Lama Tersimpan");
                }
            } 
            else if (['PDF', 'PPT', 'WORD'].includes(data.type)) {
                setUploadedUrl(data.fileUrl || "");
                if (data.fileUrl && !data.fileUrl.includes('utfs.io')) {
                     // Jika bukan link uploadthing, mungkin link drive manual
                     setInputMode('URL');
                } else {
                     setInputMode('UPLOAD');
                     setUploadedName("File Lama Tersimpan");
                }
            }
        }
        setLoading(false);
    }
    loadData();
  }, [materiId]);

  const handleSubmit = (form: FormData) => {
    // Validasi Manual
    if (['PDF', 'PPT', 'WORD'].includes(formData.type) && !uploadedUrl) {
        toast.error("File Kosong", { description: "URL File tidak boleh kosong." });
        return;
    }
    if (formData.type === 'VIDEO' && !uploadedUrl) {
        toast.error("Video Kosong", { description: "URL Video tidak boleh kosong." });
        return;
    }
    if (formData.type === 'TEXT' && !form.get("textContent")) {
        toast.error("Konten Kosong", { description: "Teks materi wajib diisi." });
        return;
    }

    startTransition(async () => {
        const result = await updateMaterial(materiId, courseId, form);
        if (result?.error) {
            toast.error("Gagal", { description: result.error });
        } else {
            toast.success("Berhasil", { description: "Materi berhasil diperbarui." });
        }
    });
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-500" /></div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Link href={`/manage/${courseId}/materi`}>
          <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Materi</h1>
      </div>

      <Card className="shadow-md">
        <CardHeader><CardTitle>Perbarui Materi</CardTitle></CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            
            {/* Tipe Materi (Disabled) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Materi</label>
              <select 
                name="type" 
                className="w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-3 text-gray-500 cursor-not-allowed"
                value={formData.type}
                disabled
              >
                <option value="VIDEO">Video</option>
                <option value="PDF">Dokumen PDF</option>
                <option value="PPT">Presentasi (PPT)</option>
                <option value="WORD">Dokumen Word</option>
                <option value="TEXT">Teks / Artikel</option>
              </select>
              <input type="hidden" name="type" value={formData.type} />
            </div>

            {/* Judul */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Judul Materi</label>
              <Input 
                name="title" 
                required 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>

            {/* --- LOGIKA HYBRID (SAMA SEPERTI CREATE) --- */}

            {/* 1. VIDEO */}
            {formData.type === 'VIDEO' && (
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">Sumber Video</label>
                        <button 
                            type="button"
                            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                            onClick={() => {
                                setInputMode(prev => prev === 'UPLOAD' ? 'URL' : 'UPLOAD');
                                // Jangan reset URL saat edit mode agar data lama tidak hilang, 
                                // kecuali user memang mau ganti. (Opsional, di sini kita biarkan user lihat data lama)
                            }}
                        >
                            {inputMode === 'UPLOAD' ? (
                                <>Gunakan Link YouTube <LinkIcon className="h-3 w-3" /></>
                            ) : (
                                <>Upload Video MP4 <UploadCloud className="h-3 w-3" /></>
                            )}
                        </button>
                    </div>

                    <input type="hidden" name="videoUrl" value={uploadedUrl} />

                    {inputMode === 'UPLOAD' ? (
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
                                        button({ ready }) { return ready ? "Ganti Video" : "Memuat..."; },
                                        allowedContent({ fileTypes }) { return `Format: MP4 (Max 256MB)`; }
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
                                <div className="flex items-center space-x-3 text-sm">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                    <span className="text-green-800 truncate max-w-[200px]">{uploadedName || "Video Tersimpan"}</span>
                                </div>
                                <Button 
                                    type="button" 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
                                    onClick={() => { setUploadedUrl(""); setUploadedName(""); }}
                                    title="Hapus / Ganti Video"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        )
                    ) : (
                        <Input 
                            placeholder="https://www.youtube.com/watch?v=..." 
                            value={uploadedUrl}
                            onChange={(e) => setUploadedUrl(e.target.value)}
                        />
                    )}
                </div>
            )}

            {/* 2. FILE (PDF/PPT/WORD) */}
            {['PDF', 'PPT', 'WORD'].includes(formData.type) && (
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">File Materi</label>
                        <button 
                            type="button"
                            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                            onClick={() => {
                                setInputMode(prev => prev === 'UPLOAD' ? 'URL' : 'UPLOAD');
                            }}
                        >
                            {inputMode === 'UPLOAD' ? (
                                <>Gunakan Link Eksternal <LinkIcon className="h-3 w-3" /></>
                            ) : (
                                <>Upload File Langsung <UploadCloud className="h-3 w-3" /></>
                            )}
                        </button>
                    </div>
                    
                    <input type="hidden" name="fileUrl" value={uploadedUrl} />

                    {inputMode === 'UPLOAD' ? (
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
                                        button({ ready }) { return ready ? "Ganti File" : "Memuat..."; },
                                        allowedContent({ fileTypes }) { return `Format: ${fileTypes.join(', ')} (Max 32MB)`; }
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
                                <div className="flex items-center space-x-3 text-sm">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                    <span className="text-green-800 truncate max-w-[200px]">{uploadedName || "File Tersimpan"}</span>
                                </div>
                                <Button 
                                    type="button" 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
                                    onClick={() => { setUploadedUrl(""); setUploadedName(""); }}
                                    title="Hapus / Ganti File"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        )
                    ) : (
                        <Input 
                            placeholder={`https://example.com/file.${formData.type.toLowerCase()}`} 
                            value={uploadedUrl}
                            onChange={(e) => setUploadedUrl(e.target.value)}
                        />
                    )}
                </div>
            )}

            {/* 3. TEXT */}
            {formData.type === 'TEXT' && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Konten Teks</label>
                    <textarea 
                        name="textContent" 
                        className="w-full min-h-[150px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        value={formData.textContent}
                        onChange={(e) => setFormData({...formData, textContent: e.target.value})}
                    />
                </div>
            )}

            {/* Deskripsi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Singkat</label>
              <Input 
                name="description" 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isPending}>
                {isPending ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                Simpan Perubahan
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}