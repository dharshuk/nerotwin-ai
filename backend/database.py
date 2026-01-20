# Database Schema and Models for NeuroVision AI
import sqlite3
from datetime import datetime
import json

DATABASE_PATH = 'neurovision.db'

def init_database():
    """Initialize SQLite database with required tables"""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    # USERS table (User Mode)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            user_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            age INTEGER,
            email TEXT UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # USER_TESTS table (User Mode History)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS user_tests (
            test_id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            motor_score REAL NOT NULL,
            speech_score REAL NOT NULL,
            reaction_score REAL NOT NULL,
            neuro_risk_index REAL NOT NULL,
            risk_level TEXT NOT NULL,
            motor_variance REAL,
            speech_stability TEXT,
            reaction_time_ms REAL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(user_id)
        )
    ''')
    
    # PATIENTS table (Clinic Mode)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS patients (
            patient_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            age INTEGER,
            gender TEXT,
            complaint TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # PATIENT_TESTS table (Clinic Mode History)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS patient_tests (
            test_id INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_id INTEGER NOT NULL,
            doctor_id TEXT,
            motor_score REAL NOT NULL,
            speech_score REAL NOT NULL,
            reaction_score REAL NOT NULL,
            neuro_risk_index REAL NOT NULL,
            risk_level TEXT NOT NULL,
            motor_variance REAL,
            speech_stability TEXT,
            reaction_time_ms REAL,
            doctor_motor TEXT,
            doctor_speech TEXT,
            doctor_cognition TEXT,
            doctor_notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
        )
    ''')
    
    conn.commit()
    conn.close()
    print("✅ Database initialized successfully")

def get_connection():
    """Get database connection"""
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row  # Return rows as dictionaries
    return conn

def create_user(name, age=None, email=None):
    """Create new user"""
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO users (name, age, email)
        VALUES (?, ?, ?)
    ''', (name, age, email))
    
    user_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    return user_id

def save_user_test(user_id, motor_score, speech_score, reaction_score, 
                   neuro_risk_index, risk_level, motor_variance=None, 
                   speech_stability=None, reaction_time_ms=None):
    """Save user test results"""
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO user_tests 
        (user_id, motor_score, speech_score, reaction_score, 
         neuro_risk_index, risk_level, motor_variance, 
         speech_stability, reaction_time_ms)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (user_id, motor_score, speech_score, reaction_score,
          neuro_risk_index, risk_level, motor_variance, 
          speech_stability, reaction_time_ms))
    
    test_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    return test_id

def get_user_history(user_id, limit=10):
    """Get user test history"""
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT test_id, user_id, motor_score, speech_score, reaction_score,
               neuro_risk_index, risk_level, motor_variance, speech_stability,
               reaction_time_ms, created_at as timestamp
        FROM user_tests
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT ?
    ''', (user_id, limit))
    
    tests = [dict(row) for row in cursor.fetchall()]
    conn.close()
    
    return tests

def get_previous_test(user_id):
    """Get most recent previous test for comparison"""
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT * FROM user_tests
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT 1
    ''', (user_id,))
    
    row = cursor.fetchone()
    conn.close()
    
    return dict(row) if row else None

def create_patient(name, age=None, gender=None, complaint=None):
    """Create new patient"""
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO patients (name, age, gender, complaint)
        VALUES (?, ?, ?, ?)
    ''', (name, age, gender, complaint))
    
    patient_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    return patient_id

def save_patient_test(patient_id, motor_score, speech_score, reaction_score,
                      neuro_risk_index, risk_level, doctor_id=None,
                      motor_variance=None, speech_stability=None, 
                      reaction_time_ms=None, doctor_motor=None, 
                      doctor_speech=None, doctor_cognition=None, 
                      doctor_notes=None):
    """Save patient test results"""
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO patient_tests 
        (patient_id, doctor_id, motor_score, speech_score, reaction_score,
         neuro_risk_index, risk_level, motor_variance, speech_stability,
         reaction_time_ms, doctor_motor, doctor_speech, doctor_cognition,
         doctor_notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (patient_id, doctor_id, motor_score, speech_score, reaction_score,
          neuro_risk_index, risk_level, motor_variance, speech_stability,
          reaction_time_ms, doctor_motor, doctor_speech, doctor_cognition,
          doctor_notes))
    
    test_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    return test_id

def get_patient_history(patient_id, limit=10):
    """Get patient test history"""
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT test_id, patient_id, doctor_id, motor_score, speech_score,
               reaction_score, neuro_risk_index, risk_level, motor_variance,
               speech_stability, reaction_time_ms, doctor_motor_assessment,
               doctor_speech_assessment, doctor_cognitive_assessment,
               doctor_notes, created_at as timestamp
        FROM patient_tests
        WHERE patient_id = ?
        ORDER BY created_at DESC
        LIMIT ?
    ''', (patient_id, limit))
    
    tests = [dict(row) for row in cursor.fetchall()]
    conn.close()
    
    return tests

# Initialize database on import
init_database()
