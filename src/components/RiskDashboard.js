import React from 'react';
import { Activity, Brain, Zap, Mic, TrendingUp, AlertCircle } from 'lucide-react';
import { LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

/**
 * RiskDashboard Component
 * Displays risk scores and metrics
 */
const RiskDashboard = ({ results }) => {
  if (!results) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Brain className="text-indigo-600" />
          Risk Analysis
        </h3>
        <div className="text-center py-12 text-gray-400">
          <Activity size={48} className="mx-auto mb-4 opacity-50" />
          <p>Complete tests to see your risk analysis</p>
        </div>
      </div>
    );
  }

  const { motor_score, speech_score, reaction_score, neuro_risk_index, risk_level } = results;

  // Risk level configuration
  const riskConfig = {
    LOW: { color: 'text-green-600', bg: 'bg-green-100', border: 'border-green-600', label: 'Low Risk' },
    MEDIUM: { color: 'text-yellow-600', bg: 'bg-yellow-100', border: 'border-yellow-600', label: 'Medium Risk' },
    HIGH: { color: 'text-red-600', bg: 'bg-red-100', border: 'border-red-600', label: 'High Risk' }
  };

  const currentRisk = riskConfig[risk_level] || riskConfig.MEDIUM;

  // Data for radar chart
  const radarData = [
    { subject: 'Motor', score: motor_score, fullMark: 100 },
    { subject: 'Speech', score: speech_score, fullMark: 100 },
    { subject: 'Reaction', score: reaction_score, fullMark: 100 },
  ];

  // Simulated trend data
  const trendData = [
    { date: 'Week 1', score: 85 },
    { date: 'Week 2', score: 82 },
    { date: 'Week 3', score: 79 },
    { date: 'Week 4', score: neuro_risk_index },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Brain className="text-indigo-600" />
        Risk Analysis
      </h3>

      {/* Overall Risk Score */}
      <div className={`mb-6 p-6 rounded-lg border-2 ${currentRisk.border} ${currentRisk.bg}`}>
        <div className="text-center">
          <div className={`text-5xl font-bold ${currentRisk.color} mb-2`}>
            {neuro_risk_index}
          </div>
          <div className={`text-lg font-semibold ${currentRisk.color} mb-1`}>
            {currentRisk.label}
          </div>
          <div className="text-sm text-gray-600">
            Neuro Risk Index
          </div>
        </div>
      </div>

      {/* Individual Scores */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <ScoreCard
          icon={<Activity size={20} />}
          label="Motor"
          score={motor_score}
          color="blue"
        />
        <ScoreCard
          icon={<Mic size={20} />}
          label="Speech"
          score={speech_score}
          color="purple"
        />
        <ScoreCard
          icon={<Zap size={20} />}
          label="Reaction"
          score={reaction_score}
          color="yellow"
        />
      </div>

      {/* Radar Chart */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Performance Profile</h4>
        <ResponsiveContainer width="100%" height={200}>
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis angle={90} domain={[0, 100]} />
            <Radar name="Score" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Trend Chart */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <TrendingUp size={16} />
          Risk Trend
        </h4>
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recommendations */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-2 mb-2">
          <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Recommendations</h4>
            <p className="text-sm text-blue-800">
              {risk_level === 'LOW' && "Your results look stable. Continue monitoring monthly."}
              {risk_level === 'MEDIUM' && "Minor changes detected. Schedule a follow-up in 2 weeks."}
              {risk_level === 'HIGH' && "Please consult a neurologist for further evaluation."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ScoreCard Sub-component
const ScoreCard = ({ icon, label, score, color }) => {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-100',
    purple: 'text-purple-600 bg-purple-100',
    yellow: 'text-yellow-600 bg-yellow-100',
  };

  return (
    <div className="text-center">
      <div className={`w-12 h-12 rounded-full ${colorClasses[color]} flex items-center justify-center mx-auto mb-2`}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-gray-800">{score}</div>
      <div className="text-xs text-gray-600">{label}</div>
    </div>
  );
};

export default RiskDashboard;
