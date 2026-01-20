"""
NeuroVision AI - Test Data Generator
Generates sample data for testing without hardware
"""

import json
import random
import numpy as np
from datetime import datetime

def generate_motor_data():
    """Generate simulated tremor data"""
    return {
        'motor_score': random.randint(60, 95),
        'tremor_frequency': round(random.uniform(4.5, 6.5), 2),
        'tremor_amplitude': round(random.uniform(0.5, 2.5), 2),
        'analysis': 'Simulated tremor analysis',
        'timestamp': datetime.now().isoformat()
    }

def generate_speech_data():
    """Generate simulated speech analysis"""
    return {
        'speech_score': random.randint(65, 95),
        'pitch_variation': round(random.uniform(80, 150), 2),
        'clarity_index': round(random.uniform(0.7, 0.95), 2),
        'articulation_score': random.randint(70, 95),
        'analysis': 'Simulated speech analysis',
        'timestamp': datetime.now().isoformat()
    }

def generate_reaction_data(trials=5):
    """Generate simulated reaction times"""
    base_time = random.uniform(200, 300)
    reaction_times = [
        int(base_time + random.uniform(-50, 50))
        for _ in range(trials)
    ]
    
    avg_reaction = np.mean(reaction_times)
    
    # Score calculation
    if avg_reaction < 250:
        reaction_score = 100
    elif avg_reaction > 400:
        reaction_score = 40
    else:
        reaction_score = int(100 - ((avg_reaction - 250) / 150) * 60)
    
    return {
        'reaction_times': reaction_times,
        'reaction_score': reaction_score,
        'average_reaction': round(avg_reaction, 2),
        'std_reaction': round(np.std(reaction_times), 2),
        'analysis': 'Simulated reaction time analysis',
        'timestamp': datetime.now().isoformat()
    }

def generate_aggregate_assessment():
    """Generate complete neuro assessment"""
    motor = generate_motor_data()
    speech = generate_speech_data()
    reaction = generate_reaction_data()
    
    # Calculate overall risk
    neuro_risk_index = int(
        motor['motor_score'] * 0.35 +
        speech['speech_score'] * 0.30 +
        reaction['reaction_score'] * 0.35
    )
    
    # Determine risk level
    if neuro_risk_index >= 80:
        risk_level = 'LOW'
        recommendation = "Your results look stable. Continue monitoring monthly."
    elif neuro_risk_index >= 60:
        risk_level = 'MEDIUM'
        recommendation = "Minor changes detected. Schedule a follow-up in 2 weeks."
    else:
        risk_level = 'HIGH'
        recommendation = "Please consult a neurologist for further evaluation."
    
    return {
        'motor_score': motor['motor_score'],
        'speech_score': speech['speech_score'],
        'reaction_score': reaction['reaction_score'],
        'neuro_risk_index': neuro_risk_index,
        'risk_level': risk_level,
        'recommendation': recommendation,
        'detailed_analysis': {
            'motor': motor,
            'speech': speech,
            'reaction': reaction
        },
        'timestamp': datetime.now().isoformat()
    }

def generate_patient_history(num_assessments=4):
    """Generate historical assessment data"""
    history = []
    base_score = random.randint(70, 85)
    
    for i in range(num_assessments):
        # Simulate gradual decline or improvement
        variation = random.randint(-5, 5)
        score = max(40, min(100, base_score + variation))
        base_score = score
        
        history.append({
            'week': f'Week {i+1}',
            'neuro_risk_index': score,
            'date': datetime.now().isoformat()
        })
    
    return history

if __name__ == '__main__':
    print("NeuroVision AI - Test Data Generator\n")
    print("=" * 50)
    
    print("\n1. Motor Assessment:")
    print(json.dumps(generate_motor_data(), indent=2))
    
    print("\n2. Speech Assessment:")
    print(json.dumps(generate_speech_data(), indent=2))
    
    print("\n3. Reaction Time Assessment:")
    print(json.dumps(generate_reaction_data(), indent=2))
    
    print("\n4. Complete Aggregate Assessment:")
    print(json.dumps(generate_aggregate_assessment(), indent=2))
    
    print("\n5. Patient History:")
    print(json.dumps(generate_patient_history(), indent=2))
    
    print("\n" + "=" * 50)
    print("\n✅ All test data generated successfully!")
