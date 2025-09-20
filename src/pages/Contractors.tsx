import { useState } from 'react';
import ContractorSelection from '@/components/ContractorSelection';
import { useNavigate } from 'react-router-dom';

const Contractors = () => {
  const navigate = useNavigate();

  const handleScheduleCall = (contractorId: number) => {
    navigate(`/schedule/${contractorId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-card">
      <ContractorSelection onScheduleCall={handleScheduleCall} />
    </div>
  );
};

export default Contractors;