import { useEffect, useState, useCallback } from 'react';
import api from '../utils/api';
import './Assessment.css';
import { useLocation } from 'react-router-dom';

function Quiz() {
  // Define the question interface
  interface Question {
    question: string;
    type: 'multipleChoice' | 'openEnded' | 'trueOrFalse';
    options?: string[]; // Optional for open-ended or true/false questions
    correctAnswer?: string; // Optional, for displaying correct answers
  }

  const [quiz, setQuiz] = useState<{ title: string; questions: Question[] } | null>(null);
  const [quizzes, setQuizzes] = useState<{ _id: string; title: string; questions: Question[]; code: number }[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [message, setMessage] = useState<string>('');
  const userType = localStorage.getItem('userType');
  const location = useLocation(); 

  // Memoize fetchQuizzes with useCallback to avoid changing the function reference on every render
  const fetchQuizzes = useCallback(async () => {
    try {
      if (userType === 'student') {
        const response = await api.get('/quiz');
        setQuiz(response.data);
        setMessage(response.data.message);
      } else if (userType === 'teacher' || userType === 'admin') {
        const response = await api.get('/teacher/quizzes');
        setQuizzes(response.data);
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  }, [userType]);

  // Fetch quiz or quizzes from API when userType or location changes
  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes, location]);

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionIndex]: answer,
    }));
  };

  const handleSubmit = async () => {
    const formattedAnswers = Object.keys(answers).map(key => ({
      questionId: key,
      answer: answers[parseInt(key)],
    }));

    try {
      await api.post('/answers', {
        quizTitle: quiz?.title ?? '',
        answers: formattedAnswers,
      });
      alert('Answers submitted successfully!');
      setAnswers({});
    } catch (error) {
      console.error('Error submitting answers:', error);
      alert('Failed to submit answers. Please try again.');
    }
  };

  return (
    <div className="Quiz">
       {userType === 'student' && (
        <>
          {quiz ? (
            <>
          <h1>{quiz.title}</h1>
          <form>
            {quiz.questions.map((question, index) => (
              <div key={index} className="question">
                <p id='question'>{question.question}</p>

                {question.type === 'multipleChoice' && (
                  question.options?.map((option, i) => (
                    <label id="option" key={i}>
                      <input
                      
                        type="radio"
                        name={`question-${index}`}
                        value={option}
                        checked={answers[index] === option}
                        onChange={() => handleAnswerChange(index, option)}
                      />
                      {option}
                    </label>
                  ))
                )}

                {question.type === 'openEnded' && (
                  <textarea
                    value={answers[index] ?? ''}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                  />
                )}

                {question.type === 'trueOrFalse' && (
                  <>
                    <label className='input'>
                      <input
                      id="option"
                        type="radio"
                        name={`question-${index}`}
                        value="true"
                        checked={answers[index] === 'True'}
                        onChange={() => handleAnswerChange(index, 'True')}
                      />
                      True
                    </label>
                    <label className='input'>
                      <input
                      id="option"
                      className='input'
                        type="radio"
                        name={`question-${index}`}
                        value="false"
                        checked={answers[index] === 'False'}
                        onChange={() => handleAnswerChange(index, 'False')}
                      />
                      False
                    </label>
                  </>
                )}
              </div>
            ))}
            <button type="button" id='submit' onClick={handleSubmit}>Submit Answers</button>
          </form>
          <p>{message}</p>
        </>
    ) : (
      <h2>No quiz is currently available. Please check back later.</h2>
          )}
          </>
          )}

      {(userType === 'teacher' || userType === 'admin') && quizzes.length > 0 && (
        <>
          <h1>Your Quizzes</h1>
          <div className="quiz-cards">
            {quizzes.map((quiz) => (
              <div className="quiz-card">
                <h2>{quiz.title}</h2>
                {quiz.questions.map((question, index) => (
                  <div key={index} className="question">
                    <p className="question-text"><strong>Question:</strong> {question.question}</p>
                    <p><strong>Options:</strong></p>
                    <ul className="options-list">
                      {question.options?.map((option, i) => (
                        <li key={i}>{option}</li>
                      ))}
                    </ul>
                    <p className="correct-answer"><strong>Correct Answer:</strong> {question.correctAnswer}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <p>{message}</p>
        </>
      )}

      {(userType === 'teacher' || userType === 'admin') && quizzes.length === 0 && (
        <h2>No quizzes found for this teacher.</h2>
      )}
      {userType === null && <h2>Please log in to view quizzes.</h2>}
    </div>
  );
}

export default Quiz;
