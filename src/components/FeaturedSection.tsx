import { motion } from 'framer-motion';
import { Droplets, Zap, Shield, Smartphone, TrendingUp, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';

const FeaturedSection = () => {
  const features = [
    {
      icon: Droplets,
      title: 'Rainfall Data Analysis',
      description: 'Comprehensive rainfall pattern analysis with historical data and predictive insights for optimal water harvesting planning.',
    },
    {
      icon: Shield,
      title: 'Groundwater Assessment',
      description: 'Detailed groundwater level monitoring and analysis to understand local water table conditions and storage capacity.',
    },
    {
      icon: TrendingUp,
      title: 'Runoff Capacity Calculation',
      description: 'Precise measurement of surface runoff potential based on terrain, soil type, and catchment area analysis.',
    },
    {
      icon: Zap,
      title: 'Dimension Analysis',
      description: 'AI-powered rooftop and land analysis to determine optimal harvesting system dimensions and placement.',
    },
    {
      icon: Smartphone,
      title: 'Cost Analysis & Planning',
      description: 'Comprehensive cost breakdown with ROI analysis, financing options, and budget optimization strategies.',
    },
    {
      icon: Users,
      title: 'Contractor Marketplace',
      description: 'Verified professionals network with project management, installation tracking, and quality assurance.',
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
            Complete{' '}
            <span className="bg-gradient-water bg-clip-text text-transparent">
              RAIN Solution
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From comprehensive analysis to professional installation - everything you need to achieve water independence and contribute to India's water security.
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