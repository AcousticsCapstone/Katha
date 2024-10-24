import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

// Styles moved to separate CSS file for clarity
import "./TeachersCorner.css";

interface DecodedToken {
  username: string;
  email: string;
  accountType: string;
  exp: number;
  iat: number;
}

const getUserDetailsFromToken = (token: string): DecodedToken | null => {
  try {
    return jwtDecode<DecodedToken>(token);
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
};

function TeachersCorner() {
  const [isTeacher, setIsTeacher] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const userDetails = getUserDetailsFromToken(token);
      if (userDetails?.accountType === "teacher" || userDetails?.accountType === "admin") {
        setIsTeacher(true);
      }
    }
  }, []);

  if (!isTeacher) {
    return <h1 className="access-denied">Access Denied. This page is for teachers only.</h1>;
  }

  const DownloadSection = () => (
    <div className="card download-card">
      <h2 className="card-title">Download Alamat</h2>
      <img
        src="Storytelling.webp"
        alt="Larawan para sa storytelling section"
        className="card-image"
      />
      <p className="description">
        Basahin or I-download ang mga istorya ng alamat.
      </p>
      <div className="button-group">
        <a 
          href="APOY.pdf"
          download
          className="primary-button"
          aria-label="I-download ang Alamat ng Apoy"
        >
          I-download ang Alamat ng Apoy <FontAwesomeIcon icon={faDownload} />
        </a>
        <a 
          href="BUWAN.pdf"
          download
          className="primary-button"
          aria-label="I-download ang Alamat ng Buwan"
        >
          I-download ang Alamat ng Buwan <FontAwesomeIcon icon={faDownload} />
        </a>
        <a 
          href="MANGGA.pdf"
          download
          className="primary-button"
          aria-label="I-download ang Alamat ng Mangga"
        >
          I-download ang Alamat ng Mangga <FontAwesomeIcon icon={faDownload} />
        </a>
      </div>
    </div>
  );

  return (
    <div className="teachers-corner">
      <h1 className="page-title">Gabay sa Pagtuturo</h1>

      <div className="card create-code-card">
        <h2 className="card-title">Gumawa ng Class Code</h2>
        <p className="description">
          Gumawa ng class code para sa iyong mga estudyante.
        </p>
        <button 
          className="primary-button"
          onClick={() => navigate("/code")}
          aria-label="Pumasok sa paggawa ng class code"
        >
          Pumasok
        </button>
      </div>

      <div className="cards-container">
        <div className="card assessment-card">
          <h2 className="card-title">Pagsusulit</h2>
          <img
            src="Matuto.webp"
            alt="Larawan para sa pagsusulit section"
            className="card-image"
          />
          <p className="description">
            Gumawa o tignan ang mga pagsusulit para sa iyong mga estudyante.
          </p>
          <div className="button-group">
            <button
              className="primary-button"
              onClick={() => navigate("/create-assessment")}
              aria-label="Gumawa ng bagong pagsusulit"
            >
              Gumawa ng Pagsusulit
            </button>
            <button
              className="primary-button"
              onClick={() => navigate("/assessment")}
              aria-label="Tignan ang mga kasalukuyang pagsusulit"
            >
              Tignan ang mga Pagsusulit
            </button>
            <button
              className="primary-button"
              onClick={() => navigate("/checked-quizzes")}
              aria-label="Tignan ang mga nasagutan ng mga estudyante"
            >
              Tignan ang mga sagot ng estudyante
            </button>
          </div>
        </div>

        <DownloadSection />
        </div>
      </div>
  );
}

export default TeachersCorner;