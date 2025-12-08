"use client";

import React, { useEffect, useState, useTransition } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, Trash2, Loader2, User } from 'lucide-react';
import { getAllUsers, deleteUser } from '@/actions/admin-actions';
import { ConfirmModal } from '@/components/ui/ConfirmModal'; // <-- 1. Import Modal

export default function ManageUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPending, startTransition] = useTransition();

  // --- STATE MODAL DELETE ---
  // Kita simpan ID dan Nama agar pesan konfirmasi lebih spesifik
  const [deleteData, setDeleteData] = useState<{ id: string, name: string } | null>(null);

  useEffect(() => {
    async function loadData() {
        const data = await getAllUsers();
        setUsers(data);
        setLoading(false);
    }
    loadData();
  }, []);

  // 2. Handler saat tombol Sampah diklik (Buka Modal)
  const handleDeleteClick = (id: string, name: string) => {
      setDeleteData({ id, name });
  };

  // 3. Handler Eksekusi Hapus (Dipanggil Modal)
  const handleConfirmDelete = () => {
      if (!deleteData) return;

      startTransition(async () => {
          const res = await deleteUser(deleteData.id);
          
          if (res.success) {
              // Hapus dari state lokal
              setUsers(prev => prev.filter(u => u.id !== deleteData.id));
              setDeleteData(null); // Tutup Modal
          } else {
              alert("Gagal menghapus user.");
          }
      });
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-purple-100 text-purple-800';
      case 'DOSEN': return 'bg-blue-100 text-blue-800';
      case 'MAHASISWA': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100';
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.academicId && user.academicId.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-500" /></div>;

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manajemen Pengguna</h1>
          <p className="text-lg text-gray-600">Kelola akun Dosen dan Mahasiswa.</p>
        </div>
      </div>
      
      <Card className="shadow-md">
        <CardHeader>
          <div className="relative w-full md:w-1/3">
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Cari nama, email, atau ID..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase bg-gray-50 border-b">
                  <th className="px-4 py-3">Nama</th>
                  <th className="px-4 py-3">ID Akademik</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Tanggal Daftar</th>
                  <th className="px-4 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                            {user.avatarUrl ? (
                                <img src={user.avatarUrl} className="w-full h-full object-cover" />
                            ) : <User className="h-5 w-5 text-gray-500" />}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {user.academicId || "-"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getRoleBadge(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      {user.role !== 'ADMIN' && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-600 hover:bg-red-100"
                            // Panggil fungsi buka modal
                            onClick={() => handleDeleteClick(user.id, user.name)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredUsers.length === 0 && (
            <p className="text-center text-gray-500 py-8">User tidak ditemukan.</p>
          )}
        </CardContent>
      </Card>

      {/* --- 4. RENDER MODAL --- */}
      <ConfirmModal 
        isOpen={!!deleteData}
        onClose={() => setDeleteData(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isPending}
        title={`Hapus Pengguna "${deleteData?.name}"?`}
        description="PERINGATAN: Menghapus pengguna ini akan menghapus semua data terkait (tugas, nilai, materi, dll) secara permanen."
      />

    </div>
  );
}