import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resultAPI } from '../services/api';
import { Trophy, TrendingUp, Clock, ArrowLeft, Download, ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

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

  const getScoreColor = (percentage) => {
    if (percentage >= 90) return 'text-emerald-400';
    if (percentage >= 75) return 'text-blue-400';
    if (percentage >= 60) return 'text-amber-400';
    if (percentage >= 40) return 'text-orange-400';
    return 'text-rose-400';
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

  const COLORS = ['#3b82f6', '#1e293b'];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-16 h-16 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin"></div>
          <BrainCircuit className="h-8 w-8 text-blue-400 animate-pulse" />
        </div>
        <p className="mt-6 text-slate-400 font-medium tracking-wide animate-pulse">Analyzing profiles...</p>
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

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] text-center px-4">
        <h3 className="text-xl font-bold text-white">Result file not found</h3>
        <p className="text-slate-400 mt-2">The requested result document could not be extracted.</p>
        <button onClick={() => navigate('/dashboard')} className="mt-6 btn-premium-primary">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      {/* Navigation and Title Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/results')}
            className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors mb-3 text-sm font-semibold"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Results Archive</span>
          </button>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {result.test.title}
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
              {result.test.category}
            </span>
          </div>
        </div>
        
        <div className="flex space-x-3 self-start sm:self-center">
          <button
            onClick={() => window.print()}
            className="btn-premium-secondary text-sm py-2 px-4"
          >
            <Download className="h-4 w-4" />
            <span>Print Report</span>
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-premium-primary text-sm py-2 px-4 shadow-md shadow-blue-500/10"
          >
            <span>Retake Evaluation</span>
          </button>
        </div>
      </div>

      {/* Main Score cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card text-center p-6 flex flex-col items-center">
          <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 mb-4">
            <Trophy className="h-6 w-6 text-blue-400" />
          </div>
          <div className={`text-4xl font-black tracking-tight ${getScoreColor(result.percentage)}`}>
            {result.percentage.toFixed(1)}%
          </div>
          <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-2">Score Rate</div>
        </div>

        <div className="glass-card text-center p-6 flex flex-col items-center">
          <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 mb-4">
            <TrendingUp className="h-6 w-6 text-indigo-400" />
          </div>
          <div className="text-4xl font-black text-white tracking-tight">
            {result.totalScore} <span className="text-xl text-slate-500 font-semibold">/ {result.maxScore}</span>
          </div>
          <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-2">Evaluation Points</div>
        </div>

        <div className="glass-card text-center p-6 flex flex-col items-center">
          <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20 mb-4">
            <Clock className="h-6 w-6 text-purple-400" />
          </div>
          <div className="text-4xl font-black text-white tracking-tight">
            {formatTime(result.timeTaken)}
          </div>
          <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-2">Duration Taken</div>
        </div>
      </div>

      {/* Level Banner & Visual Chart */}
      <div className="glass-card p-6 sm:p-8 mb-8 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl"></div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="max-w-md">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-[10px] font-semibold uppercase tracking-wider mb-3">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Assessment Summary</span>
            </div>
            <h3 className="text-xl font-extrabold text-white mb-2">Performance Band</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Your results fall under the classification band below. This index matches candidates with standard traits required in high-responsibility fields.
            </p>
            <div className={`inline-block px-5 py-2 rounded-xl text-sm font-extrabold tracking-wide uppercase ${getLevelBadgeStyles(result.level)}`}>
              {result.level}
            </div>
          </div>
          
          <div className="w-40 h-40 flex-shrink-0 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={72}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className={`text-2xl font-black tracking-tight ${getScoreColor(result.percentage)}`}>
                {Math.round(result.percentage)}%
              </span>
              <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Metrics</span>
            </div>
          </div>
        </div>
      </div>

      {/* Profiling Interpretation */}
      <div className="glass-card p-6 sm:p-8 mb-8">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
          <span className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]"></span>
          <span>Psychological Evaluation Output</span>
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line p-4 rounded-xl bg-slate-900/40 border border-slate-800/60">
          {result.interpretation}
        </p>
      </div>

      {/* Answer Breakdown grid */}
      <div className="glass-card p-6 sm:p-8 mb-8">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center space-x-2">
          <span className="h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]"></span>
          <span>Question Score Matrix</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {result.answers.map((answer, index) => (
            <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700/60 transition-all duration-200">
              <span className="text-xs font-bold text-slate-400 uppercase">Question {index + 1}</span>
              <div className="flex items-center space-x-2.5">
                <span className="text-sm font-bold text-white">
                  Score: <span className={answer.score > 0 ? 'text-emerald-400' : 'text-slate-400'}>{answer.score}</span>
                </span>
                {answer.score > 0 ? (
                  <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400/80 shadow-emerald-500/20" />
                ) : (
                  <XCircle className="h-4.5 w-4.5 text-rose-500/80" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Result;
