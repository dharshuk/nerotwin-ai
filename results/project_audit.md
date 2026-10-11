# NeuroVision Project Audit

## 1. Scope
This audit reviewed the current repository implementation, backend API behavior, frontend workflow, database logic and available test coverage.

## 2. Implemented components

### Frontend
- React single-page application in the `src/` directory.
- Flow includes camera, drawing, speech and reaction-time modules.
- Dashboard collects assessment results and sends requests to the Flask backend.

### Backend
- Flask app in `backend/app.py`.
- Endpoints include:
  - `POST /user/test`
  - `GET /user/history/<user_id>`
  - `POST /clinic/test`
  - `GET /patient/history/<patient_id>`
  - `POST /user/register`
  - `POST /patient/register`
- SQLite persistence is implemented in `backend/database.py`.

### Scoring logic
- Rule-based scoring is implemented in `backend/medical_logic.py`.
- The logic computes:
  - motor score from `motor_variance`
  - speech score from `pitch_variation`, `pause_duration`, `speech_rate`
  - reaction score from `reaction_time_ms`
  - overall Neuro Risk Index from weighted combination of motor, speech and reaction scores

## 3. What is working
- The backend starts successfully in the local project environment.
- API endpoints respond to requests.
- User mode and clinic mode endpoints generate deterministic scores from input feature values.
- SQLite records are stored and queryable.
- Trend comparison and history endpoints are functional.
- The provided system test script executes successfully and confirms the application flow in the current implementation.

## 4. Important limitations
### 4.1 Simulated input values
The frontend dashboard sends randomly generated values instead of real extracted motor, speech or drawing features. This is visible in `src/components/Dashboard.js`:
- `motor_variance: Math.random() * 0.4`
- `pitch_variation: Math.random() * 0.6`
- `pause_duration: Math.random() * 1.5`
- `speech_rate: 100 + Math.random() * 80`
- `reaction_time_ms: avgReactionTime`

This means that the current app does not yet perform genuine multimodal feature extraction from actual webcam or microphone signals.

### 4.2 No labelled clinical dataset
The repository does not contain a clinically labelled dataset with disease/no-disease outcomes. There are no supervised training labels from patient diagnoses or neurological assessment records.

### 4.3 No actual trained ML model
No model file, training script, validation split, or saved weights were found in the repository. The system uses fixed medical rules rather than a learned classifier.

### 4.4 No real handwriting or tremor extraction
The camera and microphone capture functionality exists, but the recorded media is not processed into actual tremor, tremor-frequency, MFCC, or speech-quality features. The app mostly records input and then substitutes simulated feature values.

### 4.5 No clinical validation
The current system is a screening prototype, not a medically validated diagnostic system.

## 5. Audit conclusion
The repository is a working prototype with a valid web application flow and rule-based backend scoring, but it does not currently have enough evidence for diagnostic accuracy claims. The current implementation is useful for workflow demonstration and prototype evaluation, not for medical diagnosis or clinically meaningful classification.
