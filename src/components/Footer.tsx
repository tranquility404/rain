import { motion } from 'framer-motion';
import { Droplets } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center space-y-6"
        >
          {/* Platform Branding */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-water rounded-xl flex items-center justify-center shadow-lg">
              <Droplets className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-3xl font-bold bg-gradient-water bg-clip-text text-transparent mx-auto">
                RAIN
              </span>
              <span className="text-sm text-muted-foreground -mt-1">
                Responsible Aqua Initiative for Nature
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-muted-foreground max-w-2xl leading-relaxed">
            Transforming rooftops into sustainable water collection systems with AI-powered analysis and expert installation services.
          </p>

          {/* Copyright */}
          <div className="border-t border-border w-full max-w-2xl pt-6">
            <p className="text-muted-foreground text-sm">
              © 2025 RAIN - Responsible Aqua Initiative for Nature. All rights reserved.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;