import React, { useState } from 'react';
import api from '../utils/api';

interface CheckedQuestion {
  question: string;
  submittedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

interface CheckedQuiz {
  quizTitle: string;
  quizCode: string;
  fullName: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  checkedQuestions: CheckedQuestion[];
}

const CheckedQuizzesPage: React.FC = () => {
  const [quizzes, setQuizzes] = useState<CheckedQuiz[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchCheckedQuizzes = async () => {
    setLoading(true);
    try {
      const response = await api.get('/teacher/quizzes/checked');
      setQuizzes(response.data.checkedQuizzes);
      setError(null);
    } catch (err) {
      console.error('Error fetching checked quizzes:', err);
      setError('Failed to fetch checked quizzes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Checked Quizzes</h1>
      <button
        onClick={fetchCheckedQuizzes}
        disabled={loading}
        style={{
          display: 'block',
          width: '100%',
          padding: '10px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '20px',
        }}
      >
        {loading ? 'Loading...' : 'Fetch Checked Quizzes'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {quizzes.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Quiz Title</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Quiz Code</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Student Name</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Score</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Percentage</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Checked Questions</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map((quiz, index) => (
              <tr key={index}>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{quiz.quizTitle}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{quiz.quizCode}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{quiz.fullName}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{quiz.score}/{quiz.totalQuestions}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{quiz.percentage.toFixed(2)}%</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                  <ul>
                    {quiz.checkedQuestions.map((question, qIndex) => (
                      <li key={qIndex}>
                        <strong>{question.question}</strong><br />
                        Submitted: {question.submittedAnswer}<br />
                        Correct: {question.correctAnswer} <span style={{ color: question.isCorrect ? 'green' : 'red' }}>({question.isCorrect ? 'Correct' : 'Incorrect'})</span>
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CheckedQuizzesPage;