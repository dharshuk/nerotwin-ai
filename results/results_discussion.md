# Results and Discussion

## Experimental environment
The current prototype was evaluated in a local development environment using the repository’s Flask backend and React frontend. The backend was started from the project root and tested through the available HTTP interface on `http://127.0.0.1:5000`. The application was assessed using repeated synthetic requests to the `/user/test` endpoint with controlled input values representing low-, moderate- and high-risk profiles.

The project currently does not contain a clinically labelled dataset, a trained model file, or a verified neurological ground-truth reference. Therefore, the evaluation in this section describes prototype functionality and scoring stability rather than medical classification performance.

## Application performance
The system successfully executed repeated backend requests without failing. The average response time across five repeated trials was approximately 32.9 ms for the configured test flow. This indicates that the current backend can generate a risk score efficiently under local conditions.

The measured response times were:

| Trial | Response time (ms) |
|---|---:|
| 1 | 72.25 |
| 2 | 29.07 |
| 3 | 18.44 |
| 4 | 16.36 |
| 5 | 28.25 |

The application therefore demonstrates low local processing latency, but this performance should be interpreted as prototype runtime performance, not as a clinical or diagnostic benchmark.

## Rule-based risk scoring results
The current Neuro Risk Index is produced by a fixed weighted rule in `backend/medical_logic.py`. The score combines motor, speech and reaction features according to a predefined formula, rather than a trained machine-learning model.

The measured risk outputs from the repeated trials are shown below:

| Trial | Motor score | Speech score | Reaction score | Neuro Risk Index | Risk level |
|---|---:|---:|---:|---:|---|
| 1 | 85.0 | 88.8 | 81.3 | 85.0 | LOW |
| 2 | 75.7 | 85.6 | 71.3 | 77.3 | MODERATE |
| 3 | 66.3 | 80.2 | 61.3 | 69.0 | MODERATE |
| 4 | 56.0 | 72.5 | 57.2 | 61.3 | MODERATE |
| 5 | 51.3 | 64.0 | 54.0 | 55.9 | HIGH |

These values show that the prototype produces consistent score changes when the input parameters shift from lower-risk to higher-risk conditions. The results confirm that the system behaves deterministically under the implemented rule-based logic.

## Interpretation and discussion
The current system is useful as a functional screening prototype because it provides a structured workflow for collecting assessment values and converting them into a combined risk output. This is especially relevant for demonstration, workflow validation and user-interaction testing.

However, the findings should not be interpreted as evidence that the app can correctly detect neurological disorders. The project does not yet have:
- clinically verified labels
- a validated patient population
- a trained classifier
- external test-set evaluation
- real medical ground truth

For this reason, the measured value should be understood as a prototype screening score rather than a medical diagnosis.

The fact that the risk level changes with increasing motor variance, speech irregularity and reaction delay is expected from the implemented rule-based equations. This demonstrates system responsiveness, but not medical validity.

## Comparison with prior literature
Some literature studies report high accuracy for multimodal neurological screening systems on clinically labelled datasets. Those results are not directly comparable with the current prototype because the current project does not presently use a labelled clinical dataset or a trained model evaluation protocol. It is therefore inappropriate to claim parity with or superiority over academic benchmarks at this stage.

The project should instead be positioned as an accessible screening prototype that motivates future multimodal model development.

## Limitations
The current evaluation is limited by several factors:
1. synthetic feature values rather than real extracted measures
2. lack of labelled disease/no-disease outcomes
3. absence of a trained model and test split
4. no clinically validated risk thresholds
5. no external real-world performance study

## Conclusion
The current NeuroVision implementation is operational and produces rule-based risk outputs in a stable way, but its results should be reported as prototype evidence only. The project demonstrates a functioning workflow and internal consistency, but it does not yet support claims of clinical detection accuracy or diagnostic reliability.
