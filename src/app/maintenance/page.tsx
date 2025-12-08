import React from 'react';
import Link from 'next/link';
import { Wrench } from 'lucide-react';

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100">
        <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
          <Wrench className="h-8 w-8 text-orange-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Sedang Dalam Perbaikan</h1>
        <p className="text-gray-600 mb-6">
          Sistem sedang menjalani pemeliharaan rutin. Kami akan segera kembali.
          <br />
          <span className="text-sm text-gray-400 mt-2 block">(Hanya Admin yang dapat mengakses saat ini)</span>
        </p>
        
        <Link 
          href="/" 
          className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}