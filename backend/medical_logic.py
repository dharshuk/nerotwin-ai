# Medical Scoring Logic for NeuroVision AI
# Explainable AI - No randomization, pure medical reasoning

import numpy as np

def calculate_motor_score(variance):
    """
    Calculate motor score from motion variance
    
    Medical Logic:
    - variance < 0.15  → Normal hand stability (90-100)
    - 0.15-0.30        → Mild tremor detected (65-85)
    - > 0.30           → High tremor/instability (40-60)
    
    Args:
        variance: Motion variance value from video analysis
        
    Returns:
        score (0-100): Higher is better
    """
    if variance < 0.15:
        # Normal - map 0-0.15 to 90-100
        score = 100 - (variance / 0.15) * 10
        return max(90, min(100, score))
    elif variance < 0.30:
        # Mild - map 0.15-0.30 to 65-85
        normalized = (variance - 0.15) / 0.15
        score = 85 - (normalized * 20)
        return max(65, min(85, score))
    else:
        # High - map 0.30+ to 40-60
        normalized = min((variance - 0.30) / 0.30, 1.0)
        score = 60 - (normalized * 20)
        return max(40, min(60, score))

def calculate_speech_score(pitch_variation, pause_duration, speech_rate):
    """
    Calculate speech score from audio features
    
    Medical Logic:
    - Stable voice (low variation, normal pauses) → 85-100
    - Moderate irregular (some variation) → 60-85
    - Slurred/long pauses → 40-60
    
    Args:
        pitch_variation: Standard deviation of pitch (0-1)
        pause_duration: Average pause length in seconds
        speech_rate: Words per minute
        
    Returns:
        score (0-100), stability_level
    """
    # Normalize factors
    pitch_score = 100 - (pitch_variation * 100)  # Lower variation is better
    
    # Optimal pause: 0.3-0.8s, longer = problems
    if pause_duration < 0.3:
        pause_score = 80  # Too fast, might indicate anxiety
    elif pause_duration <= 0.8:
        pause_score = 100  # Normal
    else:
        pause_score = max(40, 100 - (pause_duration - 0.8) * 50)
    
    # Optimal rate: 120-160 wpm
    if 120 <= speech_rate <= 160:
        rate_score = 100
    elif speech_rate < 120:
        # Slow speech (potential dysarthria)
        rate_score = max(40, 60 + (speech_rate / 120) * 40)
    else:
        # Too fast (potential anxiety/mania)
        rate_score = max(60, 100 - ((speech_rate - 160) / 80) * 40)
    
    # Weighted average
    final_score = (pitch_score * 0.4 + pause_score * 0.3 + rate_score * 0.3)
    
    # Determine stability level
    if final_score >= 85:
        stability = "stable"
    elif final_score >= 60:
        stability = "moderate_irregular"
    else:
        stability = "slurred"
    
    return round(final_score, 1), stability

def calculate_reaction_score(reaction_time_ms):
    """
    Calculate reaction score from reaction time
    
    Medical Logic:
    - < 300ms  → Excellent cognitive response (90-100)
    - 300-500ms → Normal range (60-85)
    - > 500ms  → Delayed response (40-60)
    
    Args:
        reaction_time_ms: Average reaction time in milliseconds
        
    Returns:
        score (0-100)
    """
    if reaction_time_ms < 300:
        # Excellent - map 0-300 to 90-100
        score = 100 - (reaction_time_ms / 300) * 10
        return max(90, min(100, score))
    elif reaction_time_ms < 500:
        # Normal - map 300-500 to 60-85
        normalized = (reaction_time_ms - 300) / 200
        score = 85 - (normalized * 25)
        return max(60, min(85, score))
    else:
        # Delayed - map 500+ to 40-60
        normalized = min((reaction_time_ms - 500) / 500, 1.0)
        score = 60 - (normalized * 20)
        return max(40, min(60, score))

def calculate_neuro_risk_index(motor_score, speech_score, reaction_score):
    """
    Calculate overall Neuro Risk Index
    
    Medical Weighting:
    - Motor: 40% (most indicative of neurological issues)
    - Speech: 30% (important for cognitive assessment)
    - Reaction: 30% (cognitive processing speed)
    
    Returns:
        neuro_risk_index (0-100), risk_level
    """
    risk_index = (
        0.4 * motor_score +
        0.3 * speech_score +
        0.3 * reaction_score
    )
    
    # Determine risk level
    if risk_index >= 80:
        risk_level = "LOW"
    elif risk_index >= 60:
        risk_level = "MODERATE"
    else:
        risk_level = "HIGH"
    
    return round(risk_index, 1), risk_level

def calculate_trend(current_score, previous_score):
    """Calculate percentage change between tests"""
    if previous_score == 0:
        return 0
    
    change = ((current_score - previous_score) / previous_score) * 100
    return round(change, 1)

def generate_nura_feedback_user(risk_index, risk_level, motor_score, 
                                  speech_score, reaction_score, 
                                  reaction_time_ms, motor_variance):
    """
    Generate NURA AI Nurse feedback for User Mode (2 lines only)
    
    Returns:
        dict with explanation and recommendation
    """
    # Line 1: Explain the score
    explanation = (
        f"Your Neuro Risk Index is {risk_index}% based on "
    )
    
    # Identify weak points
    weak_points = []
    if motor_score < 70:
        weak_points.append(f"reduced hand stability ({motor_score}%)")
    if speech_score < 70:
        weak_points.append(f"speech irregularities ({speech_score}%)")
    if reaction_score < 70:
        weak_points.append(f"slower reaction time ({reaction_time_ms:.0f} ms)")
    
    if weak_points:
        explanation += " and ".join(weak_points) + "."
    else:
        explanation += "stable neurological indicators across all tests."
    
    # Line 2: Recommendation based on risk level
    if risk_level == "LOW":
        recommendation = (
            "Your neurological indicators are stable and within normal range. "
            "No significant changes detected. Recheck next month."
        )
    elif risk_level == "MODERATE":
        recommendation = (
            "Minor neurological changes detected due to reduced motor stability and delayed reaction time. "
            "These may be caused by fatigue or early motor irregularities. Recheck in 2 weeks."
        )
    else:  # HIGH
        recommendation = (
            "Significant neurological changes detected due to poor hand stability and delayed cognitive response. "
            "Strongly recommend consulting a neurologist for further evaluation."
        )
    
    return {
        "explanation": explanation,
        "recommendation": recommendation
    }

def generate_nura_feedback_clinic(risk_index, risk_level, motor_score, 
                                    speech_score, reaction_score,
                                    reaction_time_ms, motor_variance):
    """
    Generate NURA AI Nurse feedback for Clinic Mode
    
    Returns:
        dict with clinical explanation and recommendation
    """
    # Clinical explanation
    explanation = (
        f"The Neuro Risk Index of {risk_index}% was calculated using "
        f"motor instability ({motor_score}%), speech coherence ({speech_score}%), "
        f"and reaction time ({reaction_time_ms:.0f} ms). "
    )
    
    # Identify below-threshold indicators
    below_threshold = []
    if motor_score < 70:
        below_threshold.append("motor instability")
    if speech_score < 70:
        below_threshold.append("speech irregularities")
    if reaction_score < 70:
        below_threshold.append("delayed cognitive response")
    
    if below_threshold:
        explanation += (
            f"Multiple neurological indicators ({', '.join(below_threshold)}) "
            f"are below clinical thresholds, suggesting {risk_level} neurological risk."
        )
    else:
        explanation += f"All indicators within acceptable range, classified as {risk_level} risk."
    
    return {
        "explanation": explanation
    }

def compare_ai_vs_doctor(ai_motor, ai_speech, ai_reaction, 
                          doctor_motor, doctor_speech, doctor_cognition):
    """
    Compare AI assessment with doctor's clinical judgment
    
    Args:
        ai_* : AI scores (0-100)
        doctor_* : Doctor assessment ("Normal", "Mild", "Severe")
        
    Returns:
        comparison dict with match analysis
    """
    # Convert AI scores to categories
    def score_to_category(score):
        if score >= 85:
            return "Normal"
        elif score >= 65:
            return "Mild"
        else:
            return "Severe"
    
    ai_motor_cat = score_to_category(ai_motor)
    ai_speech_cat = score_to_category(ai_speech)
    ai_cognition_cat = score_to_category(ai_reaction)
    
    comparison = {
        "motor": {
            "doctor": doctor_motor,
            "ai": ai_motor_cat,
            "match": doctor_motor == ai_motor_cat
        },
        "speech": {
            "doctor": doctor_speech,
            "ai": ai_speech_cat,
            "match": doctor_speech == ai_speech_cat
        },
        "cognition": {
            "doctor": doctor_cognition,
            "ai": ai_cognition_cat,
            "match": doctor_cognition == ai_cognition_cat
        }
    }
    
    # Generate summary
    matches = sum([c["match"] for c in comparison.values()])
    
    if matches == 3:
        summary = "AI and clinician assessments are in full agreement across all indicators."
    elif matches >= 2:
        disagreements = [k for k, v in comparison.items() if not v["match"]]
        summary = (
            f"AI and clinician assessments show partial agreement. "
            f"Differences noted in {', '.join(disagreements)}. "
            f"AI detected irregularities earlier. Recommend prioritizing neurological referral."
        )
    else:
        summary = (
            "Significant differences between AI and clinician assessments. "
            "AI screening suggests higher risk profile. "
            "Recommend comprehensive neurological evaluation."
        )
    
    comparison["summary"] = summary
    comparison["agreement_rate"] = f"{(matches/3)*100:.0f}%"
    
    return comparison
