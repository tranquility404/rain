import { motion } from 'framer-motion';
import { Droplets, Zap, Shield, Smartphone, TrendingUp, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';

const FeaturedSection = () => {
  const features = [
    {
      icon: Droplets,
      title: 'AI-Powered Analysis',
      description: 'Advanced computer vision analyzes your rooftop to calculate optimal water collection potential.',
    },
    {
      icon: Zap,
      title: 'Smart Systems',
      description: 'IoT-enabled monitoring and automated controls for maximum efficiency and convenience.',
    },
    {
      icon: Shield,
      title: 'Verified Contractors',
      description: 'Thoroughly vetted professionals with proven track records in water harvesting installations.',
    },
    {
      icon: Smartphone,
      title: 'Mobile Dashboard',
      description: 'Track your water collection, savings, and system performance from anywhere.',
    },
    {
      icon: TrendingUp,
      title: 'Cost Savings',
      description: 'Reduce water bills by up to 60% with efficient rainwater collection and storage.',
    },
    {
      icon: Users,
      title: '24/7 Support',
      description: 'Expert support team available around the clock for maintenance and troubleshooting.',
    },
  ];

  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-card-foreground">
            Why Choose{' '}
            <span className="bg-gradient-water bg-clip-text text-transparent">
              AquaHarvest
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your property into a sustainable water collection system with cutting-edge technology and expert guidance.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="p-6 h-full glass border-white/20 shadow-glass hover:shadow-water transition-all duration-300 group">
                <div className="w-12 h-12 bg-gradient-water rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-card-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;