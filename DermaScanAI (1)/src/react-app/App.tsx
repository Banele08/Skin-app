import { BrowserRouter as Router, Routes, Route } from "react-router";
import HomePage from "@/react-app/pages/Home";
import AnalysisPage from "@/react-app/pages/Analysis";
import ResultsPage from "@/react-app/pages/Results";
import HistoryPage from "@/react-app/pages/History";
import AuthCallback from "@/react-app/pages/AuthCallback";
import { SkinAnalysisProvider } from "@/react-app/hooks/useSkinAnalysis";
import { AuthProvider } from "@/react-app/hooks/useAuth";

export default function App() {
  return (
    <AuthProvider>
      <SkinAnalysisProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/analysis" element={<AnalysisPage />} />
            <Route path="/results/:id" element={<ResultsPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
          </Routes>
        </Router>
      </SkinAnalysisProvider>
    </AuthProvider>
  );
}
