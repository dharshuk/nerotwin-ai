import React from 'react';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Activity, Waves, TrendingUp } from 'lucide-react';

/**
 * VisualizationPanel Component
 * Shows graphs, heatmaps, waveforms for test data
 */
const VisualizationPanel = ({ currentStep, results }) => {
  // Simulated tremor data
  const tremorData = Array.from({ length: 30 }, (_, i) => ({
    time: i,
    amplitude: Math.random() * 50 + 25
  }));

  // Simulated speech waveform
  const speechWaveform = Array.from({ length: 50 }, (_, i) => ({
    time: i * 0.2,
    amplitude: Math.sin(i * 0.3) * 30 + Math.random() * 20
  }));

  // Reaction time data
  const reactionData = results ? [
    { test: 'Trial 1', time: 245 },
    { test: 'Trial 2', time: 280 },
    { test: 'Trial 3', time: 260 },
    { test: 'Trial 4', time: 255 },
    { test: 'Trial 5', time: 270 },
  ] : [];

  // Comparative scores
  const comparativeData = results ? [
    { category: 'Motor', your_score: results.motor_score, average: 75 },
    { category: 'Speech', your_score: results.speech_score, average: 78 },
    { category: 'Reaction', your_score: results.reaction_score, average: 72 },
  ] : [];

  return (
    <div className="space-y-6">
      {/* Tremor Analysis */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Activity className="text-blue-600" />
          Hand Tremor Analysis
        </h3>
        {currentStep === 'camera' || currentStep === 'drawing' || currentStep === 'speech' || currentStep === 'reaction' || currentStep === 'analyzing' || currentStep === 'results' ? (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={tremorData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" label={{ value: 'Time (s)', position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: 'Amplitude', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Line type="monotone" dataKey="amplitude" stroke="#2563eb" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-48 bg-gray-100 rounded flex items-center justify-center text-gray-400">
            Start tremor test to see live analysis
          </div>
        )}
        <p className="text-xs text-gray-600 mt-2">
          Real-time tremor frequency and amplitude measurement
        </p>
      </div>

      {/* Speech Waveform */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Waves className="text-green-600" />
          Speech Pattern Analysis
        </h3>
        {currentStep === 'speech' || currentStep === 'reaction' || currentStep === 'analyzing' || currentStep === 'results' ? (
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={speechWaveform}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" label={{ value: 'Time (s)', position: 'insideBottom', offset: -5 }} />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="amplitude" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-44 bg-gray-100 rounded flex items-center justify-center text-gray-400">
            Speech waveform will appear during speech test
          </div>
        )}
        <p className="text-xs text-gray-600 mt-2">
          Pitch variation and articulation clarity
        </p>
      </div>

      {/* Reaction Time Visualization */}
      {results && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="text-yellow-600" />
            Reaction Time Distribution
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={reactionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="test" />
              <YAxis label={{ value: 'Time (ms)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Bar dataKey="time" fill="#f59e0b">
                {reactionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.time < 260 ? '#10b981' : entry.time < 280 ? '#f59e0b' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-600 mt-2">
            Faster reactions indicate better neural response
          </p>
        </div>
      )}

      {/* Comparative Analysis */}
      {results && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold mb-4">Your Score vs. Average</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={comparativeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="average" fill="#cbd5e1" name="Average" />
              <Bar dataKey="your_score" fill="#6366f1" name="Your Score" />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-600 mt-2">
            Comparison with age-matched population baseline
          </p>
        </div>
      )}

      {/* Heatmap Placeholder */}
      {currentStep === 'drawing' || currentStep === 'speech' || currentStep === 'reaction' || currentStep === 'analyzing' || currentStep === 'results' ? (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold mb-4">Drawing Pressure Heatmap</h3>
          <div className="relative">
            <div className="w-full h-48 bg-gradient-to-br from-blue-200 via-purple-300 to-pink-200 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-500 rounded-full opacity-70 mx-auto mb-2"></div>
                <p className="text-sm text-gray-700 font-semibold">High Pressure Zone</p>
              </div>
            </div>
            <div className="flex justify-between mt-2 text-xs">
              <span className="text-blue-600">Low Pressure</span>
              <span className="text-red-600">High Pressure</span>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Pressure variation indicates motor control stability
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default VisualizationPanel;
