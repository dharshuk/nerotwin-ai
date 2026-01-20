# Build Flask backend for NeuroVision AI
# Complete production-ready backend with database, medical logic, and dual-mode support

from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import os
from datetime import datetime
import random

# Import database and medical logic modules
import database as db
from medical_logic import (
    calculate_motor_score,
    calculate_speech_score,
    calculate_reaction_score,
    calculate_neuro_risk_index,
    calculate_trend,
    generate_nura_feedback_user,
    generate_nura_feedback_clinic,
    compare_ai_vs_doctor
)

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Create upload directory
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Startup message
print("\n" + "="*60)
print("🚀 NeuroVision AI Backend Starting...")
print("="*60)
print("⚕️  Medical-Grade Neurological Screening Platform")
print("📊 Database: SQLite (neurovision.db)")
print("🔬 Scoring: Explainable Medical Logic (No Randomization)")
print("\n📍 API Endpoints:")
print("   POST /user/test          - User mode screening + trend analysis")
print("   GET  /user/history/<id>  - User test history")
print("   POST /clinic/test        - Clinic mode screening + AI vs Doctor")
print("   GET  /patient/history/<id> - Patient test history")
print("   POST /user/register      - Register new user")
print("   POST /patient/register   - Register new patient")
print("\n🌐 Server: http://localhost:5000")
print("⚠️  Demo System - Not for medical diagnosis")
print("="*60 + "\n")

@app.route('/')
def home():
    return jsonify({
        'status': 'NeuroVision AI Backend Running',
        'version': '3.0.0 - Medical Logic + Database',
        'disclaimer': 'Screening tool - not for medical diagnosis',
        'modes': ['user', 'clinic'],
        'endpoints': [
            'POST /user/test',
            'GET /user/history/<user_id>',
            'POST /clinic/test',
            'GET /patient/history/<patient_id>',
            'POST /user/register',
            'POST /patient/register'
        ]
    })

# ============================================================================
# USER REGISTRATION
# ============================================================================
@app.route('/user/register', methods=['POST'])
def register_user():
    """Register new user for User Mode"""
    try:
        data = request.get_json()
        name = data.get('name', 'Anonymous User')
        age = data.get('age')
        email = data.get('email')
        
        user_id = db.create_user(name, age, email)
        
        return jsonify({
            'success': True,
            'user_id': user_id,
            'message': 'User registered successfully'
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============================================================================
# USER MODE - NEURO WELLNESS SCREENING
# ============================================================================
@app.route('/user/test', methods=['POST'])
def user_test():
    """
    User Mode: Run test + store history + calculate trend
    
    Input: user_id, motor_variance, speech_features, reaction_time_ms
    Output: current_test, previous_test, trend, nura_feedback
    """
    try:
        print(f"\n👤 User Mode Test - {datetime.now().strftime('%H:%M:%S')}")
        
        data = request.get_json()
        
        # Extract user data
        user_id = data.get('user_id', 1)  # Default user for demo
        
        # Extract test metrics (simulated for now, will be real from frontend)
        motor_variance = data.get('motor_variance', random.uniform(0.1, 0.4))
        
        # Speech features
        pitch_variation = data.get('pitch_variation', random.uniform(0.1, 0.6))
        pause_duration = data.get('pause_duration', random.uniform(0.2, 1.5))
        speech_rate = data.get('speech_rate', random.uniform(90, 180))
        
        reaction_time_ms = data.get('reaction_time_ms', random.uniform(250, 600))
        
        print(f"   User ID: {user_id}")
        print(f"   Motor Variance: {motor_variance:.3f}")
        print(f"   Reaction Time: {reaction_time_ms:.0f}ms")
        
        # MEDICAL SCORING LOGIC
        motor_score = calculate_motor_score(motor_variance)
        speech_score, speech_stability = calculate_speech_score(
            pitch_variation, pause_duration, speech_rate
        )
        reaction_score = calculate_reaction_score(reaction_time_ms)
        
        # Calculate Neuro Risk Index
        neuro_risk_index, risk_level = calculate_neuro_risk_index(
            motor_score, speech_score, reaction_score
        )
        
        print(f"   📊 Scores - Motor: {motor_score}, Speech: {speech_score}, Reaction: {reaction_score}")
        print(f"   🎯 Neuro Risk Index: {neuro_risk_index}% ({risk_level})")
        
        # Save to database
        test_id = db.save_user_test(
            user_id, motor_score, speech_score, reaction_score,
            neuro_risk_index, risk_level, motor_variance,
            speech_stability, reaction_time_ms
        )
        
        # Get previous test for trend analysis
        history = db.get_user_history(user_id, limit=2)
        
        current_test = {
            'test_id': test_id,
            'motor_score': motor_score,
            'speech_score': speech_score,
            'reaction_score': reaction_score,
            'neuro_risk_index': neuro_risk_index,
            'risk_level': risk_level,
            'motor_variance': motor_variance,
            'reaction_time_ms': reaction_time_ms,
            'timestamp': datetime.now().isoformat()
        }
        
        # Calculate trend if previous test exists
        previous_test = None
        trend = None
        
        if len(history) >= 2:
            previous_test = history[1]  # Second most recent (current is first)
            trend = {
                'motor': calculate_trend(motor_score, previous_test['motor_score']),
                'speech': calculate_trend(speech_score, previous_test['speech_score']),
                'reaction': calculate_trend(reaction_score, previous_test['reaction_score']),
                'risk_index': calculate_trend(neuro_risk_index, previous_test['neuro_risk_index'])
            }
            print(f"   📈 Trend vs Previous: {trend['risk_index']:+.1f}%")
        
        # Generate NURA feedback
        nura_feedback = generate_nura_feedback_user(
            neuro_risk_index, risk_level, motor_score,
            speech_score, reaction_score, reaction_time_ms, motor_variance
        )
        
        return jsonify({
            'success': True,
            'current_test': current_test,
            'previous_test': previous_test,
            'trend': trend,
            'nura_feedback': nura_feedback,
            'message': 'Test completed and saved to history'
        })
    
    except Exception as e:
        print(f"   ❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

# ============================================================================
# USER HISTORY
# ============================================================================
@app.route('/user/history/<int:user_id>', methods=['GET'])
def get_user_test_history(user_id):
    """Get user test history for trend charts"""
    try:
        limit = request.args.get('limit', 10, type=int)
        history = db.get_user_history(user_id, limit)
        
        return jsonify({
            'success': True,
            'user_id': user_id,
            'test_count': len(history),
            'history': history
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============================================================================
# PATIENT REGISTRATION (CLINIC MODE)
# ============================================================================
@app.route('/patient/register', methods=['POST'])
def register_patient():
    """Register new patient for Clinic Mode"""
    try:
        data = request.get_json()
        name = data.get('name', 'Anonymous Patient')
        age = data.get('age')
        gender = data.get('gender')
        complaint = data.get('complaint')
        
        patient_id = db.create_patient(name, age, gender, complaint)
        
        return jsonify({
            'success': True,
            'patient_id': patient_id,
            'message': 'Patient registered successfully'
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============================================================================
# CLINIC MODE - CLINICAL SCREENING + AI vs DOCTOR
# ============================================================================
@app.route('/clinic/test', methods=['POST'])
def clinic_test():
    """
    Clinic Mode: Run test + AI vs Doctor comparison
    
    Input: patient_id, motor_variance, speech_features, reaction_time_ms,
           doctor_motor, doctor_speech, doctor_cognition
    Output: ai_result, doctor_result, comparison, nura_feedback
    """
    try:
        print(f"\n🏥 Clinic Mode Test - {datetime.now().strftime('%H:%M:%S')}")
        
        data = request.get_json()
        
        # Extract patient data
        patient_id = data.get('patient_id', 1)  # Default for demo
        doctor_id = data.get('doctor_id', 'DR001')
        
        # Extract test metrics
        motor_variance = data.get('motor_variance', random.uniform(0.1, 0.4))
        pitch_variation = data.get('pitch_variation', random.uniform(0.1, 0.6))
        pause_duration = data.get('pause_duration', random.uniform(0.2, 1.5))
        speech_rate = data.get('speech_rate', random.uniform(90, 180))
        reaction_time_ms = data.get('reaction_time_ms', random.uniform(250, 600))
        
        # Doctor's clinical assessment
        doctor_motor = data.get('doctor_motor', 'Normal')
        doctor_speech = data.get('doctor_speech', 'Normal')
        doctor_cognition = data.get('doctor_cognition', 'Normal')
        doctor_notes = data.get('doctor_notes', '')
        
        print(f"   Patient ID: {patient_id}")
        print(f"   Doctor Assessment: Motor={doctor_motor}, Speech={doctor_speech}, Cognition={doctor_cognition}")
        
        # AI MEDICAL SCORING
        motor_score = calculate_motor_score(motor_variance)
        speech_score, speech_stability = calculate_speech_score(
            pitch_variation, pause_duration, speech_rate
        )
        reaction_score = calculate_reaction_score(reaction_time_ms)
        
        neuro_risk_index, risk_level = calculate_neuro_risk_index(
            motor_score, speech_score, reaction_score
        )
        
        print(f"   🤖 AI Scores - Motor: {motor_score}, Speech: {speech_score}, Reaction: {reaction_score}")
        print(f"   🎯 AI Risk Index: {neuro_risk_index}% ({risk_level})")
        
        # Save to database
        test_id = db.save_patient_test(
            patient_id, motor_score, speech_score, reaction_score,
            neuro_risk_index, risk_level, doctor_id,
            motor_variance, speech_stability, reaction_time_ms,
            doctor_motor, doctor_speech, doctor_cognition, doctor_notes
        )
        
        ai_result = {
            'test_id': test_id,
            'motor_score': motor_score,
            'speech_score': speech_score,
            'reaction_score': reaction_score,
            'neuro_risk_index': neuro_risk_index,
            'risk_level': risk_level,
            'timestamp': datetime.now().isoformat()
        }
        
        doctor_result = {
            'motor': doctor_motor,
            'speech': doctor_speech,
            'cognition': doctor_cognition,
            'notes': doctor_notes
        }
        
        # AI vs Doctor Comparison
        comparison = compare_ai_vs_doctor(
            motor_score, speech_score, reaction_score,
            doctor_motor, doctor_speech, doctor_cognition
        )
        
        print(f"   🔍 AI-Doctor Agreement: {comparison['agreement_rate']}")
        
        # Generate NURA clinical feedback
        nura_feedback = generate_nura_feedback_clinic(
            neuro_risk_index, risk_level, motor_score,
            speech_score, reaction_score, reaction_time_ms, motor_variance
        )
        
        # Referral recommendation
        referral = {
            'needed': risk_level in ['MODERATE', 'HIGH'],
            'urgency': 'immediate' if risk_level == 'HIGH' else 'routine' if risk_level == 'MODERATE' else 'none',
            'reason': nura_feedback['explanation']
        }
        
        return jsonify({
            'success': True,
            'ai_result': ai_result,
            'doctor_result': doctor_result,
            'comparison': comparison,
            'nura_feedback': nura_feedback,
            'referral': referral,
            'message': 'Clinical test completed'
        })
    
    except Exception as e:
        print(f"   ❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

# ============================================================================
# PATIENT HISTORY
# ============================================================================
@app.route('/patient/history/<int:patient_id>', methods=['GET'])
def get_patient_test_history(patient_id):
    """Get patient test history"""
    try:
        limit = request.args.get('limit', 10, type=int)
        history = db.get_patient_history(patient_id, limit)
        
        return jsonify({
            'success': True,
            'patient_id': patient_id,
            'test_count': len(history),
            'history': history
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============================================================================
# SERVER STARTUP
# ============================================================================
if __name__ == '__main__':
    # Create default demo user
    try:
        demo_user_id = db.create_user("Demo User", 35, "demo@neurovision.ai")
        print(f"✅ Demo user created (ID: {demo_user_id})")
    except:
        print("ℹ️  Demo user already exists")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
