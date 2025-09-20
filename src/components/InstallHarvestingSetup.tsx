import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Camera, ShoppingCart, Users, Phone, CreditCard, Calendar, BarChart3 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import ImageCapture from './ImageCapture';
import MarketplaceSection from './MarketplaceSection';
import ContractorSelection from './ContractorSelection';
import CallScheduling from './CallScheduling';
import PaymentSection from './PaymentSection';
import InstallationScheduling from './InstallationScheduling';
import Dashboard from './Dashboard';

interface Step {
    id: string;
    label: string;
    icon: React.ElementType;
    description: string;
    route: string;
}

interface InstallHarvestingSetupProps {
    children?: React.ReactNode;
    currentStep?: string;
    completedSteps?: string[];
}

const steps: Step[] = [
    { id: 'capture', label: 'Image Analysis', icon: Camera, description: 'Upload rooftop image', route: '/capture' },
    { id: 'marketplace', label: 'Select Package', icon: ShoppingCart, description: 'Choose harvesting system', route: '/marketplace' },
    { id: 'contractors', label: 'Choose Contractor', icon: Users, description: 'Select installation expert', route: '/contractors' },
    { id: 'scheduling', label: 'Schedule Call', icon: Phone, description: 'Book consultation', route: '/schedule' },
    { id: 'payment', label: 'Payment', icon: CreditCard, description: 'Complete transaction', route: '/payment' },
    { id: 'installation', label: 'Installation', icon: Calendar, description: 'Schedule setup date', route: '/installation' }
];

const InstallHarvestingSetup = ({ children, currentStep = 'capture', completedSteps = [] }: InstallHarvestingSetupProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [localCurrentStep, setLocalCurrentStep] = useState<string>(currentStep);
    const [localCompletedSteps, setLocalCompletedSteps] = useState<string[]>(completedSteps);

    const currentStepIndex = steps.findIndex(step => step.id === localCurrentStep);

    // Update completed steps when current step changes
    useEffect(() => {
        const stepIndex = steps.findIndex(step => step.id === localCurrentStep);
        if (stepIndex > 0) {
            const previousSteps = steps.slice(0, stepIndex).map(step => step.id);
            setLocalCompletedSteps(prev => {
                const newCompleted = [...new Set([...prev, ...previousSteps])];
                return newCompleted;
            });
        }
    }, [localCurrentStep]);

    const handleStepClick = (stepId: string) => {
        const stepIndex = steps.findIndex(step => step.id === stepId);
        const currentIndex = steps.findIndex(step => step.id === localCurrentStep);

        // Allow navigation to completed steps or next step
        if (stepIndex <= currentIndex + 1 || localCompletedSteps.includes(stepId)) {
            setLocalCurrentStep(stepId);
        }
    };

    const goToNextStep = () => {
        const currentIndex = steps.findIndex(step => step.id === localCurrentStep);
        if (currentIndex < steps.length - 1) {
            const nextStep = steps[currentIndex + 1];
            setLocalCurrentStep(nextStep.id);
            // Mark current step as completed
            setLocalCompletedSteps(prev => [...new Set([...prev, localCurrentStep])]);
        }
    };

    const goToDashboard = () => {
        // Mark installation as completed
        setLocalCompletedSteps(prev => [...new Set([...prev, localCurrentStep])]);
        // Navigate to the actual dashboard route
        navigate('/dashboard');
    };

    // Render the appropriate component based on current step
    const renderStepComponent = () => {
        switch (localCurrentStep) {
            case 'capture':
                return <ImageCapture onAnalysisComplete={goToNextStep} />;
            case 'marketplace':
                return <MarketplaceSection onComplete={goToNextStep} />;
            case 'contractors':
                return <ContractorSelection onScheduleCall={(contractorId) => goToNextStep()} />;
            case 'scheduling':
                return <CallScheduling contractorId={1} onCallScheduled={goToNextStep} />;
            case 'payment':
                return <PaymentSection onPaymentComplete={goToNextStep} />;
            case 'installation':
                return <InstallationScheduling onInstallationScheduled={goToDashboard} />;
            case 'dashboard':
                return <Dashboard />;
            default:
                return children;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-card">
            {/* Progress Timeline */}
            <div className="w-full py-8 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10">
                <div className="container mx-auto px-4">
                    <div className="relative">
                        {/* Progress Line */}
                        <div className="absolute top-8 left-0 w-full h-1 bg-muted/30 rounded-full">
                            <motion.div
                                className="h-full bg-gradient-water rounded-full"
                                initial={{ width: '0%' }}
                                animate={{
                                    width: `${(localCompletedSteps.length / (steps.length - 1)) * 100}%`
                                }}
                                transition={{ duration: 0.8, ease: 'easeOut' }}
                            />
                        </div>

                        {/* Steps */}
                        <div className="flex justify-between relative">
                            {steps.map((step, index) => {
                                const isCompleted = localCompletedSteps.includes(step.id);
                                const isCurrent = step.id === localCurrentStep;
                                const isPast = index < currentStepIndex;
                                const isClickable = index <= currentStepIndex + 1 || isCompleted;

                                return (
                                    <motion.div
                                        key={step.id}
                                        className={`flex flex-col items-center text-center max-w-[120px] ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed'
                                            }`}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        onClick={() => isClickable && handleStepClick(step.id)}
                                    >
                                        {/* Step Circle */}
                                        <motion.div
                                            className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 relative z-10 ${isCompleted || isCurrent
                                                ? 'bg-gradient-water shadow-lg'
                                                : isClickable
                                                    ? 'bg-muted/30 border-2 border-muted hover:bg-muted/50'
                                                    : 'bg-muted/20 border-2 border-muted/50'
                                                }`}
                                            whileHover={isClickable ? { scale: 1.1 } : {}}
                                            animate={{
                                                scale: isCurrent ? [1, 1.1, 1] : 1,
                                            }}
                                            transition={{
                                                scale: isCurrent ? { repeat: Infinity, duration: 2 } : {}
                                            }}
                                        >
                                            {isCompleted ? (
                                                <CheckCircle className="w-8 h-8 text-white" />
                                            ) : (
                                                <step.icon className={`w-8 h-8 ${isCurrent ? 'text-white' :
                                                    isClickable ? 'text-muted-foreground' : 'text-muted-foreground/50'
                                                    }`} />
                                            )}

                                            {/* Current step pulse */}
                                            {isCurrent && (
                                                <motion.div
                                                    className="absolute inset-0 rounded-full bg-primary/30"
                                                    animate={{
                                                        scale: [1, 1.3, 1],
                                                        opacity: [1, 0, 1],
                                                    }}
                                                    transition={{
                                                        duration: 2,
                                                        repeat: Infinity,
                                                    }}
                                                />
                                            )}
                                        </motion.div>

                                        {/* Step Info */}
                                        <div className="text-center">
                                            <h3 className={`font-semibold text-sm mb-1 ${isCompleted || isCurrent ? 'text-primary' :
                                                isClickable ? 'text-muted-foreground' : 'text-muted-foreground/50'
                                                }`}>
                                                {step.label}
                                            </h3>
                                            <p className="text-xs text-muted-foreground hidden md:block">
                                                {step.description}
                                            </p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                {renderStepComponent()}
            </main>
        </div>
    );
};

export default InstallHarvestingSetup;