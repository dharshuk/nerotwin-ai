# NeuroVision AI - Quick Start

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd backend
pip install -r requirements.txt
```

### Step 2: Start Servers

**Terminal 1 - Backend:**
```bash
cd backend
python app.py
```

**Terminal 2 - Frontend:**
```bash
npm start
```

### Step 3: Open Application
Navigate to: **http://localhost:3000**

---

## ✅ Quick Test

1. Click **"Start Neuro Check"**
2. Allow camera access
3. Record for 5-10 seconds (or full 30s)
4. Complete drawing test
5. Allow microphone, record speech
6. Complete reaction time game
7. View your risk analysis!

---

## 🎯 Demo Mode

If hardware access fails, the app will use **simulated data** automatically.

---

## 📁 Project Files

| File | Purpose |
|------|---------|
| `src/components/Dashboard.js` | Main app layout |
| `src/components/CameraCapture.js` | Tremor test |
| `src/components/DrawingPad.js` | Drawing test |
| `src/components/SpeechRecorder.js` | Speech test |
| `src/components/ReactionTest.js` | Reaction test |
| `src/components/RiskDashboard.js` | Results display |
| `src/components/ChatbotPanel.js` | Virtual nurse |
| `backend/app.py` | Flask API + ML |

---

## 🎨 Key Features

- ✅ Real-time camera/mic access
- ✅ Interactive drawing canvas
- ✅ Reaction time game
- ✅ AI risk scoring (0-100)
- ✅ Visual charts & graphs
- ✅ Chatbot guidance
- ✅ Responsive design

---

## 🐛 Common Issues

**Camera not working?**
- Grant browser permissions
- Use Chrome/Edge (best support)

**Backend errors?**
- Make sure Flask is running on port 5000
- Check Python version (3.8-3.11 recommended)

**Charts not showing?**
- Run: `npm install recharts`

---

## 📖 Full Documentation
See [GUIDE.md](GUIDE.md) for complete documentation.

---

**Ready to demo! 🎉**
