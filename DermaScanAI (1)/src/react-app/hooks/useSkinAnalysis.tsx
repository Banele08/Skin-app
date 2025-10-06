import { createContext, useContext, useState, ReactNode } from 'react';
import { AnalysisResponse, CreateAnalysisRequest, SkinAnalysis } from '@/shared/types';

interface SkinAnalysisContextType {
  currentAnalysis: AnalysisResponse | null;
  isLoading: boolean;
  error: string | null;
  analyzeImage: (request: CreateAnalysisRequest) => Promise<AnalysisResponse | null>;
  getAnalysis: (id: number) => Promise<AnalysisResponse | null>;
  getUserAnalyses: (email: string) => Promise<SkinAnalysis[]>;
  clearAnalysis: () => void;
}

const SkinAnalysisContext = createContext<SkinAnalysisContextType | undefined>(undefined);

export function SkinAnalysisProvider({ children }: { children: ReactNode }) {
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeImage = async (request: CreateAnalysisRequest): Promise<AnalysisResponse | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze image');
      }

      const data: AnalysisResponse = await response.json();
      setCurrentAnalysis(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getAnalysis = async (id: number): Promise<AnalysisResponse | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/analysis/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to get analysis');
      }

      const data: AnalysisResponse = await response.json();
      setCurrentAnalysis(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getUserAnalyses = async (email: string): Promise<SkinAnalysis[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/user/${encodeURIComponent(email)}/analyses`);
      
      if (!response.ok) {
        throw new Error('Failed to get user analyses');
      }

      const data: SkinAnalysis[] = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const clearAnalysis = () => {
    setCurrentAnalysis(null);
    setError(null);
  };

  const value = {
    currentAnalysis,
    isLoading,
    error,
    analyzeImage,
    getAnalysis,
    getUserAnalyses,
    clearAnalysis,
  };

  return (
    <SkinAnalysisContext.Provider value={value}>
      {children}
    </SkinAnalysisContext.Provider>
  );
}

export function useSkinAnalysis() {
  const context = useContext(SkinAnalysisContext);
  if (context === undefined) {
    throw new Error('useSkinAnalysis must be used within a SkinAnalysisProvider');
  }
  return context;
}
