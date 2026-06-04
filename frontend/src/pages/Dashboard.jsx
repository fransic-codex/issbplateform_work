import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { testAPI } from '../services/api';
import { BrainCircuit, Clock, FileText, ArrowRight } from 'lucide-react';

const Dashboard = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="text-center">
          <BrainCircuit className="mx-auto h-12 w-12 text-primary-600 animate-pulse" />
          <p className="mt-4 text-gray-600">Loading tests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Psychological Assessment Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Select a test to begin your psychological assessment. Each test is designed to measure specific traits and abilities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tests.map((test) => (
          <div key={test._id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{test.title}</h3>
                <span className="inline-block mt-2 px-3 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full">
                  {test.category}
                </span>
              </div>
              <BrainCircuit className="h-8 w-8 text-primary-600 flex-shrink-0 ml-4" />
            </div>
            
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {test.description}
            </p>

            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
              <div className="flex items-center space-x-1">
                <FileText className="h-4 w-4" />
                <span>{test.questionCount} questions</span>
              </div>
              {test.duration > 0 && (
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{test.duration} min</span>
                </div>
              )}
            </div>

            <Link
              to={`/quiz/${test._id}`}
              className="flex items-center justify-center w-full btn-primary"
            >
              Start Test
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        ))}
      </div>

      {tests.length === 0 && (
        <div className="text-center py-12">
          <BrainCircuit className="mx-auto h-16 w-16 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No tests available</h3>
          <p className="mt-2 text-gray-500">Check back later for new assessments.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
