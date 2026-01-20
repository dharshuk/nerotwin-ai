# 🧠 NeuroVision AI - User Guide

## Quick Start Guide

### 🚀 Starting the System

#### 1. Start Backend Server
```bash
cd backend
python app.py
```
✅ Backend will run on: `http://localhost:5000`

#### 2. Start Frontend (separate terminal)
```bash
npm start
```
✅ Frontend will open: `http://localhost:3000`

---

## 🎯 Using the System

### USER MODE (Wellness Screening)

**For individual users to monitor neurological health**

1. **Open the App**
   - Go to `http://localhost:3000`
   - App opens in User Mode by default

2. **Take a Test**
   - Click "Start Neuro Check" button
   - Complete 4 quick tests:
     - ✋ Hand Tremor Test (30 seconds)
     - ✏️ Drawing Test (motor control)
     - 🗣️ Speech Recording (30 seconds)
     - ⚡ Reaction Time Test (10 clicks)

3. **View Results**
   - **Risk Dashboard:** Shows your Neuro Risk Index (%)
   - **NURA AI Feedback:** Two lines explaining:
     - Line 1: How your risk was calculated (specific scores)
     - Line 2: Recommendation based on your risk level
   - **Test History:** See all your previous tests with trends

4. **Understanding Your Results**

   **Risk Levels:**
   - 🟢 **LOW (80-100%):** Healthy neurological function
   - 🟡 **MODERATE (60-79%):** Minor changes detected
   - 🔴 **HIGH (0-59%):** Significant changes, consult doctor

   **Trend Indicators:**
   - ↑ Worse than previous test
   - ↓ Better than previous test
   - → Same as previous test

5. **Take Multiple Tests**
   - Click "Take Another Test" to track progress
   - All tests stored in database
   - Compare with previous tests automatically

---

### CLINIC MODE (Medical Screening)

**For healthcare professionals to screen patients**

1. **Switch to Clinic Mode**
   - Toggle switch at top: "User Wellness" → "Clinic Screening"

2. **Register Patient**
   - Fill in patient details:
     - Patient ID
     - Name
     - Age
     - Symptoms/Complaint
   - Click "Register Patient"

3. **Perform Clinical Assessment**
   - Patient completes the 4 screening tests
   - Doctor provides clinical assessment:
     - Motor Function: Normal/Mild/Moderate/Severe
     - Speech Clarity: Normal/Mild/Moderate/Severe
     - Cognitive Function: Normal/Mild/Moderate/Severe
     - Clinical Notes (optional)

4. **View AI vs Doctor Comparison**
   - System shows:
     - AI's automated diagnosis
     - Doctor's clinical assessment
     - Agreement percentage
     - Parameter-by-parameter comparison
   - Green ✅ = Agreement
   - Red ❌ = Disagreement

5. **Patient History**
   - View all tests for a patient
   - Compare AI vs Doctor assessments over time
   - Track neurological changes
   - Export reports (future feature)

---

## 📊 Understanding NURA AI Feedback

### Example Feedback (HIGH Risk)

**Line 1 (Explanation):**
> "Your Neuro Risk Index is 54.2% based on reduced hand stability (46.7%) and speech irregularities (62.5%) and slower reaction time (600 ms)."

**Line 2 (Recommendation):**
> "Significant neurological changes detected due to poor hand stability and delayed cognitive response. Strongly recommend consulting a neurologist for further evaluation."

### How Risk is Calculated

**Neuro Risk Index Formula:**
```
Risk Index = (0.4 × Motor Score) + (0.3 × Speech Score) + (0.3 × Reaction Score)
```

**Component Scores:**

1. **Motor Score (40% weight)**
   - Based on hand tremor variance
   - High score = stable hand movement
   - Low score = tremor/instability

2. **Speech Score (30% weight)**
   - Based on pitch variation, pauses, speech rate
   - High score = clear, fluent speech
   - Low score = irregular speech patterns

3. **Reaction Score (30% weight)**
   - Based on reaction time in milliseconds
   - High score = fast reaction (< 300ms)
   - Low score = slow reaction (> 500ms)

---

## 📈 Test History & Trends

### Viewing Your History

1. Complete at least one test
2. Scroll down to "Test History" section
3. See:
   - Table of last 5 tests
   - Line chart showing trends
   - Trend indicators comparing tests

### Trend Chart Colors

- 🟢 **Green:** LOW risk (80-100%)
- 🟡 **Yellow:** MODERATE risk (60-79%)
- 🔴 **Red:** HIGH risk (0-59%)

### What Trends Mean

**Improving (↓):**
- Current score better than previous
- Neurological function improving
- Continue monitoring

**Worsening (↑):**
- Current score worse than previous
- Neurological function declining
- Consider medical consultation

**Stable (→):**
- No significant change
- Continue regular monitoring

---

## 🔬 Medical Scoring Details

### Motor Function
**What it measures:** Hand stability, tremor, motor control

**Scoring:**
- **90-100%:** Variance < 0.15 (excellent stability)
- **65-85%:** Variance 0.15-0.30 (minor tremor)
- **40-60%:** Variance > 0.30 (significant tremor)

### Speech Clarity
**What it measures:** Speech patterns, fluency, articulation

**Components:**
- Pitch variation (should be 0.2-0.4)
- Pause duration (should be 0.3-0.7 seconds)
- Speech rate (should be 120-180 words/minute)

### Reaction Time
**What it measures:** Cognitive processing speed

**Scoring:**
- **90-100%:** < 300ms (fast)
- **60-85%:** 300-500ms (normal)
- **40-60%:** > 500ms (slow)

---

## 🔍 Frequently Asked Questions

### Q: How often should I take the test?
**A:** 
- LOW risk: Monthly
- MODERATE risk: Every 2 weeks
- HIGH risk: Consult doctor immediately, then follow their guidance

### Q: Is this a medical diagnosis?
**A:**
No! This is a screening tool only. Always consult a qualified healthcare professional for medical diagnosis and treatment.

### Q: Why does AI disagree with the doctor?
**A:**
AI and doctors may assess differently based on:
- AI uses objective metrics (numbers)
- Doctors use clinical experience and subjective observation
- Both perspectives are valuable
- Disagreement doesn't mean one is wrong

### Q: Can I export my test history?
**A:**
Currently, you can view history in the app. Export to PDF feature coming in future update.

### Q: How is my data stored?
**A:**
- All data stored in local SQLite database
- No data sent to external servers
- Database file: `backend/neurovision.db`

### Q: What if my risk level is HIGH?
**A:**
1. Don't panic - this is a screening, not a diagnosis
2. Consult a neurologist within 1-2 weeks
3. Bring your test history
4. Follow medical professional's advice
5. Continue monitoring as advised

---

## 🛠️ Troubleshooting

### Backend not starting?
```bash
# Check if port 5000 is already in use
# Windows:
netstat -ano | findstr :5000

# Stop the process or use different port
```

### Frontend not loading?
```bash
# Check if port 3000 is already in use
# Clear cache and restart:
npm start
```

### Database errors?
```bash
# Reinitialize database:
cd backend
python -c "from database import init_database; init_database()"
```

### Tests not saving?
- Check backend is running
- Check browser console for errors
- Verify database file exists: `backend/neurovision.db`

---

## 📞 Support

**System Type:** Development/Demo  
**Purpose:** Neurological screening assistance  
**Not for:** Medical diagnosis or treatment decisions

**Remember:** Always consult qualified healthcare professionals for medical concerns!

---

## 🎯 Tips for Best Results

1. **Quiet Environment:** Take tests in calm setting
2. **Good Lighting:** Ensure webcam can see clearly
3. **Stable Setup:** Use stable surface for drawing test
4. **Clear Speech:** Speak naturally during speech test
5. **Focus:** Concentrate during reaction test
6. **Consistent Timing:** Take tests at same time of day
7. **Track Progress:** Take tests regularly to see trends

---

**Version:** 1.0.0  
**Last Updated:** 2026-01-20  
**Platform:** Windows/macOS/Linux
