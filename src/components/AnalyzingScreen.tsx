import { motion } from 'framer-motion';
import { Scan, Zap, Brain, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface AnalyzingScreenProps {
  onComplete: () => void;
  image: string;
}

const AnalyzingScreen = ({ onComplete, image }: AnalyzingScreenProps) => {
  const analysisSteps = [
    { id: 1, text: 'Processing image data...', icon: Scan, delay: 0 },
    { id: 2, text: 'Detecting rooftop boundaries...', icon: Brain, delay: 1000 },
    { id: 3, text: 'Calculating optimal placement...', icon: Zap, delay: 2000 },
    { id: 4, text: 'Generating recommendations...', icon: CheckCircle, delay: 3000 }
  ];

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-lg z-50 flex items-center justify-center">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="p-8 glass border-white/20 shadow-glass">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Image Section */}
              <div className="relative">
                <div className="relative rounded-xl overflow-hidden">
                  <img 
                    src={image} 
                    alt="Analyzing rooftop" 
                    className="w-full h-80 object-cover"
                  />
                  
                  {/* Scanning overlay */}
                  <motion.div
                    className="absolute inset-0 border-2 border-primary"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  
                  {/* Scanning line */}
                  <motion.div
                    className="absolute w-full h-0.5 bg-gradient-water"
                    initial={{ top: 0, opacity: 0 }}
                    animate={{ top: '100%', opacity: [0, 1, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  
                  {/* Grid overlay */}
                  <div className="absolute inset-0 bg-grid-primary/20" style={{
                    backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                  }} />
                </div>
              </div>

              {/* Analysis Steps */}
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <motion.div
                    className="w-20 h-20 bg-gradient-water rounded-full flex items-center justify-center mx-auto mb-4"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Brain className="w-10 h-10 text-white" />
                  </motion.div>
                  <h2 className="text-3xl font-bold mb-2 text-card-foreground">AI Analysis in Progress</h2>
                  <p className="text-muted-foreground">
                    Our advanced machine learning model is analyzing your rooftop...
                  </p>
                </div>

                <div className="space-y-4">
                  {analysisSteps.map((step, index) => (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: step.delay / 1000, duration: 0.5 }}
                      className="flex items-center space-x-4 p-4 rounded-lg bg-gradient-card/50"
                    >
                      <motion.div
                        className="w-10 h-10 bg-gradient-water rounded-full flex items-center justify-center"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ delay: step.delay / 1000 + 0.5, duration: 0.5 }}
                      >
                        <step.icon className="w-5 h-5 text-white" />
                      </motion.div>
                      <div className="flex-1">
                        <p className="text-card-foreground font-medium">{step.text}</p>
                        <motion.div
                          className="w-full bg-muted/30 rounded-full h-2 mt-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: step.delay / 1000 }}
                        >
                          <motion.div
                            className="bg-gradient-water h-2 rounded-full"
                            initial={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            transition={{ delay: step.delay / 1000, duration: 1 }}
                          />
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 4 }}
                  className="text-center"
                >
                  <motion.button
                    onClick={onComplete}
                    className="bg-gradient-hero text-white px-8 py-3 rounded-xl font-semibold shadow-water hover:opacity-90 transition-opacity"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View Results
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyzingScreen;