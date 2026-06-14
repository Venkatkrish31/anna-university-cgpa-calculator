import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [studentName, setStudentName] = useState("");
  const [registerNumber, setRegisterNumber] = useState("");

  const navigate = useNavigate();

  const handleLogin = () => {
    if (!studentName || !registerNumber) {
      alert("Please fill all fields");
      return;
    }

    localStorage.setItem("studentName", studentName);
    localStorage.setItem("registerNumber", registerNumber);

    navigate("/");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Anna University CGPA Calculator</h1>

        <input
          type="text"
          placeholder="Student Name"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Register Number"
          value={registerNumber}
          onChange={(e) => setRegisterNumber(e.target.value)}
        />

        <button onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;