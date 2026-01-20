import React, { useState, useEffect } from 'react';
import { Zap, Target } from 'lucide-react';

/**
 * ReactionTest Component
 * Shows random dots and measures tap latency
 */
const ReactionTest = ({ onComplete, isActive }) => {
  const [gameState, setGameState] = useState('idle'); // idle, waiting, ready, clicked
  const [dotPosition, setDotPosition] = useState({ x: 0, y: 0 });
  const [reactionTimes, setReactionTimes] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const totalRounds = 5;

  useEffect(() => {
    if (isActive && gameState === 'idle') {
      // Auto start when active
      setTimeout(() => startRound(), 1000);
    }
  }, [isActive]);

  const startRound = () => {
    if (currentRound >= totalRounds) {
      finishTest();
      return;
    }

    setGameState('waiting');
    
    // Random delay between 1-3 seconds
    const delay = 1000 + Math.random() * 2000;
    
    setTimeout(() => {
      // Random position
      const x = 50 + Math.random() * 400;
      const y = 50 + Math.random() * 300;
      setDotPosition({ x, y });
      setGameState('ready');
      setStartTime(Date.now());
    }, delay);
  };

  const handleClick = () => {
    if (gameState === 'ready') {
      const reactionTime = Date.now() - startTime;
      setReactionTimes([...reactionTimes, reactionTime]);
      setCurrentRound(currentRound + 1);
      setGameState('clicked');
      
      setTimeout(() => {
        setGameState('idle');
        setTimeout(() => startRound(), 500);
      }, 500);
    } else if (gameState === 'waiting') {
      // Clicked too early
      alert('Too early! Wait for the dot to appear.');
      setGameState('idle');
      setTimeout(() => startRound(), 1000);
    }
  };

  const finishTest = () => {
    const avgReaction = reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length;
    onComplete({ 
      reactionTimes, 
      averageReaction: avgReaction,
      totalRounds 
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Zap className="text-yellow-600" />
        Reaction Time Test
      </h3>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold">Round {currentRound + 1} / {totalRounds}</span>
          <span className="text-sm text-gray-600">
            {reactionTimes.length > 0 && `Last: ${reactionTimes[reactionTimes.length - 1]}ms`}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-yellow-600 h-full rounded-full transition-all"
            style={{ width: `${(currentRound / totalRounds) * 100}%` }}
          />
        </div>
      </div>

      <div
        className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg cursor-pointer overflow-hidden"
        style={{ height: '400px' }}
        onClick={handleClick}
      >
        {/* Instructions */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Target size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Get ready...</p>
            </div>
          </div>
        )}

        {gameState === 'waiting' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-pulse text-2xl font-bold text-gray-700">
                Wait for it...
              </div>
            </div>
          </div>
        )}

        {gameState === 'ready' && (
          <div
            className="absolute w-16 h-16 bg-red-500 rounded-full cursor-pointer transform -translate-x-1/2 -translate-y-1/2 shadow-lg animate-pulse"
            style={{ 
              left: `${dotPosition.x}px`, 
              top: `${dotPosition.y}px` 
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
              TAP!
            </div>
          </div>
        )}

        {gameState === 'clicked' && (
          <div
            className="absolute w-16 h-16 bg-green-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"
            style={{ 
              left: `${dotPosition.x}px`, 
              top: `${dotPosition.y}px` 
            }}
          />
        )}
      </div>

      {reactionTimes.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm font-semibold">Reaction Times:</p>
          <div className="flex gap-2 mt-2 flex-wrap">
            {reactionTimes.map((time, i) => (
              <span key={i} className="px-2 py-1 bg-white rounded text-sm font-mono">
                {time}ms
              </span>
            ))}
          </div>
        </div>
      )}

      <p className="text-sm text-gray-600 mt-3">
        Click the red dot as quickly as possible when it appears.
      </p>
    </div>
  );
};

export default ReactionTest;
