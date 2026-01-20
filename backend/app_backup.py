# Build Flask backend for NeuroVision AI

from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import json
import os
import random
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Create upload directory
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Startup message
print("🚀 NeuroVision AI Backend Starting...")
print("⚠️  Note: This is a demo system with SIMULATED scoring - NOT for medical use")
print("📊 API Endpoints:")
print("   - POST /analyze/motor")
print("   - POST /analyze/speech")
print("   - POST /analyze/reaction")
print("   - POST /analyze/aggregate")
print("\n🌐 Server running on http://localhost:5000\n")

@app.route('/')
def home():
    return jsonify({
        'status': 'NeuroVision AI Backend Running',
        'version': '2.0.0 - Simulated ML Inference',
        'disclaimer': 'Demo system - not for medical diagnosis',
        'endpoints': [
            'POST /analyze/motor',
            'POST /analyze/speech', 
            'POST /analyze/reaction',
            'POST /analyze/aggregate'
        ]
    })

# ============================================================================
# MOTOR ANALYSIS - Video-based tremor detection
# ============================================================================
@app.route('/analyze/motor', methods=['POST'])
def analyze_motor():
    """
    Analyze motor function from video frames
    Simulates motion variance detection
    
    Scoring Logic:
    - Low variance (steady hand) → 90%
    - Medium variance → 70%
    - High variance (tremor) → 50%
    """
    try:
        print(f"\n📹 Motor Analysis Request - {datetime.now().strftime('%H:%M:%S')}")
        
        # Check for video file upload
        if 'video' in request.files:
            video_file = request.files['video']
            file_size = len(video_file.read())
            video_file.seek(0)  # Reset file pointer
            
            print(f"   Video uploaded: {video_file.filename} ({file_size} bytes)")
            
            # Save temporarily (for demo purposes)
            video_path = os.path.join(UPLOAD_FOLDER, f'motor_{datetime.now().timestamp()}.webm')
            video_file.save(video_path)
            
            # SIMULATE ML INFERENCE - Motion variance analysis
            motor_score = simulate_motor_analysis(file_size)
            
            # Cleanup
            try:
                os.remove(video_path)
            except:
                pass
                
        elif request.json and 'frames' in request.json:
            # JSON input with frame data
            frames = request.json.get('frames', 0)
            print(f"   JSON data: {frames} frames")
            motor_score = simulate_motor_analysis(frames)
        else:
            return jsonify({'error': 'No video file or frames data provided'}), 400
        
        variance_level = 'low' if motor_score >= 85 else 'medium' if motor_score >= 65 else 'high'
        print(f"   ✅ Motor Score: {motor_score}/100 (variance: {variance_level})")
        
        return jsonify({
            'motor_score': motor_score,
            'analysis': 'Motion variance analyzed via simulated CV model',
            'variance_level': variance_level,
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        print(f"   ❌ Error: {str(e)}")
        return jsonify({'error': str(e)}), 500

def simulate_motor_analysis(data_size):
    """
    SIMULATED motor function scoring
    Maps motion variance to percentage score:
    - Low → 90% (range 85-95)
    - Medium → 70% (range 65-75)
    - High → 50% (range 45-55)
    """
    # Randomly assign variance type (weighted for realism)
    variance_type = random.choices(
        ['low', 'medium', 'high'],
        weights=[0.5, 0.35, 0.15]  # Most people have steady hands
    )[0]
    
    if variance_type == 'low':
        # Low variance (steady hand) → ~90%
        score = random.randint(85, 95)
    elif variance_type == 'medium':
        # Medium variance → ~70%
        score = random.randint(65, 75)
    else:
        # High variance (tremor detected) → ~50%
        score = random.randint(45, 55)
    
    return score

# ============================================================================
# SPEECH ANALYSIS - Audio-based speech pattern detection
# ============================================================================
@app.route('/analyze/speech', methods=['POST'])
def analyze_speech():
    """
    Analyze speech from audio recording
    Simulates volume variation and pause duration analysis
    
    Scoring Logic:
    - Stable speech → 85%
    - Irregular speech → 65%
    - Erratic speech → 45%
    """
    try:
        print(f"\n🎤 Speech Analysis Request - {datetime.now().strftime('%H:%M:%S')}")
        
        # Check for audio file upload
        if 'audio' in request.files:
            audio_file = request.files['audio']
            file_size = len(audio_file.read())
            audio_file.seek(0)
            
            print(f"   Audio uploaded: {audio_file.filename} ({file_size} bytes)")
            
            # Save temporarily
            audio_path = os.path.join(UPLOAD_FOLDER, f'speech_{datetime.now().timestamp()}.webm')
            audio_file.save(audio_path)
            
            # SIMULATE ML INFERENCE - Volume variation & pause analysis
            speech_score = simulate_speech_analysis(file_size)
            
            # Cleanup
            try:
                os.remove(audio_path)
            except:
                pass
                
        elif request.json and 'duration' in request.json:
            # JSON input with audio metadata
            duration = request.json.get('duration', 0)
            print(f"   JSON data: {duration}s duration")
            speech_score = simulate_speech_analysis(duration)
        else:
            return jsonify({'error': 'No audio file or data provided'}), 400
        
        pattern = 'stable' if speech_score >= 80 else 'irregular' if speech_score >= 60 else 'erratic'
        print(f"   ✅ Speech Score: {speech_score}/100 (pattern: {pattern})")
        
        return jsonify({
            'speech_score': speech_score,
            'analysis': 'Volume variation and pause duration analyzed',
            'pattern': pattern,
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        print(f"   ❌ Error: {str(e)}")
        return jsonify({'error': str(e)}), 500

def simulate_speech_analysis(data_size):
    """
    SIMULATED speech pattern scoring
    Maps speech characteristics to percentage score:
    - Stable → 85% (range 80-90)
    - Irregular → 65% (range 60-70)
    - Erratic → 45% (range 40-50)
    """
    # Randomly assign speech pattern (weighted for realism)
    pattern_type = random.choices(
        ['stable', 'irregular', 'erratic'],
        weights=[0.6, 0.3, 0.1]  # Most people have stable speech
    )[0]
    
    if pattern_type == 'stable':
        # Stable speech (clear, consistent) → ~85%
        score = random.randint(80, 90)
    elif pattern_type == 'irregular':
        # Irregular speech (some variation) → ~65%
        score = random.randint(60, 70)
    else:
        # Erratic speech (significant issues) → ~45%
        score = random.randint(40, 50)
    
    return score

# ============================================================================
# REACTION ANALYSIS - Reaction time measurement
# ============================================================================
@app.route('/analyze/reaction', methods=['POST'])
def analyze_reaction():
    """
    Analyze reaction time from click test
    
    Scoring Logic:
    - < 300ms → 95%
    - 300-500ms → 75%
    - > 500ms → 50%
    """
    try:
        print(f"\n⚡ Reaction Analysis Request - {datetime.now().strftime('%H:%M:%S')}")
        
        data = request.get_json()
        
        if not data or 'reaction_times' not in data:
            return jsonify({'error': 'No reaction time data provided'}), 400
        
        reaction_times = data['reaction_times']
        print(f"   Reaction times: {reaction_times}")
        
        # Calculate average reaction time
        avg_reaction = np.mean(reaction_times)
        
        # SIMULATE ML INFERENCE - Map reaction time to score
        reaction_score = simulate_reaction_analysis(avg_reaction)
        
        speed_category = 'fast' if avg_reaction < 300 else 'normal' if avg_reaction < 500 else 'slow'
        print(f"   ✅ Reaction Score: {reaction_score}/100 (avg: {avg_reaction:.0f}ms, category: {speed_category})")
        
        return jsonify({
            'reaction_score': reaction_score,
            'average_time': avg_reaction,
            'speed_category': speed_category,
            'analysis': 'Response latency measured',
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        print(f"   ❌ Error: {str(e)}")
        return jsonify({'error': str(e)}), 500

def simulate_reaction_analysis(avg_reaction_ms):
    """
    SIMULATED reaction time scoring
    Maps reaction time to percentage score:
    - < 300ms → 95% (range 90-98)
    - 300-500ms → 75% (range 70-80)
    - > 500ms → 50% (range 45-55)
    """
    if avg_reaction_ms < 300:
        # Fast reaction → ~95%
        score = random.randint(90, 98)
    elif avg_reaction_ms < 500:
        # Normal reaction → ~75%
        score = random.randint(70, 80)
    else:
        # Slow reaction → ~50%
        score = random.randint(45, 55)
    
    return score

# ============================================================================
# AGGREGATE ANALYSIS - Combined risk assessment
# ============================================================================
@app.route('/analyze/aggregate', methods=['POST'])
def analyze_aggregate():
    """
    Aggregate all test results and compute neurological risk index
    
    Weighted Formula:
    Risk = 0.4 * Motor + 0.3 * Speech + 0.3 * Reaction
    
    Risk Mapping:
    - 80-100 → LOW
    - 60-80 → MODERATE
    - < 60 → HIGH
    """
    try:
        print(f"\n📊 Aggregate Analysis Request - {datetime.now().strftime('%H:%M:%S')}")
        
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Extract individual scores (default to 0 if not provided)
        motor_score = data.get('motor_score', 0)
        speech_score = data.get('speech_score', 0)
        reaction_score = data.get('reaction_score', 0)
        
        print(f"   Input scores - Motor: {motor_score}, Speech: {speech_score}, Reaction: {reaction_score}")
        
        # WEIGHTED FORMULA
        neuro_risk_index = int(
            0.4 * motor_score +
            0.3 * speech_score +
            0.3 * reaction_score
        )
        
        # RISK LEVEL MAPPING
        if neuro_risk_index >= 80:
            risk_level = "LOW"
            recommendation = "No immediate concerns detected"
        elif neuro_risk_index >= 60:
            risk_level = "MODERATE"
            recommendation = "Consider follow-up screening"
        else:
            risk_level = "HIGH"
            recommendation = "Refer to neurologist for evaluation"
        
        print(f"   ✅ Neuro Risk Index: {neuro_risk_index}/100 (level: {risk_level})")
        
        return jsonify({
            'motor_score': motor_score,
            'speech_score': speech_score,
            'reaction_score': reaction_score,
            'neuro_risk_index': neuro_risk_index,
            'risk_level': risk_level,
            'recommendation': recommendation,
            'formula': '0.4 × Motor + 0.3 × Speech + 0.3 × Reaction',
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        print(f"   ❌ Error: {str(e)}")
        return jsonify({'error': str(e)}), 500

# ============================================================================
# SERVER STARTUP
# ============================================================================
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
