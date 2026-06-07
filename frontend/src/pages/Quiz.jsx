import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { testAPI, resultAPI } from '../services/api';
import { ChevronLeft, ChevronRight, Clock, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

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
                className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 outline-none flex items-center justify-between group ${
                  selectedAnswer === option.value
                    ? 'border-blue-500 bg-blue-500/10 text-white shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                    : 'border-slate-800 bg-slate-900/40 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40 hover:text-white'
                }`}
              >
                <span className="font-semibold text-sm group-hover:translate-x-0.5 transition-transform duration-200">
                  {option.label}
                </span>
                <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-4 ${
                  selectedAnswer === option.value ? 'border-blue-400 bg-blue-400/20' : 'border-slate-700'
                }`}>
                  {selectedAnswer === option.value && <div className="h-2 w-2 rounded-full bg-blue-400" />}
                </div>
              </button>
            ))}
          </div>
        );

      case 'true_false':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {question.options.map((option) => (
              <button
                key={option.order}
                onClick={() => handleAnswer(question._id, option.value)}
                className={`p-6 rounded-xl border-2 transition-all duration-200 text-center flex flex-col items-center justify-center outline-none group ${
                  selectedAnswer === option.value
                    ? 'border-blue-500 bg-blue-500/10 text-white shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                    : 'border-slate-800 bg-slate-900/40 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40 hover:text-white'
                }`}
              >
                <span className="font-bold text-lg">{option.label}</span>
                <div className={`mt-3 h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                  selectedAnswer === option.value ? 'border-blue-400 bg-blue-400/20' : 'border-slate-700'
                }`}>
                  {selectedAnswer === option.value && <div className="h-2 w-2 rounded-full bg-blue-400" />}
                </div>
              </button>
            ))}
          </div>
        );

      case 'mcq':
        return (
          <div className="space-y-4">
            {question.scenario && (
              <div className="p-4 bg-blue-950/30 border border-blue-900/50 rounded-xl mb-2 flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-300 leading-relaxed font-medium">{question.scenario}</p>
              </div>
            )}
            <div className="space-y-3">
              {question.options.map((option) => (
                <button
                  key={option.order}
                  onClick={() => handleAnswer(question._id, option.value)}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 outline-none flex items-center justify-between group ${
                    selectedAnswer === option.value
                      ? 'border-blue-500 bg-blue-500/10 text-white shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                      : 'border-slate-800 bg-slate-900/40 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40 hover:text-white'
                  }`}
                >
                  <span className="font-semibold text-sm group-hover:translate-x-0.5 transition-transform duration-200">
                    {option.label}
                  </span>
                  <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-4 ${
                    selectedAnswer === option.value ? 'border-blue-400 bg-blue-400/20' : 'border-slate-700'
                  }`}>
                    {selectedAnswer === option.value && <div className="h-2 w-2 rounded-full bg-blue-400" />}
                  </div>
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
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-16 h-16 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin"></div>
          <BrainCircuit className="h-8 w-8 text-blue-400 animate-pulse" />
        </div>
        <p className="mt-6 text-slate-400 font-medium tracking-wide animate-pulse">Loading assessment details...</p>
      </div>
    );
  }

  if (!test || questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] text-center px-4">
        <AlertTriangle className="h-16 w-16 text-yellow-500/80 mb-4 animate-bounce" />
        <h3 className="text-xl font-bold text-white">Assessment unavailable</h3>
        <p className="text-slate-400 mt-2">The requested test contains no questions or could not be found.</p>
        <button onClick={() => navigate('/dashboard')} className="mt-6 btn-premium-primary">
          Back to Dashboard
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      {/* Header Panel */}
      <div className="glass-card p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-800/80 pb-4 mb-4 gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Assessment Profile</span>
            </div>
            <h1 className="text-2xl font-black text-white">{test.title}</h1>
          </div>
          <div className="flex items-center space-x-4 self-start sm:self-center">
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800/50 border border-slate-700/40 text-slate-300 font-semibold text-xs">
              <Clock className="h-4 w-4 text-blue-400" />
              <span>{formatTime(timeElapsed)}</span>
            </div>
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800/50 border border-slate-700/40 text-slate-300 font-semibold text-xs">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>{answeredCount}/{questions.length} Complete</span>
            </div>
          </div>
        </div>
        <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{test.instructions}</p>

        {/* Progress Bar Container */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
            <span>Evaluation progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="bg-slate-900 rounded-full h-2.5 w-full overflow-hidden border border-slate-800/50">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-out shadow-[0_0_10px_rgba(59,130,246,0.3)]"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Active Question Box */}
      <div className="glass-card p-6 sm:p-8 mb-6 relative overflow-hidden">
        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl"></div>

        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-950/60 text-blue-300 border border-blue-900/50">
              Q-{currentQuestionIndex + 1}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 capitalize">
              {currentQuestion.questionType.replace('_', ' ')}
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
            {currentQuestion.questionText}
          </h2>
        </div>

        {renderQuestionOptions(currentQuestion)}
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="btn-premium-secondary disabled:opacity-30 disabled:cursor-not-allowed text-sm py-2.5 px-4"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </button>

        {currentQuestionIndex === questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="btn-premium-primary text-sm py-2.5 px-5 shadow-lg shadow-blue-500/20"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>{submitting ? 'Submitting...' : 'Submit Evaluation'}</span>
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="btn-premium-primary text-sm py-2.5 px-5"
          >
            <span>Next Question</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Grid of Dots */}
      <div className="glass-card mt-8 p-4 flex flex-wrap gap-2.5 justify-center">
        {questions.map((q, index) => {
          const isCurrent = index === currentQuestionIndex;
          const isAnswered = !!answers[q._id];
          return (
            <button
              key={q._id}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-9 h-9 rounded-xl text-xs font-bold transition-all duration-200 border flex items-center justify-center outline-none ${
                isCurrent
                  ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_10px_rgba(59,130,246,0.35)] scale-105'
                  : isAnswered
                  ? 'bg-emerald-500/10 border-emerald-500/35 text-emerald-400 hover:bg-emerald-500/20'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Quiz;
