'use client'
import { useNavigate } from 'react-router-dom';
import { UserIcon, BookOpenIcon } from 'lucide-react';

export function UserTypeSelection() {
  const handleSelection = (userType: 'student' | 'teacher') => {
    if (userType === 'student') {
      navigate('/student-login');
    }
    else if (userType === 'teacher') {
      navigate('/login');
    }
  };
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-[#F0FFF0] shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
          <h1 className="text-3xl font-bold mb-6 text-center text-[#E1AD01]">
            Maligayang Pagdating sa Katha!
          </h1>
          <p className="text-[#E1AD01] text-center mb-8">Ikaw ba ay estudyante o guro?</p>
          <div className="flex justify-center space-x-6">
            <button
              onClick={() => handleSelection('student')}
              className="flex flex-col items-center justify-center bg-[#FFA500] hover:bg-[#FF8C00] text-black font-bold py-4 px-6 rounded-lg focus:outline-none focus:shadow-outline transform transition-all duration-300 hover:scale-105 w-40 h-40"
            >
              <UserIcon size={48} className="mb-2" />
              <span>Estudyante</span>
            </button>
            <button
              onClick={() => handleSelection('teacher')}
              className="flex flex-col items-center justify-center bg-[#FFA500] hover:bg-[#FF8C00] text-black font-bold py-4 px-6 rounded-lg focus:outline-none focus:shadow-outline transform transition-all duration-300 hover:scale-105 w-40 h-40"
            >
              <BookOpenIcon size={48} className="mb-2" />
              <span>Guro</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}