import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, Upload, Scan, CheckCircle, AlertCircle } from 'lucide-react';
import RippleButton from './RippleButton';
import AnalyzingScreen from './AnalyzingScreen';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface ImageCaptureProps {
  onAnalysisComplete?: () => void;
}

const ImageCapture = ({ onAnalysisComplete }: ImageCaptureProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalyzing, setShowAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        analyzeImage();
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    setShowAnalyzing(true);
  };

  const handleAnalysisComplete = () => {
    const mockResult = {
      rooftopArea: 1250,
      availableSpace: 950,
      estimatedCapacity: 15000,
      suitabilityScore: 87,
      recommendations: [
        'Install 3 large collection tanks (5000L each)',
        'Add guttering system on east and west sides',
        'Install first-flush diverter for better water quality'
      ]
    };
    
    setAnalysisResult(mockResult);
    setShowAnalyzing(false);
    
    toast({
      title: "Analysis Complete!",
      description: "Your rooftop has been successfully analyzed.",
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      {showAnalyzing && uploadedImage && (
        <AnalyzingScreen 
          image={uploadedImage} 
          onComplete={handleAnalysisComplete}
        />
      )}
      
      <section id="capture" className="py-20 bg-gradient-card">
        <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-water bg-clip-text text-transparent">
              Capture Your Rooftop
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload an image of your rooftop and let our AI analyze the optimal 
            rainwater harvesting setup for your space.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 h-full glass border-white/20 shadow-glass">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-water rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Camera className="w-10 h-10 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-semibold mb-4">Upload Rooftop Image</h3>
                  <p className="text-muted-foreground mb-8">
                    Take a clear aerial or elevated photo of your rooftop for accurate analysis
                  </p>

                  {!uploadedImage ? (
                    <div className="border-2 border-dashed border-muted rounded-xl p-8 hover:border-primary/50 transition-colors cursor-pointer"
                         onClick={triggerFileInput}>
                      <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-lg font-medium mb-2">Drop your image here</p>
                      <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
                      <RippleButton variant="outline">
                        Select Image
                      </RippleButton>
                    </div>
                  ) : (
                    <div className="relative rounded-xl overflow-hidden mb-6">
                      <img 
                        src={uploadedImage} 
                        alt="Uploaded rooftop" 
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        {isAnalyzing && (
                          <div className="text-white text-center">
                            <Scan className="w-8 h-8 mx-auto mb-2 animate-pulse" />
                            <p>Analyzing...</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </Card>
            </motion.div>

            {/* Results Section */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 h-full glass border-white/20 shadow-glass">
                {!analysisResult ? (
                  <div className="flex items-center justify-center h-full text-center">
                    <div>
                      <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Analysis Pending</h3>
                      <p className="text-muted-foreground">
                        Upload your rooftop image to get started with the analysis
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center mb-6">
                      <CheckCircle className="w-8 h-8 text-secondary mr-3" />
                      <h3 className="text-2xl font-semibold">Analysis Results</h3>
                    </div>

                    <div className="space-y-4 mb-8">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gradient-water/10 rounded-lg p-4">
                          <p className="text-sm text-muted-foreground">Total Area</p>
                          <p className="text-xl font-bold">{analysisResult.rooftopArea} m²</p>
                        </div>
                        <div className="bg-gradient-eco/10 rounded-lg p-4">
                          <p className="text-sm text-muted-foreground">Available Space</p>
                          <p className="text-xl font-bold">{analysisResult.availableSpace} m²</p>
                        </div>
                      </div>

                      <div className="bg-gradient-hero/10 rounded-lg p-4">
                        <p className="text-sm text-muted-foreground">Estimated Capacity</p>
                        <p className="text-2xl font-bold text-primary">{analysisResult.estimatedCapacity}L</p>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Suitability Score</p>
                        <div className="w-full bg-muted rounded-full h-3">
                          <motion.div
                            className="bg-gradient-water h-3 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${analysisResult.suitabilityScore}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                          />
                        </div>
                        <p className="text-right text-sm mt-1 font-semibold">{analysisResult.suitabilityScore}%</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-6">
                      <h4 className="font-semibold">Recommendations:</h4>
                      {analysisResult.recommendations.map((rec: string, index: number) => (
                        <div key={index} className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-secondary mr-2 mt-0.5 flex-shrink-0" />
                          <p className="text-sm">{rec}</p>
                        </div>
                      ))}
                    </div>

                    <RippleButton 
                      variant="hero" 
                      className="w-full"
                      onClick={() => onAnalysisComplete?.()}
                    >
                      Start Your Water Journey
                    </RippleButton>
                  </div>
                )}
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default ImageCapture;