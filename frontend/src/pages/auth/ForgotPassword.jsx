import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { KeyRound, ArrowLeft, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';
import api from '../../services/api';
import ThemeToggle from '../../components/common/ThemeToggle';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [step, setStep] = useState(1); // 1 = Enter Email, 2 = Enter OTP & New Password, 3 = Success
  const [demoOtpHint, setDemoOtpHint] = useState('');
  const [liveEmailSent, setLiveEmailSent] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Step 1: Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your registered email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await api.post('/api/auth/forgot-password', { email: email.trim() });
      if (res.data?.success) {
        if (res.data.live_email_sent) {
          setLiveEmailSent(true);
          setDemoOtpHint('');
        } else if (res.data.demo_otp) {
          setDemoOtpHint(res.data.demo_otp);
          setOtp(res.data.demo_otp); // prefill demo OTP for offline testing
        }
        setStep(2);
      }
    } catch (err) {
      setError(err?.response?.data?.error || 'No account found with this registered email address.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Submit New Password with OTP
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (!otp.trim()) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    if (!newPassword) {
      setError('Please enter a new password.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (!confirmPassword) {
      setError('Please confirm your new password.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await api.post('/api/auth/reset-password', {
        email: email.trim(),
        otp: otp.trim(),
        new_password: newPassword
      });

      if (res.data?.success) {
        setStep(3);
      }
    } catch (err) {
      setError(err?.response?.data?.error || 'Invalid verification code or password reset failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center items-center px-4 py-12 transition-colors duration-200">
      <div className="w-full max-w-sm mb-4 flex justify-between items-center text-xs">
        <Link to="/" className="text-blue-600 hover:underline flex items-center gap-1 font-medium">
          ← Back to Saksham AI Home
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle size="sm" />
          <span className="text-slate-400 font-medium">MoSPI Official</span>
        </div>
      </div>

      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-slate-200 p-8 transition-colors duration-200">
        {/* Top Header */}
        <div className="text-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-base mx-auto mb-3 border border-blue-200">
            <KeyRound className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            {step === 3 ? 'Password Reset Complete' : 'Reset Password'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {step === 1 && 'Enter your registered email to receive a verification code'}
            {step === 2 && `Enter the 6-digit verification code sent to ${email}`}
            {step === 3 && 'Your credentials have been updated securely'}
          </p>
        </div>

        {error && (
          <p className="text-xs text-red-600 mb-4 text-center bg-red-50 py-2 px-3 rounded-lg border border-red-200 font-medium">
            {error}
          </p>
        )}

        {/* STEP 1: Enter Email */}
        {step === 1 && (
          <form onSubmit={handleRequestOtp} noValidate className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1" htmlFor="email">
                Registered Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
                placeholder="name@gmail.com or name@mospi.gov.in"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-sm flex items-center justify-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Sending Verification Code...</span>
                </>
              ) : (
                <span>Send Verification Code</span>
              )}
            </button>
          </form>
        )}

        {/* STEP 2: Enter OTP & New Password */}
        {step === 2 && (
          <form onSubmit={handleResetPassword} noValidate className="space-y-3.5">
            {liveEmailSent ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-start space-x-2 text-xs text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>A 6-digit verification code has been dispatched to <strong>{email}</strong>. Please check your inbox.</span>
              </div>
            ) : demoOtpHint ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 flex items-center space-x-2 text-xs text-blue-800">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Verification code: <strong className="font-mono">{demoOtpHint}</strong></span>
              </div>
            ) : null}

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1" htmlFor="otp">
                6-Digit Verification Code
              </label>
              <input
                id="otp"
                name="otp"
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 font-mono text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="123456"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1" htmlFor="newPassword">
                New Password
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1" htmlFor="confirmPassword">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-sm flex items-center justify-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Resetting Password...</span>
                </>
              ) : (
                <span>Reset &amp; Save Password</span>
              )}
            </button>
          </form>
        )}

        {/* STEP 3: Success Confirmation */}
        {step === 3 && (
          <div className="text-center space-y-4 py-2">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Your password has been reset</p>
              <p className="text-xs text-slate-500 mt-1">You can now sign in with your new password.</p>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition shadow-sm"
            >
              Sign In with New Password
            </button>
          </div>
        )}

        {/* Bottom Back to Sign in link */}
        {step !== 3 && (
          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign in</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
