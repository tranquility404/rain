import { motion } from 'framer-motion';
import { ArrowRight, Droplets, Zap, Users } from 'lucide-react';
import WaterScene from './WaterScene';
import RippleButton from './RippleButton';

const HeroSection = () => {
  const features = [
    {
      icon: Droplets,
      title: 'AI-Powered Analysis',
      description: 'Complete water assessment from rainfall patterns to groundwater levels, calculating your exact harvesting potential',
      highlight: '5 Key Metrics'
    },
    {
      icon: Zap,
      title: 'End-to-End Solution',
      description: 'From analysis to installation - verified contractors, project tracking, and cost optimization in one platform',
      highlight: 'Complete Pipeline'
    },
    {
      icon: Users,
      title: 'Community Network',
      description: 'Join India\'s growing water independence movement with interconnected hubs and shared resources',
      highlight: '200+ Active Users'
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
                Transforming
              </span>{' '}
              <span className="text-card-foreground">India's</span>
              <br />
              <span className="bg-gradient-eco bg-clip-text text-transparent">
                Water Future
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-card-foreground/80 max-w-3xl mx-auto leading-relaxed mb-4">
              From <strong className="text-card-foreground">600 million</strong> facing water scarcity to complete water independence -
              RAIN Platform makes rainwater harvesting accessible, intelligent, and community-driven.
            </p>
            <p className="text-lg md:text-xl text-card-foreground/80 max-w-2xl mx-auto">
              Join <strong className="text-card-foreground">200+ users</strong> already building India's interconnected water hub network
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
              Start Water Assessment
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
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-water rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full font-medium">
                    {feature.highlight}
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-3 text-card-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
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