"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { mockAllUsers } from '@/data/mockData'; // <-- 1. Impor semua user
import { User } from '@/lib/types';

// Komponen untuk satu baris user di tabel
function UserTableRow({ user }: { user: User }) {
  const getRoleBadge = (role: User['role']) => {
    switch (role) {
      case 'Admin': return 'bg-red-100 text-red-800';
      case 'Dosen': return 'bg-blue-100 text-blue-800';
      case 'Mahasiswa': return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      {/* Nama & Avatar */}
      <td className="px-4 py-3">
        <div className="flex items-center space-x-3">
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/40x40/E2E8F0/A0AEC0?text=${user.name.charAt(0)}`; }}
          />
          <div>
            <p className="font-semibold text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
      </td>
      {/* ID Akademik */}
      <td className="px-4 py-3 text-sm text-gray-600">
        {user.academicId}
      </td>
      {/* Role */}
      <td className="px-4 py-3">
        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getRoleBadge(user.role)}`}>
          {user.role}
        </span>
      </td>
      {/* Aksi */}
      <td className="px-4 py-3">
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" className="text-blue-600 hover:bg-blue-100">
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-red-600 hover:bg-red-100">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}

// Halaman utama /admin/users
export default function ManageUsersPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Logika filter (UI only)
  const filteredUsers = mockAllUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.academicId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header Halaman */}
      <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Manajemen Pengguna
          </h1>
          <p className="text-lg text-gray-600">
            Kelola semua akun Dosen dan Mahasiswa.
          </p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Tambah Pengguna Baru
        </Button>
      </div>
      
      {/* Kartu Tabel Pengguna */}
      <Card className="shadow-md">
        <CardHeader>
          {/* Search Bar */}
          <div className="relative w-full md:w-1/3">
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Cari nama, email, atau NIM/NIDN..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {/* Wrapper untuk tabel agar bisa scroll horizontal di HP */}
          <div className="overflow-x-auto">
            <table className="min-w-full w-full">
              {/* Header Tabel */}
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase">
                  <th className="px-4 py-3">Nama</th>
                  <th className="px-4 py-3">ID Akademik</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Aksi</th>
                </tr>
              </thead>
              {/* Isi Tabel */}
              <tbody>
                {filteredUsers.map(user => (
                  <UserTableRow key={user.id} user={user} />
                ))}
              </tbody>
            </table>
          </div>
          {filteredUsers.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              Tidak ada pengguna yang cocok dengan pencarian.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}