import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, Calendar, Filter, TrendingUp, DollarSign, Users, Truck, Activity } from 'lucide-react';
import { CURRENCY } from '../constants';

interface FinancialData {
  date: string;
  revenue: number;
  commission: number;
  expenses: number;
  profit: number;
}

interface DriverEarnings {
  name: string;
  earnings: number;
  rides: number;
  rating: number;
}

interface PaymentMethod {
  name: string;
  value: number;
  percentage: number;
}

const mockFinancialData: FinancialData[] = [
  { date: 'Jan 1', revenue: 450000, commission: 90000, expenses: 120000, profit: 240000 },
  { date: 'Jan 2', revenue: 520000, commission: 104000, expenses: 125000, profit: 291000 },
  { date: 'Jan 3', revenue: 380000, commission: 76000, expenses: 115000, profit: 189000 },
  { date: 'Jan 4', revenue: 680000, commission: 136000, expenses: 140000, profit: 404000 },
  { date: 'Jan 5', revenue: 750000, commission: 150000, expenses: 145000, profit: 455000 },
  { date: 'Jan 6', revenue: 890000, commission: 178000, expenses: 160000, profit: 552000 },
  { date: 'Jan 7', revenue: 920000, commission: 184000, expenses: 165000, profit: 571000 },
];

const mockDriverEarnings: DriverEarnings[] = [
  { name: 'Ibrahim Musa', earnings: 285000, rides: 156, rating: 4.8 },
  { name: 'Chisom Okeke', earnings: 241000, rides: 132, rating: 4.6 },
  { name: 'Adeyemi Oladele', earnings: 198000, rides: 108, rating: 4.5 },
  { name: 'Fatima Hassan', earnings: 165000, rides: 89, rating: 4.4 },
  { name: 'Kwame Asante', earnings: 142000, rides: 76, rating: 4.3 },
];

const mockPaymentMethods: PaymentMethod[] = [
  { name: 'Card Payment', value: 4200000, percentage: 45 },
  { name: 'Mobile Wallet', value: 2800000, percentage: 30 },
  { name: 'Bank Transfer', value: 1400000, percentage: 15 },
  { name: 'Cash', value: 700000, percentage: 10 },
];

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

export const FinancialReports: React.FC = () => {
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<'all' | 'revenue' | 'commission' | 'expenses' | 'profit'>('all');

  // Calculate totals
  const totalRevenue = mockFinancialData.reduce((sum, item) => sum + item.revenue, 0);
  const totalCommission = mockFinancialData.reduce((sum, item) => sum + item.commission, 0);
  const totalExpenses = mockFinancialData.reduce((sum, item) => sum + item.expenses, 0);
  const totalProfit = mockFinancialData.reduce((sum, item) => sum + item.profit, 0);
  const avgDailyRevenue = Math.round(totalRevenue / mockFinancialData.length);

  const handleExportPDF = () => {
    alert('Financial report exported as PDF');
    // In production, would generate actual PDF
  };

  const handleExportExcel = () => {
    alert('Financial report exported as Excel');
    // In production, would generate actual Excel file
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Financial Reports</h3>
            <p className="text-sm text-gray-500">Comprehensive financial analytics and insights</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 font-medium text-sm transition-colors"
            >
              <Download size={16} />
              PDF Report
            </button>
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 font-medium text-sm transition-colors"
            >
              <Download size={16} />
              Excel Report
            </button>
          </div>
        </div>

        {/* Date Range & Filters */}
        <div className="flex gap-4 flex-wrap">
          <div className="flex gap-2">
            {(['week', 'month', 'quarter', 'year'] as const).map(range => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  dateRange === range
                    ? 'bg-brand-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium text-sm"
          >
            <Filter size={16} />
            Filters
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Start Date</label>
              <input type="date" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">End Date</label>
              <input type="date" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Metric</label>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value as typeof selectedMetric)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              >
                <option value="all">All Metrics</option>
                <option value="revenue">Revenue Only</option>
                <option value="commission">Commission Only</option>
                <option value="expenses">Expenses Only</option>
                <option value="profit">Profit Only</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="w-full px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 font-medium text-sm">
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Total Revenue</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{CURRENCY}{(totalRevenue / 1000000).toFixed(1)}M</h3>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="text-green-600" size={20} />
            </div>
          </div>
          <p className="text-xs text-green-600 font-medium">↑ 12.5% vs last period</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Commission Earned</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{CURRENCY}{(totalCommission / 1000000).toFixed(2)}M</h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <DollarSign className="text-blue-600" size={20} />
            </div>
          </div>
          <p className="text-xs text-gray-600 font-medium">{((totalCommission / totalRevenue) * 100).toFixed(1)}% of revenue</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Total Expenses</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{CURRENCY}{(totalExpenses / 1000000).toFixed(2)}M</h3>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Activity className="text-orange-600" size={20} />
            </div>
          </div>
          <p className="text-xs text-gray-600 font-medium">{((totalExpenses / totalRevenue) * 100).toFixed(1)}% of revenue</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Net Profit</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{CURRENCY}{(totalProfit / 1000000).toFixed(1)}M</h3>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <TrendingUp className="text-purple-600" size={20} />
            </div>
          </div>
          <p className="text-xs text-purple-600 font-medium">Profit Margin: {((totalProfit / totalRevenue) * 100).toFixed(1)}%</p>
        </div>
      </div>

      {/* Revenue vs Expenses Trend */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h4 className="font-bold text-gray-800 mb-4">Revenue, Expenses & Profit Trend</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mockFinancialData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              formatter={(value) => `${CURRENCY}${(value / 1000).toFixed(0)}K`}
            />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} name="Revenue" dot={{ r: 4 }} />
            <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} name="Expenses" dot={{ r: 4 }} />
            <Line type="monotone" dataKey="profit" stroke="#3b82f6" strokeWidth={2} name="Profit" dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Commission vs Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h4 className="font-bold text-gray-800 mb-4">Daily Commission Breakdown</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={mockFinancialData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                formatter={(value) => `${CURRENCY}${(value / 1000).toFixed(0)}K`}
              />
              <Bar dataKey="commission" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Methods Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h4 className="font-bold text-gray-800 mb-4">Payment Methods Distribution</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={mockPaymentMethods}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {mockPaymentMethods.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${CURRENCY}${(value / 1000000).toFixed(1)}M`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {mockPaymentMethods.map((method, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }}></div>
                  <span className="text-gray-700">{method.name}</span>
                </div>
                <span className="font-semibold text-gray-900">{CURRENCY}{(method.value / 1000000).toFixed(2)}M</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Earning Drivers */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h4 className="font-bold text-gray-800 mb-4">Top Earning Drivers</h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Driver Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Total Earnings</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Rides Completed</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Avg per Ride</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Rating</th>
              </tr>
            </thead>
            <tbody>
              {mockDriverEarnings.map((driver, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-brand-400 to-brand-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {idx + 1}
                      </div>
                      <span className="font-medium text-gray-900">{driver.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-900">{CURRENCY}{(driver.earnings / 1000).toFixed(0)}K</td>
                  <td className="px-4 py-3 text-gray-700">{driver.rides}</td>
                  <td className="px-4 py-3 text-gray-700">{CURRENCY}{Math.round(driver.earnings / driver.rides)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-gray-900">{driver.rating}</span>
                      <span className="text-yellow-400">★</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-700 rounded-xl shadow-sm p-6 text-white">
        <h4 className="font-bold text-lg mb-4">Period Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <p className="text-brand-100 text-sm mb-1">Avg Daily Revenue</p>
            <p className="text-2xl font-bold">{CURRENCY}{(avgDailyRevenue / 1000000).toFixed(1)}M</p>
          </div>
          <div>
            <p className="text-brand-100 text-sm mb-1">Avg Daily Commission</p>
            <p className="text-2xl font-bold">{CURRENCY}{(totalCommission / mockFinancialData.length / 1000).toFixed(0)}K</p>
          </div>
          <div>
            <p className="text-brand-100 text-sm mb-1">Avg Daily Expenses</p>
            <p className="text-2xl font-bold">{CURRENCY}{(totalExpenses / mockFinancialData.length / 1000).toFixed(0)}K</p>
          </div>
          <div>
            <p className="text-brand-100 text-sm mb-1">Avg Daily Profit</p>
            <p className="text-2xl font-bold">{CURRENCY}{(totalProfit / mockFinancialData.length / 1000).toFixed(0)}K</p>
          </div>
          <div>
            <p className="text-brand-100 text-sm mb-1">Total Days</p>
            <p className="text-2xl font-bold">{mockFinancialData.length} days</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialReports;
