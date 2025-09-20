import { useState } from 'react';
import ScrollProgress from '@/components/ScrollProgress';
import Navigation from '@/components/Navigation';
import ImageCapture from '@/components/ImageCapture';
import MarketplaceSection from '@/components/MarketplaceSection';
import ContractorSelection from '@/components/ContractorSelection';
import CallScheduling from '@/components/CallScheduling';
import PaymentSection from '@/components/PaymentSection';
import InstallationScheduling from '@/components/InstallationScheduling';
import Dashboard from '@/components/Dashboard';

const Workflow = () => {
  const [currentStep, setCurrentStep] = useState('capture');
  const [selectedContractor, setSelectedContractor] = useState<number | null>(null);

  const handleAnalysisComplete = () => {
    setCurrentStep('marketplace');
  };

  const handleMarketplaceComplete = () => {
    setCurrentStep('contractors');
  };

  const handleScheduleCall = (contractorId: number) => {
    setSelectedContractor(contractorId);
    setCurrentStep('scheduling');
  };

  const handleCallScheduled = () => {
    setCurrentStep('payment');
  };

  const handlePaymentComplete = () => {
    setCurrentStep('installation');
  };

  const handleInstallationScheduled = () => {
    setCurrentStep('dashboard');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'capture':
        return <ImageCapture onAnalysisComplete={handleAnalysisComplete} />;
      case 'marketplace':
        return <MarketplaceSection onComplete={handleMarketplaceComplete} />;
      case 'contractors':
        return <ContractorSelection onScheduleCall={handleScheduleCall} />;
      case 'scheduling':
        return selectedContractor ? (
          <CallScheduling 
            contractorId={selectedContractor} 
            onCallScheduled={handleCallScheduled} 
          />
        ) : null;
      case 'payment':
        return <PaymentSection onPaymentComplete={handlePaymentComplete} />;
      case 'installation':
        return <InstallationScheduling onInstallationScheduled={handleInstallationScheduled} />;
      case 'dashboard':
        return <Dashboard />;
      default:
        return <ImageCapture onAnalysisComplete={handleAnalysisComplete} />;
    }
  };

  return (
    <div className="relative">
      <ScrollProgress />
      <Navigation />
      <main>
        {renderCurrentStep()}
      </main>
    </div>
  );
};

export default Workflow;