"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Clock, CheckCircle, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';

import { mockCourses } from '@/data/mockData';

export default function QuizInterfacePage() {
  const params = useParams();
  const router = useRouter(); // Untuk redirect setelah selesai
  const courseId = params.courseId as string;
  const quizId = params.kuisId as string;

  // Cari data kuis
  const course = mockCourses.find(c => c.id === courseId);
  const quiz = course?.quizzes.find(q => q.id === quizId);

  // State Management
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({}); // Menyimpan jawaban { questionId: option }
  const [isSubmitted, setIsSubmitted] = useState(false); // Status apakah sudah submit

  if (!quiz) return <div>Kuis tidak ditemukan.</div>;

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  // Fungsi pilih jawaban
  const handleOptionSelect = (option: string) => {
    if (isSubmitted) return; // Jangan bisa pilih kalau sudah submit
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: option
    }));
  };

  // Navigasi Soal
  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // Submit Kuis (Hitung Skor Sederhana)
  const handleSubmit = () => {
    setIsSubmitted(true);
    // Di sini nanti kita bisa redirect ke halaman result atau tampilkan modal skor
    // Untuk sekarang, kita tampilkan alert skor dulu
    let score = 0;
    quiz.questions.forEach(q => {
        if (answers[q.id] === q.correctAnswer) score++;
    });
    const totalQuestions = quiz?.questions.length || 1;
    const finalScore = Math.round((score / totalQuestions) * 100);
    
    alert(`Kuis Selesai! Skor Anda: ${finalScore}`);
    // Redirect kembali ke list kuis (opsional)
    router.push(`/courses/${courseId}/kuis/${quizId}/hasil?score=${finalScore}&total=${totalQuestions}&correct=${score}`);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header Kuis (Judul & Timer) */}
      <div className="flex justify-between items-center">
        <div>
            <p className="text-sm text-gray-500">{course?.title}</p>
            <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
        </div>
        <div className="flex items-center bg-orange-100 text-orange-700 px-4 py-2 rounded-lg font-mono font-bold">
            <Clock className="h-5 w-5 mr-2" />
            30:00
        </div>
      </div>

      {/* Progress Bar */}
      <Card className="shadow-sm border-none bg-gray-50">
        <CardContent className="p-4">
            <div className="flex justify-between text-sm mb-2 text-gray-600">
                <span>Soal {currentQuestionIndex + 1} dari {totalQuestions}</span>
                <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                    className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </CardContent>
      </Card>

      {/* Kartu Soal Utama */}
      <Card className="shadow-lg min-h-[400px] flex flex-col justify-between">
        <CardContent className="p-8">
            
            {/* Badge Tipe Soal */}
            <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                {currentQuestion.type}
            </span>

            {/* Teks Soal */}
            <h2 className="text-xl md:text-2xl font-medium text-gray-900 mb-8 leading-relaxed">
                {currentQuestion.questionText}
            </h2>

            {/* Pilihan Jawaban */}
            <div className="space-y-3">
                {currentQuestion.options.map((option, idx) => {
                    const isSelected = answers[currentQuestion.id] === option;
                    return (
                        <div 
                            key={idx}
                            onClick={() => handleOptionSelect(option)}
                            className={`
                                flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all
                                ${isSelected 
                                    ? 'border-blue-500 bg-blue-50' 
                                    : 'border-gray-200 hover:border-blue-300'
                                }
                            `}
                        >
                            {/* Lingkaran Radio Custom */}
                            <div className={`
                                w-5 h-5 rounded-full border flex items-center justify-center mr-4
                                ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-400'}
                            `}>
                                {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                            </div>
                            
                            <span className={`text-lg ${isSelected ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>
                                {option}
                            </span>
                        </div>
                    );
                })}
            </div>

        </CardContent>
      </Card>

      {/* Navigasi Bawah */}
      <div className="flex justify-between items-center">
        <Button 
            variant="secondary" 
            onClick={handlePrev}
            disabled={currentQuestionIndex === 0}
            className="w-32"
        >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Sebelumnya
        </Button>

        {/* Indikator Soal (Kotak-kotak kecil di tengah) */}
        <div className="hidden md:flex space-x-2">
            {quiz.questions.map((_, idx) => (
                <div 
                    key={idx}
                    className={`
                        w-8 h-8 flex items-center justify-center rounded-md text-sm font-bold
                        ${idx === currentQuestionIndex 
                            ? 'bg-blue-500 text-white' 
                            : answers[quiz.questions[idx].id] 
                                ? 'bg-blue-100 text-blue-600' // Sudah dijawab
                                : 'bg-gray-200 text-gray-500'
                        }
                    `}
                >
                    {idx + 1}
                </div>
            ))}
        </div>

        {currentQuestionIndex === totalQuestions - 1 ? (
             <Button 
                className="w-32 bg-green-600 hover:bg-green-700 text-white"
                onClick={handleSubmit}
            >
                Submit Quiz
             </Button>
        ) : (
            <Button 
                className="w-32"
                onClick={handleNext}
            >
                Selanjutnya
                <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
        )}
       
      </div>

    </div>
  );
}