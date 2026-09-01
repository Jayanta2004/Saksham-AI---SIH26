import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { KeyRound, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';
import api from '../../services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [step, setStep] = useState(1); // 1 = Enter Email, 2 = Enter OTP & New Password, 3 = Success
  const [demoOtpHint, setDemoOtpHint] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Step 1: Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await api.post('/api/auth/forgot-password', { email });
      if (res.data?.success) {
        if (res.data.demo_otp) {
          setDemoOtpHint(res.data.demo_otp);
          setOtp(res.data.demo_otp); // prefill demo OTP for convenience
        }
        setStep(2);
      }
    } catch (err) {
      setError(err?.response?.data?.error || 'No officer account found with this email address.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Submit New Password with OTP
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await api.post('/api/auth/reset-password', {
        email,
        otp,
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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        {/* Top Header */}
        <div className="text-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-base mx-auto mb-3">
            <KeyRound className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">
            {step === 3 ? 'Password Reset Complete' : 'Reset Password'}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            {step === 1 && 'Enter your official MoSPI email to receive a verification code'}
            {step === 2 && `Enter the 6-digit verification code sent to ${email}`}
            {step === 3 && 'Your credentials have been updated securely'}
          </p>
        </div>

        {error && (
          <p className="text-xs text-red-600 mb-4 text-center bg-red-50 py-2 px-3 rounded-lg border border-red-100">
            {error}
          </p>
        )}

        {/* STEP 1: Enter Email */}
        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="email">
                Official Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="name@mospi.gov.in"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-sm"
            >
              {isSubmitting ? 'Sending Code...' : 'Send Verification Code'}
            </button>
          </form>
        )}

        {/* STEP 2: Enter OTP & New Password */}
        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-3.5">
            {demoOtpHint && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 flex items-center space-x-2 text-xs text-blue-800">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Verification code: <strong className="font-mono">{demoOtpHint}</strong></span>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="otp">
                6-Digit Verification Code
              </label>
              <input
                id="otp"
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="123456"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="newPassword">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="confirmPassword">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-sm mt-1"
            >
              {isSubmitting ? 'Updating Password...' : 'Reset & Save Password'}
            </button>
          </form>
        )}

        {/* STEP 3: Success Confirmation */}
        {step === 3 && (
          <div className="text-center space-y-4 py-2">
            <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <p className="text-xs text-gray-600">
              Your password has been changed successfully. You can now log into your account with your new password.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors shadow-sm"
            >
              Sign in with New Password
            </button>
          </div>
        )}

        {/* Back to Login Link */}
        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          <Link to="/login" className="inline-flex items-center space-x-1.5 text-xs text-blue-600 font-medium hover:underline">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign in</span>
          </Link>
        </div>
      </div>

      <p className="text-[11px] text-gray-400 mt-6 text-center">
        Ministry of Statistics & Programme Implementation (MoSPI) • SIH 2026
      </p>
    </div>
  );
}
