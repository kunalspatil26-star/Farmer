import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../config/firebase.js';
import SectionHeader from '../components/SectionHeader.jsx';

export default function AuthPage({ setUser }) {
  const [email, setEmail] = useState('');
  const [method, setMethod] = useState('otp');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!email.startsWith('+91')) return alert('Enter mobile with +91');
    const recaptcha = new RecaptchaVerifier('recaptcha-container', {}, auth);
    const result = await signInWithPhoneNumber(auth, email, recaptcha);
    setConfirmationResult(result);
  };

  const handleVerifyOtp = async () => {
    if (!confirmationResult) return;
    const result = await confirmationResult.confirm(otp);
    setUser({ id: result.user.uid, mobile: email, name: 'User', role: 'farmer' });
    navigate('/role');
  };

  const handleEmailLogin = (event) => {
    event.preventDefault();
    // Placeholder for email/password login
    setUser({ id: 'email-user', email, name: 'User', role: 'farmer' });
    navigate('/role');
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Login or sign up" subtitle="Use mobile OTP or email/password to continue with your farm profile." />
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <form onSubmit={method === 'otp' ? (confirmationResult ? handleVerifyOtp : handleSendOtp) : handleEmailLogin} className="space-y-5 rounded-3xl border border-farmsoil bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="space-y-3">
            <label className="text-sm font-semibold">Choose login method</label>
            <div className="flex flex-wrap gap-3">
              {['otp', 'email'].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setMethod(value)}
                  className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${method === value ? 'bg-farmgreen text-white' : 'bg-farmsoil text-farmgreen'}`}
                >
                  {value === 'otp' ? 'Mobile OTP' : 'Email'}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            {method === 'otp' ? (
              <>
                <label className="block">
                  <span className="text-sm font-semibold">Mobile number</span>
                  <input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="+91 98765 43210"
                    className="mt-2 w-full rounded-3xl border border-farmsoil bg-farmsoil px-4 py-3 text-sm outline-none transition focus:border-farmgreen"
                  />
                </label>
                {!confirmationResult ? (
                  <button type="submit" className="w-full rounded-3xl bg-farmgreen px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-farmleaf">
                    Send OTP
                  </button>
                ) : (
                  <>
                    <label className="block">
                      <span className="text-sm font-semibold">Enter OTP</span>
                      <input
                        value={otp}
                        onChange={(event) => setOtp(event.target.value)}
                        placeholder="123456"
                        className="mt-2 w-full rounded-3xl border border-farmsoil bg-farmsoil px-4 py-3 text-sm outline-none transition focus:border-farmgreen"
                      />
                    </label>
                    <button type="submit" className="w-full rounded-3xl bg-farmgreen px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-farmleaf">
                      Verify OTP
                    </button>
                  </>
                )}
                <div id="recaptcha-container"></div>
              </>
            ) : (
              <>
                <label className="block">
                  <span className="text-sm font-semibold">Email address</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="farmer@example.com"
                    className="mt-2 w-full rounded-3xl border border-farmsoil bg-farmsoil px-4 py-3 text-sm outline-none transition focus:border-farmgreen"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold">Password</span>
                  <input
                    type="password"
                    placeholder="********"
                    className="mt-2 w-full rounded-3xl border border-farmsoil bg-farmsoil px-4 py-3 text-sm outline-none transition focus:border-farmgreen"
                  />
                </label>
                <button type="submit" className="w-full rounded-3xl bg-farmgreen px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-farmleaf">
                  Login
                </button>
              </>
            )}
          </div>
        </form>
        <div className="rounded-3xl bg-farmsoil p-6 dark:bg-slate-800">
          <h2 className="text-lg font-semibold">Quick start</h2>
          <p className="mt-3 text-sm text-farmgray">FarmPrice India is built for simple farmer onboarding. Verify your profile, select your role, and add products with GST settings to start receiving buyer offers.</p>
          <div className="mt-5 space-y-3 text-sm">
            <p>• GSTIN field is optional for exempt farmers.</p>
            <p>• Taxable products can use CGST/SGST or IGST based on state.</p>
            <p>• Admin can manage slabs, HSN codes, and marketplace rules.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
