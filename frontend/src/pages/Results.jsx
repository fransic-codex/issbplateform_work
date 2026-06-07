import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { resultAPI } from '../services/api';
import { FileText, Calendar, TrendingUp, Trash2, ArrowRight, BrainCircuit } from 'lucide-react';

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
    if (!window.confirm('Are you sure you want to delete this assessment record?')) {
      return;
    }

    try {
      await resultAPI.deleteResult(resultId);
      setResults(results.filter(r => r._id !== resultId));
    } catch (error) {
      console.error('Error deleting result:', error);
      alert('Failed to delete result record.');
    }
  };

  const getLevelBadgeStyles = (level) => {
    switch (level) {
      case 'Excellent':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25';
      case 'Good':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/25';
      case 'Average':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/25';
      case 'Below Average':
        return 'bg-orange-500/10 text-orange-400 border border-orange-500/25';
      case 'Poor':
        return 'bg-rose-500/10 text-rose-400 border border-rose-500/25';
      default:
        return 'bg-slate-500/10 text-slate-400 border border-slate-500/25';
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
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-16 h-16 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin"></div>
          <BrainCircuit className="h-8 w-8 text-blue-400 animate-pulse" />
        </div>
        <p className="mt-6 text-slate-400 font-medium tracking-wide animate-pulse">Retrieving scorecards...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      {/* Title Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Your Evaluation History</h1>
        <p className="mt-2 text-slate-400 text-sm leading-relaxed max-w-2xl">
          Review details of your completed psychological assessments. Download official classification reports and verify metric standings.
        </p>
      </div>

      {results.length === 0 ? (
        <div className="glass-card text-center py-16 flex flex-col items-center justify-center">
          <div className="h-16 w-16 rounded-full bg-slate-800/40 flex items-center justify-center border border-slate-700/30 mb-4">
            <FileText className="h-8 w-8 text-slate-500" />
          </div>
          <h3 className="text-xl font-bold text-white">No scorecards found</h3>
          <p className="mt-2 text-slate-400 text-sm max-w-xs mb-6">
            You haven't completed any assessments under this profile yet.
          </p>
          <Link
            to="/dashboard"
            className="btn-premium-primary text-sm py-2.5 px-6 shadow-md shadow-blue-500/15"
          >
            <span>Begin Evaluation</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((result) => (
            <div key={result._id} className="glass-card p-5 group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 hover:translate-y-[-1px] transition-transform duration-200">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2.5">
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors duration-200">
                    {result.test.title}
                  </h3>
                  <span className={`px-2.5 py-0.5 text-[10px] font-extrabold tracking-wider uppercase rounded-full ${getLevelBadgeStyles(result.level)}`}>
                    {result.level}
                  </span>
                </div>
                
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-4">{result.test.category}</p>

                <div className="flex flex-wrap items-center gap-6 text-xs font-bold text-slate-400">
                  <div className="flex items-center space-x-1.5">
                    <TrendingUp className="h-4 w-4 text-blue-400" />
                    <span>Score: <span className="text-slate-200">{result.percentage.toFixed(1)}%</span></span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="h-4 w-4 text-slate-500" />
                    <span>{formatDate(result.completedAt)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 self-end sm:self-center">
                <Link
                  to={`/result/${result._id}`}
                  className="btn-premium-primary text-xs py-2 px-4 shadow-md shadow-blue-500/5 group/btn"
                >
                  <span>Details</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                </Link>
                <button
                  onClick={() => handleDelete(result._id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all duration-200"
                  title="Delete record"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Results;
