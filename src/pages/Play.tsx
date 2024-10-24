// import Navbar from '../Navbar/Navbar';
import './Play.css';
import UnityGame from '../components/unitygame';

function Play() {
  return (
    <>
     <div id="full-width">
        <h1 className="title">Maglaro!</h1>
        <br></br>
        <UnityGame width="960px" height="650px" />
        <p className="description">
          <br></br>
          Alamin kung paano nagkaroon ng Apoy, Buwan, at Mangga ang sangkatauhan !
          <br></br>
          <br></br>
        </p>
        </div>
    </>
  );
}

export default Play;
