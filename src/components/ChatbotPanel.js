import React, { useState } from "react";
import { Bot } from "lucide-react";

export default function ChatbotPanel({ mode, results }) {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: mode === "user"
        ? "Hello! I'm NURA, your AI nurse. I'll help you understand your brain wellness screening results."
        : "Hello. I'm NURA, clinical AI assistant. I'll provide analysis of neurological screening results.",
    },
  ]);

  const addMessage = (text) => {
    setMessages((prev) => [...prev, { sender: "bot", text }]);
  };

  React.useEffect(() => {
    if (!results) return;

    // Clear previous result messages and add new ones
    setMessages([{
      sender: "bot",
      text: mode === "user"
        ? "Hello! I'm NURA, your AI nurse. I'll help you understand your brain wellness screening results."
        : "Hello. I'm NURA, clinical AI assistant. I'll provide analysis of neurological screening results.",
    }]);

    setTimeout(() => {
      if (mode === "user") {
        // USER MODE - 2 LINE FEEDBACK
        
        // Line 1: How risk was calculated
        const indicators = [];
        if (results.motor_score) indicators.push(`motor function ${results.motor_score}%`);
        if (results.speech_score) indicators.push(`speech clarity ${results.speech_score}%`);
        if (results.reaction_score) indicators.push(`reaction time ${results.reaction_score}%`);
        
        const line1 = `Your Neuro Risk Index is ${results.neuro_risk_index}% calculated from: ${indicators.join(', ')}. This places you in ${results.risk_level} risk category.`;
        addMessage(line1);

        // Line 2: Recommendation
        let line2 = "";
        if (results.risk_level === "LOW") {
          line2 = "Your brain health is excellent. All indicators are within healthy ranges. Continue your wellness routine and recheck in 1 month.";
        } else if (results.risk_level === "MODERATE") {
          line2 = "Some indicators show minor variations. This may be due to stress or fatigue. I recommend retesting in 2 weeks and consulting a doctor if symptoms persist.";
        } else {
          line2 = "Multiple indicators are below normal ranges. Please consult a neurologist within 2 weeks for comprehensive evaluation. This is important for your health.";
        }
        
        // Add trend information if available
        if (results.trend && results.previous_test) {
          const trendLine = `Compared to your previous test: Motor ${results.trend.motor > 0 ? '↑' : '↓'}${Math.abs(results.trend.motor).toFixed(1)}%, Speech ${results.trend.speech > 0 ? '↑' : '↓'}${Math.abs(results.trend.speech).toFixed(1)}%, Reaction ${results.trend.reaction > 0 ? '↑' : '↓'}${Math.abs(results.trend.reaction).toFixed(1)}%`;
          addMessage(trendLine);
        }
        
        addMessage(line2);

      } else {
        // CLINIC MODE - PROFESSIONAL FEEDBACK
        
        // Line 1: Clinical calculation
        const clinicalIndicators = [];
        if (results.motor_score < 70) clinicalIndicators.push(`motor instability (${results.motor_score}%)`);
        if (results.speech_score < 70) clinicalIndicators.push(`speech deficit (${results.speech_score}%)`);
        if (results.reaction_score < 70) clinicalIndicators.push(`delayed cognition (${results.reaction_score}%)`);
        
        const clinicalLine1 = clinicalIndicators.length > 0
          ? `Neuro Risk Index: ${results.neuro_risk_index}% - Based on ${clinicalIndicators.join(', ')}. Classification: ${results.risk_level} RISK.`
          : `Neuro Risk Index: ${results.neuro_risk_index}% - All parameters within clinical range (Motor: ${results.motor_score}%, Speech: ${results.speech_score}%, Cognition: ${results.reaction_score}%). Classification: ${results.risk_level} RISK.`;
        
        addMessage(clinicalLine1);

        // Line 2: Clinical recommendation
        let clinicalLine2 = "";
        if (results.risk_level === "HIGH") {
          clinicalLine2 = "RECOMMENDATION: Priority neurological referral within 1-2 weeks. Multiple indicators below clinical threshold (70%). Document symptoms and order baseline imaging if indicated.";
        } else if (results.risk_level === "MODERATE") {
          clinicalLine2 = "RECOMMENDATION: Standard neurological consultation within 2-4 weeks. Monitor symptom progression. Patient education on warning signs advised.";
        } else {
          clinicalLine2 = "ASSESSMENT: Parameters within acceptable range. Continue routine monitoring per protocol. Schedule standard follow-up as clinically indicated.";
        }
        
        addMessage(clinicalLine2);

        // Show AI vs Doctor comparison if available
        if (results.comparison) {
          const comp = results.comparison;
          const comparisonMsg = `AI-Doctor Analysis: Motor ${comp.motor.match ? '✓' : '✗'} (AI: ${comp.motor.ai}, MD: ${comp.motor.doctor}), Speech ${comp.speech.match ? '✓' : '✗'} (AI: ${comp.speech.ai}, MD: ${comp.speech.doctor}), Cognition ${comp.cognition.match ? '✓' : '✗'} (AI: ${comp.cognition.ai}, MD: ${comp.cognition.doctor}). Agreement: ${comp.agreement_rate}`;
          addMessage(comparisonMsg);
        }
      }
    }, 500);
  }, [results, mode]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-200">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
          <Bot className="text-white" size={18} />
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-800">NURA - AI Nurse</h3>
          <p className="text-xs text-gray-500">Neurological Health Assistant</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white rounded-lg p-3 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className="flex gap-2 animate-fade-in">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center mt-1">
              <Bot className="text-pink-600" size={14} />
            </div>
            <div className="flex-1 bg-white rounded-lg p-3 shadow-sm border border-gray-100">
              <p className="text-sm text-gray-800 leading-relaxed">
                {msg.text}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-400 text-center">
          {mode === "user" 
            ? "🔒 Your health data is secure and private"
            : "⚕️ AI-assisted tool. Final diagnosis requires clinical judgment"}
        </p>
      </div>
    </div>
  );
}
