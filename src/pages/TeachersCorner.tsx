import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import "./TeachersCorner.css";
// Decoded Token Interface
interface DecodedToken {
  username: string;
  email: string;
  accountType: string;
  exp: number;
  iat: number;
}

// Utility function to decode JWT
const getUserDetailsFromToken = (token: string): DecodedToken | null => {
  try {
    const decodedToken = jwtDecode<DecodedToken>(token);
    return decodedToken;
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
      if (
        userDetails &&
        (userDetails.accountType === "teacher" ||
          userDetails.accountType === "admin")
      ) {
        setIsTeacher(true);
      }
    }
  }, []);

  if (!isTeacher) {
    return <h1>Access Denied. This page is for teachers only.</h1>;
  }

  return (
    <>
      <h1 className="title">Gabay sa Pagtuturo</h1>
      <div className="card">
          <h2 className="title">Gumawa ng Class Code</h2>
          {/* <img
            src=""
            alt="Original Sources"
            className="card-image"
            style={{ width: "90%" }}
          /> */}
          <p className="description">
            Gumawa ng class code para sa iyong mga estudyante.
          </p>
          <button className="card-button" onClick={() => navigate("/code")}>
            Pumasok
          </button>
        </div>
      <div className="cards-container">
        <div className="card">
          <h2 className="title">Pagsusulit</h2>
          <img
            src="Matuto.webp"
            alt="Pagsusulit"
            style={{ width: "90%" }}
            className="card-image"
          />
          <p className="description">
            Gumawa o tignan ang mga pagsusulit para sa iyong mga estudyante.
          </p>
          <button
            className="card-button"
            onClick={() => navigate("/create-assessment")}
          >
            Gumawa ng Pagsusulit
          </button>
          <button
            className="card-button"
            onClick={() => navigate("/assessment")}
          >
            Tignan ang mga Pagsusulit
          </button>
          <button
            className="card-button"
            onClick={() => navigate("/checked-quizzes")}
          >
            Tignan ang mga sagot ng estudyante
          </button>
        </div>

        <div className="card">
          <h2 className="title">Download Alamat</h2>
          <img
            src="Storytelling.webp"
            alt="Storytelling"
            className="card-image"
            style={{ width: "90%" }}
          />
          <p className="description">
            Basahin or I-download ang mga istorya ng alamat.
          </p>

          <a href="APOY.pdf" download>
        <button className="card-button">
          I-download ang Alamat ng Apoy <FontAwesomeIcon icon={faDownload} />
        </button>
      </a>
      <a href="BUWAN.pdf" download>
        <button className="card-button">
          I-download ang Alamat ng Buwan <FontAwesomeIcon icon={faDownload} />
        </button>
      </a>
      <a href="MANGGA.pdf" download>
        <button className="card-button">
          I-download ang Alamat ng Mangga <FontAwesomeIcon icon={faDownload} />
        </button>
      </a>
        </div>
      </div>
    </>
  );
}

export default TeachersCorner;
