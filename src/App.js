import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import RegisterCourse from "./pages/RegisterCourse";
import "./App.css";

function App() {
  const [courses, setCourses] = useState([]);
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesResponse = await axios.get(
          "http://localhost:5000/courses"
        );
        setCourses(coursesResponse.data);

        const registeredResponse = await axios.get(
          "http://localhost:5000/registered-courses"
        );
        setRegisteredCourses(registeredResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRegister = (newRegistration) => {
    setRegisteredCourses([...registeredCourses, newRegistration]);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <header>Course Management App</header>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/register">Register for a Course</Link>
      </nav>

      <div className="container">
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <h1>Available Courses</h1>
                <ul>
                  {courses.map((course) => (
                    <li key={course.id}>
                      {course.id} - {course.name}
                    </li>
                  ))}
                </ul>

                <h2>Registered Courses</h2>
                <ul>
                  {registeredCourses.map((item, index) => (
                    <li key={index}>
                      {item.participantName} - {item.courseId} -{" "}
                      {item.courseName} - {item.date}
                    </li>
                  ))}
                </ul>
              </div>
            }
          />
          <Route
            path="/register"
            element={
              <RegisterCourse courses={courses} onRegister={handleRegister} />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
