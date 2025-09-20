import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Phone, CheckCircle, User } from 'lucide-react';
import { Card } from '@/components/ui/card';
import RippleButton from './RippleButton';

interface CallSchedulingProps {
  contractorId: number;
  onCallScheduled: () => void;
}

const CallScheduling = ({ contractorId, onCallScheduled }: CallSchedulingProps) => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isScheduled, setIsScheduled] = useState(false);

  const availableSlots = [
    { date: '2024-01-20', day: 'Tomorrow', times: ['10:00 AM', '2:00 PM', '4:00 PM'] },
    { date: '2024-01-21', day: 'Friday', times: ['9:00 AM', '11:00 AM', '3:00 PM', '5:00 PM'] },
    { date: '2024-01-22', day: 'Saturday', times: ['10:00 AM', '1:00 PM', '3:00 PM'] }
  ];

  const handleScheduleCall = () => {
    if (selectedDate && selectedTime) {
      setIsScheduled(true);
      setTimeout(() => {
        onCallScheduled();
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
              className="w-20 h-20 bg-gradient-eco rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-10 h-10 text-white" />
            </motion.div>
            
            <h2 className="text-2xl font-bold mb-4 text-card-foreground">Call Scheduled!</h2>
            <p className="text-muted-foreground mb-6">
              Your call has been scheduled for {selectedDate} at {selectedTime}. 
              The contractor will call you through the app.
            </p>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="space-y-2 text-sm text-muted-foreground"
            >
              <p>📱 You'll receive an in-app notification</p>
              <p>📧 Confirmation email sent</p>
              <p>🔄 You can reschedule anytime</p>
            </motion.div>
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
              Schedule Your Call
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose a convenient time for your consultation. The contractor will call you 
            through our secure in-app calling system.
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          {/* Contractor Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Card className="p-6 glass border-white/20 shadow-glass">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-water rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-card-foreground">Rajesh Kumar</h3>
                  <p className="text-muted-foreground">Consultation Fee: ₹2,500</p>
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
                <h3 className="text-lg font-semibold text-card-foreground">Select Date</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {availableSlots.map((slot) => (
                  <motion.button
                    key={slot.date}
                    onClick={() => {
                      setSelectedDate(slot.date);
                      setSelectedTime(''); // Reset time when date changes
                    }}
                    className={`p-4 rounded-lg border transition-all duration-300 ${
                      selectedDate === slot.date
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50 text-card-foreground'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="font-semibold">{slot.day}</div>
                    <div className="text-sm opacity-75">{slot.date}</div>
                  </motion.button>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Time Selection */}
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
                  <h3 className="text-lg font-semibold text-card-foreground">Select Time</h3>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {availableSlots
                    .find(slot => slot.date === selectedDate)
                    ?.times.map((time) => (
                    <motion.button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-3 rounded-lg border transition-all duration-300 ${
                        selectedTime === time
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50 text-card-foreground'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {time}
                    </motion.button>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Schedule Button */}
          {selectedDate && selectedTime && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <Card className="p-6 glass border-white/20 shadow-glass">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2 text-card-foreground">Confirm Your Call</h3>
                  <p className="text-muted-foreground">
                    📅 {selectedDate} at {selectedTime}
                  </p>
                  <p className="text-muted-foreground">
                    📞 In-app video call with Rajesh Kumar
                  </p>
                </div>
                
                <RippleButton 
                  variant="hero" 
                  size="lg" 
                  className="w-full"
                  onClick={handleScheduleCall}
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Schedule Call - ₹2,500
                </RippleButton>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CallScheduling;