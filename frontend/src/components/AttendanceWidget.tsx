import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export interface AttendanceData {
  subject: string;
  present: number;
  absent: number;
  total: number;
  percentage: number;
}

interface AttendanceWidgetProps {
  data: AttendanceData;
}

const AttendanceWidget: React.FC<AttendanceWidgetProps> = ({ data }) => {
  const chartData = [
    { name: 'Present', value: data.present, color: '#7c3aed' }, // purple
    { name: 'Absent', value: data.absent, color: '#e2e8f0' }   // light gray
  ];

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] mt-3 max-w-[340px] font-sans">
      <p className="text-sm text-slate-500 mb-1">Here is your attendance for</p>
      <h4 className="font-semibold text-indigo-600 mb-4">{data.subject}</h4>
      
      <div className="flex items-center gap-6">
        <div className="relative w-[100px] h-[100px] flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={36}
                outerRadius={50}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-xl font-bold text-slate-800">{data.percentage}%</span>
          </div>
        </div>

        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-slate-600 font-medium">Present</span>
            </div>
            <span className="font-semibold text-slate-800">{data.present} Classes</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span className="text-slate-600 font-medium">Absent</span>
            </div>
            <span className="font-semibold text-slate-800">{data.absent} Classes</span>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-sm">
            <span className="text-slate-500">Total Classes</span>
            <span className="font-bold text-slate-800">{data.total}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceWidget;
