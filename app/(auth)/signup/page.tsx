"use client";
import React, { useState } from "react";
import Background from "../../components/Background";
import Link from "next/link";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";


const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    setIsLoading(false);
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    console.log("✅ User created:", userCredential.user);
    alert("Signup successful 🎉");
  } catch (error: any) {
    console.error("❌ Signup error:", error);
    alert(error.message);
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div style={{ minHeight: "100vh", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", padding: "10px" }}>
      <Background />

      <div style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: "380px" }}>
        {/* Glow */}
        <div
          style={{
            position: "absolute",
            inset: "-4px",
            background: "linear-gradient(to right, #7c3aed, #c026d3, #7c3aed)",
            borderRadius: "20px",
            filter: "blur(20px)",
            opacity: 0.3,
          }}
        />

        {/* Card */}
        <div
          style={{
            position: "relative",
            backdropFilter: "blur(12px)",
            backgroundColor: "rgba(0,0,0,0.25)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "16px",
            padding: "20px",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
          }}
        >
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "16px" }}>
            <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              🎓 FocusEdu
            </span>
            <p style={{ color: '#9ca3af', fontSize: '10px', marginTop: '2px' }}>by Orion Labs</p>
            <h1 style={{ fontSize: "20px", fontWeight: "bold", color: "white", marginTop: "12px" }}>Create Account</h1>
            <p style={{ fontSize: "12px", color: "#d1d5db" }}>
              Join and start your learning journey
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {/* Name */}
            <input
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={inputStyle}
            />

            {/* Email */}
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />

            {/* Password */}
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ ...inputStyle, paddingRight: "40px" }}
              />
              <ToggleButton show={showPassword} setShow={setShowPassword} />
            </div>

            {/* Confirm Password */}
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={inputStyle}
            />

            {/* Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                marginTop: "6px",
                padding: "10px",
                background: "linear-gradient(to right, #7c3aed, #c026d3)",
                borderRadius: "8px",
                color: "white",
                fontWeight: 600,
                border: "none",
                cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading ? 0.6 : 1,
              }}
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          {/* Footer */}
          <p style={{ marginTop: "14px", textAlign: "center", fontSize: "12px", color: "#9ca3af" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "#a78bfa", fontWeight: 500 }}>
              Sign In
            </Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        input::placeholder {
          color: #6b7280;
        }
        input:focus {
          border-color: rgba(124, 58, 237, 0.5);
          box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.25);
          outline: none;
        }
      `}</style>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 12px",
  backgroundColor: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "8px",
  color: "white",
  fontSize: "13px",
};

const ToggleButton = ({ show, setShow }: any) => (
  <button
    type="button"
    onClick={() => setShow(!show)}
    style={{
      position: "absolute",
      top: "50%",
      right: "10px",
      transform: "translateY(-50%)",
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "#9ca3af",
    }}
  >
    {show ? "🙈" : "👁️"}
  </button>
);

export default SignupPage;
