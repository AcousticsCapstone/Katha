import React, { useEffect, useState } from "react";
import "./MyAccount.css";
import getUserDetailsFromToken from "../utils/tokenDecode";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

interface UserDetails {
  username: string;
  email: string;
  accountType: string;
}

interface CodeDetails {
  code: number;
  createdAt: string;
  expiresAt: string;
  isExpired: boolean;
  remainingTime: number;
}

const MyAccount: React.FC = () => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [codes, setCodes] = useState<CodeDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [isTeacher, setIsTeacher] = useState<boolean>(false);
  const fetchCodes = async () => {
    try {
      const response = await api.get("/teacher/codes");

      const data = response.data;
      setCodes(data.codes);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch codes");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const details = getUserDetailsFromToken(token);
      if (details) {
        setUserDetails({
          username: details.username,
          email: details.email,
          accountType: details.accountType,
        });
        // Only fetch codes if user is a teacher
        if (details.accountType !== "student") {
          setIsTeacher(true);
          fetchCodes();
        }
      } else {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);
  if (!isTeacher) {
    return <h1>Access Denied. This page is for teachers only.</h1>;
  }
  if (!userDetails) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="cards-container">
        <div className="card">
          <h1>{userDetails.username}</h1>
          <p className="userDetails">
            Account Type: {userDetails.accountType === "student" ? "Student" : "Teacher"}
            <br />
            Email Address: {userDetails.email}
          </p>
          <button className="card-button" onClick={() => navigate("/change-password")}>
            Change Password
          </button>
        </div>

        {userDetails.accountType === "teacher" && (
  <div className="card teacher-codes-card">
    <h1 className="card-title">Generated Codes</h1>
    
    <div className="codes-container">
      {loading ? (
        <div className="loading-container">
          <p>Loading codes...</p>
          <div className="spinner"></div> {/* Optional: Add a spinner here for better user experience */}
        </div>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : codes.length === 0 ? (
        <p className="no-codes-text">No codes have been generated yet.</p>
      ) : (
        <table className="codes-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Created At</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {codes.map((code, index) => (
              <tr key={index} className={code.isExpired ? "code-row expired" : "code-row active"}>
                <td>{code.code}</td>
                <td>{formatDate(code.createdAt)}</td>
                <td>
                  {code.isExpired ? (
                    <span className="status-badge expired">Expired</span>
                  ) : (
                    <span className="status-badge active">
                      Active ({Math.floor(code.remainingTime / 60)}h {code.remainingTime % 60}m remaining)
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  </div>
)}


        {userDetails.accountType === "admin" && (
          <div className="card">
            <h1>Admin</h1>
            <p className="description">Pahina para sa admin</p>
            <button className="card-button" onClick={() => navigate("/admin")}>
              Pumunta sa pahina ng Admin
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default MyAccount;