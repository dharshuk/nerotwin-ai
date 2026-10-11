# Experimental Evaluation Plan

## 1. Goal
Evaluate the current implementation as a prototype neurological screening system and separate:
- application functionality
- runtime behavior
- rule-based scoring behavior
- the absence of valid classification claims

## 2. Current dataset status
At the present time, the repository does not contain a valid labelled dataset for neurological disorder classification.

The current backend accepts numeric feature values and computes risk scores from rule-based equations. It does not include patient labels such as:
- healthy vs diseased
- Parkinson's disease vs control
- diagnostic severity class

Therefore, a true supervised classification evaluation is not currently possible from the project alone.

## 3. Valid experiment types available
### A. Functional validation
Measure:
- API response time
- risk-score generation latency
- successful endpoint execution rate
- database persistence
- repeated-trial stability under synthetic inputs

### B. Prototype scoring analysis
Measure:
- distribution of motor score
- distribution of speech score
- distribution of reaction score
- Neuro Risk Index variation across repeated trials

### C. Simulated evaluation only
The project supports synthetic feature generation and rule-based scoring from numeric inputs. This is useful for engineering validation but not medical validation.

## 4. Experimental procedure
1. Run backend locally.
2. Trigger repeated `/user/test` requests with controlled numeric feature values.
3. Record request timestamps, response times and output risk values.
4. Save results in CSV format.
5. Plot response time and risk-index trends.
6. Separate application performance from any hypothetical medical classification task.

## 5. What cannot be claimed
The current project cannot claim:
- diagnostic sensitivity or specificity
- disease detection accuracy
- Parkinson's disease classification accuracy
- superior performance to literature benchmarks

These claims require a valid labelled dataset, a medically justified target task and proper train/test separation.

## 6. Recommended next step
To support a strong research paper, the project needs a dataset that includes clinically verified labels and a modality-matched feature set. Once available, the following should be evaluated:
- motor-only model
- drawing-only model
- speech-only model
- reaction-only model
- multimodal fusion model
- held-out independent test set
