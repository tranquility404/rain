import ImageCapture from '@/components/ImageCapture';
import { useNavigate } from 'react-router-dom';

const Capture = () => {
  const navigate = useNavigate();

  const handleAnalysisComplete = () => {
    navigate('/marketplace');
  };

  return (
    <div className="min-h-screen bg-gradient-card">
      <ImageCapture onAnalysisComplete={handleAnalysisComplete} />
    </div>
  );
};

export default Capture;