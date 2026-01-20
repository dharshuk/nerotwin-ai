import React, { useState, useRef } from 'react';
import { Mic, StopCircle } from 'lucide-react';

/**
 * SpeechRecorder Component
 * Records 10 seconds of voice for speech analysis
 */
const SpeechRecorder = ({ onComplete, isActive }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [audioLevel, setAudioLevel] = useState(0);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);

  const testSentence = "The quick brown fox jumps over the lazy dog";

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Setup audio visualization
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(analyser);
      analyser.fftSize = 256;
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      // Visualize audio level
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateLevel = () => {
        if (analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setAudioLevel(Math.min(100, (average / 256) * 200));
          if (isRecording) {
            requestAnimationFrame(updateLevel);
          }
        }
      };
      updateLevel();

      // Setup recorder
      chunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach(track => track.stop());
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }
        onComplete({ audioBlob: blob, duration: 10 });
        setIsRecording(false);
        setCountdown(10);
        setAudioLevel(0);
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Countdown timer
      let timeLeft = 10;
      const timer = setInterval(() => {
        timeLeft--;
        setCountdown(timeLeft);
        if (timeLeft <= 0) {
          clearInterval(timer);
          mediaRecorder.stop();
        }
      }, 1000);

    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Mic className="text-green-600" />
        Speech Test
      </h3>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <p className="text-sm text-gray-600 mb-2">Please read this sentence:</p>
        <p className="text-lg font-semibold text-gray-800">"{testSentence}"</p>
      </div>

      {/* Audio Level Indicator */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Mic size={16} className="text-gray-600" />
          <span className="text-sm text-gray-600">Audio Level</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="bg-green-500 h-full transition-all duration-100"
            style={{ width: `${audioLevel}%` }}
          />
        </div>
      </div>

      {isRecording && (
        <div className="text-center mb-4">
          <div className="text-4xl font-bold text-red-600">{countdown}s</div>
          <div className="flex justify-center gap-1 mt-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 bg-red-600 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
          >
            <Mic size={20} />
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
          >
            <StopCircle size={20} />
            Stop Recording
          </button>
        )}
      </div>

      <p className="text-sm text-gray-600 mt-3">
        Recording will analyze speech clarity, pitch variation, and articulation.
      </p>
    </div>
  );
};

export default SpeechRecorder;
