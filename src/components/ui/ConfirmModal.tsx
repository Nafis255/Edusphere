"use client";

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { AlertTriangle, Loader2, CheckCircle, Info } from 'lucide-react'; // Import Info

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  isLoading?: boolean;
  confirmText?: string; 
  cancelText?: string;
  // Kita ubah tipe variant agar sesuai dengan logika kita
  variant?: 'danger' | 'success' | 'primary'; 
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Apakah Anda yakin?",
  description = "Tindakan ini tidak dapat dibatalkan.",
  isLoading = false,
  confirmText = "Ya, Hapus",
  cancelText = "Batal",
  variant = "danger",
}: ConfirmModalProps) {
  
  // 1. Mapping Variant Modal ke Variant Button
  // danger -> destructive (merah)
  // success -> success (hijau)
  // primary -> primary (biru gradient)
  const getButtonVariant = () => {
    switch (variant) {
      case 'success': return 'success';
      case 'primary': return 'primary';
      default: return 'destructive'; // default danger
    }
  };

  // 2. Mapping Icon & Color Style untuk Hiasan Modal
  const getModalStyles = () => {
    switch (variant) {
      case 'success':
        return {
          bg: 'bg-green-50 border-green-200',
          iconBg: 'bg-green-100',
          icon: <CheckCircle className="h-5 w-5 text-green-600" />
        };
      case 'primary':
        return {
          bg: 'bg-blue-50 border-blue-200',
          iconBg: 'bg-blue-100',
          icon: <Info className="h-5 w-5 text-blue-600" />
        };
      default: // danger
        return {
          bg: 'bg-red-50 border-red-200',
          iconBg: 'bg-red-100',
          icon: <AlertTriangle className="h-5 w-5 text-red-600" />
        };
    }
  };

  const styles = getModalStyles();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4">
        
        {/* Area Deskripsi dengan Warna Dinamis */}
        <div className={`flex items-start space-x-4 p-4 rounded-lg border ${styles.bg}`}>
          <div className={`p-2 rounded-full flex-shrink-0 ${styles.iconBg}`}>
            {styles.icon}
          </div>
          <p className="text-sm text-gray-700 leading-relaxed pt-1">
            {description}
          </p>
        </div>

        {/* Tombol Aksi */}
        <div className="flex justify-end space-x-3 pt-2">
          <Button 
            variant="ghost" 
            onClick={onClose} 
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          
          {/* Gunakan variant resmi Button */}
          <Button 
            variant={getButtonVariant()} 
            onClick={onConfirm} 
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}