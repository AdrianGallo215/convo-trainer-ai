import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface FadeInProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

export const FadeIn = ({ children, className, delay = 0, direction = 'up' }: FadeInProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                threshold: 0.1,
                rootMargin: '50px',
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    const getDirectionClass = () => {
        switch (direction) {
            case 'up': return 'slide-in-from-bottom-8';
            case 'down': return 'slide-in-from-top-8';
            case 'left': return 'slide-in-from-right-8';
            case 'right': return 'slide-in-from-left-8';
            default: return '';
        }
    };

    return (
        <div
            ref={ref}
            className={cn(
                "transition-all duration-1000 ease-out",
                isVisible
                    ? `opacity-100 animate-in fade-in ${getDirectionClass()}`
                    : "opacity-0 translate-y-4", // Initial state
                className
            )}
            style={{ animationDelay: `${delay}ms`, transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
};
