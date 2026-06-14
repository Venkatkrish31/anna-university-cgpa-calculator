import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "./App.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
function App() {
  const navigate = useNavigate();
  const handleLogout = () => {
  localStorage.removeItem("studentName");
  localStorage.removeItem("registerNumber");

  navigate("/login");
};
  const [subject, setSubject] = useState("");
  const [credit, setCredit] = useState("");
  const studentName = localStorage.getItem("studentName");
  const [grade, setGrade] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [gpa, setGpa] = useState(0);
  const subjectInputRef = useRef(null);
  const [editIndex, setEditIndex] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
   const savedTheme = localStorage.getItem("darkMode");
   return savedTheme ? JSON.parse(savedTheme) : false;
   });
   useEffect(() => {
  localStorage.setItem(
    "darkMode",
    JSON.stringify(darkMode)
  );
}, [darkMode]);

  const [semesterGpas, setSemesterGpas] = useState(() => {
    const saved = localStorage.getItem("semesterGpas");
    return saved ? JSON.parse(saved) : [];
  });

  const [cgpa, setCgpa] = useState(() => {
    const saved = localStorage.getItem("cgpa");
    return saved ? JSON.parse(saved) : 0;
  });

  useEffect(() => {
  const studentName = localStorage.getItem("studentName");
  const registerNumber = localStorage.getItem("registerNumber");

  if (!studentName || !registerNumber) {
    navigate("/login");
  }
}, [navigate]);

  useEffect(() => {
    localStorage.setItem(
      "semesterGpas",
      JSON.stringify(semesterGpas)
    );
  }, [semesterGpas]);

  useEffect(() => {
    localStorage.setItem(
      "cgpa",
      JSON.stringify(cgpa)
    );
  }, [cgpa]);
 
  const gradePoints = {
    O: 10,
    "A+": 9,
    A: 8,
    "B+": 7,
    B: 6,
    C: 5,
    U: 0,
  };

  const addSubject = () => {
    if (!subject || !credit || !grade) {
      alert("Please fill all fields");
      return;
    }

    const newSubject = {
      subject,
      credit,
      grade,
    };

    setSubjects([...subjects, newSubject]);

    setSubject("");
    setCredit("");
    setGrade("");
  };

  const deleteSubject = (indexToDelete) => {
    const updatedSubjects = subjects.filter(
      (_, index) => index !== indexToDelete
    );

    setSubjects(updatedSubjects);
  };
 const editSubject = (index) => {
  const selectedSubject = subjects[index];

  setSubject(selectedSubject.subject);
  setCredit(selectedSubject.credit);
  setGrade(selectedSubject.grade);

  setEditIndex(index);
  setIsEditing(true);

  setTimeout(() => {
    subjectInputRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    subjectInputRef.current?.focus();
  }, 100);
};
  const updateSubject = () => {
  const updatedSubjects = [...subjects];

  updatedSubjects[editIndex] = {
    subject,
    credit,
    grade,
  };

  setSubjects(updatedSubjects);

  setSubject("");
  setCredit("");
  setGrade("");

  setEditIndex(null);
  setIsEditing(false);
};

  const calculateGpa = () => {
    let totalCredits = 0;
    let totalPoints = 0;

    subjects.forEach((item) => {
      const creditValue = Number(item.credit);
      const gradePoint = gradePoints[item.grade];

      totalCredits += creditValue;
      totalPoints += creditValue * gradePoint;
    });

    if (totalCredits === 0) {
      setGpa(0);
      return;
    }

    const result = totalPoints / totalCredits;
    setGpa(Number(result.toFixed(2)));
  };

  const saveSemester = () => {
  if (gpa === 0) {
    alert("Calculate GPA first");
    return;
  }

  setSemesterGpas([...semesterGpas, gpa]);

  setSubjects([]);
  setGpa(0);

  setSubject("");
  setCredit("");
  setGrade("");
};

  const calculateCgpa = () => {
  if (semesterGpas.length === 0) {
    setCgpa(0);
    return;
  }

  const total = semesterGpas.reduce(
    (sum, semesterGpa) => sum + semesterGpa,
    0
  );

  setCgpa(
    Number(
      (total / semesterGpas.length).toFixed(2)
    )
  );
};

  const clearAllData = () => {
    setSubjects([]);
    setSemesterGpas([]);
    setGpa(0);
    setCgpa(0);

    localStorage.removeItem("semesterGpas");
    localStorage.removeItem("cgpa");
  };
  const deleteSemester = (indexToDelete) => {
  const updatedSemesters = semesterGpas.filter(
    (_, index) => index !== indexToDelete
  );

  setSemesterGpas(updatedSemesters);

  if (updatedSemesters.length > 0) {
    const total = updatedSemesters.reduce(
      (sum, gpa) => sum + gpa,
      0
    );

    setCgpa(
      Number(
        (total / updatedSemesters.length).toFixed(2)
      )
    );
  } else {
    setCgpa(0);
  }
};
const toggleDarkMode = () => {
  setDarkMode(!darkMode);
};
 
  const downloadPdf = () => {
  // Validation
   const studentName = localStorage.getItem("studentName");
  const registerNumber = localStorage.getItem("registerNumber");

  if (!studentName || !registerNumber) {
    alert("Please login first");
    return;
  }
  if (semesterGpas.length === 0) {
    alert("Please save at least one semester");
    return;
  }

  const doc = new jsPDF();

  // Header
  doc.setFillColor(4, 14, 71);
  doc.rect(0, 0, 210, 20, "F");

  doc.setTextColor(157, 157, 157);
  doc.setFontSize(18);
  const pageWidth = doc.internal.pageSize.getWidth();

    doc.text(
      "Anna University CGPA Report",pageWidth / 2,13,
  { align: "center" }
);

  // Reset text color
  doc.setTextColor(0, 0, 0);

  // Date
  const today = new Date().toLocaleDateString();

  // CGPA Card
doc.setFillColor(4, 14, 71);
doc.roundedRect(15, 30, 180, 25, 3, 3, "F");

doc.setTextColor(157, 157, 157);
doc.setFontSize(14);
doc.text("Final CGPA", 20, 45);

doc.setFontSize(20);
doc.text(cgpa.toString(), 160, 45);

// Reset color
doc.setTextColor(0, 0, 0);

// Student Details
doc.setFontSize(12);

doc.text(`Student Name : ${studentName}`, 15, 70);
doc.text(`Register Number : ${registerNumber}`, 15, 80);
doc.text(`Generated On : ${today}`, 15, 90);


  doc.setTextColor(0, 0, 0);

  // Semester Table
  const tableData = semesterGpas.map((gpa, index) => [
    `Semester ${index + 1}`,
    gpa,
  ]);

  autoTable(doc, {
    startY: 105,
    head: [["Semester", "GPA"]],
    body: tableData,
    theme: "grid",
    headStyles: {
      fillColor: [4, 14, 71],     
      textColor: [157, 157, 157],
    },
    alternateRowStyles: {
    fillColor: [240, 240, 240],
  },
  });

  // Statistics
  const highest =
    semesterGpas.length > 0
      ? Math.max(...semesterGpas)
      : 0;

  const lowest =
    semesterGpas.length > 0
      ? Math.min(...semesterGpas)
      : 0;

  const average =
    semesterGpas.length > 0
      ? (
          semesterGpas.reduce(
            (sum, gpa) => sum + gpa,
            0
          ) / semesterGpas.length
        ).toFixed(2)
      : 0;

  let finalY = doc.lastAutoTable.finalY + 20;

  doc.setTextColor(4, 14, 71);
  doc.setFontSize(14);
  doc.text("Statistics", 15, finalY);
  
  doc.setTextColor(0, 0, 0);

  finalY += 10;

  doc.setFontSize(12);

  doc.text(
    `Total Semesters : ${semesterGpas.length}`,
    15,
    finalY
  );

  finalY += 8;

  doc.text(
    `Highest GPA : ${highest}`,
    15,
    finalY
  );

  finalY += 8;

  doc.text(
    `Lowest GPA : ${lowest}`,
    15,
    finalY
  );

  finalY += 8;

  doc.text(
    `Average GPA : ${average}`,
    15,
    finalY
  );

  // Footer
  doc.setFontSize(10);
  doc.setTextColor(100);

  doc.text(
    "Generated using Anna University CGPA Calculator",
    15,
    285
  );

  doc.save("Anna_University_CGPA_Report.pdf");
};
  return (
    <div className={darkMode ? "container dark" : "container"}> 
      <h1>Anna University CGPA Calculator</h1>
      <button onClick={handleLogout}>Logout</button>
      
      <h3>Welcome, {studentName}</h3>

       <br /><br />
      <input
        ref={subjectInputRef}
        type="text"
        placeholder="Subject Name"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />

      <br /><br />

      <select
        value={credit}
        onChange={(e) => setCredit(e.target.value)}
      >
        <option value="">Select Credit</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>

      <br /><br />

      <select
        value={grade}
        onChange={(e) => setGrade(e.target.value)}
      >
        <option value="">Select Grade</option>
        <option value="O">O</option>
        <option value="A+">A+</option>
        <option value="A">A</option>
        <option value="B+">B+</option>
        <option value="B">B</option>
        <option value="C">C</option>
        <option value="U">U</option>
      </select>

      <br /><br />

      <button onClick={isEditing ? updateSubject : addSubject}>
         {isEditing ? "Update Subject" : "Add Subject"}
      </button>


      
      <button onClick={toggleDarkMode}>
         {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>
        

      <hr />
      <br></br>

      <h2>Subjects</h2>

      {subjects.length > 0 && (
  <div className="subjects-table-wrapper">
    <table className="subjects-table">
      <thead>
        <tr>
          <th>Subject</th>
          <th>Credit</th>
          <th>Grade</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {subjects.map((item, index) => (
          <tr key={index}>
            <td>{item.subject}</td>
            <td>{item.credit}</td>
            <td>{item.grade}</td>
            <td>
              <div className="action-buttons">
                <button onClick={() => editSubject(index)}>
                  Edit
                </button>

                <button onClick={() => deleteSubject(index)}>
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
       <br></br>
       <button
        onClick={calculateGpa}>
        Calculate GPA
      </button>
      <br></br>

      <div className="card-container">
        <div className="card">
          <h3>Current GPA</h3>
          <h2>{gpa}</h2>
        </div>
      </div><br></br>

      <hr /><br></br>

      <button
        onClick={saveSemester}> Save Semester
      </button>
      <br></br> <br></br>
      

      <h2>Semester GPAs</h2>

<table className="semester-table">
  <thead>
    <tr>
      <th>Semester</th>
      <th>GPA</th>
      <th>Action</th>
    </tr>
  </thead>

  <tbody>
    {semesterGpas.map((item, index) => (
      <tr key={index}>
        <td>Semester {index + 1}</td>
        <td>{item}</td>
        <td>
          <button
            onClick={() => deleteSemester(index)}
          >
            Delete
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
      <br></br>
      <hr />
      <br></br>

      <button
        onClick={calculateCgpa}>
        Calculate CGPA
      </button>

      <br></br>

       <div className="card-container">
        <div className="card">
           <h3>Final CGPA</h3>
           <h2>{cgpa}</h2>
        </div>
       </div>

      <br></br>
      <h2>Statistics</h2>

      <p>Total Semesters: {semesterGpas.length}</p>

      <p>
        Highest GPA:{" "}
        {semesterGpas.length > 0
          ? Math.max(...semesterGpas)
         : 0}
      </p>

      <p>
      Lowest GPA:{" "}
      {semesterGpas.length > 0
      ? Math.min(...semesterGpas)
       : 0}
      </p>

      <p>
        Average GPA:{" "}
        {semesterGpas.length > 0
         ? (
        semesterGpas.reduce(
          (sum, gpa) => sum + gpa,
          0
          ) / semesterGpas.length
          ).toFixed(2)
          : 0}
      </p>
      <br></br>
      
      <button onClick={() => {
          if (
          window.confirm(
           "Are you sure you want to clear all data?"
             )
           ) {
              clearAllData();
             }
         }}>Clear All Data
      </button>

      <button onClick={downloadPdf}>  Download PDF
      </button>
      <br></br>
      <hr />
      <footer>
  <p>Made with React by Venkat Raj 🚀</p>
</footer>
    </div>
  );
}

export default App;
