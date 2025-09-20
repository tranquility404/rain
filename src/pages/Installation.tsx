import InstallationScheduling from '@/components/InstallationScheduling';
import { useNavigate } from 'react-router-dom';

const Installation = () => {
  const navigate = useNavigate();

  const handleInstallationScheduled = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-card">
      <InstallationScheduling onInstallationScheduled={handleInstallationScheduled} />
    </div>
  );
};

export default Installation;