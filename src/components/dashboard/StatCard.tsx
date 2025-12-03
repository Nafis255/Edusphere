import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string; 
}

export default function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  const bgColorClass = color.replace('text-', 'bg-').replace('500', '100'); 


  return (
    <Card className="shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6 flex items-center justify-between">
        {/* Bagian Kiri: Judul dan Nilai */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>
          <h3 className="text-3xl font-bold text-gray-900">
            {value}
          </h3>
        </div>

        {/* Bagian Kanan: Ikon dengan Background */}
        <div className={`p-3 rounded-xl ${bgColorClass}bg-opacity-50`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </CardContent>
    </Card>
  );
}