import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { History, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TestHistory = ({ mode, userId, patientId }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadHistory();
  }, [mode, userId, patientId]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const endpoint = mode === 'user' 
        ? `http://localhost:5000/user/history/${userId || 1}`
        : `http://localhost:5000/patient/history/${patientId || 1}`;
      
      const response = await axios.get(endpoint);
      setHistory(response.data.history || []);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse">Loading history...</div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <History className="text-indigo-600" />
          Test History
        </h3>
        <div className="text-center py-8 text-gray-400">
          <History size={48} className="mx-auto mb-4 opacity-50" />
          <p>No previous tests found. Complete your first test to see history.</p>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const chartData = history.slice(0, 10).reverse().map((test, index) => ({
    test: `Test ${index + 1}`,
    date: new Date(test.created_at).toLocaleDateString(),
    motor: test.motor_score,
    speech: test.speech_score,
    reaction: test.reaction_score,
    risk: test.neuro_risk_index
  }));

  // Get trend for latest test vs previous
  const getTrend = (current, previous) => {
    if (!previous) return null;
    const diff = current - previous;
    if (Math.abs(diff) < 2) return { icon: Minus, color: 'text-gray-500', text: 'stable' };
    if (diff > 0) return { icon: TrendingUp, color: 'text-green-600', text: `+${diff.toFixed(1)}%` };
    return { icon: TrendingDown, color: 'text-red-600', text: `${diff.toFixed(1)}%` };
  };

  const latest = history[0];
  const previous = history[1];

  const motorTrend = getTrend(latest.motor_score, previous?.motor_score);
  const speechTrend = getTrend(latest.speech_score, previous?.speech_score);
  const reactionTrend = getTrend(latest.reaction_score, previous?.reaction_score);
  const riskTrend = getTrend(latest.neuro_risk_index, previous?.neuro_risk_index);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <History className="text-indigo-600" />
        Test History ({history.length} tests)
      </h3>

      {/* Trend Summary */}
      {previous && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
          <h4 className="font-semibold mb-3 text-sm text-gray-700">Latest vs Previous Test</h4>
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center">
              <div className="text-xs text-gray-600 mb-1">Motor</div>
              <div className={`flex items-center justify-center gap-1 ${motorTrend?.color || ''}`}>
                {motorTrend?.icon && <motorTrend.icon size={16} />}
                <span className="text-sm font-semibold">{motorTrend?.text || 'N/A'}</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-600 mb-1">Speech</div>
              <div className={`flex items-center justify-center gap-1 ${speechTrend?.color || ''}`}>
                {speechTrend?.icon && <speechTrend.icon size={16} />}
                <span className="text-sm font-semibold">{speechTrend?.text || 'N/A'}</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-600 mb-1">Reaction</div>
              <div className={`flex items-center justify-center gap-1 ${reactionTrend?.color || ''}`}>
                {reactionTrend?.icon && <reactionTrend.icon size={16} />}
                <span className="text-sm font-semibold">{reactionTrend?.text || 'N/A'}</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-600 mb-1">Risk Index</div>
              <div className={`flex items-center justify-center gap-1 ${riskTrend?.color || ''}`}>
                {riskTrend?.icon && <riskTrend.icon size={16} />}
                <span className="text-sm font-semibold">{riskTrend?.text || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trend Chart */}
      <div className="mb-6">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Line type="monotone" dataKey="motor" stroke="#3b82f6" name="Motor" strokeWidth={2} />
            <Line type="monotone" dataKey="speech" stroke="#10b981" name="Speech" strokeWidth={2} />
            <Line type="monotone" dataKey="reaction" stroke="#f59e0b" name="Reaction" strokeWidth={2} />
            <Line type="monotone" dataKey="risk" stroke="#ef4444" name="Risk Index" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Test Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-center">Motor</th>
              <th className="p-2 text-center">Speech</th>
              <th className="p-2 text-center">Reaction</th>
              <th className="p-2 text-center">Risk</th>
              <th className="p-2 text-center">Level</th>
            </tr>
          </thead>
          <tbody>
            {history.slice(0, 5).map((test, index) => (
              <tr key={test.test_id} className={index === 0 ? 'bg-blue-50 font-semibold' : 'hover:bg-gray-50'}>
                <td className="p-2 border-t">{new Date(test.created_at).toLocaleDateString()}</td>
                <td className="p-2 border-t text-center">{test.motor_score}%</td>
                <td className="p-2 border-t text-center">{test.speech_score}%</td>
                <td className="p-2 border-t text-center">{test.reaction_score}%</td>
                <td className="p-2 border-t text-center">{test.neuro_risk_index}%</td>
                <td className="p-2 border-t text-center">
                  <span className={`px-2 py-1 rounded text-xs ${
                    test.risk_level === 'LOW' ? 'bg-green-100 text-green-800' :
                    test.risk_level === 'MODERATE' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {test.risk_level}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {history.length > 5 && (
        <div className="mt-3 text-center">
          <button 
            onClick={loadHistory}
            className="text-xs text-indigo-600 hover:text-indigo-800"
          >
            View all {history.length} tests
          </button>
        </div>
      )}
    </div>
  );
};

export default TestHistory;
