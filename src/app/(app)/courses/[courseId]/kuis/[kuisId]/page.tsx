"use client";

import React, { useEffect, useState, useTransition, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Clock, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { getQuizQuestionsForStudent, submitQuizAttempt } from '@/actions/student-quiz-actions';
import { ConfirmModal } from '@/components/ui/ConfirmModal'; // <-- 1. Import Modal
import { toast } from 'sonner';

// Helper format detik ke MM:SS
const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export default function QuizInterfacePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const quizId = params.kuisId as string;

  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // State Interaksi
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({}); 
  const [isPending, startTransition] = useTransition();

  // State Modal Submit
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // State Timer
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const hasCheckedRef = useRef(false);

  useEffect(() => {
    if (!quizId) return;

    // 1. Buat variabel flag lokal
    let ignore = false;

    async function loadData() {
        const data: any = await getQuizQuestionsForStudent(quizId);
        
        // 2. Cek apakah komponen sudah "dibuang" (unmounted)?
        // Jika ignore = true, berarti ini adalah efek "hantu" dari Strict Mode -> Stop.
        if (ignore) return;

        if (data && data.completed) {
            toast.info("Sudah Dikerjakan", {
                description: "Anda sudah menyelesaikan kuis ini. Mengalihkan ke hasil..."
            });
            const { score, correct, total } = data.result;
            router.replace(`/courses/${courseId}/kuis/${quizId}/hasil?score=${score}&total=${total}&correct=${correct}`);
            return;
        }

        setQuiz(data);
        if (data && data.duration) {
            setTimeLeft(data.duration * 60);
        }
        setLoading(false);
    }

    loadData();

    // 3. Cleanup Function: Akan dipanggil otomatis oleh React saat efek dibersihkan
    return () => {
        ignore = true;
    };
  }, [quizId]);

  // 2. Logic Timer Countdown
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev !== null && prev <= 1) {
          clearInterval(timerRef.current!);
          // Waktu Habis -> Auto Submit (Tanpa Modal, langsung paksa)
          handleAutoSubmit();
          return 0;
        }
        return prev !== null ? prev - 1 : null;
      });
    }, 1000);

    return () => {
        if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeLeft]);

  // Fungsi Inti Submit (Dipanggil oleh Manual & Auto)
  const submitData = async () => {
    // Stop timer
    if (timerRef.current) clearInterval(timerRef.current);

    const result = await submitQuizAttempt(quizId, answers);
    
    if (result.success && result.result) {
        const { score, correctCount, totalQuestions } = result.result;
        // Redirect ke halaman hasil
        router.replace(`/courses/${courseId}/kuis/${quizId}/hasil?score=${score}&total=${totalQuestions}&correct=${correctCount}`);
    } else {
        toast.error(result.error || "Gagal mengirim jawaban.");
        setShowSubmitModal(false); // Tutup modal jika gagal
    }
  };

  // Handler Tombol "Selesai" (Buka Modal)
  const handleClickSubmit = () => {
    setShowSubmitModal(true);
  };

  // Handler Konfirmasi di Modal (Eksekusi Submit)
  const handleConfirmSubmit = () => {
    startTransition(() => submitData());
  };

  // Handler Waktu Habis (Langsung Submit tanpa tanya)
  const handleAutoSubmit = () => {
      toast.warning("Waktu Habis!", {description: " Jawaban Anda akan dikirim otomatis."});
      startTransition(() => submitData());
  };

  if (loading) return <div className="flex justify-center h-screen items-center"><Loader2 className="animate-spin text-blue-500 h-10 w-10" /></div>;
  if (!quiz) return <div className="text-center py-20">Kuis tidak ditemukan.</div>;

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  // Handle Pilih Jawaban
  const handleOptionSelect = (option: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: option
    }));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-6">
      
      {/* Header Sticky */}
      <div className="flex justify-between items-center sticky top-0 bg-gray-50 py-4 z-10 border-b border-gray-200">
        <div>
            <h1 className="text-xl font-bold text-gray-900">{quiz.title}</h1>
            <p className="text-sm text-gray-500">{quiz.questions.length} Soal</p>
        </div>
        
        {/* Tampilan Timer */}
        <div className={`flex items-center px-4 py-2 rounded-lg font-mono font-bold shadow-sm transition-colors
            ${(timeLeft || 0) < 60 ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-blue-100 text-blue-700'}
        `}>
            <Clock className="h-5 w-5 mr-2" />
            {timeLeft !== null ? formatTime(timeLeft) : "--:--"}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
            className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Kartu Soal */}
      <Card className="shadow-lg min-h-[400px] flex flex-col justify-between">
        <CardContent className="p-8">
            <h2 className="text-xl md:text-2xl font-medium text-gray-900 mb-8 leading-relaxed">
                <span className="font-bold text-gray-400 mr-4">#{currentQuestionIndex + 1}</span>
                {currentQuestion.text}
            </h2>

            <div className="space-y-3">
                {currentQuestion.options.map((option: string, idx: number) => {
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
      <div className="flex justify-between items-center pb-10">
        <Button 
            variant="secondary" 
            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
            className="w-32"
        >
            <ArrowLeft className="h-4 w-4 mr-2" /> Prev
        </Button>

        {currentQuestionIndex === totalQuestions - 1 ? (
             <Button 
                className="w-32 bg-green-600 hover:bg-green-700 text-white"
                onClick={handleClickSubmit} // <-- Buka Modal
                disabled={isPending}
            >
                {isPending ? <Loader2 className="animate-spin" /> : "Selesai"}
             </Button>
        ) : (
            <Button 
                className="w-32"
                onClick={() => setCurrentQuestionIndex(prev => Math.min(totalQuestions - 1, prev + 1))}
            >
                Next <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
        )}
      </div>

      {/* --- MODAL KONFIRMASI SUBMIT --- */}
      <ConfirmModal 
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onConfirm={handleConfirmSubmit}
        isLoading={isPending}
        title="Kirim Jawaban?"
        description="Apakah Anda yakin ingin menyelesaikan kuis ini? Pastikan semua soal telah terjawab."
        
        confirmText="Ya, Kirim Jawaban"
        variant="success" 
      />

    </div>
  );
}