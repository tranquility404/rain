import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import RippleButton from './RippleButton';

const CTASection = () => {
  const benefits = [
    'Comprehensive water analysis platform',
    'Verified contractor marketplace',
    'Real-time project management',
    'Community water hub network',
    'Sustainable water independence',
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5" />
      <motion.div
        className="absolute top-10 left-10 w-32 h-32 bg-gradient-water rounded-full opacity-20 blur-xl"
        animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-eco rounded-full opacity-20 blur-xl"
        animate={{ y: [0, 20, 0], x: [0, -15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Building India's{' '}
              <span className="bg-gradient-water bg-clip-text text-transparent">
                Water
              </span>{' '}
              Future
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Join the network of interconnected water hubs creating water independence across India. Every installation contributes to our collective water security.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid md:grid-cols-5 gap-4 mb-8 text-left"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                className="flex items-center space-x-2"
              >
                <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0" />
                <span className="text-sm text-muted-foreground">{benefit}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/self-assessment">
              <RippleButton
                size="lg"
                className="bg-gradient-water text-white hover:opacity-90 group text-lg px-8 py-4"
              >
                Join RAIN Platform
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </RippleButton>
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-sm text-muted-foreground mt-6"
          >
            Free platform access • Community-driven solutions • Building India's water future together
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;