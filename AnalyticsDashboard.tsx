
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { AnalyticsData } from '../types';
import { UsersIcon, SearchCircleIcon } from './icons';

interface AnalyticsDashboardProps {
    data: AnalyticsData;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-slate-200 rounded-md shadow-lg">
        <p className="label font-semibold">{`Day: ${label}`}</p>
        <p className="intro text-teal-600">{`Searches: ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ data }) => {
    return (
        <div className="space-y-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-sm text-slate-500 flex items-center justify-center gap-1.5"><UsersIcon className="w-4 h-4" /> Total Visits</p>
                    <p className="text-2xl font-bold text-teal-600">{data.totalVisits}</p>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-sm text-slate-500 flex items-center justify-center gap-1.5"><SearchCircleIcon className="w-4 h-4" /> Total Searches</p>
                    <p className="text-2xl font-bold text-teal-600">{data.totalSearches}</p>
                </div>
            </div>
            <div>
                 <p className="text-sm text-center font-medium text-slate-600 mb-2">Searches (Last 7 Days)</p>
                <div style={{ width: '100%', height: 150 }}>
                    <ResponsiveContainer>
                        <BarChart data={data.searchesByDay} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis 
                                dataKey="day" 
                                tickFormatter={(tick) => new Date(tick).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} 
                                angle={-30}
                                textAnchor="end"
                                height={40}
                                tick={{ fontSize: 10, fill: '#64748b' }} 
                                axisLine={{stroke: '#cbd5e1'}}
                                tickLine={{stroke: '#cbd5e1'}}
                            />
                            <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#64748b' }} axisLine={{stroke: '#cbd5e1'}} tickLine={{stroke: '#cbd5e1'}} />
                            <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(20, 184, 166, 0.1)'}} />
                            <Bar dataKey="searches" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};
