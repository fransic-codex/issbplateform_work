import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { testAPI, resultAPI } from '../services/api';
import { ChevronLeft, ChevronRight, Clock, CheckCircle } from 'lucide-react';

const Quiz = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTestData();
    const timer = setInterval(() => setTimeElapsed(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, [testId]);

  const fetchTestData = async () => {
    try {
      const response = await testAPI.getTestWithQuestions(testId);
      setTest(response.data.data.test);
      setQuestions(response.data.data.questions);
    } catch (error) {
      console.error('Error fetching test data:', error);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId, selectedOption) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: selectedOption
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    const unansweredQuestions = questions.filter(q => !answers[q._id]);
    if (unansweredQuestions.length > 0) {
      alert(`Please answer all questions before submitting. ${unansweredQuestions.length} question(s) remaining.`);
      return;
    }

    setSubmitting(true);
    try {
      const answersArray = Object.entries(answers).map(([questionId, selectedOption]) => ({
        questionId,
        selectedOption
      }));

      const response = await resultAPI.submitResult({
        testId,
        answers: answersArray,
        timeTaken: timeElapsed
      });

      navigate(`/result/${response.data.data._id}`);
    } catch (error) {
      console.error('Error submitting result:', error);
      alert('Failed to submit test. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderQuestionOptions = (question) => {
    const selectedAnswer = answers[question._id];

    switch (question.questionType) {
      case 'likert':
      case 'frequency':
        return (
          <div className="space-y-3">
            {question.options.map((option) => (
              <button
                key={option.order}
                onClick={() => handleAnswer(question._id, option.value)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  selectedAnswer === option.value
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <span className="font-medium">{option.label}</span>
              </button>
            ))}
          </div>
        );

      case 'true_false':
        return (
          <div className="grid grid-cols-2 gap-4">
            {question.options.map((option) => (
              <button
                key={option.order}
                onClick={() => handleAnswer(question._id, option.value)}
                className={`p-6 rounded-lg border-2 transition-all ${
                  selectedAnswer === option.value
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <span className="font-medium text-lg">{option.label}</span>
              </button>
            ))}
          </div>
        );

      case 'mcq':
        return (
          <div className="space-y-3">
            {question.scenario && (
              <div className="p-4 bg-blue-50 rounded-lg mb-4">
                <p className="text-sm text-blue-800">{question.scenario}</p>
              </div>
            )}
            <div className="space-y-3">
              {question.options.map((option) => (
                <button
                  key={option.order}
                  onClick={() => handleAnswer(question._id, option.value)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    selectedAnswer === option.value
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <span className="font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading test...</p>
        </div>
      </div>
    );
  }

  if (!test || questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="text-center">
          <p className="text-gray-600">Test not found or has no questions.</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{test.title}</h1>
        <p className="text-gray-600 mb-4">{test.instructions}</p>
        
        {/* Progress Bar */}
        <div className="bg-gray-200 rounded-full h-3 mb-4">
          <div
            className="bg-primary-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4" />
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>{formatTime(timeElapsed)}</span>
          </div>
          <div>
            <span>Answered: {answeredCount}/{questions.length}</span>
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="card mb-6">
        <div className="mb-6">
          <span className="inline-block px-3 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full mb-4">
            {currentQuestion.questionType.replace('_', ' ').toUpperCase()}
          </span>
          <h2 className="text-xl font-semibold text-gray-900">
            {currentQuestion.questionText}
          </h2>
        </div>

        {renderQuestionOptions(currentQuestion)}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="flex items-center space-x-2 px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Previous</span>
        </button>

        {currentQuestionIndex === questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center space-x-2 px-6 py-3 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle className="h-5 w-5" />
            <span>{submitting ? 'Submitting...' : 'Submit Test'}</span>
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex items-center space-x-2 px-6 py-3 btn-primary"
          >
            <span>Next</span>
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Question Navigation Dots */}
      <div className="mt-8 flex flex-wrap gap-2 justify-center">
        {questions.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentQuestionIndex(index)}
            className={`w-8 h-8 rounded-full text-sm font-medium transition-all ${
              index === currentQuestionIndex
                ? 'bg-primary-600 text-white'
                : answers[questions[index]._id]
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Quiz;
