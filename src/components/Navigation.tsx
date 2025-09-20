import { useState } from 'react';
import { motion } from 'framer-motion';
import { Droplet, Camera, ShoppingCart, Users, BarChart3, Menu, X } from 'lucide-react';
import RippleButton from './RippleButton';
import { cn } from '@/lib/utils';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { icon: Camera, label: 'Capture', href: '#capture' },
    { icon: ShoppingCart, label: 'Marketplace', href: '#marketplace' },
    { icon: Users, label: 'Contractors', href: '#contractors' },
    { icon: BarChart3, label: 'Dashboard', href: '#dashboard' },
  ];

  return (
    <motion.nav
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-4xl px-4"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <div className="glass rounded-2xl border border-white/20 backdrop-blur-md shadow-glass">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <div className="w-10 h-10 bg-gradient-water rounded-xl flex items-center justify-center">
              <Droplet className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-water bg-clip-text text-transparent">
              AquaHarvest
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <motion.a
                key={item.label}
                href={item.href}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl text-card-foreground/80 hover:text-card-foreground hover:bg-white/10 transition-all duration-300"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <item.icon className="w-4 h-4" />
                <span className="font-medium">{item.label}</span>
              </motion.a>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <RippleButton variant="hero" size="default">
              Get Started
            </RippleButton>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          className={cn(
            'md:hidden overflow-hidden border-t border-white/20',
            isOpen ? 'block' : 'hidden'
          )}
          initial={false}
          animate={{ height: isOpen ? 'auto' : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-6 py-4 space-y-2">
            {navItems.map((item, index) => (
              <motion.a
                key={item.label}
                href={item.href}
                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-foreground/80 hover:text-foreground hover:bg-white/10 transition-all duration-300"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </motion.a>
            ))}
            <div className="pt-4">
              <RippleButton variant="hero" className="w-full">
                Get Started
              </RippleButton>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navigation;