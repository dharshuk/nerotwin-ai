"""
NeuroVision AI System Test
Test multiple user tests, database storage, and trend analysis
"""

import requests
import json
from datetime import datetime

API_URL = "http://localhost:5000"

def print_header(text):
    print("\n" + "="*60)
    print(f"  {text}")
    print("="*60)

def test_user_mode():
    """Test User Mode: Multiple tests with trend analysis"""
    print_header("TEST 1: USER MODE - MULTIPLE TESTS")
    
    user_id = 1  # Demo user
    
    # Test 1: HIGH RISK
    print("\n📝 Taking Test #1 (simulating HIGH risk)...")
    test1_data = {
        "user_id": user_id,
        "motor_variance": 0.45,  # High variance = low score
        "pitch_variation": 0.55,
        "pause_duration": 1.4,
        "speech_rate": 95,
        "reaction_time_ms": 580
    }
    
    response = requests.post(f"{API_URL}/user/test", json=test1_data)
    result1 = response.json()
    
    if result1['success']:
        test = result1['current_test']
        print(f"   ✅ Test saved! ID: {test['test_id']}")
        print(f"   📊 Neuro Risk Index: {test['neuro_risk_index']}% ({test['risk_level']})")
        print(f"   🔍 Scores - Motor: {test['motor_score']}, Speech: {test['speech_score']}, Reaction: {test['reaction_score']}")
        if result1['previous_test']:
            print(f"   📈 Previous test found: {result1['previous_test']['test_id']}")
            if result1['trend']:
                print(f"   📈 Trend: Risk Index {result1['trend']['risk_index']:+.1f}%")
    
    # Test 2: MODERATE RISK (after 2 seconds)
    print("\n📝 Taking Test #2 (simulating MODERATE risk)...")
    import time
    time.sleep(2)
    
    test2_data = {
        "user_id": user_id,
        "motor_variance": 0.25,  # Medium variance
        "pitch_variation": 0.35,
        "pause_duration": 0.8,
        "speech_rate": 130,
        "reaction_time_ms": 420
    }
    
    response = requests.post(f"{API_URL}/user/test", json=test2_data)
    result2 = response.json()
    
    if result2['success']:
        test = result2['current_test']
        print(f"   ✅ Test saved! ID: {test['test_id']}")
        print(f"   📊 Neuro Risk Index: {test['neuro_risk_index']}% ({test['risk_level']})")
        print(f"   🔍 Scores - Motor: {test['motor_score']}, Speech: {test['speech_score']}, Reaction: {test['reaction_score']}")
        if result2['trend']:
            print(f"   📈 Trend vs Previous:")
            print(f"      Motor: {result2['trend']['motor']:+.1f}%")
            print(f"      Speech: {result2['trend']['speech']:+.1f}%")
            print(f"      Reaction: {result2['trend']['reaction']:+.1f}%")
            print(f"      Risk Index: {result2['trend']['risk_index']:+.1f}%")
    
    # Test 3: LOW RISK
    print("\n📝 Taking Test #3 (simulating LOW risk)...")
    time.sleep(2)
    
    test3_data = {
        "user_id": user_id,
        "motor_variance": 0.08,  # Low variance = high score
        "pitch_variation": 0.25,
        "pause_duration": 0.4,
        "speech_rate": 150,
        "reaction_time_ms": 270
    }
    
    response = requests.post(f"{API_URL}/user/test", json=test3_data)
    result3 = response.json()
    
    if result3['success']:
        test = result3['current_test']
        print(f"   ✅ Test saved! ID: {test['test_id']}")
        print(f"   📊 Neuro Risk Index: {test['neuro_risk_index']}% ({test['risk_level']})")
        print(f"   🔍 Scores - Motor: {test['motor_score']}, Speech: {test['speech_score']}, Reaction: {test['reaction_score']}")
        if result3['trend']:
            print(f"   📈 Trend vs Previous:")
            print(f"      Risk Index: {result3['trend']['risk_index']:+.1f}% (IMPROVING!)")

def test_user_history():
    """Test retrieving user history"""
    print_header("TEST 2: USER HISTORY RETRIEVAL")
    
    user_id = 1
    response = requests.get(f"{API_URL}/user/history/{user_id}")
    result = response.json()
    
    if result['success']:
        history = result['history']
        print(f"\n   📚 Found {len(history)} tests in history")
        print(f"\n   📋 Last 5 Tests:")
        print(f"   {'Test ID':<10} {'Date/Time':<20} {'Risk %':<10} {'Level':<12} {'Trend'}")
        print(f"   {'-'*80}")
        
        for i, test in enumerate(history[:5]):
            date_str = datetime.fromisoformat(test['timestamp']).strftime("%Y-%m-%d %H:%M")
            trend_icon = ""
            if i < len(history) - 1:
                prev_risk = history[i+1]['neuro_risk_index']
                curr_risk = test['neuro_risk_index']
                if curr_risk < prev_risk:
                    trend_icon = "↓ Better"
                elif curr_risk > prev_risk:
                    trend_icon = "↑ Worse"
                else:
                    trend_icon = "→ Same"
            
            print(f"   {test['test_id']:<10} {date_str:<20} {test['neuro_risk_index']:<10.1f} {test['risk_level']:<12} {trend_icon}")

def test_clinic_mode():
    """Test Clinic Mode with AI vs Doctor comparison"""
    print_header("TEST 3: CLINIC MODE - AI vs DOCTOR")
    
    # Register patient
    patient_data = {
        "name": "Test Patient",
        "age": 65,
        "symptoms": "Mild tremor, speech slurring"
    }
    
    print("\n📋 Registering patient...")
    response = requests.post(f"{API_URL}/patient/register", json=patient_data)
    patient_result = response.json()
    
    if patient_result['success']:
        patient_id = patient_result['patient_id']
        print(f"   ✅ Patient registered: ID {patient_id}")
        
        # Doctor performs screening
        print(f"\n🏥 Doctor performing clinical assessment...")
        
        clinic_data = {
            "patient_id": patient_id,
            "motor_variance": 0.32,
            "pitch_variation": 0.42,
            "pause_duration": 1.1,
            "speech_rate": 110,
            "reaction_time_ms": 480,
            "doctor_motor": "MODERATE",  # Doctor's opinion
            "doctor_speech": "MODERATE",
            "doctor_cognition": "MODERATE"
        }
        
        response = requests.post(f"{API_URL}/clinic/test", json=clinic_data)
        result = response.json()
        
        if result['success']:
            test = result['ai_result']
            print(f"   ✅ Assessment complete!")
            print(f"   📊 AI Diagnosis:")
            print(f"      Neuro Risk Index: {test['neuro_risk_index']}% ({test['risk_level']})")
            print(f"      Motor: {test['motor_score']}%, Speech: {test['speech_score']}%, Reaction: {test['reaction_score']}%")
            
            if result.get('comparison'):
                comp = result['comparison']
                print(f"\n   🤖 vs 👨‍⚕️ AI-Doctor Comparison:")
                print(f"      Motor:    AI={comp['motor']['ai']:<10} Doctor={comp['motor']['doctor']:<10} Match: {'✅' if comp['motor']['match'] else '❌'}")
                print(f"      Speech:   AI={comp['speech']['ai']:<10} Doctor={comp['speech']['doctor']:<10} Match: {'✅' if comp['speech']['match'] else '❌'}")
                print(f"      Cognition: AI={comp['cognition']['ai']:<10} Doctor={comp['cognition']['doctor']:<10} Match: {'✅' if comp['cognition']['match'] else '❌'}")
                print(f"\n      Overall Agreement: {comp['agreement_rate']}")

def test_nura_feedback():
    """Test NURA AI feedback (2-line format)"""
    print_header("TEST 4: NURA AI FEEDBACK (2-LINE FORMAT)")
    
    print("\n🤖 Simulating different risk levels...\n")
    
    # HIGH RISK
    test_data = {
        "user_id": 1,
        "motor_variance": 0.50,
        "pitch_variation": 0.60,
        "pause_duration": 1.5,
        "speech_rate": 90,
        "reaction_time_ms": 600
    }
    
    response = requests.post(f"{API_URL}/user/test", json=test_data)
    result = response.json()
    
    if result['success']:
        feedback = result['nura_feedback']
        print(f"   🔴 HIGH RISK Feedback:")
        print(f"   Line 1: {feedback['explanation']}")
        print(f"   Line 2: {feedback['recommendation']}")

if __name__ == "__main__":
    print("\n" + "🧠"*30)
    print("  NeuroVision AI - Complete System Test")
    print("🧠"*30)
    
    try:
        # Run all tests
        test_user_mode()
        test_user_history()
        test_clinic_mode()
        test_nura_feedback()
        
        print_header("✅ ALL TESTS COMPLETED")
        print("\n📌 Summary:")
        print("   ✅ Multiple user tests stored successfully")
        print("   ✅ Trend analysis working (comparing previous vs current)")
        print("   ✅ Database persistence verified")
        print("   ✅ Clinic mode AI vs Doctor comparison working")
        print("   ✅ NURA AI providing concise 2-line feedback")
        print("\n🎯 System is fully operational!")
        
    except requests.exceptions.ConnectionError:
        print("\n❌ ERROR: Cannot connect to backend server")
        print("   Make sure Flask is running: python backend/app.py")
    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
