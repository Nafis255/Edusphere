"use client";

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  buttonText?: string;
  variant?: 'success' | 'error' | 'warning' | 'info';
}

export function AlertModal({
  isOpen,
  onClose,
  title = "Informasi",
  description,
  buttonText = "OK",
  variant = "info",
}: AlertModalProps) {

  // 1. Tentukan Warna & Ikon berdasarkan Variant
  const getStyles = () => {
    switch (variant) {
      case 'success':
        return {
          icon: <CheckCircle className="h-6 w-6 text-green-600" />,
          bg: 'bg-green-50 border-green-200',
          btn: 'bg-green-600 hover:bg-green-700 text-white border-none'
        };
      case 'error':
        return {
          icon: <AlertCircle className="h-6 w-6 text-red-600" />,
          bg: 'bg-red-50 border-red-200',
          btn: 'bg-red-600 hover:bg-red-700 text-white border-none'
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="h-6 w-6 text-orange-600" />,
          bg: 'bg-orange-50 border-orange-200',
          btn: 'bg-orange-600 hover:bg-orange-700 text-white border-none'
        };
      default: // info
        return {
          icon: <Info className="h-6 w-6 text-blue-600" />,
          bg: 'bg-blue-50 border-blue-200',
          btn: 'bg-blue-600 hover:bg-blue-700 text-white border-none'
        };
    }
  };

  const style = getStyles();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-6">
        
        {/* Konten Utama */}
        <div className={`flex flex-col items-center text-center p-6 rounded-lg border ${style.bg}`}>
          <div className="mb-3 p-3 bg-white rounded-full shadow-sm">
            {style.icon}
          </div>
          <p className="text-gray-700 font-medium">
            {description}
          </p>
        </div>

        {/* Tombol Tunggal */}
        <div className="flex justify-center">
          <Button 
            className={`w-full md:w-auto min-w-[100px] ${style.btn}`}
            onClick={onClose}
          >
            {buttonText}
          </Button>
        </div>

      </div>
    </Modal>
  );
}