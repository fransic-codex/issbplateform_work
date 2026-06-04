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
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
        <p className="mt-2 text-gray-600">Manage tests and questions</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab('tests')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'tests'
              ? 'border-b-2 border-primary-600 text-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Tests
        </button>
        <button
          onClick={() => setActiveTab('questions')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'questions'
              ? 'border-b-2 border-primary-600 text-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Questions
        </button>
      </div>

      {activeTab === 'tests' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">All Tests</h2>
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
              className="flex items-center space-x-2 btn-primary"
            >
              <Plus className="h-5 w-5" />
              <span>Add Test</span>
            </button>
          </div>

          {showTestForm && (
            <div className="card mb-6">
              <h3 className="text-lg font-semibold mb-4">
                {editingTest ? 'Edit Test' : 'Add New Test'}
              </h3>
              <form onSubmit={handleTestSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={testForm.title}
                    onChange={(e) => setTestForm({ ...testForm, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    className="input-field"
                    value={testForm.category}
                    onChange={(e) => setTestForm({ ...testForm, category: e.target.value })}
                  >
                    <option>Self Confidence</option>
                    <option>Influencing Ability</option>
                    <option>Persuasion Skills</option>
                    <option>Assertiveness</option>
                    <option>Bridging Ability</option>
                    <option>Self Motivation</option>
                    <option>Communication Skills</option>
                    <option>Courage</option>
                    <option>Self Determination</option>
                    <option>Self Efficacy</option>
                    <option>Positive Thinking</option>
                    <option>Responsibility</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    required
                    rows="3"
                    className="input-field"
                    value={testForm.description}
                    onChange={(e) => setTestForm({ ...testForm, description: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    className="input-field"
                    value={testForm.duration}
                    onChange={(e) => setTestForm({ ...testForm, duration: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
                  <textarea
                    rows="2"
                    className="input-field"
                    value={testForm.instructions}
                    onChange={(e) => setTestForm({ ...testForm, instructions: e.target.value })}
                  />
                </div>
                <div className="flex space-x-3">
                  <button type="submit" className="btn-primary">
                    {editingTest ? 'Update' : 'Create'} Test
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowTestForm(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="space-y-4">
            {tests.map((test) => (
              <div key={test._id} className="card">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-gray-900">{test.title}</h3>
                      <span className="px-2 py-1 text-xs bg-primary-100 text-primary-800 rounded">
                        {test.category}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">{test.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>{test.questionCount} questions</span>
                      <span>{test.duration} minutes</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setSelectedTest(test._id);
                        fetchQuestions(test._id);
                        setActiveTab('questions');
                      }}
                      className="p-2 text-gray-400 hover:text-primary-600"
                      title="View questions"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleEditTest(test)}
                      className="p-2 text-gray-400 hover:text-blue-600"
                      title="Edit test"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteTest(test._id)}
                      className="p-2 text-gray-400 hover:text-red-600"
                      title="Delete test"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'questions' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Questions</h2>
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
                className="flex items-center space-x-2 btn-primary"
              >
                <Plus className="h-5 w-5" />
                <span>Add Question</span>
              </button>
            )}
          </div>

          {!selectedTest ? (
            <div className="card text-center py-8">
              <p className="text-gray-600">Select a test to view its questions</p>
            </div>
          ) : (
            <>
              {showQuestionForm && (
                <div className="card mb-6">
                  <h3 className="text-lg font-semibold mb-4">
                    {editingQuestion ? 'Edit Question' : 'Add New Question'}
                  </h3>
                  <form onSubmit={handleQuestionSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Question Text</label>
                      <textarea
                        required
                        rows="3"
                        className="input-field"
                        value={questionForm.questionText}
                        onChange={(e) => setQuestionForm({ ...questionForm, questionText: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Question Type</label>
                      <select
                        className="input-field"
                        value={questionForm.questionType}
                        onChange={(e) => {
                          setQuestionForm({ ...questionForm, questionType: e.target.value });
                          setDefaultOptions(e.target.value);
                        }}
                      >
                        <option value="likert">Likert Scale</option>
                        <option value="frequency">Frequency Scale</option>
                        <option value="true_false">True/False</option>
                        <option value="mcq">Multiple Choice</option>
                      </select>
                    </div>
                    {questionForm.questionType === 'mcq' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Scenario (optional)</label>
                        <textarea
                          rows="2"
                          className="input-field"
                          value={questionForm.scenario}
                          onChange={(e) => setQuestionForm({ ...questionForm, scenario: e.target.value })}
                          placeholder="Add a scenario context for this question"
                        />
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                      {questionForm.options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2 mb-2">
                          <input
                            type="text"
                            required
                            className="input-field"
                            value={option.label}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            placeholder={`Option ${index + 1}`}
                          />
                          {questionForm.options.length > 2 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveOption(index)}
                              className="p-2 text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={handleAddOption}
                        className="text-sm text-primary-600 hover:text-primary-700"
                      >
                        + Add Option
                      </button>
                    </div>
                    <div className="flex space-x-3">
                      <button type="submit" className="btn-primary">
                        {editingQuestion ? 'Update' : 'Create'} Question
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowQuestionForm(false)}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="space-y-4">
                {questions.map((question, index) => (
                  <div key={question._id} className="card">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm font-medium text-gray-500">Q{index + 1}</span>
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                            {question.questionType.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-gray-900 font-medium">{question.questionText}</p>
                        {question.scenario && (
                          <p className="text-gray-600 text-sm mt-2 italic">{question.scenario}</p>
                        )}
                        <div className="mt-2 flex flex-wrap gap-2">
                          {question.options.map((opt, idx) => (
                            <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {opt.label}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => handleEditQuestion(question)}
                          className="p-2 text-gray-400 hover:text-blue-600"
                          title="Edit question"
                        >
                          <Edit2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(question._id)}
                          className="p-2 text-gray-400 hover:text-red-600"
                          title="Delete question"
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
