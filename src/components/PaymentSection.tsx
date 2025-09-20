import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Shield, CheckCircle, Calendar, Package } from 'lucide-react';
import { Card } from '@/components/ui/card';
import RippleButton from './RippleButton';

interface PaymentSectionProps {
  onPaymentComplete: () => void;
}

const PaymentSection = ({ onPaymentComplete }: PaymentSectionProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const orderSummary = {
    items: [
      { name: 'Premium Water Tank 5000L', price: 25000, quantity: 1 },
      { name: 'Gutter Collection System', price: 8500, quantity: 1 },
      { name: 'Smart Water Filter Pro', price: 15000, quantity: 1 }
    ],
    subtotal: 48500,
    installation: 12000,
    total: 60500
  };

  const handlePayment = () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
      
      setTimeout(() => {
        onPaymentComplete();
      }, 2000);
    }, 3000);
  };

  if (isComplete) {
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
            
            <h2 className="text-2xl font-bold mb-4 text-card-foreground">Payment Successful!</h2>
            <p className="text-muted-foreground mb-6">
              Your order has been confirmed. We'll schedule the installation date next.
            </p>
            
            <div className="bg-gradient-card/50 rounded-lg p-4 text-sm text-card-foreground">
              <p className="font-semibold">Order ID: #RWH-2024-001</p>
              <p>Total Paid: ₹{orderSummary.total.toLocaleString()}</p>
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
            <span className="bg-gradient-eco bg-clip-text text-transparent">
              Complete Your Order
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Review your order and proceed with secure payment. Your rainwater harvesting 
            system will be delivered and installed by certified professionals.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="p-6 glass border-white/20 shadow-glass">
              <div className="flex items-center mb-6">
                <Package className="w-5 h-5 mr-2 text-primary" />
                <h3 className="text-xl font-semibold text-card-foreground">Order Summary</h3>
              </div>

              <div className="space-y-4 mb-6">
                {orderSummary.items.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex justify-between items-center p-3 bg-gradient-card/30 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-card-foreground">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-card-foreground">₹{item.price.toLocaleString()}</p>
                  </motion.div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>₹{orderSummary.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Installation & Setup</span>
                  <span>₹{orderSummary.installation.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-2 border-t border-border text-card-foreground">
                  <span>Total</span>
                  <span>₹{orderSummary.total.toLocaleString()}</span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Payment Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="p-6 glass border-white/20 shadow-glass">
              <div className="flex items-center mb-6">
                <CreditCard className="w-5 h-5 mr-2 text-primary" />
                <h3 className="text-xl font-semibold text-card-foreground">Payment Details</h3>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full p-3 rounded-lg border border-border bg-background/50 text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full p-3 rounded-lg border border-border bg-background/50 text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full p-3 rounded-lg border border-border bg-background/50 text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full p-3 rounded-lg border border-border bg-background/50 text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex items-center mb-6 p-4 bg-gradient-eco/10 rounded-lg">
                <Shield className="w-5 h-5 text-secondary mr-3" />
                <div className="text-sm">
                  <p className="font-medium text-card-foreground">Secure Payment</p>
                  <p className="text-muted-foreground">256-bit SSL encryption</p>
                </div>
              </div>

              <RippleButton
                variant="hero"
                size="lg"
                className="w-full"
                onClick={handlePayment}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 mr-2" />
                    Pay ₹{orderSummary.total.toLocaleString()}
                  </>
                )}
              </RippleButton>

              <div className="text-center mt-4 text-sm text-muted-foreground">
                <p>🔒 Your payment information is secure and encrypted</p>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PaymentSection;