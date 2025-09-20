import MarketplaceSection from '@/components/MarketplaceSection';
import { useNavigate } from 'react-router-dom';

const Marketplace = () => {
  const navigate = useNavigate();

  const handleComplete = () => {
    navigate('/contractors');
  };

  return (
    <div className="min-h-screen bg-gradient-card">
      <MarketplaceSection onComplete={handleComplete} />
    </div>
  );
};

export default Marketplace;