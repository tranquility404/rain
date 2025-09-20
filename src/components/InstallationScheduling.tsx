import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Truck, User, CheckCircle, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import RippleButton from './RippleButton';

interface InstallationSchedulingProps {
  onInstallationScheduled: () => void;
}

const InstallationScheduling = ({ onInstallationScheduled }: InstallationSchedulingProps) => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [isScheduled, setIsScheduled] = useState(false);

  const availableDates = [
    { date: '2024-01-25', day: 'Thursday', available: true },
    { date: '2024-01-26', day: 'Friday', available: true },
    { date: '2024-01-27', day: 'Saturday', available: false },
    { date: '2024-01-28', day: 'Sunday', available: false },
    { date: '2024-01-29', day: 'Monday', available: true },
    { date: '2024-01-30', day: 'Tuesday', available: true }
  ];

  const timeSlots = [
    { time: '8:00 AM - 12:00 PM', label: 'Morning' },
    { time: '1:00 PM - 5:00 PM', label: 'Afternoon' }
  ];

  const handleScheduleInstallation = () => {
    if (selectedDate && selectedTimeSlot) {
      setIsScheduled(true);
      setTimeout(() => {
        onInstallationScheduled();
      }, 2000);
    }
  };

  if (isScheduled) {
    return (
      <div className="fixed inset-0 bg-background/95 backdrop-blur-lg z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto"
        >
          <Card className="p-8 glass border-white/20 shadow-glass text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 bg-gradient-water rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-10 h-10 text-white" />
            </motion.div>
            
            <h2 className="text-2xl font-bold mb-4 text-card-foreground">Installation Scheduled!</h2>
            <p className="text-muted-foreground mb-6">
              Your rainwater harvesting system installation has been scheduled for {selectedDate} 
              during {selectedTimeSlot}.
            </p>
            
            <div className="bg-gradient-card/50 rounded-lg p-4 text-sm text-card-foreground space-y-1">
              <p>📦 Equipment will arrive 1 day before</p>
              <p>👷 Certified installation team assigned</p>
              <p>📱 You'll receive updates via SMS & email</p>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-water bg-clip-text text-transparent">
              Schedule Installation
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose a convenient date for your rainwater harvesting system installation. 
            Our certified team will handle everything professionally.
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          {/* Order Reference */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Card className="p-6 glass border-white/20 shadow-glass">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-card-foreground">Order #RWH-2024-001</h3>
                  <p className="text-muted-foreground">Premium Rainwater Harvesting System</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Installation Value</p>
                  <p className="text-xl font-bold text-primary">₹60,500</p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Installation Team Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <Card className="p-6 glass border-white/20 shadow-glass">
              <div className="flex items-center mb-4">
                <User className="w-5 h-5 mr-2 text-primary" />
                <h3 className="text-lg font-semibold text-card-foreground">Installation Team</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gradient-card/30 rounded-lg p-4">
                  <p className="font-medium text-card-foreground">Lead Installer: Rajesh Kumar</p>
                  <p className="text-sm text-muted-foreground">8+ years experience, 150+ installations</p>
                </div>
                <div className="bg-gradient-card/30 rounded-lg p-4">
                  <p className="font-medium text-card-foreground">Team Size: 3 professionals</p>
                  <p className="text-sm text-muted-foreground">Estimated duration: 6-8 hours</p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Date Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <Card className="p-6 glass border-white/20 shadow-glass">
              <div className="flex items-center mb-4">
                <Calendar className="w-5 h-5 mr-2 text-primary" />
                <h3 className="text-lg font-semibold text-card-foreground">Select Installation Date</h3>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableDates.map((slot) => (
                  <motion.button
                    key={slot.date}
                    onClick={() => slot.available && setSelectedDate(slot.date)}
                    disabled={!slot.available}
                    className={`p-4 rounded-lg border transition-all duration-300 ${
                      !slot.available
                        ? 'border-border bg-muted/20 text-muted-foreground cursor-not-allowed'
                        : selectedDate === slot.date
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50 text-card-foreground'
                    }`}
                    whileHover={slot.available ? { scale: 1.02 } : {}}
                    whileTap={slot.available ? { scale: 0.98 } : {}}
                  >
                    <div className="font-semibold">{slot.day}</div>
                    <div className="text-sm opacity-75">{slot.date}</div>
                    {!slot.available && (
                      <div className="text-xs text-red-400 mt-1">Unavailable</div>
                    )}
                  </motion.button>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Time Slot Selection */}
          {selectedDate && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <Card className="p-6 glass border-white/20 shadow-glass">
                <div className="flex items-center mb-4">
                  <Clock className="w-5 h-5 mr-2 text-primary" />
                  <h3 className="text-lg font-semibold text-card-foreground">Select Time Slot</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {timeSlots.map((slot) => (
                    <motion.button
                      key={slot.time}
                      onClick={() => setSelectedTimeSlot(slot.time)}
                      className={`p-4 rounded-lg border transition-all duration-300 ${
                        selectedTimeSlot === slot.time
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50 text-card-foreground'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="font-semibold">{slot.label}</div>
                      <div className="text-sm opacity-75">{slot.time}</div>
                    </motion.button>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Confirmation */}
          {selectedDate && selectedTimeSlot && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <Card className="p-6 glass border-white/20 shadow-glass">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4 text-card-foreground">Confirm Installation Schedule</h3>
                  
                  <div className="bg-gradient-card/50 rounded-lg p-4 space-y-2 text-card-foreground">
                    <div className="flex items-center justify-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{selectedDate} • {selectedTimeSlot}</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                      <Truck className="w-4 h-4" />
                      <span>Equipment delivery 1 day prior</span>
                    </div>
                  </div>
                </div>
                
                <RippleButton 
                  variant="hero" 
                  size="lg" 
                  className="w-full"
                  onClick={handleScheduleInstallation}
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Confirm Installation Schedule
                </RippleButton>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default InstallationScheduling;