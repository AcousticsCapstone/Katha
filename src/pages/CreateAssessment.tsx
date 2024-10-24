  import { useState } from 'react';
  import './Assessment.css';
  import TextField from '@mui/material/TextField';
  import Button from '@mui/material/Button';
  import MenuItem from '@mui/material/MenuItem';
  import Select from '@mui/material/Select';
  import api from '../utils/api';
  import { Paper, Typography, Box } from '@mui/material';
  import DeleteIcon from '@mui/icons-material/Delete';
  import AddCircleIcon from '@mui/icons-material/AddCircle';

  interface Question {
    type: string;
    question: string;
    options?: string[];
    correctAnswer?: string;
  }

  interface ErrorMessages {
    quizTitle: string;
    generatedCode: string;
    questions: string;
  }

  const questionTypes = [
    { value: 'multipleChoice', label: 'Multiple Choice' },
    { value: 'openEnded', label: 'Open Ended' },
    { value: 'trueOrFalse', label: 'True or False' },
  ];

  function Assessment() {
    const [quizTitle, setQuizTitle] = useState<string>('');
    const [generatedCode, setGeneratedCode] = useState<string>('');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionType, setCurrentQuestionType] = useState<'multipleChoice' | 'openEnded' | 'trueOrFalse' | ''>('');
    const [currentQuestionText, setCurrentQuestionText] = useState<string>('');
    const [currentOptions, setCurrentOptions] = useState<string[]>(['', '', '']);
    const [currentCorrectAnswer, setCurrentCorrectAnswer] = useState<string>('');
    const [message, setMessage] = useState<string>('');

    // Validation state
    const [errorMessages, setErrorMessages] = useState<ErrorMessages>({
      quizTitle: '',
      generatedCode: '',
      questions: '',
    });

    const handleAddQuestion = () => {
      if (!currentQuestionType || !currentQuestionText) {
        setMessage('Please fill out the question type and text.');
        return;
      }
    
      // Validation for multiple choice questions
      if (currentQuestionType === 'multipleChoice') {
        if (currentOptions.some((opt) => !opt)) {
          setMessage('Please provide all options for the multiple-choice question.');
          return;
        }
    
        if (!currentCorrectAnswer) {
          setMessage('Please provide a correct answer for the multiple-choice question.');
          return;
        }
      }
    
      // Validation for true/false questions
      if (currentQuestionType === 'trueOrFalse' && !currentCorrectAnswer) {
        setMessage('Please provide a correct answer for the true/false question.');
        return;
      }
    
      const newQuestion: Question = {
        type: currentQuestionType,
        question: currentQuestionText,
        options: currentQuestionType === 'multipleChoice' ? currentOptions : undefined,
        // Set correctAnswer for open-ended questions to "Unapplicable" or "OpenEnded"
        correctAnswer: currentQuestionType === 'openEnded' ? 'Unapplicable' : currentCorrectAnswer,
      };
    
      setQuestions([...questions, newQuestion]);
      setCurrentQuestionText('');
      setCurrentOptions(['', '', '']);
      setCurrentCorrectAnswer('');
      setCurrentQuestionType('');
      setMessage('');
    };
    
    

    const handleRemoveQuestion = (index: number) => {
      const newQuestions = questions.filter((_, i) => i !== index);
      setQuestions(newQuestions);
    };

    const handleGenerateCode = async () => {
      try {
        const response = await api.post<{ code: string; message: string }>('/generate-code');
        setGeneratedCode(response.data.code);
        setMessage(response.data.message);
      } catch (error: any) {
        console.error('Error generating code:', error);
        setMessage('Error generating code. Please try again.');
      }
    };

    const validateForm = (): boolean => {
      let isValid = true;
      const errors: ErrorMessages = {
        quizTitle: '',
        generatedCode: '',
        questions: '',
      };

      if (!quizTitle.trim()) {
        errors.quizTitle = 'Quiz title is required';
        isValid = false;
      }

      if (!generatedCode) {
        errors.generatedCode = 'Quiz code is required. Please generate a code.';
        isValid = false;
      }

      if (questions.length === 0) {
        errors.questions = 'At least one question is required';
        isValid = false;
      }

      setErrorMessages(errors);
      return isValid;
    };

    const handleSaveQuiz = async () => {
      if (!validateForm()) {
        return;
      }

      const quiz = {
        title: quizTitle,
        questions,
        code: generatedCode,
      };

      try {
        await api.post('/quiz', quiz);
        setMessage('Quiz saved successfully!');
      } catch (error: any) {
        setMessage(error.response?.data?.message || 'Failed to save quiz. Please try again.');
      }
      console.log(quiz)
    };

    return (
      <Box className="Assessment custom-font" sx={{ maxWidth: 800, margin: 'auto', padding: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom className="quiz-title">
          Create Quiz
        </Typography>
        {message && <Typography color="error">{message}</Typography>}
        <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
          <TextField
            fullWidth
            label="Quiz Title"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            margin="dense"
            variant="outlined"
            required
            error={!!errorMessages.quizTitle}
            helperText={errorMessages.quizTitle}
            className="quiz-title-input"
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
            <Button
              onClick={handleGenerateCode}
              variant="contained"
              color="primary"
              startIcon={<AddCircleIcon />}
            >
              Generate Code
            </Button>
            {generatedCode && (
              <Typography variant="body1">
                Your generated code is: <strong>{generatedCode}</strong>
              </Typography>
            )}
            {errorMessages.generatedCode && (
              <Typography color="error">{errorMessages.generatedCode}</Typography>
            )}
          </Box>
        </Paper>

        {/* Questions */}
        {questions.map((question, index) => (
          <Paper key={index} elevation={2} sx={{ padding: 2, marginBottom: 2 }}>
            <Typography variant="h6" gutterBottom className="quiz-title">
              Question {index + 1}
            </Typography>
            <Typography variant="body1">Type: {question.type}</Typography>
            <Typography variant="body1" gutterBottom>Question: {question.question}</Typography>
            {question.type === 'multipleChoice' && (
              <Box sx={{ marginLeft: 2 }}>
                <Typography variant="body1">Options:</Typography>
                <ul>
                  {question.options?.map((option, optIndex) => (
                    <li key={optIndex}>{option}</li>
                  ))}
                </ul>
                <Typography variant="body1">Correct Answer: {question.correctAnswer}</Typography>
              </Box>
            )}
            {question.type === 'trueOrFalse' && (
              <Typography variant="body1">Correct Answer: {question.correctAnswer}</Typography>
            )}
            <Button
              onClick={() => handleRemoveQuestion(index)}
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              sx={{ marginTop: 1 }}
            >
              Remove Question
            </Button>
          </Paper>
        ))}

        <Paper elevation={3} sx={{ padding: 3, marginTop: 3 }}>
          <Typography variant="h5" gutterBottom>
            Add a Question
          </Typography>
          <Select
            fullWidth
            value={currentQuestionType}
            onChange={(e) => setCurrentQuestionType(e.target.value as 'multipleChoice' | 'openEnded' | 'trueOrFalse' | '')}
            displayEmpty
            margin="dense"
            variant="outlined"
          >
            <MenuItem value="" disabled>Select question type</MenuItem>
            {questionTypes.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </Select>
          {currentQuestionType && (
              <Box sx={{ width: '400px', margin: '0 auto' }}>
              {message && <Typography color="error">{message}</Typography>}
              <TextField
                fullWidth
                label="Question Text"
                value={currentQuestionText}
                onChange={(e) => setCurrentQuestionText(e.target.value)}
                margin="dense"
                variant="outlined"
                required
              />
        
              {currentQuestionType === 'multipleChoice' && (
                <>
                  {currentOptions.map((option, index) => (
                    <TextField
                      key={index}
                      fullWidth
                      label={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...currentOptions];
                        newOptions[index] = e.target.value;
                        setCurrentOptions(newOptions);
                      }}
                      margin="normal"
                      variant="outlined"
                      required
                    />
                  ))}
                  <TextField
                    fullWidth
                    label="Correct Answer"
                    value={currentCorrectAnswer}
                    onChange={(e) => setCurrentCorrectAnswer(e.target.value)}
                    margin="normal"
                    variant="outlined"
                    required
                  />
                </>
              )}
        
              {currentQuestionType === 'trueOrFalse' && (
                <>
                  <Select
                    fullWidth
                    value={currentCorrectAnswer}
                    onChange={(e) => setCurrentCorrectAnswer(e.target.value)}
                    margin="dense"
                    variant="outlined"
                    displayEmpty
                    required
                  >
                    <MenuItem value="" disabled>Select True/False</MenuItem>
                    <MenuItem value="true">True</MenuItem>
                    <MenuItem value="false">False</MenuItem>
                  </Select>
                </>
              )}
              <Button
                onClick={handleAddQuestion}
                variant="contained"
                color="primary"
                startIcon={<AddCircleIcon />}
                sx={{ marginTop: 2 }}
              >
                Add Question
              </Button>
            </Box>
          )}
        </Paper>

        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
          <Button
            onClick={handleSaveQuiz}
            variant="contained"
            color="success"
            size="large"
          >
            Save Quiz
          </Button>
        </Box>
      </Box>
    );
  }

  export default Assessment;
