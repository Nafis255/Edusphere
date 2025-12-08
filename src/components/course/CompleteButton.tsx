"use client";

import React, { useState, useTransition } from 'react';
import { Button } from '@/components/ui/Button';
import { CheckCircle, Circle, Loader2 } from 'lucide-react';
import { toggleMaterialCompletion } from '@/actions/progress-actions';
import { useRouter } from 'next/navigation';

interface Props {
  materialId: string;
  courseId: string;
  initialState: boolean;
}

export default function CompleteButton({ materialId, courseId, initialState }: Props) {
  const [isCompleted, setIsCompleted] = useState(initialState);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleToggle = () => {
    // Optimistic UI Update (Langsung ubah tampilan biar terasa cepat)
    const newState = !isCompleted;
    setIsCompleted(newState);

    startTransition(async () => {
      const res = await toggleMaterialCompletion(materialId, courseId, newState);
      if (res.success) {
        // Refresh router agar progress bar di layout ikut terupdate
        router.refresh(); 
      } else {
        // Rollback jika gagal
        setIsCompleted(!newState);
        alert("Gagal menyimpan progress.");
      }
    });
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleToggle}
      disabled={isPending}
      className={`
        transition-all border 
        ${isCompleted 
            ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100' 
            : 'border-gray-300 text-gray-600 hover:bg-gray-50'
        }
      `}
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : isCompleted ? (
        <CheckCircle className="h-4 w-4 mr-2" />
      ) : (
        <Circle className="h-4 w-4 mr-2" />
      )}
      {isCompleted ? "Selesai" : "Tandai Selesai"}
    </Button>
  );
}