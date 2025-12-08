"use client"; 

import React, { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input'; 
import { Mail, CheckCircle, Briefcase, Calendar, Edit, Loader2, Save, User as UserIcon, BookOpen, ImageIcon, X } from 'lucide-react';
import { getUserProfile, updateProfile } from '@/actions/profile-actions'; 
import { getBookRecommendations, BookData } from '@/actions/book-actions';
import { UploadButton } from '@/lib/uploadthing'; // <-- 1. Import UploadButton
import { toast } from 'sonner'; // <-- 2. Import Toast

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    avatarUrl: "",
    academicId: ""
  });

  const [books, setBooks] = useState<BookData[]>([]);

  useEffect(() => {
    async function loadData() {
        const data = await getUserProfile();
        if (data) {
            setUser(data);
            setFormData({
                name: data.name,
                bio: data.bio || "",
                avatarUrl: data.avatarUrl || "",
                academicId: data.academicId || ""
            });

            if (data.role === 'MAHASISWA') {
                const bookData = await getBookRecommendations();
                setBooks(bookData);
            }
        }
        setLoading(false);
    }
    loadData();
  }, []);

  const handleSave = () => {
      startTransition(async () => {
          const form = new FormData();
          form.append("name", formData.name);
          form.append("bio", formData.bio);
          form.append("avatarUrl", formData.avatarUrl);
          form.append("academicId", formData.academicId);

          const res = await updateProfile(form);
          if (res.success) {
              setIsEditing(false);
              setUser((prevUser: any) => ({ ...prevUser, ...formData }));
              router.refresh();
              toast.success("Profil Diperbarui!"); // Pakai Toast
          } else {
              toast.error(res.error || "Gagal update.");
          }
      });
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-500" /></div>;
  if (!user) return <div>Gagal memuat profil.</div>;

  const idLabel = user.role === 'DOSEN' ? 'NIDN/NIDK' : 'NIM';
  const coursesLabel = user.role === 'DOSEN' ? 'Mengampu' : 'Enrolled';

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:items-start">
        
        {/* Kolom Kiri: Kartu Foto (Menampilkan Preview Live dari formData) */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-md text-center h-full">
            <CardContent className="p-6">
              <div className="relative w-32 h-32 mx-auto group">
                <img 
                  // Gunakan formData.avatarUrl agar preview langsung berubah saat upload
                  src={formData.avatarUrl || user.avatarUrl || `https://ui-avatars.com/api/?name=${user.name}&background=random`} 
                  alt={user.name}
                  className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-gray-100 group-hover:border-blue-200 transition-colors"
                />
                {/* Overlay Edit Icon saat hover (Hanya indikator visual) */}
                {isEditing && (
                    <div className="absolute inset-0 bg-black/10 rounded-full flex items-center justify-center">
                        <ImageIcon className="text-white opacity-80 h-8 w-8" />
                    </div>
                )}
              </div>
              <h2 className="text-2xl font-bold mt-4 text-gray-900">{formData.name || user.name}</h2>
              <span className={`text-sm font-medium px-3 py-1 rounded-full mt-2 inline-block ${user.role === 'DOSEN' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                {user.role}
              </span>
              <p className="text-gray-600 mt-2 text-sm">{user.email}</p>
            </CardContent>
            
            <div className="border-t border-gray-200 p-4 space-y-3 bg-gray-50/50">
              <div className="flex items-center justify-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                Member since {new Date(user.createdAt).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}
              </div>
              <div className="flex items-center justify-center text-sm text-gray-600">
                <Briefcase className="h-4 w-4 mr-2" />
                {user.stats.coursesCount} {coursesLabel}
              </div>
            </div>
          </Card>
        </div>

        {/* Kolom Kanan: Detail & Form Edit */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-md h-full">
            <CardHeader className="flex flex-row justify-between items-center pb-2">
              <CardTitle>Informasi Pribadi</CardTitle>
              {!isEditing ? (
                  <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" /> Edit Profile
                  </Button>
              ) : (
                  <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => {
                          setIsEditing(false);
                          // Reset form ke data asli jika batal
                          setFormData({
                            name: user.name,
                            bio: user.bio || "",
                            avatarUrl: user.avatarUrl || "",
                            academicId: user.academicId || ""
                          });
                      }} disabled={isPending}>
                          Batal
                      </Button>
                      <Button size="sm" onClick={handleSave} disabled={isPending}>
                          {isPending ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4 mr-2" />}
                          Simpan
                      </Button>
                  </div>
              )}
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-500 mb-1 block">Nama Lengkap</label>
                {isEditing ? (
                    <Input 
                        value={formData.name} 
                        onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    />
                ) : (
                    <p className="text-gray-900 font-medium text-lg">{user.name}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 mb-1 block">Email</label>
                <div className="flex items-center bg-gray-100 p-2 rounded-md text-gray-600">
                    <Mail className="h-4 w-4 mr-2" /> {user.email}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 mb-1 block">{idLabel}</label>
                {isEditing ? (
                    <Input 
                        value={formData.academicId} 
                        onChange={(e) => setFormData({...formData, academicId: e.target.value})} 
                        placeholder={`Masukkan ${idLabel} Anda`}
                    />
                ) : (
                    <div className="flex items-center bg-gray-100 p-2 rounded-md text-gray-600">
                        <UserIcon className="h-4 w-4 mr-2" /> {user.academicId || "-"}
                    </div>
                )}
              </div>

              {/* --- GANTI INPUT URL DENGAN UPLOAD BUTTON --- */}
              {isEditing && (
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-500 mb-2 block">Foto Profil</label>
                    
                    <div className="flex items-center gap-4 border border-gray-200 p-4 rounded-lg bg-gray-50">
                        {/* Area Upload */}
                        <div className="flex-1">
                            <UploadButton
                                endpoint="profileImage" // Gunakan endpoint baru
                                onClientUploadComplete={(res) => {
                                    if (res && res[0]) {
                                        setFormData({ ...formData, avatarUrl: res[0].url });
                                        toast.success("Foto Berhasil Diupload!");
                                    }
                                }}
                                onUploadError={(error: Error) => {
                                    toast.error(`Upload Gagal: ${error.message}`);
                                }}
                                appearance={{
                                    button: "bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors w-full md:w-auto",
                                    allowedContent: "text-xs text-gray-500 mt-1"
                                }}
                                content={{
                                    button({ ready }) { return ready ? "Pilih Foto Baru" : "Loading..."; },
                                    allowedContent: "Max 4MB (PNG, JPG)"
                                }}
                            />
                        </div>

                        {/* Tombol Hapus Foto */}
                        {formData.avatarUrl && (
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-red-600 border-red-200 hover:bg-red-50 h-10"
                                onClick={() => setFormData({ ...formData, avatarUrl: "" })}
                                title="Hapus Foto"
                            >
                                <X className="h-4 w-4 mr-2" /> Hapus
                            </Button>
                        )}
                    </div>
                  </div>
              )}

              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-500 mb-1 block">Bio</label>
                {isEditing ? (
                    <textarea
                        className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="Ceritakan sedikit tentang diri Anda..."
                        value={formData.bio}
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    ></textarea>
                ) : (
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {user.bio || <span className="text-gray-400 italic">Belum ada bio.</span>}
                    </p>
                )}
              </div>

            </CardContent>
          </Card>
        </div>
      </div> 

      {/* Bagian Rekomendasi Buku (Tetap Sama) */}
      {user.role === 'MAHASISWA' && (
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                  Recommended Reading
              </CardTitle>
              <p className="text-sm text-gray-500">
                  Buku rekomendasi berdasarkan aktivitas belajar Anda.
              </p>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {books.length > 0 ? (
                  books.map(book => (
                    <a 
                        key={book.id} 
                        href={book.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group block text-center"
                    >
                      <div className="relative overflow-hidden rounded-lg shadow-sm mb-3 aspect-[2/3] border border-gray-200">
                          <img 
                            src={book.imageUrl} 
                            alt={book.title} 
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                      </div>
                      <p className="font-semibold text-sm text-gray-900 line-clamp-2 group-hover:text-blue-600 leading-tight">
                          {book.title}
                      </p>
                      <p className="text-xs text-gray-500 line-clamp-1 mt-1">{book.author}</p>
                    </a>
                  ))
              ) : (
                  <p className="col-span-full text-center text-gray-500 py-10">
                      Tidak ada rekomendasi buku saat ini.
                  </p>
              )}
            </CardContent>
          </Card>
        )}

    </div>
  );
}