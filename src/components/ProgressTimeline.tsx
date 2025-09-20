import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Camera, ShoppingCart, Users, Phone, CreditCard, Calendar, BarChart3 } from 'lucide-react';

interface Step {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
}

interface ProgressTimelineProps {
  currentStep: string;
  completedSteps: string[];
}

const steps: Step[] = [
  { id: 'capture', label: 'Image Analysis', icon: Camera, description: 'Upload rooftop image' },
  { id: 'marketplace', label: 'Select Package', icon: ShoppingCart, description: 'Choose harvesting system' },
  { id: 'contractors', label: 'Choose Contractor', icon: Users, description: 'Select installation expert' },
  { id: 'scheduling', label: 'Schedule Call', icon: Phone, description: 'Book consultation' },
  { id: 'payment', label: 'Payment', icon: CreditCard, description: 'Complete transaction' },
  { id: 'installation', label: 'Installation', icon: Calendar, description: 'Schedule setup date' }
];

const ProgressTimeline = ({ currentStep, completedSteps }: ProgressTimelineProps) => {
  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  
  return (
    <div className="w-full py-8 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10">
      <div className="container mx-auto px-4">
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-8 left-0 w-full h-1 bg-muted/30 rounded-full">
            <motion.div
              className="h-full bg-gradient-water rounded-full"
              initial={{ width: '0%' }}
              animate={{ 
                width: `${(completedSteps.length / (steps.length - 1)) * 100}%` 
              }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>

          {/* Steps */}
          <div className="flex justify-between relative">
            {steps.map((step, index) => {
              const isCompleted = completedSteps.includes(step.id);
              const isCurrent = step.id === currentStep;
              const isPast = index < currentStepIndex;
              
              return (
                <motion.div
                  key={step.id}
                  className="flex flex-col items-center text-center max-w-[120px]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* Step Circle */}
                  <motion.div
                    className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 relative z-10 ${
                      isCompleted || isCurrent
                        ? 'bg-gradient-water shadow-lg'
                        : 'bg-muted/30 border-2 border-muted'
                    }`}
                    whileHover={{ scale: 1.1 }}
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
                      <step.icon className={`w-8 h-8 ${
                        isCurrent ? 'text-white' : 'text-muted-foreground'
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
                    <h3 className={`font-semibold text-sm mb-1 ${
                      isCompleted || isCurrent ? 'text-primary' : 'text-muted-foreground'
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
  );
};

export default ProgressTimeline;