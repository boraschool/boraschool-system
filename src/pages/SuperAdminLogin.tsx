import React, { useState } from 'react';
import { motion } from 'motion/react';
import { GraduationCap, Lock, User, ArrowLeft, ShieldAlert } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { supabase } from '../lib/supabase';
import { authService } from '../services/authService';

export const SuperAdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (data.user) {
        const profile = await authService.getCurrentProfile();
        if (profile && profile.role === 'super_admin') {
          navigate('/super-admin/dashboard');
        } else {
          await supabase.auth.signOut();
          setError('Access denied. Super Admin privileges required.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-mono">
      {/* Technical Grid Background */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
           style={{ 
             backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', 
             backgroundSize: '40px 40px' 
           }} />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-kenya-red via-kenya-green to-kenya-red opacity-50" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link to="/" className="flex items-center justify-center gap-3 mb-12 group">
          <div className="bg-white/10 p-2 rounded-lg border border-white/20 group-hover:border-kenya-green/50 transition-all">
            <GraduationCap className="w-8 h-8 text-kenya-green" />
          </div>
          <div className="text-left">
            <span className="block text-2xl font-bold text-white tracking-tighter uppercase">Alakara <span className="text-kenya-red">HQ</span></span>
            <span className="block text-[10px] text-kenya-green font-bold tracking-[0.3em] uppercase opacity-70">Central Command</span>
          </div>
        </Link>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#151619] py-10 px-6 shadow-2xl sm:rounded-2xl sm:px-10 border border-white/10 relative overflow-hidden"
        >
          {/* Decorative corner accents */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-kenya-green/30" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-kenya-green/30" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-kenya-green/30" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-kenya-green/30" />

          <div className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-kenya-red animate-pulse" />
              <h2 className="text-sm font-bold text-white uppercase tracking-widest">System Authentication</h2>
            </div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Secure node access required for administrative privileges.</p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-kenya-red/10 border border-kenya-red/30 text-kenya-red px-4 py-3 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-3"
              >
                <ShieldAlert className="w-4 h-4" />
                Error: {error}
              </motion.div>
            )}

            <div>
              <label htmlFor="email" className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                Operator Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-kenya-green" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder-gray-700 focus:outline-none focus:ring-1 focus:ring-kenya-green focus:border-kenya-green transition-all text-sm"
                  placeholder="admin@boraschool.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                Access Key
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-kenya-green" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder-gray-700 focus:outline-none focus:ring-1 focus:ring-kenya-green focus:border-kenya-green transition-all text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-3 w-3 bg-black border-white/10 text-kenya-green focus:ring-kenya-green rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-[10px] text-gray-500 uppercase tracking-wider">
                  Persistent Session
                </label>
              </div>

              <div className="text-[10px]">
                <a href="#" className="font-bold text-kenya-red hover:text-red-400 uppercase tracking-wider">
                  Reset Key
                </a>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-kenya-green hover:bg-green-600 text-black font-bold uppercase tracking-[0.2em] text-xs py-4 rounded-lg shadow-[0_0_20px_rgba(0,255,0,0.1)]"
              disabled={isLoading}
            >
              {isLoading ? 'Decrypting...' : 'Initialize Session'}
            </Button>

            <div className="mt-6 pt-6 border-t border-white/5">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Demo Environment</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-kenya-green animate-pulse" />
                </div>
                <p className="text-[10px] text-gray-500 mb-4 leading-relaxed uppercase tracking-wider">
                  Use the button below to access the dashboard with pre-configured administrative privileges.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('admin@boraschool.com');
                    setPassword('admin123');
                    // We need to wait a tick for state to update or just pass values directly
                    setTimeout(() => {
                      const form = document.querySelector('form');
                      if (form) form.requestSubmit();
                    }, 100);
                  }}
                  className="w-full py-2 bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold uppercase tracking-widest rounded transition-all border border-white/10"
                >
                  Quick Demo Access
                </button>
              </div>
            </div>
          </form>

          <div className="mt-10 pt-6 border-t border-white/5">
            <Link
              to="/"
              className="flex items-center justify-center gap-2 text-[10px] font-bold text-gray-600 hover:text-kenya-green uppercase tracking-widest transition-colors"
            >
              <ArrowLeft className="w-3 h-3" />
              Return to Surface
            </Link>
          </div>
        </motion.div>
        
        <div className="mt-8 flex justify-between items-center px-2">
          <p className="text-[9px] text-gray-600 uppercase tracking-[0.3em]">
            &copy; 2026 Alakara KE HQ
          </p>
          <div className="flex gap-4">
            <div className="w-1 h-1 rounded-full bg-kenya-green opacity-50" />
            <div className="w-1 h-1 rounded-full bg-kenya-red opacity-50" />
            <div className="w-1 h-1 rounded-full bg-white opacity-50" />
          </div>
        </div>
      </div>
    </div>
  );
};
