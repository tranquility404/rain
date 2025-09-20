import PaymentSection from '@/components/PaymentSection';
import { useNavigate } from 'react-router-dom';

const Payment = () => {
  const navigate = useNavigate();

  const handlePaymentComplete = () => {
    navigate('/installation');
  };

  return (
    <div className="min-h-screen bg-gradient-card">
      <PaymentSection onPaymentComplete={handlePaymentComplete} />
    </div>
  );
};

export default Payment;