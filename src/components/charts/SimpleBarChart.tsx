"use client";

import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

interface ChartData {
  name: string;
  [key: string]: any;
}

interface SimpleBarChartProps {
  data: ChartData[];
  barKey: string;
  fillColor: string;
}

export default function SimpleBarChart({ data, barKey, fillColor }: SimpleBarChartProps) {
  // 1. Hitung lebar dinamis
  // Misal: Setiap bar butuh minimal 100px.
  // Jika total lebar < 100%, dia akan stretch 100%.
  // Jika total lebar > 100%, dia akan memanjang dan memunculkan scrollbar.
  const minWidthPerBar = 120; // Pixel per bar (biar label muat)
  const dynamicWidth = Math.max(data.length * minWidthPerBar, 500); // Minimal 500px agar tidak kekecilan di awal

  return (
    <div className="w-full overflow-x-auto pb-4"> {/* Container Scroll */}
      <div style={{ width: `${dynamicWidth}px`, height: 300 }}> {/* Container Lebar Dinamis */}
        
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data} 
            margin={{ top: 10, right: 30, left: 0, bottom: 20 }} // Tambah margin bawah untuk label
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            
            <XAxis 
              dataKey="name" 
              stroke="#888888" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              interval={0} // Paksa semua label muncul
              // Jika label terlalu panjang, potong text-nya
              tickFormatter={(value) => value.length > 10 ? `${value.substring(0, 10)}...` : value}
            />
            
            <YAxis 
              stroke="#888888" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(value) => `${value}`}
            />
            
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
              }}
            />
            
            {/* Bar dengan lebar tetap atau max-width agar estetik */}
            <Bar 
                dataKey={barKey} 
                fill={fillColor} 
                radius={[4, 4, 0, 0]} 
                barSize={40} // Lebar bar fix agar konsisten (tidak kurus/gemuk sendiri)
            />
          </BarChart>
        </ResponsiveContainer>

      </div>
    </div>
  );
}