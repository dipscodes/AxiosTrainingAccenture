const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const coursesFilePath = path.join(__dirname, "data", "courses.json");
const registeredCoursesFilePath = path.join(
  __dirname,
  "data",
  "registeredCourses.json"
);

function getCourseName(courseId) {
  const courses = JSON.parse(fs.readFileSync(coursesFilePath, "utf-8"));
  const course = courses.find((c) => c.id === courseId);
  return course ? course.name : "Unknown Course";
}
app.get("/courses", (req, res) => {
  fs.readFile(coursesFilePath, "utf-8", (err, data) => {
    if (err) {
      res.status(500).json({ error: "Unable to read courses data." });
    } else {
      res.json(JSON.parse(data));
    }
  });
});

app.get("/registered-courses", (req, res) => {
  fs.readFile(registeredCoursesFilePath, "utf-8", (err, data) => {
    if (err) {
      res
        .status(500)
        .json({ error: "Unable to read registered courses data." });
    } else {
      res.json(JSON.parse(data));
    }
  });
});

app.post("/register-course", (req, res) => {
  const { participantName, courseId, date } = req.body;

  if (!participantName || !courseId || !date) {
    return res
      .status(400)
      .json({ error: "Participant name, course ID, and date are required." });
  }

  fs.readFile(registeredCoursesFilePath, "utf-8", (err, data) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Unable to read registered courses data." });
    }

    const registeredCourses = JSON.parse(data);
    const newCourse = {
      participantName,
      courseId,
      courseName: getCourseName(courseId),
      date,
    };

    registeredCourses.push(newCourse);

    fs.writeFile(
      registeredCoursesFilePath,
      JSON.stringify(registeredCourses, null, 2),
      (err) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "Unable to save registered course." });
        }
        res.status(201).json(newCourse);
      }
    );
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
