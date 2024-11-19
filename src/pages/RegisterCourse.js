import React, { useState } from "react";
import axios from "axios";

function RegisterCourse({ courses, onRegister }) {
  const [participantName, setParticipantName] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [message, setMessage] = useState("");

  const handleRegisterCourse = async (e) => {
    e.preventDefault();

    if (!participantName || !selectedCourseId) {
      setMessage("Please fill in all fields.");
      return;
    }

    try {
      const date = new Date().toISOString().split("T")[0]; // Current date in YYYY-MM-DD format
      const response = await axios.post(
        "http://localhost:5000/register-course",
        {
          participantName,
          courseId: selectedCourseId,
          date,
        }
      );

      setMessage("Course registered successfully!");
      setParticipantName("");
      setSelectedCourseId("");
      onRegister(response.data); // Callback to update the registered courses list
    } catch (error) {
      console.error("Error registering course:", error);
      setMessage("Failed to register the course. Please try again.");
    }
  };

  return (
    <div>
      <h2>Register for a Course</h2>
      <form onSubmit={handleRegisterCourse}>
        <div>
          <label>Participant Name:</label>
          <input
            type="text"
            value={participantName}
            onChange={(e) => setParticipantName(e.target.value)}
            placeholder="Enter your name"
          />
        </div>
        <div>
          <label>Select Course:</label>
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
          >
            <option value="">-- Select a course --</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Register</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default RegisterCourse;
