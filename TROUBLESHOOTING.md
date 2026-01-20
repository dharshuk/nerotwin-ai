# NeuroVision AI - Troubleshooting Guide

## 🔧 Common Issues & Solutions

---

## Installation Issues

### Issue: `npm install` fails
**Symptoms:**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Solutions:**
1. Try legacy peer deps:
   ```bash
   npm install --legacy-peer-deps
   ```

2. Clear npm cache:
   ```bash
   npm cache clean --force
   npm install
   ```

3. Delete and reinstall:
   ```bash
   rmdir /s /q node_modules
   del package-lock.json
   npm install
   ```

4. Update Node.js to v16+ or v18 LTS

---

### Issue: Python `pip install` fails
**Symptoms:**
```
error: Microsoft Visual C++ 14.0 or greater is required
```

**Solutions:**
1. Install Visual Studio Build Tools:
   - Download from: https://visualstudio.microsoft.com/downloads/
   - Select "Desktop development with C++"

2. Use conda instead:
   ```bash
   conda create -n neurovision python=3.9
   conda activate neurovision
   conda install -c conda-forge opencv numpy scipy
   pip install flask flask-cors
   ```

3. Downgrade to Python 3.9 or 3.10 (avoid 3.12)

---

## Runtime Issues

### Issue: Camera not working
**Symptoms:**
- Black screen in video preview
- "Permission denied" error
- No camera access prompt

**Solutions:**
1. **Grant browser permissions:**
   - Chrome: Settings → Privacy → Camera → Allow
   - Edge: Settings → Cookies and site permissions → Camera

2. **Use HTTPS or localhost:**
   - Camera API requires secure context
   - If deployed, must use HTTPS

3. **Check if camera is in use:**
   - Close other apps using camera (Zoom, Teams, etc.)
   - Restart browser

4. **Try different browser:**
   - Best: Chrome, Edge (Chromium)
   - Avoid: Safari (limited support)

5. **Fallback mode:**
   - App will use simulated data if camera fails
   - Check console for errors (F12)

---

### Issue: Microphone not working
**Symptoms:**
- Audio level bar stays at 0
- No recording indicator
- Silent audio file

**Solutions:**
1. **Check browser permissions:**
   - Same as camera (above)

2. **Select correct input device:**
   - Browser may pick wrong mic
   - Check system settings

3. **Test microphone:**
   ```
   Windows: Settings → System → Sound → Input
   ```

4. **Disable audio enhancements:**
   - Can interfere with Web Audio API
   - Sound settings → Device properties → Disable enhancements

---

### Issue: Backend connection failed
**Symptoms:**
```
AxiosError: Network Error
Failed to fetch
CORS policy: No 'Access-Control-Allow-Origin'
```

**Solutions:**
1. **Verify backend is running:**
   ```bash
   # Should see output
   python backend/app.py
   # Output: "Server running on http://localhost:5000"
   ```

2. **Check port 5000 is available:**
   ```bash
   netstat -ano | findstr :5000
   ```

3. **Verify proxy in package.json:**
   ```json
   {
     "proxy": "http://localhost:5000"
   }
   ```

4. **CORS headers (backend):**
   - Already configured in `app.py`
   - If modified, ensure `CORS(app)` is present

5. **Firewall/Antivirus:**
   - May block localhost connections
   - Temporarily disable to test

6. **Use absolute URL:**
   - In Dashboard.js, change:
   ```javascript
   const API_BASE = 'http://localhost:5000';
   ```

---

### Issue: Charts not displaying
**Symptoms:**
- Blank white spaces where charts should be
- Console error: "Recharts is not defined"

**Solutions:**
1. **Install recharts:**
   ```bash
   npm install recharts
   ```

2. **Restart dev server:**
   ```bash
   # Ctrl+C to stop
   npm start
   ```

3. **Check import statements:**
   ```javascript
   import { LineChart, Line, ... } from 'recharts';
   ```

4. **Browser compatibility:**
   - Update browser to latest version
   - Clear cache (Ctrl+Shift+Delete)

---

### Issue: Tailwind styles not applying
**Symptoms:**
- Plain HTML with no styling
- No colors, spacing, or layout

**Solutions:**
1. **Verify tailwind.config.js exists**

2. **Check postcss.config.js:**
   ```javascript
   module.exports = {
     plugins: {
       tailwindcss: {},
       autoprefixer: {},
     },
   }
   ```

3. **Import in index.css:**
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

4. **Rebuild:**
   ```bash
   npm run build
   npm start
   ```

---

## Analysis Issues

### Issue: "Analysis failed" error
**Symptoms:**
- Spinner forever
- Error in console
- No results displayed

**Solutions:**
1. **Check backend logs:**
   - Look for Python errors in terminal
   - Common: File not found, permission denied

2. **Verify file uploads:**
   - Check `backend/uploads/` folder exists
   - Create manually if missing:
   ```bash
   mkdir backend/uploads
   ```

3. **File size limits:**
   - Large videos may fail
   - Reduce recording time for testing

4. **Fallback to simulated data:**
   - App should auto-fallback
   - Check Dashboard.js `catch` block

---

### Issue: OpenCV errors
**Symptoms:**
```
cv2.error: OpenCV(4.x.x) error
```

**Solutions:**
1. **Reinstall opencv:**
   ```bash
   pip uninstall opencv-python
   pip install opencv-python==4.8.1.78
   ```

2. **Check codec support:**
   - WebM may not be supported on some systems
   - Try MP4 instead (modify frontend)

3. **Use headless version:**
   ```bash
   pip install opencv-python-headless
   ```

---

## Performance Issues

### Issue: App is slow
**Symptoms:**
- Lag during drawing
- Video preview stuttering
- Long analysis time

**Solutions:**
1. **Close other tabs/apps**

2. **Reduce video quality:**
   - In CameraCapture.js:
   ```javascript
   video: { width: 320, height: 240 }  // Lower resolution
   ```

3. **Limit frame analysis:**
   - In app.py, reduce `max_frames`

4. **Use production build:**
   ```bash
   npm run build
   # Serve with production server
   ```

---

## Deployment Issues

### Issue: Build fails
**Symptoms:**
```
npm run build
Error: ...
```

**Solutions:**
1. **Check for console.log warnings:**
   - Remove unused imports
   - Fix ESLint errors

2. **Increase memory:**
   ```bash
   set NODE_OPTIONS=--max-old-space-size=4096
   npm run build
   ```

3. **Disable source maps (if too large):**
   - Add to package.json:
   ```json
   "build": "GENERATE_SOURCEMAP=false react-scripts build"
   ```

---

### Issue: Deployed app won't load
**Symptoms:**
- Blank page on Vercel/Netlify
- 404 errors

**Solutions:**
1. **Check build output:**
   - Should be in `/build` folder
   - Deploy this folder

2. **Set environment variables:**
   ```
   REACT_APP_API_URL=https://your-backend.com
   ```

3. **Configure routing:**
   - Add `_redirects` (Netlify):
   ```
   /*    /index.html   200
   ```

4. **Backend CORS:**
   - Update allowed origins:
   ```python
   CORS(app, origins=['https://your-frontend.com'])
   ```

---

## Browser-Specific Issues

### Chrome
- ✅ Best compatibility
- Issue: Memory leaks with long sessions
- Solution: Refresh page periodically

### Firefox
- ⚠️ Limited MediaRecorder support
- Issue: WebM codec issues
- Solution: Use Chrome for demo

### Safari
- ❌ Poor WebRTC support
- Issue: Camera/mic may not work
- Solution: Use Chrome or Edge

### Edge
- ✅ Good compatibility (Chromium-based)
- Same as Chrome

---

## Debug Mode

### Enable verbose logging

**Frontend (App.js):**
```javascript
// Add to top of file
window.DEBUG = true;

// Use throughout
if (window.DEBUG) console.log('Step:', currentStep);
```

**Backend (app.py):**
```python
# Already enabled with debug=True
app.run(debug=True, host='0.0.0.0', port=5000)
```

### Browser DevTools
```
F12 → Console (errors)
F12 → Network (API calls)
F12 → Application (storage, cache)
F12 → Performance (profiling)
```

---

## Emergency Fixes

### Nuclear Option: Fresh Install
```bash
# Frontend
rmdir /s /q node_modules
del package-lock.json
npm install
npm start

# Backend
rmdir /s /q venv
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

### Use Demo Mode
If all else fails, the app has built-in fallbacks:
- Simulated camera data
- Simulated speech data
- Simulated reaction times
- Mock API responses

Just complete the tests - results will appear!

---

## Getting Help

### Check logs
1. **Frontend:** Browser console (F12)
2. **Backend:** Terminal running Flask
3. **Network:** Browser DevTools → Network tab

### File an issue
Include:
- OS version
- Browser version
- Node.js version
- Python version
- Error messages (full stack trace)
- Steps to reproduce

### Test with minimal setup
```bash
# Create new test directory
mkdir test-neurovision
cd test-neurovision

# Copy only essential files
# Test if works in isolation
```

---

## Quick Diagnostics

Run this checklist:
```
□ Node.js installed? (node --version)
□ Python installed? (python --version)
□ npm packages installed? (ls node_modules)
□ Python packages installed? (pip list)
□ Backend running? (curl http://localhost:5000)
□ Frontend running? (check http://localhost:3000)
□ Camera permission granted?
□ Microphone permission granted?
□ No firewall blocking?
□ Latest browser version?
```

---

**Still stuck? The app is designed to work even with failures - just proceed through tests!**
