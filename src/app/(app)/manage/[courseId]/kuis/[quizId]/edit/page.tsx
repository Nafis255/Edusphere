"use client";

import React, { useEffect, useState, useTransition } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ArrowLeft, Save, Trash2, CheckCircle, Loader2 } from 'lucide-react';
import { getQuizWithQuestions, createQuestion, deleteQuestion } from '@/actions/quiz-actions';

// Tipe data lokal
type Question = {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
};

type QuizDetail = {
  id: string;
  title: string;
  questions: Question[];
};

export default function EditQuizQuestionsPage() {
  const params = useParams();
  const quizId = params.quizId as string;
  const courseId = params.courseId as string;
  const router = useRouter();

  const [quiz, setQuiz] = useState<QuizDetail | null>(null);
  const [loading, setLoading] = useState(true);
  
  // State Form Soal
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState({ A: "", B: "", C: "", D: "" });
  const [correctKey, setCorrectKey] = useState<"A"|"B"|"C"|"D">("A"); // Radio button selection
  
  const [isPending, startTransition] = useTransition();

  // Load Data
  useEffect(() => {
    if (!quizId) return;
    loadData();
  }, [quizId]);

  async function loadData() {
    const data = await getQuizWithQuestions(quizId);
    // @ts-ignore
    setQuiz(data);
    setLoading(false);
  }

  // Handle Tambah Soal
  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Siapkan FormData manual agar sesuai dengan Server Action
    const formData = new FormData();
    formData.append("text", questionText);
    formData.append("optionA", options.A);
    formData.append("optionB", options.B);
    formData.append("optionC", options.C);
    formData.append("optionD", options.D);
    
    // Kunci jawaban yang dikirim adalah TEKS opsi yang dipilih (bukan huruf A/B/C)
    // Misal: Jika A dipilih, kirim value dari options.A
    formData.append("correctAnswer", options[correctKey]); 

    startTransition(async () => {
        const res = await createQuestion(quizId, formData);
        if (res?.error) {
            alert(res.error);
        } else {
            // Reset Form
            setQuestionText("");
            setOptions({ A: "", B: "", C: "", D: "" });
            setCorrectKey("A");
            // Reload Data
            loadData();
        }
    });
  };

  // Handle Hapus Soal
  const handleDeleteQuestion = async (id: string) => {
      if(!confirm("Hapus soal ini?")) return;
      await deleteQuestion(id);
      loadData(); // Reload
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>;
  if (!quiz) return <div>Kuis tidak ditemukan</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
            <Link href={`/manage/${courseId}/kuis`}>
                <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
            </Link>
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Soal</h1>
                <p className="text-gray-500 text-sm">{quiz.title}</p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* KOLOM KIRI: FORM TAMBAH SOAL */}
        <div className="lg:col-span-1">
            <Card className="sticky top-24 shadow-md border-blue-100">
                <CardHeader className="bg-blue-50/50 pb-4">
                    <CardTitle className="text-lg text-blue-700">Buat Soal Baru</CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                    <form onSubmit={handleAddQuestion}>
                        <div>
                            <label className="block text-sm font-medium mb-1">Pertanyaan</label>
                            <textarea 
                                required
                                className="w-full p-2 border rounded-md text-sm min-h-[80px]" 
                                placeholder="Tulis pertanyaan di sini..."
                                value={questionText}
                                onChange={(e) => setQuestionText(e.target.value)}
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="block text-sm font-medium">Pilihan Jawaban</label>
                            {(['A', 'B', 'C', 'D'] as const).map((key) => (
                                <div key={key} className="flex items-center gap-2">
                                    <input 
                                        type="radio" 
                                        name="correctKey"
                                        checked={correctKey === key}
                                        onChange={() => setCorrectKey(key)}
                                        className="w-4 h-4 text-blue-600 cursor-pointer"
                                        title="Tandai sebagai jawaban benar"
                                    />
                                    <Input 
                                        required={key === 'A' || key === 'B'} // Minimal 2 opsi
                                        placeholder={`Opsi ${key}`} 
                                        value={options[key]}
                                        onChange={(e) => setOptions({...options, [key]: e.target.value})}
                                        className={`h-9 text-sm ${correctKey === key ? 'border-blue-500 ring-1 ring-blue-500' : ''}`}
                                    />
                                </div>
                            ))}
                            <p className="text-xs text-gray-500">*Klik radio button untuk memilih kunci jawaban.</p>
                        </div>

                        <Button type="submit" disabled={isPending} className="w-full mt-4">
                            {isPending ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4 mr-2" />}
                            Simpan Soal
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>

        {/* KOLOM KANAN: DAFTAR SOAL */}
        <div className="lg:col-span-2 space-y-4">
            <h2 className="font-semibold text-gray-700">Daftar Soal ({quiz.questions.length})</h2>
            
            {quiz.questions.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 border border-dashed rounded-lg text-gray-500">
                    Belum ada soal. Silakan buat soal di panel kiri.
                </div>
            ) : (
                quiz.questions.map((q, idx) => (
                    <Card key={q.id} className="shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex gap-2">
                                        <span className="font-bold text-gray-500">#{idx + 1}</span>
                                        <p className="font-medium text-gray-900">{q.text}</p>
                                    </div>
                                    
                                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {q.options.map((opt, i) => (
                                            <div 
                                                key={i} 
                                                className={`
                                                    text-sm px-3 py-2 rounded-md border 
                                                    ${opt === q.correctAnswer 
                                                        ? 'bg-green-50 border-green-200 text-green-800 font-medium' 
                                                        : 'bg-gray-50 border-gray-100 text-gray-600'}
                                                `}
                                            >
                                                <div className="flex items-center gap-2">
                                                    {opt === q.correctAnswer && <CheckCircle className="h-3 w-3 text-green-600" />}
                                                    {opt}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="text-red-500 hover:bg-red-50 ml-2"
                                    onClick={() => handleDeleteQuestion(q.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))
            )}
        </div>

      </div>
    </div>
  );
}