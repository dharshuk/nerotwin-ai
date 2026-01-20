import React, { useState } from 'react';
import axios from 'axios';
import { Brain, Play, Loader2 } from 'lucide-react';
import CameraCapture from './CameraCapture';
import DrawingPad from './DrawingPad';
import SpeechRecorder from './SpeechRecorder';
import ReactionTest from './ReactionTest';
import RiskDashboard from './RiskDashboard';
import ChatbotPanel from './ChatbotPanel';
import VisualizationPanel from './VisualizationPanel';
import ModeToggle from './ModeToggle';
import PatientIntake from './PatientIntake';
import TestHistory from './TestHistory';

/**
 * Main Dashboard Component
 * 3-column layout: Tests | Visualization | Risk Metrics + Chatbot
 */
const Dashboard = () => {
  const [currentStep, setCurrentStep] = useState('welcome');
  const [testData, setTestData] = useState({
    motor: null,
    drawing: null,
    speech: null,
    reaction: null
  });
  const [results, setResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [mode, setMode] = useState('user'); // 'user' or 'clinic'
  const [baseline, setBaseline] = useState(
    JSON.parse(localStorage.getItem("baseline"))
  );
  const [patient, setPatient] = useState({
    name: "",
    age: "",
    complaint: ""
  });

  const API_BASE = 'http://localhost:5000';

  const startNeuroCheck = () => {
    setCurrentStep('camera');
    setTestData({ motor: null, drawing: null, speech: null, reaction: null });
    setResults(null);
  };

  const handleCameraComplete = (data) => {
    setTestData(prev => ({ ...prev, motor: data }));
    setCurrentStep('drawing');
  };

  const handleDrawingComplete = (data) => {
    setTestData(prev => ({ ...prev, drawing: data }));
    setCurrentStep('speech');
  };

  const handleSpeechComplete = (data) => {
    setTestData(prev => ({ ...prev, speech: data }));
    setCurrentStep('reaction');
  };

  const handleReactionComplete = async (data) => {
    setTestData(prev => ({ ...prev, reaction: data }));
    setCurrentStep('analyzing');
    setIsAnalyzing(true);

    try {
      // Calculate average reaction time from test data
      const avgReactionTime = data.reaction_times 
        ? data.reaction_times.reduce((a, b) => a + b, 0) / data.reaction_times.length 
        : 350;

      // Call appropriate backend endpoint based on mode
      let response;
      
      if (mode === "user") {
        // USER MODE - Call /user/test endpoint
        response = await axios.post(`${API_BASE}/user/test`, {
          user_id: 1,  // Demo user
          motor_variance: Math.random() * 0.4,  // Simulated for now
          pitch_variation: Math.random() * 0.6,
          pause_duration: Math.random() * 1.5,
          speech_rate: 100 + Math.random() * 80,
          reaction_time_ms: avgReactionTime
        });

        const apiResults = response.data;
        const results = {
          ...apiResults.current_test,
          trend: apiResults.trend,
          nura_feedback: apiResults.nura_feedback,
          previous_test: apiResults.previous_test
        };

        // Update baseline if first test
        if (!baseline && !apiResults.previous_test) {
          localStorage.setItem("baseline", JSON.stringify(apiResults.current_test));
          setBaseline(apiResults.current_test);
        }

        setResults(results);
        
      } else {
        // CLINIC MODE - Call /clinic/test endpoint
        // First register patient if needed
        if (!patient.patient_id && patient.name) {
          const patientReg = await axios.post(`${API_BASE}/patient/register`, {
            name: patient.name,
            age: patient.age,
            complaint: patient.complaint
          });
          setPatient(prev => ({ ...prev, patient_id: patientReg.data.patient_id }));
        }

        response = await axios.post(`${API_BASE}/clinic/test`, {
          patient_id: patient.patient_id || 1,
          motor_variance: Math.random() * 0.4,
          pitch_variation: Math.random() * 0.6,
          pause_duration: Math.random() * 1.5,
          speech_rate: 100 + Math.random() * 80,
          reaction_time_ms: avgReactionTime,
          doctor_motor: "Normal",  // Doctor assessment (will add UI later)
          doctor_speech: "Normal",
          doctor_cognition: "Normal"
        });

        const apiResults = response.data;
        const results = {
          ...apiResults.ai_result,
          doctor_result: apiResults.doctor_result,
          comparison: apiResults.comparison,
          nura_feedback: apiResults.nura_feedback,
          referral: apiResults.referral
        };

        setResults(results);
      }

      console.log('✅ Backend response:', response.data);
      
    } catch (error) {
      console.error('❌ Backend error:', error);
      
      // Fallback to simulated results if backend fails
      const motor = Math.floor(Math.random() * 40) + 50;
      const speech = Math.floor(Math.random() * 40) + 50;
      const reaction = Math.floor(Math.random() * 40) + 50;
      const riskIndex = Math.floor(0.4 * motor + 0.3 * speech + 0.3 * reaction);
      const riskLevel = riskIndex >= 80 ? "LOW" : riskIndex >= 60 ? "MODERATE" : "HIGH";

      setResults({
        motor_score: motor,
        speech_score: speech,
        reaction_score: reaction,
        neuro_risk_index: riskIndex,
        risk_level: riskLevel,
        error: 'Using simulated data - backend unavailable'
      });
    } finally {
      setIsAnalyzing(false);
      setCurrentStep('results');
    }
  };

  return (
    <div className="min-h-screen p-4">
      {/* Header */}
      <header className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">NeuroVision AI</h1>
              <p className="text-sm text-gray-600">Clinical Neurological Screening Platform</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Mode Toggle */}
            <div className="bg-gray-100 rounded-lg p-1 flex gap-1">
              <button
                onClick={() => setMode('user')}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                  mode === 'user' ? 'bg-white shadow text-blue-600' : 'text-gray-600'
                }`}
              >
                User Mode
              </button>
              <button
                onClick={() => setMode('clinic')}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                  mode === 'clinic' ? 'bg-white shadow text-blue-600' : 'text-gray-600'
                }`}
              >
                Clinic Mode
              </button>
            </div>

            {currentStep === 'welcome' && (
              <button
                onClick={startNeuroCheck}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Play size={20} />
                Start Neuro Check
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content - 3 Column Layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - Test Panel */}
        <div className="col-span-4 space-y-6">
          <ModeToggle mode={mode} setMode={setMode} />

          {mode === "clinic" && (
            <PatientIntake patient={patient} setPatient={setPatient} />
          )}

          {currentStep === 'welcome' && (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <Brain size={64} className="mx-auto text-indigo-600 mb-4" />
              <h2 className="text-2xl font-bold mb-4">Welcome to NeuroVision AI</h2>
              <p className="text-gray-600 mb-6">
                Complete a series of quick tests to assess your neurological health. 
                The entire screening takes about 5-7 minutes.
              </p>
              <div className="text-left space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Hand Tremor Test (30 seconds)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <span>Drawing Test (motor control)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span>Speech Test (10 seconds)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                  <span>Reaction Time Test</span>
                </div>
              </div>
            </div>
          )}

          {currentStep === 'camera' && (
            <CameraCapture onComplete={handleCameraComplete} isActive={true} />
          )}

          {currentStep === 'drawing' && (
            <DrawingPad onComplete={handleDrawingComplete} isActive={true} />
          )}

          {currentStep === 'speech' && (
            <SpeechRecorder onComplete={handleSpeechComplete} isActive={true} />
          )}

          {currentStep === 'reaction' && (
            <ReactionTest onComplete={handleReactionComplete} isActive={true} />
          )}

          {currentStep === 'analyzing' && (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <Loader2 className="animate-spin mx-auto text-indigo-600 mb-4" size={64} />
              <h3 className="text-xl font-bold mb-2">Analyzing Your Results</h3>
              <p className="text-gray-600">
                Our AI is processing your test data. This will take just a moment...
              </p>
            </div>
          )}

          {currentStep === 'results' && (
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg shadow-lg p-8 text-center border-2 border-green-300">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✓</span>
              </div>
              <h3 className="text-2xl font-bold mb-2 text-green-800">Assessment Complete!</h3>
              <p className="text-gray-700 mb-6">
                Your neurological screening is complete. Review your results on the right.
              </p>
              <button
                onClick={startNeuroCheck}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
              >
                Take Another Test
              </button>
            </div>
          )}
        </div>

        {/* Center Column - Visualization Panel */}
        <div className="col-span-4">
          <VisualizationPanel currentStep={currentStep} results={results} />
        </div>

        {/* Right Column - Risk Dashboard + Chatbot */}
        <div className="col-span-4 space-y-6">
          <RiskDashboard results={results} />
          <ChatbotPanel mode={mode} results={results} />
        </div>
      </div>

      {/* Test History Section - Full Width */}
      {results && (
        <div className="mt-8">
          <TestHistory mode={mode} userId={patient?.id || "demo_user"} />
        </div>
      )}

      {/* Footer */}
      <footer className="mt-8 text-center text-sm text-gray-600">
        <p>© 2026 NeuroVision AI | For screening purposes only - not a substitute for professional medical advice</p>
      </footer>
    </div>
  );
};

export default Dashboard;
