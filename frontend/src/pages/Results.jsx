import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { resultAPI } from '../services/api';
import { FileText, Calendar, TrendingUp, Trash2 } from 'lucide-react';

const Results = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await resultAPI.getResults();
      setResults(response.data.data);
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (resultId) => {
    if (!window.confirm('Are you sure you want to delete this result?')) {
      return;
    }

    try {
      await resultAPI.deleteResult(resultId);
      setResults(results.filter(r => r._id !== resultId));
    } catch (error) {
      console.error('Error deleting result:', error);
      alert('Failed to delete result');
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Excellent':
        return 'bg-green-100 text-green-800';
      case 'Good':
        return 'bg-blue-100 text-blue-800';
      case 'Average':
        return 'bg-yellow-100 text-yellow-800';
      case 'Below Average':
        return 'bg-orange-100 text-orange-800';
      case 'Poor':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Results</h1>
        <p className="mt-2 text-gray-600">
          View your psychological assessment results and track your progress over time.
        </p>
      </div>

      {results.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="mx-auto h-16 w-16 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No results yet</h3>
          <p className="mt-2 text-gray-500">Complete a test to see your results here.</p>
          <Link
            to="/dashboard"
            className="mt-4 inline-flex items-center btn-primary"
          >
            Take a Test
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {results.map((result) => (
            <div key={result._id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {result.test.title}
                    </h3>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getLevelColor(result.level)}`}>
                      {result.level}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3">{result.test.category}</p>

                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="h-4 w-4" />
                      <span>Score: {result.percentage.toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(result.completedAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <Link
                    to={`/result/${result._id}`}
                    className="btn-primary text-sm"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => handleDelete(result._id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete result"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Results;
