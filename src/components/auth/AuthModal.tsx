import React, { useState, useEffect, useRef } from 'react';
import { X, LogIn, UserPlus, AlertCircle } from 'lucide-react'; // Added icons
import { supabase } from '../../lib/supabase';

interface AuthModalProps {
  onClose: () => void;
  isFirstUser: boolean;
}

export function AuthModal({ onClose, isFirstUser }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(isFirstUser); // Default to sign up if it's the first user
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }
    if (isSignUp && password.trim().length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password: password.trim(),
          options: { data: isFirstUser ? { role: 'admin' } : undefined },
        });
        if (signUpError) throw signUpError;
        if (!data.user) throw new Error('Failed to create account. Please try again.');
        // Potentially show a "Check your email for confirmation" message if email confirmation is enabled
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim(),
        });
        if (signInError) throw signInError;
      }
      onClose();
    } catch (err: any) {
      console.error('Auth error:', err.message);
      // More user-friendly error messages
      if (err.message.includes('already registered') || (err.status === 400 && err.message.includes('User already registered'))) {
        setError('This email is already registered. Please sign in or use a different email.');
      } else if (err.message.includes('Invalid login credentials')) {
        setError('Invalid email or password. Please check your credentials and try again.');
      } else if (err.message.includes('Password should be at least 6 characters')) {
        setError('Password must be at least 6 characters long.');
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const modalTitle = isFirstUser ? 'Create Admin Account' : (isSignUp ? 'Create New Account' : 'Sign In to Your Account');

  return (
    <dialog id="auth_modal" className="modal modal-open modal-bottom sm:modal-middle" open>
      <div className="modal-box w-11/12 max-w-md">
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-3 border-b border-base-300">
          <h3 className="text-xl font-bold text-base-content">{modalTitle}</h3>
          {!isFirstUser && ( // Do not show close button for first user setup
            <button 
              onClick={onClose} 
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="py-4 space-y-4">
          {isFirstUser && (
            <div className="alert alert-info shadow-sm">
              <div>
                <InfoIcon size={20}/>
                <span>You are the first user. This account will have admin privileges.</span>
              </div>
            </div>
          )}

          <div className="form-control">
            <label className="label" htmlFor="email">
              <span className="label-text">Email Address</span>
            </label>
            <input
              ref={inputRef}
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered input-primary w-full"
              required
              autoComplete="email"
              disabled={loading}
              placeholder="you@example.com"
            />
          </div>

          <div className="form-control">
            <label className="label" htmlFor="password">
              <span className="label-text">Password</span>
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered input-primary w-full"
              required
              minLength={6}
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              disabled={loading}
              placeholder={isSignUp ? 'Choose a strong password (min. 6 chars)' : 'Enter your password'}
            />
            {isSignUp && (
              <label className="label">
                <span className="label-text-alt">Password must be at least 6 characters.</span>
              </label>
            )}
          </div>

          {error && (
            <div role="alert" className="alert alert-error shadow-sm">
              <AlertCircle size={20}/>
              <span>{error}</span>
            </div>
          )}

          {!isFirstUser && (
            <div className="text-center">
              <button
                type="button"
                onClick={() => { setIsSignUp(!isSignUp); setError(null); }} // Reset error on toggle
                className="link link-secondary text-sm"
              >
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </button>
            </div>
          )}
          
          {/* Modal Actions */}
          <div className="modal-action mt-6">
             {!isFirstUser && (
                <button type="button" onClick={onClose} className="btn btn-ghost" disabled={loading}>
                    Cancel
                </button>
             )}
            <button
              type="submit"
              className="btn btn-primary flex-grow sm:flex-grow-0" // Allow button to grow on small screens
              disabled={loading || !email.trim() || !password.trim()}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                isSignUp ? <UserPlus size={18} className="mr-2"/> : <LogIn size={18} className="mr-2"/>
              )}
              {loading ? (isSignUp ? 'Creating Account...' : 'Signing In...') : (isSignUp ? 'Sign Up' : 'Sign In')}
            </button>
          </div>
        </form>
      </div>
      {/* Optional: only add backdrop if not first user, to prevent accidental close */}
      {!isFirstUser && (
        <form method="dialog" className="modal-backdrop">
            <button type="submit" onClick={onClose}>close</button>
        </form>
      )}
    </dialog>
  );
}