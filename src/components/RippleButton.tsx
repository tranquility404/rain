import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'default' | 'hero' | 'eco' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const RippleButton = React.forwardRef<HTMLButtonElement, RippleButtonProps>(
  ({ children, className, variant = 'default', size = 'default', onClick, ...props }, ref) => {
    const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

    const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
      const button = event.currentTarget;
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;

      const newRipple = {
        x,
        y,
        id: Date.now(),
      };

      setRipples(prev => [...prev, newRipple]);

      setTimeout(() => {
        setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
      }, 600);

      if (onClick) {
        onClick(event);
      }
    };

    const getVariantClasses = () => {
      switch (variant) {
        case 'hero':
          return 'bg-gradient-hero text-white hover:opacity-90 shadow-water';
        case 'eco':
          return 'bg-gradient-eco text-white hover:opacity-90 shadow-eco';
        case 'outline':
          return 'border-2 border-primary text-primary hover:bg-primary hover:text-white bg-background';
        case 'ghost':
          return 'text-primary hover:bg-primary/10 bg-transparent';
        default:
          return 'bg-primary text-white hover:bg-primary/90';
      }
    };

    return (
      <Button
        ref={ref}
        className={cn(
          'relative overflow-hidden transition-all duration-300',
          getVariantClasses(),
          className
        )}
        size={size}
        onClick={createRipple}
        {...props}
      >
        {children}
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            className="absolute rounded-full bg-white/30 pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: 0,
              height: 0,
            }}
            animate={{
              width: 300,
              height: 300,
              opacity: [0.8, 0],
            }}
            transition={{
              duration: 0.6,
              ease: 'easeOut',
            }}
          />
        ))}
      </Button>
    );
  }
);

RippleButton.displayName = 'RippleButton';

export default RippleButton;