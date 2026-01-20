# NeuroVision AI - Complete Setup & Usage Guide

## 🎯 Overview
NeuroVision AI is a clinical-style neurological screening web application that performs:
- **Hand Tremor Test**: 30-second video analysis for tremor detection
- **Drawing Test**: Motor control assessment via spiral/line drawing
- **Speech Test**: Voice analysis for speech clarity
- **Reaction Time Test**: Neural response measurement
- **AI Risk Scoring**: Aggregate neuro risk index (0-100)
- **Virtual Nurse Chatbot**: Step-by-step guidance

---

## 🛠️ Installation

### Prerequisites
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.8 or higher) - [Download](https://www.python.org/)
- **Git** (optional)

### Quick Setup

#### Option 1: Automated Setup (Windows)

1. **Install Frontend**:
   ```bash
   setup-frontend.bat
   ```

2. **Install Backend**:
   ```bash
   setup-backend.bat
   ```

#### Option 2: Manual Setup

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # On Windows
# OR
source venv/bin/activate  # On Mac/Linux
pip install -r requirements.txt
```

---

## 🚀 Running the Application

### Option 1: Start Both (Recommended)
```bash
start-all.bat
```

### Option 2: Start Separately

**Terminal 1 - Backend:**
```bash
cd backend
venv\Scripts\activate
python app.py
```

**Terminal 2 - Frontend:**
```bash
npm start
```

### Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

---

## 📋 Usage Flow

### 1. Start Assessment
- Click **"Start Neuro Check"** button
- Virtual nurse will guide you through each step

### 2. Complete Tests

#### A. Hand Tremor Test (30 seconds)
- Grant camera access
- Hold device steady
- Camera records hand movements
- AI analyzes tremor patterns

#### B. Drawing Test
- Choose: Spiral or Straight Line
- Trace the template pattern
- Submit when complete

#### C. Speech Test (10 seconds)
- Grant microphone access
- Read the displayed sentence aloud
- AI analyzes speech patterns

#### D. Reaction Time Test
- Wait for red dot to appear
- Tap as quickly as possible
- Complete 5 trials

### 3. View Results
- **Motor Score**: Hand tremor analysis (0-100)
- **Speech Score**: Voice clarity assessment (0-100)
- **Reaction Score**: Neural response speed (0-100)
- **Neuro Risk Index**: Overall score (0-100)
- **Risk Level**: LOW / MEDIUM / HIGH

### 4. Review Recommendations
- **Low Risk**: Monitor monthly
- **Medium Risk**: Follow-up in 2 weeks
- **High Risk**: Consult neurologist

---

## 🏗️ Project Structure

```
NEROTWIN AI/
├── backend/
│   ├── app.py              # Flask server with ML logic
│   ├── requirements.txt    # Python dependencies
│   └── uploads/            # Temporary file storage
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── components/
│   │   ├── Dashboard.js           # Main layout
│   │   ├── CameraCapture.js       # Tremor test
│   │   ├── DrawingPad.js          # Motor control test
│   │   ├── SpeechRecorder.js      # Speech analysis
│   │   ├── ReactionTest.js        # Reaction time
│   │   ├── RiskDashboard.js       # Results display
│   │   ├── ChatbotPanel.js        # Virtual nurse
│   │   └── VisualizationPanel.js  # Graphs/charts
│   ├── App.js              # Root component
│   ├── index.js            # Entry point
│   └── index.css           # Tailwind CSS
├── package.json            # Node dependencies
├── tailwind.config.js      # Tailwind configuration
└── README.md               # This file
```

---

## 🔌 API Endpoints

### POST /analyze/motor
Analyzes hand tremor from video.

**Request:**
- Form data with `video` file (WebM format)

**Response:**
```json
{
  "motor_score": 75,
  "analysis": "Tremor frequency and amplitude analyzed",
  "timestamp": "2026-01-20T12:00:00"
}
```

### POST /analyze/speech
Analyzes speech clarity from audio.

**Request:**
- Form data with `audio` file (WebM format)

**Response:**
```json
{
  "speech_score": 81,
  "analysis": "Speech clarity and articulation analyzed",
  "timestamp": "2026-01-20T12:00:00"
}
```

### POST /analyze/reaction
Analyzes reaction time data.

**Request:**
```json
{
  "reaction_times": [245, 280, 260, 255, 270]
}
```

**Response:**
```json
{
  "reaction_score": 78,
  "average_reaction": 262,
  "std_reaction": 12.5,
  "analysis": "Neural response time analyzed",
  "timestamp": "2026-01-20T12:00:00"
}
```

### POST /analyze/aggregate
Comprehensive analysis of all tests.

**Request:**
- Form data with:
  - `motor_video` (file)
  - `drawing_image` (file)
  - `speech_audio` (file)
  - `reaction_data` (JSON string)

**Response:**
```json
{
  "motor_score": 75,
  "speech_score": 81,
  "reaction_score": 78,
  "neuro_risk_index": 78,
  "risk_level": "MEDIUM",
  "timestamp": "2026-01-20T12:00:00",
  "analysis_complete": true
}
```

---

## 🎨 Features

### Frontend
- ✅ Responsive 3-column dashboard layout
- ✅ Real-time camera/microphone access
- ✅ Interactive drawing canvas
- ✅ Reaction time game
- ✅ Live data visualizations (charts, waveforms)
- ✅ Risk score dashboard
- ✅ AI chatbot assistant
- ✅ User/Clinic mode toggle

### Backend
- ✅ Flask REST API
- ✅ OpenCV-based tremor analysis
- ✅ Audio feature extraction (placeholder)
- ✅ Reaction time scoring
- ✅ Risk aggregation algorithm
- ✅ File upload handling

### ML/AI Components
- **Tremor Detection**: Frame difference analysis using OpenCV
- **Drawing Analysis**: Pressure heatmap (simulated)
- **Speech Analysis**: Placeholder for librosa integration
- **Risk Scoring**: Weighted combination algorithm

---

## 🔧 Customization

### Modify Risk Thresholds
Edit `backend/app.py`:
```python
# Line ~250
if neuro_risk_index >= 80:
    risk_level = 'LOW'
elif neuro_risk_index >= 60:  # Change this
    risk_level = 'MEDIUM'
else:
    risk_level = 'HIGH'
```

### Change Test Duration
Edit component files:
- Camera: `src/components/CameraCapture.js` (line 42: countdown = 30)
- Speech: `src/components/SpeechRecorder.js` (line 11: countdown = 10)
- Reaction: `src/components/ReactionTest.js` (line 15: totalRounds = 5)

### Customize Chatbot Responses
Edit `src/components/ChatbotPanel.js` (lines 65-85)

---

## 🐛 Troubleshooting

### Issue: Camera/Microphone Not Working
**Solution**: 
- Grant browser permissions
- Use HTTPS or localhost
- Check device privacy settings

### Issue: Backend Connection Failed
**Solution**:
- Ensure backend is running on port 5000
- Check CORS settings in `backend/app.py`
- Verify firewall isn't blocking port

### Issue: Charts Not Displaying
**Solution**:
- Install missing dependency: `npm install recharts`
- Clear browser cache
- Check browser console for errors

### Issue: Python Dependencies Fail
**Solution**:
- Use Python 3.8-3.11 (avoid 3.12+)
- Install Visual C++ Build Tools (Windows)
- Try: `pip install --upgrade pip setuptools`

---

## 📊 Performance Tips

1. **Optimize Video Recording**: Reduce resolution for faster upload
2. **Cache Static Assets**: Enable service worker for PWA
3. **Database Integration**: Replace in-memory storage with SQLite/Firebase
4. **WebSocket**: Use for real-time chat updates
5. **CDN**: Host static files for production

---

## 🚀 Production Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Upload /build folder
```

### Backend (Heroku/Railway)
```bash
# Add Procfile:
web: gunicorn app:app

# Requirements:
pip freeze > requirements.txt
```

### Environment Variables
```env
FLASK_ENV=production
CORS_ORIGINS=https://your-frontend-domain.com
```

---

## 📝 License
MIT License - Free for hackathon and educational use

## 👥 Credits
Built with:
- React.js
- Tailwind CSS
- Flask
- OpenCV
- Recharts
- Lucide Icons

---

## 🎓 Educational Notes

This is a **prototype for demonstration purposes**. In a real clinical setting:
- Use validated neurological assessment tools
- Implement proper data encryption
- Comply with HIPAA/medical data regulations
- Integrate with EHR systems
- Use clinically-validated ML models
- Require professional medical oversight

**Disclaimer**: This tool is NOT a substitute for professional medical diagnosis.

---

## 📞 Support

For issues or questions:
1. Check this guide
2. Review console logs (F12)
3. Check GitHub issues
4. Contact development team

---

**Happy Hacking! 🎉**
