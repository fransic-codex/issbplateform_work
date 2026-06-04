import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resultAPI } from '../services/api';
import { Trophy, TrendingUp, Clock, ArrowLeft, Share2, Download } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const Result = () => {
  const { resultId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResult();
  }, [resultId]);

  const fetchResult = async () => {
    try {
      const response = await resultAPI.getResult(resultId);
      setResult(response.data.data);
    } catch (error) {
      console.error('Error fetching result:', error);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Excellent':
        return 'bg-green-500';
      case 'Good':
        return 'bg-blue-500';
      case 'Average':
        return 'bg-yellow-500';
      case 'Below Average':
        return 'bg-orange-500';
      case 'Poor':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 75) return 'text-blue-600';
    if (percentage >= 60) return 'text-yellow-600';
    if (percentage >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const chartData = [
    { name: 'Score', value: result?.percentage || 0 },
    { name: 'Remaining', value: 100 - (result?.percentage || 0) }
  ];

  const COLORS = ['#0ea5e9', '#e5e7eb'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="text-center">
          <p className="text-gray-600">Result not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/results')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Results</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-900">{result.test.title}</h1>
        <p className="text-gray-600 mt-2">{result.test.category}</p>
      </div>

      {/* Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card text-center">
          <Trophy className="h-12 w-12 text-primary-600 mx-auto mb-4" />
          <div className={`text-4xl font-bold ${getScoreColor(result.percentage)}`}>
            {result.percentage.toFixed(1)}%
          </div>
          <div className="text-gray-600 mt-2">Score</div>
        </div>

        <div className="card text-center">
          <TrendingUp className="h-12 w-12 text-primary-600 mx-auto mb-4" />
          <div className="text-4xl font-bold text-gray-900">
            {result.totalScore}/{result.maxScore}
          </div>
          <div className="text-gray-600 mt-2">Points</div>
        </div>

        <div className="card text-center">
          <Clock className="h-12 w-12 text-primary-600 mx-auto mb-4" />
          <div className="text-4xl font-bold text-gray-900">
            {formatTime(result.timeTaken)}
          </div>
          <div className="text-gray-600 mt-2">Time Taken</div>
        </div>
      </div>

      {/* Level Badge */}
      <div className="card mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Performance Level</h3>
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-white font-medium ${getLevelColor(result.level)}`}>
              {result.level}
            </div>
          </div>
          <div className="w-48 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Interpretation */}
      <div className="card mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis</h3>
        <p className="text-gray-700 leading-relaxed">{result.interpretation}</p>
      </div>

      {/* Answer Breakdown */}
      <div className="card mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Answer Breakdown</h3>
        <div className="space-y-3">
          {result.answers.map((answer, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Question {index + 1}</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900">
                  Score: {answer.score}
                </span>
                <div className={`w-3 h-3 rounded-full ${answer.score > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center space-x-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center space-x-2 btn-secondary"
        >
          <TrendingUp className="h-5 w-5" />
          <span>Take Another Test</span>
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center space-x-2 btn-primary"
        >
          <Download className="h-5 w-5" />
          <span>Download Report</span>
        </button>
      </div>
    </div>
  );
};

export default Result;
