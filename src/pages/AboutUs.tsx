import "./Home.css";
import TeamSection from './members';
function AboutUs() {
  
  return (
    <>
      <div>
        <h1 className="title">
          <br></br>Katha
        </h1>
        <img src="KathaLogo.webp" style={{ width: "40%" }} alt="Image" />

        <p className="description">
          Ang KATHA application ay binuo ng mga estudyante mula sa National
          University - Manila, sa ilalim ng Bachelor of Science in Information
          Technology with Specialization in Multimedia Arts and Animation.
          <br />
          Isa sa inspirasyon ng grupo ay ang kanilang interes sa mga kuwentong
          bayan, at pagbuo ng mga games. Nais ng grupo na makapag hatid ng
          ligaya sa mga estudyante ng Santiago Elementary School, gamit ang mga
          mahahalagang aral na mapupulot mula sa Alamat.{" "}
        </p>
      </div>
      <div>
        <h1 className="title">Mga Maygawa</h1>
        <TeamSection />
        <p className="description">
          Ang grupo ay binubuo nina Justinn Alzona (Web Developer), Kristan
          Domondon (Animator/Artist), Simon Ducusin (Game Developer/Programmer),
          Aaron Flores (Project Manager/Documenter), at ang kanilang adviser na
          si Sir Ryan Richard Guadana na nagbigay ng payo, tulong, at
          inspirasyon sa proyekto.
          <br />
          Mula sa grupong Acoustics, panatilihin nating buhay ang literaturang
          Filipino.
          <br />
          <br />
        </p>
      </div>
    </>
  );
}

export default AboutUs;
