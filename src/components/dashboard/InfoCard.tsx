import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

type InfoItem = {
  id: string;
  title: string;
  subtitle: string;
  badge?: string; // e.g., "2 hari lagi"
};

interface InfoCardProps {
  title: string;
  items: InfoItem[];
}

export default function InfoCard({ title, items }: InfoCardProps) {
  const getBadgeColor = (badge: string) => {
    if (badge.includes('hari')) return 'text-orange-600 bg-orange-100';
    if (badge.includes('minggu')) return 'text-red-600 bg-red-100';
    return 'text-gray-500 bg-gray-100'; // Default
  };
  
  return (
    <Card className="shadow-md h-full border-gray-200">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">{title}</CardTitle>
      </CardHeader>
      
      {/* Perubahan di CardContent dan div di bawahnya.
        - CardContent diberi className 'pt-0' agar padding atasnya 0.
        - div pembungkus list diubah dari 'space-y-4' menjadi 'divide-y'.
      */}
      <CardContent className="pt-0">
        <div className="divide-y divide-gray-300">
          {items.map((item) => (
            
            // Setiap item diberi padding vertikal 'py-4'
            <div key={item.id} className="flex justify-between items-start py-4"> 
              <div>
                <p className="font-medium text-gray-800">{item.title}</p>
                <p className="text-sm text-gray-500">{item.subtitle}</p>
              </div>
              {item.badge && (
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${getBadgeColor(item.badge)}`}>
                  {item.badge}
                </span>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}