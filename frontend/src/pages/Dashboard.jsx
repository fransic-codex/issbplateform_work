import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { testAPI } from '../services/api';
import { BrainCircuit, Clock, FileText, ArrowRight, ShieldCheck } from 'lucide-react';

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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-16 h-16 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin"></div>
          <BrainCircuit className="h-8 w-8 text-blue-400 animate-pulse" />
        </div>
        <p className="mt-6 text-slate-400 font-medium tracking-wide animate-pulse">Loading assessments...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      {/* Welcome Banner */}
      <div className="mb-10 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-transparent border border-blue-500/15 backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <BrainCircuit className="w-64 h-64 text-blue-400" />
        </div>
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Official ISSB Protocol</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Psychological Assessment Dashboard
          </h1>
          <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
            Welcome to the assessment suite. These standardized tests are configured to evaluate specific cognitive traits, emotional resilience, decision-making integrity, and leadership indices. Find a quiet environment before initiating.
          </p>
        </div>
      </div>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tests.map((test) => (
          <div key={test._id} className="glass-card flex flex-col justify-between p-6 group h-full">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full uppercase tracking-wider mb-2.5 ${getCategoryColor(test.category)}`}>
                    {test.category}
                  </span>
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors duration-200 line-clamp-1">
                    {test.title}
                  </h3>
                </div>
                <div className="h-10 w-10 rounded-xl bg-slate-800/60 flex items-center justify-center border border-slate-700/50 group-hover:border-blue-500/40 group-hover:bg-blue-500/10 transition-all duration-300 ml-4 flex-shrink-0">
                  <BrainCircuit className="h-5 w-5 text-slate-400 group-hover:text-blue-400 transition-colors duration-300" />
                </div>
              </div>
              
              <p className="text-slate-400 text-sm mb-6 leading-relaxed line-clamp-3">
                {test.description}
              </p>
            </div>

            <div>
              <div className="flex items-center space-x-4 text-xs font-semibold text-slate-400 border-t border-slate-800/80 pt-4 mb-5">
                <div className="flex items-center space-x-1.5">
                  <FileText className="h-4 w-4 text-slate-500" />
                  <span>{test.questionCount} Questions</span>
                </div>
                {test.duration > 0 && (
                  <div className="flex items-center space-x-1.5">
                    <Clock className="h-4 w-4 text-slate-500" />
                    <span>{test.duration} Minutes</span>
                  </div>
                )}
              </div>

              <Link
                to={`/quiz/${test._id}`}
                className="btn-premium-primary w-full text-center group/btn"
              >
                <span>Start Evaluation</span>
                <ArrowRight className="ml-1 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {tests.length === 0 && (
        <div className="glass-card text-center py-16 flex flex-col items-center justify-center">
          <div className="h-16 w-16 rounded-full bg-slate-800/40 flex items-center justify-center border border-slate-700/30 mb-4">
            <BrainCircuit className="h-8 w-8 text-slate-500" />
          </div>
          <h3 className="text-xl font-bold text-white">No assessments available</h3>
          <p className="mt-2 text-slate-400 text-sm max-w-xs">
            There are currently no active profiles allocated. Contact the administration desk.
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
