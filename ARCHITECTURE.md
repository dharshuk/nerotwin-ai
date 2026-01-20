# NeuroVision AI - Architecture & Features

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     User Interface                      │
│                    (React + Tailwind)                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  Test Panel  │  │Visualization │  │ Risk + Chat  │ │
│  │              │  │    Panel     │  │    Panel     │ │
│  │ - Camera     │  │ - Charts     │  │ - Dashboard  │ │
│  │ - Drawing    │  │ - Waveforms  │  │ - Chatbot    │ │
│  │ - Speech     │  │ - Heatmaps   │  │ - Scores     │ │
│  │ - Reaction   │  │ - Trends     │  │ - Alerts     │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
                            ↕
                    Axios HTTP Client
                            ↕
┌─────────────────────────────────────────────────────────┐
│                    Flask REST API                       │
│                  (Python Backend)                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ Motor API    │  │ Speech API   │  │Reaction API  │ │
│  │ /analyze/    │  │ /analyze/    │  │ /analyze/    │ │
│  │  motor       │  │  speech      │  │  reaction    │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                           │                            │
│                  ┌────────▼─────────┐                  │
│                  │  Aggregate API   │                  │
│                  │   /analyze/      │                  │
│                  │   aggregate      │                  │
│                  └──────────────────┘                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────┐
│                   ML Processing Layer                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │              OpenCV (cv2)                        │  │
│  │  - Frame difference analysis                     │  │
│  │  - Tremor frequency detection                    │  │
│  │  - Motion tracking                               │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │           NumPy / SciPy                          │  │
│  │  - Statistical analysis                          │  │
│  │  - Signal processing                             │  │
│  │  - Feature extraction                            │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │         Risk Scoring Engine                      │  │
│  │  - Weighted aggregation                          │  │
│  │  - Threshold classification                      │  │
│  │  - Trend analysis                                │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📦 Component Architecture

### Frontend Components

#### 1. Dashboard.js (Main Container)
**Responsibilities:**
- Layout management (3-column grid)
- State management for entire app
- Test flow orchestration
- API communication
- Mode switching (User/Clinic)

**State:**
```javascript
{
  currentStep: 'welcome' | 'camera' | 'drawing' | 'speech' | 'reaction' | 'analyzing' | 'results',
  testData: { motor, drawing, speech, reaction },
  results: { motor_score, speech_score, reaction_score, neuro_risk_index, risk_level },
  isAnalyzing: boolean,
  mode: 'user' | 'clinic'
}
```

#### 2. CameraCapture.js
**Features:**
- WebRTC camera access
- MediaRecorder API for video recording
- 30-second countdown timer
- Real-time video preview
- Blob upload to backend

**Browser APIs:**
- `navigator.mediaDevices.getUserMedia()`
- `MediaRecorder`

#### 3. DrawingPad.js
**Features:**
- HTML5 Canvas drawing
- Template overlays (spiral/line)
- Mouse/touch event handling
- Pressure simulation
- Drawing data export (coordinates + timestamps)

**Data Structure:**
```javascript
drawingData: [
  { x: 120, y: 200, timestamp: 1642512000000 },
  { x: 121, y: 201, timestamp: 1642512000010 },
  ...
]
```

#### 4. SpeechRecorder.js
**Features:**
- Microphone access
- Audio recording (WebM format)
- Real-time audio level visualization
- 10-second recording window
- Visual feedback (pulse animation)

**Visualization:**
- Web Audio API for level metering
- `AnalyserNode` for frequency data

#### 5. ReactionTest.js
**Features:**
- Random dot positioning
- Timing precision (milliseconds)
- 5-round test cycle
- Statistical aggregation
- Too-early click detection

**Metrics:**
- Reaction times array
- Average reaction time
- Standard deviation
- Min/max values

#### 6. RiskDashboard.js
**Features:**
- Score visualization
- Risk level classification (LOW/MEDIUM/HIGH)
- Radar chart (performance profile)
- Trend line chart
- Recommendations engine

**Charts (Recharts):**
- RadarChart
- LineChart
- BarChart

#### 7. ChatbotPanel.js
**Features:**
- Step-by-step guidance
- Context-aware messages
- User input handling
- Rule-based responses
- Message history

**Message Types:**
```javascript
{
  type: 'bot' | 'user',
  text: string,
  timestamp: Date
}
```

#### 8. VisualizationPanel.js
**Features:**
- Real-time tremor graph
- Speech waveform display
- Reaction time distribution
- Comparative analysis
- Pressure heatmap

---

## 🔌 Backend API Specification

### Endpoints

#### POST /analyze/motor
**Input:** 
- Form data: `video` (WebM file)

**Processing:**
1. Save video to temporary storage
2. Load with OpenCV
3. Convert frames to grayscale
4. Calculate frame differences
5. Extract tremor metrics (mean, std)
6. Normalize to 0-100 score

**Output:**
```json
{
  "motor_score": 75,
  "analysis": "Tremor frequency and amplitude analyzed",
  "timestamp": "2026-01-20T12:00:00"
}
```

#### POST /analyze/speech
**Input:**
- Form data: `audio` (WebM file)

**Processing:**
1. Save audio file
2. Load with librosa (placeholder)
3. Extract features:
   - Pitch (fundamental frequency)
   - Energy/amplitude envelope
   - MFCCs (spectral features)
4. Calculate clarity score
5. Normalize to 0-100

**Output:**
```json
{
  "speech_score": 81,
  "analysis": "Speech clarity and articulation analyzed",
  "timestamp": "2026-01-20T12:00:00"
}
```

#### POST /analyze/reaction
**Input:**
```json
{
  "reaction_times": [245, 280, 260, 255, 270]
}
```

**Processing:**
1. Calculate average
2. Calculate standard deviation
3. Score based on thresholds:
   - < 250ms → 100 points
   - > 400ms → 40 points
   - Linear interpolation between

**Output:**
```json
{
  "reaction_score": 78,
  "average_reaction": 262,
  "std_reaction": 12.5,
  "analysis": "Neural response time analyzed",
  "timestamp": "2026-01-20T12:00:00"
}
```

#### POST /analyze/aggregate
**Input:**
- Form data:
  - `motor_video` (file)
  - `drawing_image` (file)
  - `speech_audio` (file)
  - `reaction_data` (JSON string)

**Processing:**
1. Analyze each component
2. Calculate weighted average:
   - Motor: 35%
   - Speech: 30%
   - Reaction: 35%
3. Classify risk level:
   - ≥80 → LOW
   - 60-79 → MEDIUM
   - <60 → HIGH

**Output:**
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

## 🧠 ML Algorithms

### 1. Tremor Detection (OpenCV)
```python
def analyze_tremor(video_path):
    # Load video
    cap = cv2.VideoCapture(video_path)
    
    # Extract frames
    prev_frame = None
    frame_diffs = []
    
    while cap.isOpened():
        ret, frame = cap.read()
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        gray = cv2.GaussianBlur(gray, (21, 21), 0)
        
        if prev_frame is not None:
            # Calculate difference
            diff = cv2.absdiff(prev_frame, gray)
            mean_diff = np.mean(diff)
            frame_diffs.append(mean_diff)
        
        prev_frame = gray
    
    # Analyze variation
    std_movement = np.std(frame_diffs)
    tremor_index = min(100, std_movement * 2)
    motor_score = 100 - tremor_index
    
    return motor_score
```

**Future Enhancement:**
- FFT for frequency analysis
- Bandpass filtering (4-6 Hz tremor range)
- CNN-based tremor classification

### 2. Drawing Analysis
**Current:** Simulated
**Future Algorithm:**
```python
def analyze_drawing(image, drawing_data):
    # Load template
    template = load_template('spiral')
    
    # Extract user path
    user_path = np.array([(d['x'], d['y']) for d in drawing_data])
    
    # Calculate deviation
    deviation = calculate_path_deviation(user_path, template)
    
    # Smoothness metric (jerk)
    jerk = calculate_jerk(user_path)
    
    # Pressure variation
    pressure_std = calculate_pressure_variation(drawing_data)
    
    # Composite score
    drawing_score = weighted_average(deviation, jerk, pressure_std)
    
    return drawing_score
```

### 3. Speech Analysis
**Current:** Simulated
**Future Algorithm (librosa):**
```python
def analyze_speech(audio_path):
    # Load audio
    y, sr = librosa.load(audio_path)
    
    # Extract pitch
    pitches, magnitudes = librosa.piptrack(y=y, sr=sr)
    pitch_variation = np.std(pitches[pitches > 0])
    
    # Energy envelope
    rms = librosa.feature.rms(y=y)
    energy_std = np.std(rms)
    
    # MFCCs (spectral features)
    mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
    spectral_score = analyze_mfccs(mfccs)
    
    # Clarity index
    zcr = librosa.feature.zero_crossing_rate(y)
    clarity = calculate_clarity(zcr)
    
    # Composite score
    speech_score = weighted_average(
        pitch_variation, energy_std, spectral_score, clarity
    )
    
    return speech_score
```

### 4. Risk Aggregation
```python
def calculate_neuro_risk_index(motor, speech, reaction):
    # Weighted average
    nri = (motor * 0.35) + (speech * 0.30) + (reaction * 0.35)
    
    # Classification
    if nri >= 80:
        risk_level = 'LOW'
    elif nri >= 60:
        risk_level = 'MEDIUM'
    else:
        risk_level = 'HIGH'
    
    return int(nri), risk_level
```

---

## 🔒 Security Considerations

### Current Implementation
- CORS enabled for development
- No authentication (hackathon prototype)
- Temporary file storage (auto-cleanup)

### Production Roadmap
1. **Authentication:**
   - JWT tokens
   - OAuth 2.0 integration
   - Role-based access (User/Clinic)

2. **Data Protection:**
   - End-to-end encryption
   - HIPAA compliance
   - Data retention policies
   - Audit logging

3. **API Security:**
   - Rate limiting
   - Input validation
   - SQL injection prevention
   - XSS protection

4. **Infrastructure:**
   - HTTPS only
   - Secure file uploads
   - Regular security audits

---

## 📊 Database Schema (Future)

```sql
-- Users
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),
    role VARCHAR(20), -- 'user' or 'clinician'
    created_at TIMESTAMP
);

-- Assessments
CREATE TABLE assessments (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    motor_score INTEGER,
    speech_score INTEGER,
    reaction_score INTEGER,
    neuro_risk_index INTEGER,
    risk_level VARCHAR(20),
    created_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Test Data
CREATE TABLE test_data (
    id INTEGER PRIMARY KEY,
    assessment_id INTEGER,
    test_type VARCHAR(50),
    data_blob BLOB,
    metadata JSON,
    FOREIGN KEY (assessment_id) REFERENCES assessments(id)
);
```

---

## 🚀 Deployment Architecture

### Development
```
Frontend: localhost:3000 (React Dev Server)
Backend:  localhost:5000 (Flask)
```

### Production (Recommended)
```
Frontend: Vercel/Netlify (Static hosting)
Backend:  AWS EC2 / Heroku / Railway (API server)
Database: PostgreSQL / Firebase
Storage:  S3 for media files
CDN:      CloudFront for static assets
```

---

## 📈 Performance Metrics

### Current
- **Page Load:** < 2s
- **Test Completion:** 5-7 minutes
- **API Response:** < 1s per endpoint
- **Video Processing:** ~2-3s

### Optimization Targets
- **Page Load:** < 1s
- **Video Processing:** < 1s
- **Real-time Updates:** WebSocket integration
- **Offline Mode:** PWA with service workers

---

## 🎯 Feature Roadmap

### Phase 1 (Hackathon) ✅
- [x] Core UI components
- [x] Camera/mic access
- [x] Basic ML analysis
- [x] Risk scoring
- [x] Chatbot

### Phase 2 (Post-Hackathon)
- [ ] User authentication
- [ ] Database integration
- [ ] Advanced ML models
- [ ] Clinical validation
- [ ] Multi-language support

### Phase 3 (Production)
- [ ] Mobile apps (iOS/Android)
- [ ] Wearable integration
- [ ] EHR/EMR integration
- [ ] Telemedicine platform
- [ ] FDA approval

---

**Built with ❤️ for hackathon demo**
