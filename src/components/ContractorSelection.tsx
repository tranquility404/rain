import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Star, MapPin, Phone, Calendar, Award, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import RippleButton from './RippleButton';

interface ContractorSelectionProps {
  onScheduleCall: (contractorId: number) => void;
}

const ContractorSelection = ({ onScheduleCall }: ContractorSelectionProps) => {
  const [selectedContractor, setSelectedContractor] = useState<number | null>(null);

  const contractors = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      rating: 4.9,
      completedProjects: 150,
      location: '2.5 km away',
      specialization: 'Residential Water Systems',
      experience: '8 years',
      fee: 2500,
      image: '/api/placeholder/100/100',
      availability: ['Tomorrow 10 AM', 'Friday 2 PM', 'Saturday 9 AM'],
      certifications: ['Licensed Plumber', 'Water Conservation Expert']
    },
    {
      id: 2,
      name: 'Priya Sharma',
      rating: 4.8,
      completedProjects: 120,
      location: '3.1 km away',
      specialization: 'Eco-friendly Installations',
      experience: '6 years',
      fee: 2200,
      image: '/api/placeholder/100/100',
      availability: ['Today 4 PM', 'Tomorrow 11 AM', 'Monday 3 PM'],
      certifications: ['Green Building Certified', 'Solar Expert']
    },
    {
      id: 3,
      name: 'Amit Patel',
      rating: 4.7,
      completedProjects: 200,
      location: '4.2 km away',
      specialization: 'Large Scale Systems',
      experience: '12 years',
      fee: 3000,
      image: '/api/placeholder/100/100',
      availability: ['Wednesday 9 AM', 'Thursday 1 PM', 'Friday 10 AM'],
      certifications: ['Master Installer', 'Safety Certified']
    }
  ];

  return (
    <section className="py-20 bg-gradient-card">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-eco bg-clip-text text-transparent">
              Choose Your Contractor
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Select from our network of verified professionals in your area. 
            All contractors are certified and experienced in rainwater harvesting systems.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-6">
          {contractors.map((contractor, index) => (
            <motion.div
              key={contractor.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="group"
            >
              <Card className={`p-6 glass border-white/20 shadow-glass hover:shadow-water transition-all duration-300 cursor-pointer ${
                selectedContractor === contractor.id ? 'ring-2 ring-primary shadow-water' : ''
              }`}
              onClick={() => setSelectedContractor(contractor.id)}>
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Contractor Info */}
                  <div className="md:col-span-2">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gradient-water rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-bold text-card-foreground">{contractor.name}</h3>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="ml-1 font-semibold text-card-foreground">{contractor.rating}</span>
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground mb-1">{contractor.specialization}</p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                          <span>{contractor.experience} experience</span>
                          <span>•</span>
                          <span>{contractor.completedProjects} projects</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-muted-foreground mb-3">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{contractor.location}</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {contractor.certifications.map(cert => (
                            <span key={cert} className="flex items-center text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full">
                              <Award className="w-3 h-3 mr-1" />
                              {cert}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pricing & Action */}
                  <div className="flex flex-col justify-between">
                    <div className="text-center mb-4">
                      <div className="text-2xl font-bold text-primary mb-1">
                        ₹{contractor.fee.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">Consultation Fee</div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="text-sm">
                        <div className="font-medium text-card-foreground mb-1">Available Slots:</div>
                        {contractor.availability.slice(0, 2).map(slot => (
                          <div key={slot} className="text-muted-foreground">{slot}</div>
                        ))}
                      </div>
                      
                      <RippleButton 
                        variant={selectedContractor === contractor.id ? "hero" : "outline"}
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          onScheduleCall(contractor.id);
                        }}
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Schedule Call
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </RippleButton>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-12"
        >
          <Card className="inline-block p-6 glass border-white/20 shadow-glass">
            <h3 className="text-lg font-semibold mb-2 text-card-foreground">Need Help Choosing?</h3>
            <p className="text-muted-foreground mb-4">
              Our AI can recommend the best contractor based on your specific requirements
            </p>
            <RippleButton variant="eco">
              Get AI Recommendation
            </RippleButton>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default ContractorSelection;