import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const StatsSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  const stats = [
    { number: 600, suffix: 'M', label: 'Indians Face Water Scarcity' },
    { number: 40, suffix: '%', label: 'Population Without Clean Water' },
    { number: 70, suffix: '%', label: 'Water Bill Reduction Potential' },
    { number: 1000, suffix: '+', label: 'Communities Can Benefit' },
  ];

  const AnimatedNumber = ({ number, suffix, isVisible }: { number: number; suffix: string; isVisible: boolean }) => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
      if (!isVisible) return;

      const increment = number / 50;
      const timer = setInterval(() => {
        setCurrent((prev) => {
          const next = prev + increment;
          if (next >= number) {
            clearInterval(timer);
            return number;
          }
          return next;
        });
      }, 30);

      return () => clearInterval(timer);
    }, [isVisible, number]);

    return (
      <span className="text-5xl md:text-6xl font-bold bg-gradient-water bg-clip-text text-transparent">
        {Math.floor(current).toLocaleString()}{suffix}
      </span>
    );
  };

  return (
    <section className="py-20 bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onViewportEnter={() => setIsVisible(true)}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-card-foreground">
            India's Water{' '}
            <span className="bg-gradient-eco bg-clip-text text-transparent">
              Challenge
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Understanding the scale of India's water crisis and how RAIN platform can transform communities through sustainable water management solutions.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="mb-2">
                <AnimatedNumber
                  number={stat.number}
                  suffix={stat.suffix}
                  isVisible={isVisible}
                />
              </div>
              <p className="text-lg font-medium text-muted-foreground">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;