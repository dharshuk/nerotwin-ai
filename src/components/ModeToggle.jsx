import React from "react";

export default function ModeToggle({ mode, setMode }) {
  return (
    <div className="mb-4">
      <h3 className="text-lg mb-2">Mode</h3>
      <div className="flex gap-2">
        <button
          onClick={() => setMode("user")}
          className={`flex-1 p-2 rounded-lg ${
            mode === "user" ? "bg-green-600" : "bg-gray-600"
          }`}
        >
          Neuro Wellness
        </button>
        <button
          onClick={() => setMode("clinic")}
          className={`flex-1 p-2 rounded-lg ${
            mode === "clinic" ? "bg-blue-600" : "bg-gray-600"
          }`}
        >
          Clinical Screening
        </button>
      </div>

      <p className="mt-2 text-sm text-gray-400">
        {mode === "user"
          ? "Track your brain health over time"
          : "Rapid neurological screening for patients"}
      </p>
    </div>
  );
}
