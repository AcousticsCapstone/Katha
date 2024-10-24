
const TeamMember = ({ name, role, imageSrc }: { name: string; role: string; imageSrc: string }) => (
  <div className="flex flex-col items-center p-4">
    <img 
      src={imageSrc} 
      alt={name} 
      className="w-48 h-48 rounded-full object-cover mb-4 border-4 border-amber-600"
    />
    <h3 className="text-xl font-bold text-amber-800">{name}</h3>
    <p className="text-amber-700">{role}</p>
  </div>
);

const TeamSection = () => {
  const teamMembers = [
    {
      name: "Justinn Alzona",
      role: "Web Developer",
      imageSrc: "AboutUs/justinn.jpg" // Replace with actual image path
    },
    {
      name: "Kristan Domondon",
      role: "Animator/Artist",
      imageSrc: "AboutUs/reggae.png" // Replace with actual image path
    },
    {
      name: "Simon Ducusin",
      role: "Game Developer/Programmer",
      imageSrc: "AboutUs/simon.webp" // Replace with actual image path
    },
    {
      name: "Aaron Flores",
      role: "Project Manager/Documenter",
      imageSrc: "AboutUs/aaron.webp" // Replace with actual image path
    },
    {
      name: "Sir Ryan Richard Guadana",
      role: "Adviser",
      imageSrc: "AboutUs/Adviser1.jpg" // Replace with actual image path
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center max-w-6xl mx-auto p-8">
      {teamMembers.map((member, index) => (
        <TeamMember
          key={index}
          name={member.name}
          role={member.role}
          imageSrc={member.imageSrc}
        />
      ))}
    </div>
  );
};

export default TeamSection;