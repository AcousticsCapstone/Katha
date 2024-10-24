import { useState, useEffect } from 'react';
import api from '../utils/api';

const GenerateCodePage = () => {
  const [code, setCode] = useState<string | null>(localStorage.getItem('generatedCode')); // Check localStorage for a saved code
  const [error, setError] = useState<string | null>(null);
  const [students, setStudents] = useState<{ fullName: string, expiresAt: string }[]>([]);

  useEffect(() => {
    // If there's already a code in localStorage, fetch students
    if (code) {
      fetchStudents(code);
    }
  }, [code]);

  // Function to generate the code
  const generateCode = async () => {
    try {
      //check if code is already generated, look for code in localStorage
      const localCode = localStorage.getItem('generatedCode');
      if(localCode){
        setCode(localCode);
        await fetchStudents(localCode);
        return;
      }
      if (!code || !localCode) {
        const response = await api.post('/generate-code', {}, {});

        const generatedCode = response.data.code;
        setCode(generatedCode);
        setError(null);

        // Fetch students after generating the code
        await fetchStudents(generatedCode);
      } else {
        setError('Code has already been generated.');
      }
    } catch (err) {
      console.error('Error generating code:', err);
      setError('Failed to generate code. Please try again.');
    }
  };

  // Function to fetch students based on the code
  const fetchStudents = async (generatedCode: string) => {
    try {
      const response = await api.get(`/getStudentsBasedOnCode/${generatedCode}`);
      setStudents(response.data); // Store students in state
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('No Students found for this code.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Generate Code</h1>
      
      <button 
        onClick={generateCode}
        style={{ 
          display: 'block',
          width: '100%',
          padding: '10px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        {code ? 'Code Already Generated' : 'Generate Code'}
      </button>
      
      {code && (
        <>
          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '1.2em' }}>
            Your code is: <strong style={{ color: '#007bff' }}>{code}</strong>
          </p>

          {students.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <button 
        onClick={generateCode}
        style={{ 
          display: 'block',
          width: '100%',
          padding: '10px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
        
      >Refresh Student List</button>
              <h3>Students:</h3>
              <ul>
                {students.map((student, index) => (
                  <li key={index}>
                    {student.fullName} - Expires at: {new Date(student.expiresAt).toLocaleString()}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
      
      {error && (
        <p style={{ textAlign: 'center', marginTop: '20px', color: 'red' }}>{error}</p>
      )}
    </div>
  );
};

export default GenerateCodePage;
