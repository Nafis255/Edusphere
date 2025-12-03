"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Course } from "@/lib/types"; 

interface CourseProgressCardProps {
  course: Course;
}

export default function CourseProgressCard({
  course,
}: CourseProgressCardProps) {
  return (
    <Card className="shadow-md overflow-hidden border-gray-200">
      <CardContent className="p-4 flex items-center space-x-4">
        <img
          src={course.imageUrl}
          alt={course.title}
          className="w-24 h-24 object-cover rounded-lg"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://placehold.co/96x96/E2E8F0/A0AEC0?text=IMG";
          }}
        />
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-900">
            {course.title}
          </h3>
          <p className="text-sm text-gray-500">
            Dr. {course.instructorName}
          </p>

          {/* Progress Bar */}
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="gradient-primary h-2.5 rounded-full"
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {course.progress}% selesai
            </p>
          </div>
        </div>

        {/* Tombol Lanjutkan */}
        <Link href={`/courses/${course.id}/materi`} passHref>
          <Button variant="secondary" size="sm">
            Lanjutkan
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
