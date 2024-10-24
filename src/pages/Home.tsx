// import Navbar from '../Navbar/Navbar';
import './Home.css';
import { NavLink } from 'react-router-dom';
import {useAuth} from '../utils/AuthContext';
function Home() {
  const {userType } = useAuth();
  
  return (
    <>
      <section id="full-width">
        <h1 className="title">Maglaro!<br></br></h1>
        <img src="/Maglaro.webp" alt="Image" style={{width:"80%"}}/>
        <p className="description">
          Alamin kung paano nagkaroon ng Apoy, Buwan, at Mangga ang sangkatauhan !
          <br></br>
          <br></br>
        </p>
        <NavLink to="/play" className="button">
        <button id="button" style={{
                    backgroundColor: "hsl(28, 88%, 62%)",
                    color: "black",
                    fontSize:"1.5rem"
                  }}>Maglaro</button>
      </NavLink>
        
      </section>
      
      <div id='spacerDiv'> </div>

      <div > {/* Wrap remaining sections */}
        <section id="full-width">
          <div className="row">
            <div className="col">
              <h1 className="title">Matuto</h1>
              <img src="/Matuto.webp" alt="Image" style={{width:"80%"}}/>
              <p className="description">
              <br></br>
                Alamin ang mga alamat ng Pilipinas!
                <br></br>
                <br></br>
                <br></br>
              </p>
              <NavLink to="/learn" className="button">
              <button id="button" style={{
                    backgroundColor: "hsl(28, 88%, 62%)",
                    color: "black",
                    fontSize:"1.5rem"
                  }}>Matuto</button></NavLink>
            </div>
          </div>
        </section>
        {(userType === 'teacher'|| userType ==='admin') ? (
        <section id="full-width">
          <div className="row">
            <div className="col">
              <h1 className="title">Gabay sa Pagtuturo</h1>
              <img src="Storytelling.webp" alt="Image" style={{width:"80%"}}/>
              <p className="description">
                <br></br>
                Mga gabay sa pagtuturo ng mga alamat sa klase.
                <br></br>
                <br></br>
              </p>
              <NavLink to="/teacher-corner" className="button">
              <button id="button" style={{
                    backgroundColor: "hsl(28, 88%, 62%)",
                    color: "black",
                    fontSize:"1.5rem"
                  }}>Pumasok</button></NavLink>
            </div>
          </div>
        </section>
        ) : (
          <></>
        )}
        
      </div>
    </>
  );
}

export default Home;
