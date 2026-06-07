import React, { useEffect, useState } from 'react';
import { testAPI, questionAPI } from '../services/api';
import { Plus, Edit2, Trash2, Eye, ChevronDown, ChevronUp } from 'lucide-react';

const AdminPanel = () => {
  const [tests, setTests] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [activeTab, setActiveTab] = useState('tests');
  const [showTestForm, setShowTestForm] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [expandedTest, setExpandedTest] = useState(null);
  const [loading, setLoading] = useState(true);

  const [testForm, setTestForm] = useState({
    title: '',
    category: 'Self Confidence',
    description: '',
    duration: 15,
    instructions: 'Answer all questions honestly. There are no right or wrong answers.'
  });

  const [questionForm, setQuestionForm] = useState({
    test: '',
    questionText: '',
    questionType: 'likert',
    options: [],
    scenario: ''
  });

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const response = await testAPI.getTests();
      setTests(response.data.data);
    } catch (error) {
      console.error('Error fetching tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async (testId) => {
    try {
      const response = await questionAPI.getQuestionsByTest(testId);
      setQuestions(response.data.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleTestSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTest) {
        await testAPI.updateTest(editingTest._id, testForm);
      } else {
        await testAPI.createTest(testForm);
      }
      setShowTestForm(false);
      setEditingTest(null);
      setTestForm({
        title: '',
        category: 'Self Confidence',
        description: '',
        duration: 15,
        instructions: 'Answer all questions honestly. There are no right or wrong answers.'
      });
      fetchTests();
    } catch (error) {
      console.error('Error saving test:', error);
      alert('Failed to save test');
    }
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    try {
      const questionData = {
        ...questionForm,
        options: questionForm.options.map((opt, idx) => ({
          label: opt.label,
          value: idx + 1,
          order: idx + 1
        }))
      };

      if (editingQuestion) {
        await questionAPI.updateQuestion(editingQuestion._id, questionData);
      } else {
        await questionAPI.createQuestion(questionData);
      }
      setShowQuestionForm(false);
      setEditingQuestion(null);
      setQuestionForm({
        test: '',
        questionText: '',
        questionType: 'likert',
        options: [],
        scenario: ''
      });
      if (selectedTest) {
        fetchQuestions(selectedTest);
        fetchTests();
      }
    } catch (error) {
      console.error('Error saving question:', error);
      alert('Failed to save question');
    }
  };

  const handleDeleteTest = async (testId) => {
    if (!window.confirm('Are you sure you want to delete this test and all its questions?')) {
      return;
    }
    try {
      await testAPI.deleteTest(testId);
      fetchTests();
      if (selectedTest === testId) {
        setSelectedTest(null);
        setQuestions([]);
      }
    } catch (error) {
      console.error('Error deleting test:', error);
      alert('Failed to delete test');
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm('Are you sure you want to delete this question?')) {
      return;
    }
    try {
      await questionAPI.deleteQuestion(questionId);
      if (selectedTest) {
        fetchQuestions(selectedTest);
        fetchTests();
      }
    } catch (error) {
      console.error('Error deleting question:', error);
      alert('Failed to delete question');
    }
  };

  const handleEditTest = (test) => {
    setEditingTest(test);
    setTestForm({
      title: test.title,
      category: test.category,
      description: test.description,
      duration: test.duration,
      instructions: test.instructions
    });
    setShowTestForm(true);
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setQuestionForm({
      test: question.test,
      questionText: question.questionText,
      questionType: question.questionType,
      options: question.options.map(opt => ({ label: opt.label })),
      scenario: question.scenario || ''
    });
    setShowQuestionForm(true);
  };

  const handleAddOption = () => {
    setQuestionForm(prev => ({
      ...prev,
      options: [...prev.options, { label: '' }]
    }));
  };

  const handleOptionChange = (index, value) => {
    setQuestionForm(prev => ({
      ...prev,
      options: prev.options.map((opt, idx) =>
        idx === index ? { label: value } : opt
      )
    }));
  };

  const handleRemoveOption = (index) => {
    setQuestionForm(prev => ({
      ...prev,
      options: prev.options.filter((_, idx) => idx !== index)
    }));
  };

  const setDefaultOptions = (type) => {
    let defaultOptions = [];
    switch (type) {
      case 'likert':
        defaultOptions = [
          { label: 'Strongly Disagree' },
          { label: 'Disagree' },
          { label: 'Neutral' },
          { label: 'Agree' },
          { label: 'Strongly Agree' }
        ];
        break;
      case 'frequency':
        defaultOptions = [
          { label: 'Not at all' },
          { label: 'Rarely' },
          { label: 'Sometimes' },
          { label: 'Often' },
          { label: 'Very Often' }
        ];
        break;
      case 'true_false':
        defaultOptions = [
          { label: 'True' },
          { label: 'False' }
        ];
        break;
      case 'mcq':
        defaultOptions = [
          { label: 'Option 1' },
          { label: 'Option 2' },
          { label: 'Option 3' },
          { label: 'Option 4' }
        ];
        break;
    }
    setQuestionForm(prev => ({ ...prev, options: defaultOptions }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-16 h-16 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin"></div>
          <BrainCircuit className="h-8 w-8 text-blue-400 animate-pulse" />
        </div>
        <p className="mt-6 text-slate-400 font-medium tracking-wide animate-pulse">Initializing panel console...</p>
      </div>
    );
  }

  // Fallback icon for loading context
  function BrainCircuit(props) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
        <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
        <line x1="12" x2="12" y1="19" y2="22" />
      </svg>
    );
  }

  const getCategoryColor = (category) => {
    const cat = category?.toLowerCase() || '';
    if (cat.includes('confidence')) return 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20';
    if (cat.includes('influenc') || cat.includes('persuas')) return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
    if (cat.includes('assertive') || cat.includes('courage')) return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
    if (cat.includes('bridg') || cat.includes('communicat')) return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
    if (cat.includes('motivation') || cat.includes('determination')) return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    if (cat.includes('efficacy') || cat.includes('positive')) return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    return 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      {/* Title console banner */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Admin Console</h1>
          <p className="mt-2 text-slate-400 text-sm leading-relaxed">
            Configure psychological profiles, allocate test indices, and structure question trees.
          </p>
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex space-x-2 mb-8 border-b border-slate-800/80 pb-3">
        <button
          onClick={() => setActiveTab('tests')}
          className={`px-5 py-2 rounded-xl font-bold text-sm transition-all duration-200 border ${
            activeTab === 'tests'
              ? 'bg-blue-500/10 border-blue-500/20 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.05)]'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Assessment Profiles
        </button>
        <button
          onClick={() => setActiveTab('questions')}
          className={`px-5 py-2 rounded-xl font-bold text-sm transition-all duration-200 border ${
            activeTab === 'questions'
              ? 'bg-blue-500/10 border-blue-500/20 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.05)]'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Question Trees
        </button>
      </div>

      {activeTab === 'tests' && (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <h2 className="text-lg font-bold text-white uppercase tracking-wider">All Profiles</h2>
            <button
              onClick={() => {
                setEditingTest(null);
                setTestForm({
                  title: '',
                  category: 'Self Confidence',
                  description: '',
                  duration: 15,
                  instructions: 'Answer all questions honestly. There are no right or wrong answers.'
                });
                setShowTestForm(true);
              }}
              className="flex items-center space-x-2 btn-premium-primary text-xs py-2 px-4 shadow-md shadow-blue-500/15"
            >
              <Plus className="h-4 w-4" />
              <span>New Assessment Profile</span>
            </button>
          </div>

          {showTestForm && (
            <div className="glass-card p-6 mb-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl"></div>
              <h3 className="text-md font-bold text-white mb-6 uppercase tracking-wider border-b border-slate-800 pb-3">
                {editingTest ? 'Modify Assessment Profile' : 'Configure Assessment Profile'}
              </h3>
              <form onSubmit={handleTestSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Assertiveness Assessment"
                      className="input-premium"
                      value={testForm.title}
                      onChange={(e) => setTestForm({ ...testForm, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Category</label>
                    <select
                      className="input-premium bg-slate-900"
                      value={testForm.category}
                      onChange={(e) => setTestForm({ ...testForm, category: e.target.value })}
                    >
                      <option value="Self Confidence">Self Confidence</option>
                      <option value="Influencing Ability">Influencing Ability</option>
                      <option value="Persuasion Skills">Persuasion Skills</option>
                      <option value="Assertiveness">Assertiveness</option>
                      <option value="Bridging Ability">Bridging Ability</option>
                      <option value="Self Motivation">Self Motivation</option>
                      <option value="Communication Skills">Communication Skills</option>
                      <option value="Courage">Courage</option>
                      <option value="Self Determination">Self Determination</option>
                      <option value="Self Efficacy">Self Efficacy</option>
                      <option value="Positive Thinking">Positive Thinking</option>
                      <option value="Responsibility">Responsibility</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</label>
                  <textarea
                    required
                    rows="3"
                    placeholder="Provide a detailed summary describing what psychological properties are assessed..."
                    className="input-premium"
                    value={testForm.description}
                    onChange={(e) => setTestForm({ ...testForm, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Duration (Minutes)</label>
                    <input
                      type="number"
                      required
                      className="input-premium"
                      value={testForm.duration}
                      onChange={(e) => setTestForm({ ...testForm, duration: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Instructions</label>
                    <textarea
                      rows="2"
                      placeholder="e.g. Answer honestly and swiftly. There are no right or wrong parameters..."
                      className="input-premium"
                      value={testForm.instructions}
                      onChange={(e) => setTestForm({ ...testForm, instructions: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex space-x-3 pt-2">
                  <button type="submit" className="btn-premium-primary text-xs py-2 px-5">
                    {editingTest ? 'Save Updates' : 'Publish Profile'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowTestForm(false)}
                    className="btn-premium-secondary text-xs py-2 px-4"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="space-y-4">
            {tests.map((test) => (
              <div key={test._id} className="glass-card p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 hover:translate-y-[-1px] transition-transform duration-200">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2.5">
                    <h3 className="text-lg font-bold text-white">{test.title}</h3>
                    <span className={`px-2.5 py-0.5 text-[10px] font-extrabold tracking-wider uppercase rounded-full ${getCategoryColor(test.category)}`}>
                      {test.category}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-2">{test.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-6 text-xs font-semibold text-slate-400">
                    <span className="flex items-center space-x-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                      <span>{test.questionCount} Questions</span>
                    </span>
                    <span className="flex items-center space-x-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-purple-500"></span>
                      <span>{test.duration} Minutes Duration</span>
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1 self-end sm:self-center">
                  <button
                    onClick={() => {
                      setSelectedTest(test._id);
                      fetchQuestions(test._id);
                      setActiveTab('questions');
                    }}
                    className="p-2 rounded-xl text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 border border-transparent hover:border-blue-500/20 transition-all duration-200"
                    title="View questions"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleEditTest(test)}
                    className="p-2 rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 border border-transparent hover:border-emerald-500/20 transition-all duration-200"
                    title="Edit test"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteTest(test._id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all duration-200"
                    title="Delete test"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'questions' && (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-bold text-white uppercase tracking-wider">Question Registry</h2>
              {selectedTest && (
                <div className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                  Selected Profile Active
                </div>
              )}
            </div>
            {selectedTest && (
              <button
                onClick={() => {
                  setEditingQuestion(null);
                  setQuestionForm({
                    test: selectedTest,
                    questionText: '',
                    questionType: 'likert',
                    options: [],
                    scenario: ''
                  });
                  setDefaultOptions('likert');
                  setShowQuestionForm(true);
                }}
                className="flex items-center space-x-2 btn-premium-primary text-xs py-2 px-4 shadow-md shadow-blue-500/15"
              >
                <Plus className="h-4 w-4" />
                <span>New Question Node</span>
              </button>
            )}
          </div>

          {!selectedTest ? (
            <div className="glass-card text-center py-16 flex flex-col items-center justify-center">
              <Eye className="h-10 w-10 text-slate-500 mb-4" />
              <h3 className="text-lg font-bold text-white">No Profile Selected</h3>
              <p className="mt-2 text-slate-400 text-sm max-w-xs mb-6">
                Please visit the Assessment Profiles tab and select an index to configure questions.
              </p>
              <button
                onClick={() => setActiveTab('tests')}
                className="btn-premium-primary text-xs py-2 px-4"
              >
                Go to Profiles
              </button>
            </div>
          ) : (
            <>
              {showQuestionForm && (
                <div className="glass-card p-6 mb-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl"></div>
                  <h3 className="text-md font-bold text-white mb-6 uppercase tracking-wider border-b border-slate-800 pb-3">
                    {editingQuestion ? 'Modify Question Node' : 'Configure Question Node'}
                  </h3>
                  <form onSubmit={handleQuestionSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Question Type</label>
                        <select
                          className="input-premium bg-slate-900"
                          value={questionForm.questionType}
                          onChange={(e) => {
                            setQuestionForm({ ...questionForm, questionType: e.target.value });
                            setDefaultOptions(e.target.value);
                          }}
                        >
                          <option value="likert">Likert Scale (5 pts)</option>
                          <option value="frequency">Frequency Scale (5 pts)</option>
                          <option value="true_false">True / False</option>
                          <option value="mcq">Multiple Choice Scenario</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Question Text</label>
                      <textarea
                        required
                        rows="3"
                        placeholder="State the core prompt for assessment validation..."
                        className="input-premium"
                        value={questionForm.questionText}
                        onChange={(e) => setQuestionForm({ ...questionForm, questionText: e.target.value })}
                      />
                    </div>
                    {questionForm.questionType === 'mcq' && (
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Scenario Context (Optional)</label>
                        <textarea
                          rows="3"
                          placeholder="Outline scenario parameters to set context for MCQs..."
                          className="input-premium"
                          value={questionForm.scenario}
                          onChange={(e) => setQuestionForm({ ...questionForm, scenario: e.target.value })}
                        />
                      </div>
                    )}
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">Options Config</label>
                      <div className="space-y-3">
                        {questionForm.options.map((option, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <span className="text-xs font-bold text-slate-500 w-8">O-{index + 1}</span>
                            <input
                              type="text"
                              required
                              className="input-premium"
                              value={option.label}
                              onChange={(e) => handleOptionChange(index, e.target.value)}
                              placeholder={`Option Label Value`}
                            />
                            {questionForm.options.length > 2 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveOption(index)}
                                className="p-2.5 rounded-xl bg-slate-800 hover:bg-rose-500/10 hover:text-rose-400 border border-slate-700/40 hover:border-rose-500/20 text-slate-400 transition-colors"
                              >
                                <Trash2 className="h-4.5 w-4.5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={handleAddOption}
                        className="text-xs font-bold text-blue-400 hover:text-blue-300 mt-4 inline-flex items-center space-x-1"
                      >
                        <span>+ Add Option Value</span>
                      </button>
                    </div>
                    
                    <div className="flex space-x-3 pt-2">
                      <button type="submit" className="btn-premium-primary text-xs py-2 px-5">
                        {editingQuestion ? 'Save Node' : 'Publish Node'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowQuestionForm(false)}
                        className="btn-premium-secondary text-xs py-2 px-4"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="space-y-4">
                {questions.map((question, index) => (
                  <div key={question._id} className="glass-card p-5 hover:translate-y-[-1px] transition-transform duration-200">
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3.5 mb-2.5">
                          <span className="text-xs font-bold text-slate-400 uppercase">Q-Node {index + 1}</span>
                          <span className="text-[10px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/50">
                            {question.questionType.replace('_', ' ')}
                          </span>
                        </div>
                        <h4 className="text-white font-bold text-base leading-relaxed">{question.questionText}</h4>
                        {question.scenario && (
                          <div className="mt-3 p-3 rounded-lg bg-blue-950/20 border border-blue-950/40 text-xs text-blue-300 font-semibold leading-relaxed">
                            {question.scenario}
                          </div>
                        )}
                        <div className="mt-4 flex flex-wrap gap-2">
                          {question.options.map((opt, idx) => (
                            <span key={idx} className="text-xs font-medium bg-slate-900/50 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300">
                              <span className="text-slate-500 font-bold mr-1.5">{idx + 1}.</span>
                              {opt.label}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1 flex-shrink-0 ml-4">
                        <button
                          onClick={() => handleEditQuestion(question)}
                          className="p-2 rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 border border-transparent hover:border-emerald-500/20 transition-all duration-200"
                          title="Edit question node"
                        >
                          <Edit2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(question._id)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all duration-200"
                          title="Delete question node"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
