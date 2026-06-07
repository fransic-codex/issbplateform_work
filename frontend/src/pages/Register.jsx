import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BrainCircuit, User, Mail, Lock, Eye, EyeOff, ArrowRight, Shield, Sparkles, CheckCircle2 } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  // Password strength
  const getPasswordStrength = () => {
    if (!password) return { level: 0, text: '', color: '' };
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { level: 1, text: 'Weak', color: '#ef4444' };
    if (score <= 2) return { level: 2, text: 'Fair', color: '#f59e0b' };
    if (score <= 3) return { level: 3, text: 'Good', color: '#22c55e' };
    return { level: 4, text: 'Strong', color: '#10b981' };
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Failed to create account. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Animated background orbs */}
      <div className="auth-orb auth-orb-1"></div>
      <div className="auth-orb auth-orb-2"></div>
      <div className="auth-orb auth-orb-3"></div>

      <div className="auth-container">
        {/* Left branding panel */}
        <div className="auth-brand-panel">
          <div className="auth-brand-content">
            <div className="auth-brand-icon">
              <BrainCircuit size={48} strokeWidth={1.5} />
            </div>
            <h1 className="auth-brand-title">ISSB Psychological Assessment</h1>
            <p className="auth-brand-subtitle">
              Begin your journey with a comprehensive psychological evaluation for ISSB preparation.
            </p>
            <div className="auth-brand-features">
              <div className="auth-feature">
                <Shield size={20} />
                <span>Secure & Confidential</span>
              </div>
              <div className="auth-feature">
                <Sparkles size={20} />
                <span>AI-Powered Analysis</span>
              </div>
              <div className="auth-feature">
                <CheckCircle2 size={20} />
                <span>Detailed Reports</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <div className="auth-form-panel">
          <div className="auth-form-wrapper">
            <div className="auth-form-header">
              <h2 className="auth-form-title">Create your account</h2>
              <p className="auth-form-subtitle">Start your assessment journey today</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              {error && (
                <div className="auth-error">
                  <div className="auth-error-dot"></div>
                  {error}
                </div>
              )}

              <div className="auth-input-group">
                <label htmlFor="reg-name" className="auth-label">Full Name</label>
                <div className="auth-input-wrapper">
                  <User size={18} className="auth-input-icon" />
                  <input
                    id="reg-name"
                    name="name"
                    type="text"
                    required
                    placeholder="John Doe"
                    className="auth-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="auth-input-group">
                <label htmlFor="reg-email" className="auth-label">Email address</label>
                <div className="auth-input-wrapper">
                  <Mail size={18} className="auth-input-icon" />
                  <input
                    id="reg-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="you@example.com"
                    className="auth-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="auth-input-group">
                <label htmlFor="reg-password" className="auth-label">Password</label>
                <div className="auth-input-wrapper">
                  <Lock size={18} className="auth-input-icon" />
                  <input
                    id="reg-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    placeholder="••••••••"
                    className="auth-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="auth-toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {/* Password strength bar */}
                {password && (
                  <div className="auth-strength">
                    <div className="auth-strength-bars">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="auth-strength-bar"
                          style={{
                            backgroundColor: i <= strength.level ? strength.color : 'rgba(255,255,255,0.1)',
                          }}
                        />
                      ))}
                    </div>
                    <span className="auth-strength-text" style={{ color: strength.color }}>
                      {strength.text}
                    </span>
                  </div>
                )}
              </div>

              <div className="auth-input-group">
                <label htmlFor="reg-confirm" className="auth-label">Confirm Password</label>
                <div className="auth-input-wrapper">
                  <Lock size={18} className="auth-input-icon" />
                  <input
                    id="reg-confirm"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    placeholder="••••••••"
                    className="auth-input"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="auth-toggle-password"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="auth-mismatch">Passwords do not match</p>
                )}
                {confirmPassword && password === confirmPassword && confirmPassword.length >= 6 && (
                  <p className="auth-match">Passwords match ✓</p>
                )}
              </div>

              <button
                type="submit"
                className="auth-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <div className="auth-spinner"></div>
                ) : (
                  <>
                    Create account
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                Already have an account?{' '}
                <Link to="/login" className="auth-link">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
