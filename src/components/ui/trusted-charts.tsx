"use client";

import { useState, useEffect } from 'react';
import { 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { Highlighter } from "@/components/ui/highlighter";
import { DotPattern } from "@/components/ui/backgrounds";

// Patient growth data - showing monthly growth
const patientGrowthData = [
  { month: 'Jan', patients: 1200 },
  { month: 'Feb', patients: 1800 },
  { month: 'Mar', patients: 2400 },
  { month: 'Apr', patients: 3200 },
  { month: 'May', patients: 4100 },
  { month: 'Jun', patients: 5200 },
  { month: 'Jul', patients: 6100 },
  { month: 'Aug', patients: 7200 },
  { month: 'Sep', patients: 8100 },
  { month: 'Oct', patients: 9000 },
  { month: 'Nov', patients: 9600 },
  { month: 'Dec', patients: 10000 },
];

// Recovery time data - showing decreasing trend
const recoveryTimeData = [
  { week: 'W1', time: 100 },
  { week: 'W2', time: 92 },
  { week: 'W3', time: 85 },
  { week: 'W4', time: 78 },
  { week: 'W5', time: 72 },
  { week: 'W6', time: 68 },
  { week: 'W7', time: 65 },
  { week: 'W8', time: 62 },
  { week: 'W9', time: 60 },
];

export function TrustedByThousandsSection() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section className="relative py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <DotPattern className="opacity-20" color="#94a3b8" cr={1} />
      
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <p className="text-[13px] text-cyan-500 mb-3">Trusted by Thousands</p>
          <h2 className="text-[32px] md:text-[40px] font-medium text-gray-900 mb-4 leading-tight tracking-tight">
            Real results that{' '}
            <span className="bg-gradient-to-r from-cyan-500 to-teal-500 bg-clip-text text-transparent">speak for themselves</span>
          </h2>
          <p className="text-[15px] text-gray-500 max-w-2xl mx-auto">
            Join thousands of patients who have transformed their health with H2H Healthcare
          </p>
        </div>
        
        {/* Charts Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {/* Patient Growth Chart */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[13px] text-gray-500">Patient Growth</p>
              </div>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-green-100 text-green-700">
                ↑ Growing
              </span>
            </div>
            <div className="mb-5">
              <p className="text-[32px] font-light text-gray-900">10,000+</p>
              <p className="text-[13px] text-gray-500">Happy patients and growing</p>
            </div>
            {/* Recharts Area Chart */}
            <div className="h-48 w-full min-w-0">
              {isMounted && (
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <AreaChart data={patientGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="patientGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis 
                      dataKey="month" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 11, fill: '#9ca3af' }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 11, fill: '#9ca3af' }}
                      tickFormatter={(value) => `${value / 1000}K`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: 'none', 
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '12px'
                      }}
                      formatter={(value) => [`${Number(value).toLocaleString()} patients`, 'Total']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="patients" 
                      stroke="#06b6d4" 
                      strokeWidth={3}
                      fill="url(#patientGradient)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
          
          {/* Recovery Time Chart */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[13px] text-gray-500">Recovery Time</p>
              </div>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-blue-100 text-blue-700">
                ↓ Reducing
              </span>
            </div>
            <div className="mb-5">
              <p className="text-[32px] font-light text-gray-900">40%</p>
              <p className="text-[13px] text-gray-500">Faster recovery than average</p>
            </div>
            {/* Recharts Line Chart - Decreasing */}
            <div className="h-48 w-full min-w-0">
              {isMounted && (
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <AreaChart data={recoveryTimeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="recoveryGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis 
                      dataKey="week" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 11, fill: '#9ca3af' }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 11, fill: '#9ca3af' }}
                      tickFormatter={(value) => `${value}%`}
                      domain={[50, 100]}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: 'none', 
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '12px'
                      }}
                      formatter={(value) => [`${Number(value)}% of average time`, 'Recovery']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="time" 
                      stroke="#14b8a6" 
                      strokeWidth={3}
                      fill="url(#recoveryGradient)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
        
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 text-center hover:shadow-lg transition-shadow hover:-translate-y-1 duration-300">
            <p className="text-[24px] font-light text-gray-900 mb-1">50+</p>
            <p className="text-[11px] text-gray-500">Expert Doctors</p>
          </div>
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 text-center hover:shadow-lg transition-shadow hover:-translate-y-1 duration-300">
            <p className="text-[24px] font-light text-gray-900 mb-1">98%</p>
            <p className="text-[11px] text-gray-500">Success Rate</p>
          </div>
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 text-center hover:shadow-lg transition-shadow hover:-translate-y-1 duration-300">
            <p className="text-[24px] font-light text-gray-900 mb-1">8+</p>
            <p className="text-[11px] text-gray-500">Cities</p>
          </div>
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 text-center hover:shadow-lg transition-shadow hover:-translate-y-1 duration-300">
            <p className="text-[24px] font-light text-gray-900 mb-1">24/7</p>
            <p className="text-[11px] text-gray-500">Support</p>
          </div>
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 text-center hover:shadow-lg transition-shadow hover:-translate-y-1 duration-300">
            <p className="text-[24px] font-light text-gray-900 mb-1">15+</p>
            <p className="text-[11px] text-gray-500">Years Experience</p>
          </div>
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 text-center hover:shadow-lg transition-shadow hover:-translate-y-1 duration-300">
            <p className="text-[24px] font-light text-gray-900 mb-1">5K+</p>
            <p className="text-[11px] text-gray-500">Home Visits</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TrustedByThousandsSection;
