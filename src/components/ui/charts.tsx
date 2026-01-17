'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  BarElement,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { cn } from '@/lib/utils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface AnimatedChartProps {
  direction: 'up' | 'down';
  title: string;
  value: string;
  subtitle: string;
  className?: string;
}

export function AnimatedLineChart({ direction, title, value, subtitle, className }: AnimatedChartProps) {
  const chartRef = useRef<ChartJS<'line'>>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePosition({ x, y });
  }, []);
  
  // More realistic healthcare data
  const upData = [1200, 2100, 2800, 3500, 4200, 5100, 5800, 6700, 7400, 8200, 9100, 10000];
  const downData = [65, 58, 52, 48, 44, 42, 40, 38, 36, 34, 32, 30];
  
  const createGradient = (ctx: CanvasRenderingContext2D, isUp: boolean) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 180);
    if (isUp) {
      gradient.addColorStop(0, 'rgba(16, 185, 129, 0.5)');
      gradient.addColorStop(0.5, 'rgba(16, 185, 129, 0.2)');
      gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
    } else {
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.5)');
      gradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.2)');
      gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
    }
    return gradient;
  };
  
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        data: direction === 'up' ? upData : downData,
        borderColor: direction === 'up' ? '#10b981' : '#3b82f6',
        backgroundColor: (context: { chart: { ctx: CanvasRenderingContext2D } }) => {
          const ctx = context.chart.ctx;
          return createGradient(ctx, direction === 'up');
        },
        fill: true,
        tension: 0.4,
        pointRadius: isHovered ? 4 : 0,
        pointHoverRadius: 8,
        pointBackgroundColor: direction === 'up' ? '#10b981' : '#3b82f6',
        pointHoverBackgroundColor: direction === 'up' ? '#10b981' : '#3b82f6',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 3,
        borderWidth: isHovered ? 4 : 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2500,
      easing: 'easeOutQuart' as const,
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#ffffff',
        titleFont: { size: 14, weight: 'bold' as const },
        bodyColor: '#94a3b8',
        bodyFont: { size: 13 },
        borderColor: direction === 'up' ? '#10b981' : '#3b82f6',
        borderWidth: 2,
        padding: 14,
        cornerRadius: 12,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            const value = context.parsed?.y ?? 0;
            if (direction === 'up') {
              return `Patients: ${value.toLocaleString()}`;
            }
            return `Recovery Days: ${value}`;
          }
        }
      },
    },
    scales: {
      x: {
        display: false,
        grid: { display: false },
      },
      y: {
        display: false,
        grid: { display: false },
      },
    },
  };

  if (!mounted) {
    return (
      <div className={cn("bg-white rounded-3xl p-8 border border-gray-100 shadow-xl", className)}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold text-gray-500 font-[family-name:var(--font-poppins)]">{title}</h3>
        </div>
        <p className="text-5xl font-bold text-gray-900 mb-2 font-[family-name:var(--font-poppins)]">{value}</p>
        <p className="text-sm text-gray-500 mb-8 font-[family-name:var(--font-poppins)]">{subtitle}</p>
        <div className="h-40 bg-gray-50 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative bg-white rounded-3xl p-8 border border-gray-100 shadow-xl overflow-hidden transition-all duration-500 cursor-pointer",
        isHovered && (direction === 'up' 
          ? "shadow-2xl shadow-emerald-500/20 border-emerald-200 scale-[1.02]" 
          : "shadow-2xl shadow-blue-500/20 border-blue-200 scale-[1.02]"),
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      {/* Smooth mouse follow gradient effect */}
      <div 
        className="absolute inset-0 transition-opacity duration-500 pointer-events-none"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(800px circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, ${direction === 'up' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(59, 130, 246, 0.12)'}, transparent 40%)`,
        }}
      />
      
      {/* Border glow effect */}
      <div 
        className={cn(
          "absolute inset-0 rounded-3xl transition-opacity duration-500 pointer-events-none",
          isHovered ? "opacity-100" : "opacity-0"
        )}
        style={{
          background: direction === 'up' 
            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, transparent 50%, rgba(6, 182, 212, 0.1) 100%)'
            : 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, transparent 50%, rgba(99, 102, 241, 0.1) 100%)',
        }}
      />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className={cn(
            "text-sm font-semibold uppercase tracking-wider font-[family-name:var(--font-poppins)] transition-colors duration-300",
            isHovered ? (direction === 'up' ? 'text-emerald-600' : 'text-blue-600') : 'text-gray-600'
          )}>{title}</h3>
          <span className={cn(
            "text-xs font-bold px-3 py-1.5 rounded-full transition-all duration-300",
            direction === 'up' 
              ? 'text-emerald-700 bg-emerald-100' 
              : 'text-blue-700 bg-blue-100',
            isHovered && (direction === 'up' ? 'bg-emerald-200 scale-105' : 'bg-blue-200 scale-105')
          )}>
            {direction === 'up' ? '↑ Growing' : '↓ Reducing'}
          </span>
        </div>
        
        <p className={cn(
          "text-5xl font-bold mb-2 font-[family-name:var(--font-poppins)] transition-all duration-300",
          isHovered 
            ? (direction === 'up' ? 'text-emerald-600' : 'text-blue-600') 
            : 'text-gray-900'
        )}>{value}</p>
        <p className="text-sm text-gray-500 mb-8 font-[family-name:var(--font-poppins)]">{subtitle}</p>
        
        <div className="h-40 relative">
          <Line ref={chartRef} data={data} options={options} />
        </div>
      </div>
    </div>
  );
}

// Additional chart types for variety
interface BarChartProps {
  title: string;
  className?: string;
}

export function ServiceBarChart({ title, className }: BarChartProps) {
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const data = {
    labels: ['Sports Rehab', 'Post-Surgery', 'Chronic Pain', 'Neuro Rehab', 'Pediatric'],
    datasets: [
      {
        data: [850, 720, 680, 540, 420],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(6, 182, 212, 0.8)',
          'rgba(20, 184, 166, 0.8)',
          'rgba(34, 197, 94, 0.8)',
        ],
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2000,
      easing: 'easeOutQuart' as const,
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#94a3b8',
        borderWidth: 0,
        padding: 12,
        cornerRadius: 10,
      },
    },
    scales: {
      x: {
        display: false,
        grid: { display: false },
      },
      y: {
        display: false,
        grid: { display: false },
      },
    },
  };

  if (!mounted) {
    return <div className={cn("h-48 bg-gray-50 rounded-2xl animate-pulse", className)} />;
  }

  return (
    <div 
      className={cn(
        "bg-white rounded-3xl p-6 border border-gray-100 shadow-xl transition-all duration-500",
        isHovered && "shadow-2xl scale-[1.02]",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h3 className="text-sm font-semibold text-gray-600 mb-4 uppercase tracking-wider font-[family-name:var(--font-poppins)]">{title}</h3>
      <div className="h-48">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}

export function SuccessRateChart({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const data = {
    labels: ['Success', 'Ongoing'],
    datasets: [
      {
        data: [98, 2],
        backgroundColor: [
          'rgba(16, 185, 129, 0.9)',
          'rgba(229, 231, 235, 0.5)',
        ],
        borderWidth: 0,
        cutout: '75%',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2000,
      easing: 'easeOutQuart' as const,
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  };

  if (!mounted) {
    return <div className={cn("h-32 w-32 bg-gray-50 rounded-full animate-pulse", className)} />;
  }

  return (
    <div 
      className={cn(
        "relative h-32 w-32 transition-all duration-500",
        isHovered && "scale-110",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Doughnut data={data} options={options} />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-poppins)]">98%</span>
      </div>
    </div>
  );
}
