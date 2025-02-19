"use client";

import { useSessionContext } from "@supabase/auth-helpers-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef, Suspense } from "react";
import { getAvailableModels, type ModelType } from "@/lib/models";
import { AnalysisProgress } from "@/components/AnalysisProgress";
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { formatDate } from "@/lib/utils";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";


interface Document {
  id: string;
  filename: string;
  created_at: string;
  status: string;
  risk_level: string;
}

const Dashboard = () => {
  const { session, isLoading } = useSessionContext();
  const router = useRouter();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
};

const DashboardContent = () => {
  const { session, isLoading } = useSessionContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [dragActive, setDragActive] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelType>('geminiPro');
  const [credits, setCredits] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [analysisStage, setAnalysisStage] = useState<'idle' | 'uploading' | 'reading' | 'analyzing' | 'summarizing' | 'complete' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [documents, setDocuments] = useState<Document[]>([]);
  const supabase = createClientComponentClient();

  // Protect the dashboard route
  useEffect(() => {
    if (!session && !isLoading) {
      router.replace('/sign-in');
    }
  }, [session, isLoading, router]);

  // Fetch documents
  const fetchDocuments = async () => {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setDocuments(data);
    }
  };

  // Add this effect to fetch credits
  const fetchCredits = async () => {
    if (session?.user) {
      console.log('Fetching credits for user:', session.user.id); // Debug log
      const { data, error } = await supabase
        .from('users')
        .select('credits')
        .eq('id', session.user.id)
        .single();
      
      if (data) {
        console.log('Credits data:', data); // Debug log
        setCredits(data.credits);
      }
      if (error) {
        console.error('Error fetching credits:', error); // Debug log
      }
    }
  };

  // Add this to listen for credits updates
  useEffect(() => {
    const channel = supabase
      .channel('credits')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'users',
          filter: `id=eq.${session?.user?.id}`,
        },
        (payload: any) => {
          setCredits(payload.new.credits);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [session, supabase]);

  // Handle successful payment
  useEffect(() => {
    if (sessionId) {
      try {
        // Clear the URL parameter without triggering a reload
        window.history.replaceState({}, '', '/dashboard');
        
        // Refresh necessary data
        fetchDocuments();
        fetchCredits();
      } catch (error) {
        console.error('Error handling successful payment:', error);
      }
    }
  }, [sessionId, fetchDocuments, fetchCredits]);

  // Add this useEffect after your function definitions
  useEffect(() => {
    fetchDocuments();
    fetchCredits();
  }, [supabase, session]);  // Add session to dependency array

  if (isLoading) {
    return null;
  }

  const simulateProgress = () => {
    setProgress(0);
    const stages = ['uploading', 'reading', 'analyzing', 'summarizing'];
    let currentStageIndex = 0;
    
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          if (currentStageIndex < stages.length - 1) {
            currentStageIndex++;
            setAnalysisStage(stages[currentStageIndex] as any);
            return 0;
          } else {
            clearInterval(progressInterval);
            return 100;
          }
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(progressInterval);
  };

  const handleFileSelect = async (file: File) => {
    // Check file type
    const validTypes = [
      'application/msword', // .doc
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'text/plain', // .txt
      'application/rtf' // .rtf
    ];
    
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid document file (DOC, DOCX, TXT OR RTF)');
      setAnalysisStage('idle');
      return;
    }

    try {
      setAnalysisStage('uploading');
      const stopProgress = simulateProgress();

      const text = await file.text();
      const formData = new FormData();
      formData.append('content', text);
      formData.append('filename', file.name);
      formData.append('model', selectedModel);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      setAnalysisStage('complete');
      setProgress(100);
      
      // Wait for completion animation
      setTimeout(() => {
        router.push(`/report/${data.documentId}`);
      }, 1000);

    } catch (error) {
      console.error('Error analyzing contract:', error);
      setAnalysisStage('error');
      setProgress(100);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Update the upload button click handler
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleUpgrade = async () => {
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Add this before your return statement
  const renderCreditsDisplay = () => (
    <div className="mb-8 flex items-center justify-between bg-[#1D2839]/10 border border-[#1D2839] rounded-lg p-4">
      <div>
        <h3 className="text-white font-medium">Remaining Credits</h3>
        <p className="text-[#8491A5]">
          {credits === 0 ? 'No credits remaining' : 'Available contract analyses'}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-2xl font-bold text-white">{credits ?? '-'}</span>
        {credits === 0 && (
          <button
            onClick={() => router.push('/dashboard/billing')}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
          >
            Get More Credits
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-black" />
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-20" 
        style={{
          backgroundImage: `radial-gradient(#1D2839 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Dashboard Content */}
      <div className="relative z-10">
        <DashboardHeader userEmail={session?.user?.email ?? ''} />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderCreditsDisplay()}
          {/* Upload Section */}
          <div className="relative mb-8">
            <div className="absolute -inset-1 bg-blue-500/5 rounded-2xl blur-xl" />
            <div 
              className={`relative p-8 border-2 border-dashed rounded-2xl transition-colors ${
                dragActive ? 'border-white bg-[#1D2839]/20' : 'border-[#1D2839] bg-[#0A0A0A]'
              }`}
              onDragEnter={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInputChange}
                className="hidden"
                accept=".doc,.docx,.txt,.rtf"
              />
              
              {analysisStage === 'idle' ? (
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-[#8491A5]" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m0 0v4a4 4 0 004 4h20a4 4 0 004-4V28m-4-4l-8-8-4 4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-white">Drop your contract here</h3>
                  <p className="mt-1 text-sm text-[#8491A5]">or click to upload</p>
                  <button 
                    onClick={handleUploadClick}
                    className="mt-4 px-4 py-2 rounded-full bg-white/10 text-white text-sm hover:bg-white/20 transition-colors"
                  >
                    Select file
                  </button>
                </div>
              ) : (
                <div className="w-full max-w-md mx-auto">
                  <AnalysisProgress 
                    stage={analysisStage} 
                    progress={progress} 
                  />
                </div>
              )}
            </div>
          </div>

          {/* Model Selector */}
          <div className="mb-8">
            <label htmlFor="model" className="block text-sm font-medium text-white mb-2">
              Select AI Model
            </label>
            <select 
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value as ModelType)}
              className="w-full px-4 py-2 rounded-lg bg-[#0A0A0A] border border-[#1D2839] text-white"
              disabled={analysisStage !== 'idle'}
            >
              {getAvailableModels().map(model => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>

          {/* Recent Documents */}
          <div className="bg-[#0A0A0A] border border-[#1D2839] rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Recent Documents</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#1D2839]/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-[#8491A5]">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-[#8491A5]">Uploaded at</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-[#8491A5]">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-[#8491A5]">Risk Level</th>
                    <th className="px-6 py-3 text-right text-sm font-medium text-[#8491A5]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1D2839]">
                  {documents.map((doc) => (
                    <tr key={doc.id}>
                      <td className="px-6 py-4 text-sm text-white">{doc.filename}</td>
                      <td className="px-6 py-4 text-sm text-[#8491A5]">
                        {formatDate(doc.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          doc.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                          doc.status === 'processing' ? 'bg-blue-500/10 text-blue-500' :
                          'bg-red-500/10 text-red-500'
                        }`}>
                          {doc.status === 'completed' ? 'Analyzed' : 
                           doc.status === 'processing' ? 'Processing' : 'Failed'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          doc.risk_level === 'high' ? 'bg-red-500/10 text-red-500' :
                          doc.risk_level === 'medium' ? 'bg-yellow-500/10 text-yellow-500' :
                          'bg-green-500/10 text-green-500'
                        }`}>
                          {doc.risk_level?.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => router.push(`/report/${doc.id}`)}
                          className="text-sm text-blue-500 hover:text-blue-400"
                        >
                          View Report
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
