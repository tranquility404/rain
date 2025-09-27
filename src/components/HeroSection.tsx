import { motion } from 'framer-motion';
import { ArrowRight, Droplets, Zap, Users } from 'lucide-react';
import WaterScene from './WaterScene';
import RippleButton from './RippleButton';

const HeroSection = () => {
  const features = [
    {
      icon: Droplets,
      title: 'Smart Water Collection',
      description: 'AI-powered rooftop analysis'
    },
    {
      icon: Zap,
      title: 'Efficient Systems',
      description: 'Optimized harvesting setups'
    },
    {
      icon: Users,
      title: 'Expert Contractors',
      description: 'Verified professional network'
    }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <WaterScene />

      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-water bg-clip-text text-transparent">
                Harvest
              </span>{' '}
              <span className="text-card-foreground">Every</span>
              <br />
              <span className="bg-gradient-eco bg-clip-text text-transparent">
                Drop of Rain
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-card-foreground/80 max-w-2xl mx-auto leading-relaxed">
              Transform your rooftop into a sustainable water collection system with
              AI-powered analysis and expert installation services.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <RippleButton
              variant="hero"
              size="lg"
              className="group"
              onClick={() => window.location.href = '/self-assessment'}
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </RippleButton>
          </motion.div>

          {/* Feature cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="glass rounded-2xl p-6 border border-white/20 backdrop-blur-md shadow-glass group hover:shadow-water transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-water rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-card-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Floating elements */}
      <motion.div
        className="absolute top-20 left-10 w-20 h-20 bg-gradient-water rounded-full opacity-20 blur-xl"
        animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-eco rounded-full opacity-20 blur-xl"
        animate={{ y: [0, 20, 0], x: [0, -15, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
    </section>
  );
};

export default HeroSection;