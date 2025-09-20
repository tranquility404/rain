import CallScheduling from '@/components/CallScheduling';
import { useNavigate, useParams } from 'react-router-dom';

const Schedule = () => {
  const navigate = useNavigate();
  const { contractorId } = useParams();

  const handleCallScheduled = () => {
    navigate('/payment');
  };

  return (
    <div className="min-h-screen bg-gradient-card">
      <CallScheduling
        contractorId={contractorId ? parseInt(contractorId) : 1}
        onCallScheduled={handleCallScheduled}
      />
    </div>
  );
};

export default Schedule;