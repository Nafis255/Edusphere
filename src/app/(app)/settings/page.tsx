"use client";

import React, { useEffect, useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Switch } from '@/components/ui/Switch';
import { Input } from '@/components/ui/Input'; 
import { useRole } from '@/contexts/RoleContext';
import { Bell, Shield, Loader2, Settings2, Save, AlertTriangle } from 'lucide-react'; 
import { getUserSettings, toggleCourseNotification, getSystemConfig, updateSystemConfig } from '@/actions/settings-actions';
import { changePassword, deleteMyAccount } from '@/actions/security-actions';
import { Modal } from '@/components/ui/Modal';
import { toast } from 'sonner'; // <-- 1. Import Toast

// Helper Component
function SettingsRow({ title, description, children }: { title: string, description: string, children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0 border-b border-gray-200 py-4 last:border-b-0">
      <div>
        <h4 className="font-medium text-gray-900">{title}</h4>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <div>{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const { role } = useRole(); 
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  
  // State Settings
  const [courseNotif, setCourseNotif] = useState(true);
  const [adminConfig, setAdminConfig] = useState({ allowRegistration: true, maintenanceMode: false });

  // State Change Password
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passForm, setPassForm] = useState({ oldPassword: "", newPassword: "" });

  // State Modal Hapus Akun
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  useEffect(() => {
    async function loadData() {
        const settings = await getUserSettings();
        if (settings) setCourseNotif(settings.enableCourseNotif);

        if (role === 'admin') {
            const config = await getSystemConfig();
            if (config) setAdminConfig(config);
        }
        
        setLoading(false);
    }
    if (role) loadData();
  }, [role]);

  // --- HANDLER TOGGLE NOTIFIKASI (Dengan Toast) ---
  const handleToggleUser = (checked: boolean) => {
      // Optimistic Update
      setCourseNotif(checked);
      
      startTransition(async () => {
          const res = await toggleCourseNotification(checked);
          if (res.success) {
              toast.success("Pengaturan Disimpan", {
                  description: `Notifikasi ${checked ? 'diaktifkan' : 'dinonaktifkan'}.`
              });
          } else {
              setCourseNotif(!checked); // Rollback
              toast.error("Gagal Menyimpan", { description: "Terjadi kesalahan pada server." });
          }
      });
  };

  const handleToggleAdmin = (key: 'allowRegistration' | 'maintenanceMode', checked: boolean) => {
      setAdminConfig(prev => ({ ...prev, [key]: checked }));
      startTransition(async () => {
          const res = await updateSystemConfig(key, checked);
          if (res.success) {
              toast.success("Konfigurasi Sistem Diperbarui");
          } else {
              setAdminConfig(prev => ({ ...prev, [key]: !checked })); // Rollback
              toast.error("Gagal Update Sistem");
          }
      });
  };

  // --- HANDLER GANTI PASSWORD (Dengan Toast) ---
  const handleChangePassword = () => {
      // Validasi sederhana sebelum kirim
      if (!passForm.oldPassword || !passForm.newPassword) {
          toast.warning("Lengkapi Data", { description: "Password lama dan baru harus diisi." });
          return;
      }

      const toastId = toast.loading("Memperbarui password...");

      startTransition(async () => {
          const formData = new FormData();
          formData.append("oldPassword", passForm.oldPassword);
          formData.append("newPassword", passForm.newPassword);

          const res = await changePassword(formData);
          
          toast.dismiss(toastId); // Tutup loading

          if (res.success) {
              toast.success("Berhasil", { description: "Password Anda telah diubah." });
              setShowPasswordForm(false);
              setPassForm({ oldPassword: "", newPassword: "" });
          } else {
              toast.error("Gagal Mengganti Password", { description: res.error });
          }
      });
  };

  // --- HANDLER HAPUS AKUN (Dengan Toast Error) ---
  const handleExecuteDelete = () => {
      if (deleteConfirmation !== "DELETE") return;

      const toastId = toast.loading("Menghapus akun...");

      startTransition(async () => {
          const res = await deleteMyAccount();
          // Jika sukses, user akan di-redirect oleh server action (Logout), jadi toast sukses mungkin tidak sempat terlihat lama.
          // Tapi jika gagal, kita butuh toast error.
          if (res?.error) {
              toast.dismiss(toastId);
              toast.error("Gagal Menghapus Akun", { description: res.error });
              setShowDeleteModal(false);
          }
      });
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-500" /></div>;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900">Pengaturan</h1>
      
      {/* 1. Notifikasi */}
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center space-x-3">
          <Bell className="h-6 w-6 text-blue-500" />
          <div>
            <CardTitle>Notifikasi</CardTitle>
            <CardDescription>Atur preferensi notifikasi email Anda.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <SettingsRow 
            title="Update Mata Kuliah" 
            description={role === 'dosen' ? "Notifikasi aktivitas mahasiswa." : "Notifikasi materi dan nilai."}
          >
            <Switch checked={courseNotif} onCheckedChange={handleToggleUser} />
          </SettingsRow>
        </CardContent>
      </Card>

      {/* 2. Admin Config */}
      {role === 'admin' && (
          <Card className="shadow-md border-purple-200 bg-purple-50/30">
            <CardHeader className="flex flex-row items-center space-x-3">
              <Settings2 className="h-6 w-6 text-purple-600" />
              <div>
                <CardTitle>Pengaturan Platform (Admin)</CardTitle>
                <CardDescription>Kontrol akses global aplikasi.</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <SettingsRow title="Izinkan Pendaftaran Baru" description="Jika dimatikan, user baru tidak bisa Register.">
                <Switch checked={adminConfig.allowRegistration} onCheckedChange={(c) => handleToggleAdmin('allowRegistration', c)} />
              </SettingsRow>
              <SettingsRow title="Mode Maintenance" description="Jika aktif, hanya Admin yang bisa login.">
                <Switch checked={adminConfig.maintenanceMode} onCheckedChange={(c) => handleToggleAdmin('maintenanceMode', c)} />
              </SettingsRow>
            </CardContent>
          </Card>
      )}

      {/* 3. Keamanan Akun */}
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center space-x-3">
          <Shield className="h-6 w-6 text-red-500" />
          <div>
            <CardTitle>Keamanan Akun</CardTitle>
            <CardDescription>Kelola keamanan dan password Anda.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Form Ganti Password */}
          <div>
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h4 className="font-medium text-gray-900">Password</h4>
                    <p className="text-sm text-gray-500">Ganti password secara berkala.</p>
                </div>
                {!showPasswordForm && (
                    <Button variant="secondary" size="sm" onClick={() => setShowPasswordForm(true)}>Ganti Password</Button>
                )}
            </div>

            {showPasswordForm && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">Password Lama</label>
                        <Input type="password" className="bg-white mt-1" value={passForm.oldPassword} onChange={(e) => setPassForm({...passForm, oldPassword: e.target.value})} />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">Password Baru</label>
                        <Input type="password" className="bg-white mt-1" value={passForm.newPassword} onChange={(e) => setPassForm({...passForm, newPassword: e.target.value})} />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="ghost" size="sm" onClick={() => setShowPasswordForm(false)}>Batal</Button>
                        <Button size="sm" onClick={handleChangePassword} disabled={isPending}>
                            {isPending ? <Loader2 className="animate-spin h-4 w-4" /> : "Simpan Password"}
                        </Button>
                    </div>
                </div>
            )}
          </div>

          <div className="border-t pt-4">
             <h4 className="font-medium text-red-600 mb-2">Zona Berbahaya</h4>
             <p className="text-sm text-gray-500 mb-4">
                Menghapus akun akan menghilangkan semua data progres belajar, nilai, dan materi yang Anda buat.
             </p>
             <Button 
                variant="outline" 
                className="text-red-600 border-red-200 hover:bg-red-50 w-full md:w-auto"
                onClick={() => {
                    setDeleteConfirmation("");
                    setShowDeleteModal(true);
                }}
             >
                Hapus Akun Saya
             </Button>
          </div>

        </CardContent>
      </Card>

      {/* --- MODAL KONFIRMASI HAPUS AKUN --- */}
      <Modal 
        isOpen={showDeleteModal} 
        onClose={() => setShowDeleteModal(false)}
        title="Hapus Akun Permanen?"
      >
        <div className="space-y-4">
            <div className="bg-red-50 text-red-800 p-3 rounded-md text-sm border border-red-200 flex gap-3">
                <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                <p>
                    Tindakan ini <b>tidak dapat dibatalkan</b>. Semua data Anda akan dihapus dari server kami.
                </p>
            </div>
            
            <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Ketik <strong>DELETE</strong> untuk konfirmasi
                </label>
                <Input 
                    type="text"
                    placeholder="DELETE"
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    className="border-red-300 focus:ring-red-500"
                />
            </div>

            <div className="flex justify-end gap-3 pt-2">
                <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>
                    Batal
                </Button>
                <Button 
                    className="bg-red-600 hover:bg-red-700 text-white border-none"
                    onClick={handleExecuteDelete} 
                    disabled={isPending || deleteConfirmation !== "DELETE"}
                    variant="destructive"
                >
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Hapus Akun Saya"}
                </Button>
            </div>
        </div>
      </Modal>

    </div>
  );
}