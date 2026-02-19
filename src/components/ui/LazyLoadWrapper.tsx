"use client";

import { useInView } from "framer-motion";
import { useRef } from "react";

interface LazyLoadWrapperProps {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
  triggerOnce?: boolean;
}

export default function LazyLoadWrapper({ 
  children, 
  className = "", 
  threshold = 0.1, 
  triggerOnce = true 
}: LazyLoadWrapperProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    amount: threshold, 
    once: triggerOnce 
  });

  return (
    <div 
      ref={ref} 
      className={`${className} ${!isInView ? 'opacity-0' : 'opacity-100'} transition-opacity duration-1000`}
    >
      {isInView && children}
    </div>
  );
}