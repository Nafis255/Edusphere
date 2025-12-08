"use client"; 

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { PlayCircle, FileText, Calendar, Presentation, TextIcon, CheckCircle, Loader2 } from 'lucide-react';
import { getStudentMaterials } from '@/actions/student-actions'; // Import action baru

type MaterialData = {
  id: string;
  title: string;
  type: string;
  createdAt: Date;
  isCompleted?: boolean; // Nanti kita bisa tambah fitur ini
};

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function StudentMateriPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  
  const [materials, setMaterials] = useState<MaterialData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId) return;
    async function loadData() {
        const data = await getStudentMaterials(courseId);
        // @ts-ignore
        setMaterials(data);
        setLoading(false);
    }
    loadData();
  }, [courseId]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'VIDEO': return <PlayCircle className="h-5 w-5 text-blue-400" />;
      case 'PDF': return <FileText className="h-5 w-5 text-red-400" />;
      case 'PPT': return <Presentation className="h-5 w-5 text-orange-400" />;
      case 'TEXT': return <TextIcon className="h-5 w-5 text-gray-400" />;
      default: return <FileText className="h-5 w-5 text-gray-400" />;
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-500" /></div>;

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Materi Pembelajaran</CardTitle>
      </CardHeader>
      <CardContent className="px-4"> 
        {materials.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {materials.map(material => (
              <Link 
                key={material.id} 
                href={`/courses/${courseId}/materi/${material.id}`} // Link ke detail
                className="block py-4 px-2 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-white transition-colors">
                        {getIcon(material.type)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {material.title}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-3 text-sm text-gray-500 mt-1">
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium">{material.type}</span>
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(material.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Selesai (Dummy dulu, nanti bisa diaktifkan) */}
                  {/* {material.isCompleted && (
                    <span className="text-green-600 flex items-center text-xs font-medium bg-green-50 px-2 py-1 rounded-full">
                        <CheckCircle className="h-3 w-3 mr-1" /> Selesai
                    </span>
                  )} */}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-10">
            <p>Belum ada materi yang diunggah oleh dosen.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}