import React from "react";

export default function PatientIntake({ patient, setPatient }) {
  return (
    <div className="mb-4">
      <h3 className="text-lg mb-2">Patient Intake</h3>

      <input
        type="text"
        placeholder="Patient Name"
        value={patient.name}
        onChange={(e) => setPatient({ ...patient, name: e.target.value })}
        className="w-full mb-2 p-2 rounded bg-gray-700"
      />

      <input
        type="number"
        placeholder="Age"
        value={patient.age}
        onChange={(e) => setPatient({ ...patient, age: e.target.value })}
        className="w-full mb-2 p-2 rounded bg-gray-700"
      />

      <select
        value={patient.complaint}
        onChange={(e) =>
          setPatient({ ...patient, complaint: e.target.value })
        }
        className="w-full mb-2 p-2 rounded bg-gray-700"
      >
        <option value="">Primary Complaint</option>
        <option value="tremor">Tremor</option>
        <option value="speech">Speech Difficulty</option>
        <option value="memory">Memory Issues</option>
        <option value="dizziness">Dizziness</option>
      </select>
    </div>
  );
}
