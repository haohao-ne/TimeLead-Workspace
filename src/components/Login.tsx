import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Eye, EyeOff, Mail, Lock, UserCircle, LayoutGrid } from 'lucide-react';

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleAuth = async () => {
    if (!email || !password || (isSignUp && !fullName)) {
      alert("Hạo ơi, vui lòng điền đầy đủ thông tin nhé!");
      return;
    }
    
    setLoading(true);
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        alert(error.message);
      } else {
        // GIỮ NGUYÊN LOGIC QUAN TRỌNG: Thêm nhân sự vào team
        await supabase.from('categories').insert([{ type: 'team', name: fullName }]);
        alert("Đăng ký thành công! Hạo kiểm tra email để xác nhận nhé.");
        setIsSignUp(false);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert(error.message);
    }
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!email) {
      alert("Hạo ơi, hãy nhập Email trước nhé!");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
    if (error) alert(error.message);
    else alert("Link đặt lại mật khẩu đã được gửi vào Email của Hạo!");
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FBFBFD] text-[#1D1D1F] p-6 font-sans overflow-hidden">
      {/* Hiệu ứng mờ ảo phía sau (Apple Glassmorphism Decor) */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-50/50 rounded-full blur-[120px] -z-10" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-50/40 rounded-full blur-[120px] -z-10" />

      {/* Container chính: Bo góc 10px (ws-outer) */}
      <div className="w-full max-w-[400px] space-y-10 bg-white/80 backdrop-blur-2xl p-10 rounded-[10px] border border-white shadow-[0_20px_50px_rgba(0,0,0,0.04)] relative">
        
        <div className="text-center space-y-3">
          {/* Logo Sharp: Bo góc 4px (ws-input) */}
          <div className="w-12 h-12 bg-neutral-900 rounded-[4px] flex items-center justify-center mx-auto mb-6 shadow-xl">
             <LayoutGrid className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-[24px] font-medium tracking-tight text-neutral-900 uppercase">
            {isSignUp ? 'Tạo tài khoản' : 'Creative Workspace'}
          </h2>
          <p className="text-[13px] font-light text-neutral-400">Hệ thống quản trị Multimedia chuyên nghiệp</p>
        </div>
        
        <div className="space-y-4">
          {isSignUp && (
            <div className="relative group">
              <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300 group-focus-within:text-indigo-400 transition-colors" />
              <input 
                className="w-full pl-11 pr-4 py-3.5 rounded-[4px] bg-neutral-50/30 border border-neutral-100 text-[14px] font-normal outline-none focus:bg-white focus:border-indigo-300 transition-all placeholder:text-neutral-300" 
                placeholder="Tên hiển thị của Hạo" 
                onChange={e => setFullName(e.target.value)} 
              />
            </div>
          )}

          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300 group-focus-within:text-indigo-400 transition-colors" />
            <input 
              className="w-full pl-11 pr-4 py-3.5 rounded-[4px] bg-neutral-50/30 border border-neutral-100 text-[14px] font-normal outline-none focus:bg-white focus:border-indigo-300 transition-all placeholder:text-neutral-300" 
              type="email" 
              placeholder="Email của Hạo" 
              onChange={e => setEmail(e.target.value)} 
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300 group-focus-within:text-indigo-400 transition-colors" />
            <input 
              className="w-full pl-11 pr-11 py-3.5 rounded-[4px] bg-neutral-50/30 border border-neutral-100 text-[14px] font-normal outline-none focus:bg-white focus:border-indigo-300 transition-all placeholder:text-neutral-300" 
              type={showPassword ? "text" : "password"} 
              placeholder="Mật khẩu" 
              onChange={e => setPassword(e.target.value)} 
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-300 hover:text-indigo-400"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          
          <div className="pt-2">
            <button 
              onClick={handleAuth} 
              className="w-full bg-neutral-900 text-white py-4 rounded-[4px] text-[12px] font-medium tracking-[0.2em] hover:bg-black transition-all active:scale-[0.98] shadow-lg shadow-neutral-200 uppercase" 
              disabled={loading}
            >
              {loading ? 'Đang xử lý...' : (isSignUp ? 'Hoàn tất đăng ký' : 'Đăng nhập ngay')}
            </button>
          </div>
          
          <div className="flex flex-col gap-3 items-center pt-4">
            {!isSignUp && (
              <button 
                onClick={handleForgotPassword}
                className="text-[11px] font-medium text-indigo-500 hover:text-indigo-600 transition-colors uppercase tracking-widest"
              >
                Quên mật khẩu?
              </button>
            )}
            <div className="w-8 h-[1px] bg-neutral-100 my-1" />
            <button 
              onClick={() => setIsSignUp(!isSignUp)} 
              className="text-[11px] font-light text-neutral-400 hover:text-neutral-900 transition-colors uppercase tracking-widest"
            >
              {isSignUp ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Đăng ký'}
            </button>
          </div>
        </div>
      </div>
      
      <p className="mt-12 text-[10px] font-light text-neutral-300 tracking-[0.3em] uppercase">
        Creative Workspace • Designed by Hạo 2026
      </p>
    </div>
  );
}