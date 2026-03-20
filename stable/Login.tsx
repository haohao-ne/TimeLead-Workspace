import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Eye, EyeOff, Mail, Lock, UserCircle } from 'lucide-react';

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State hiện/ẩn mật khẩu
  
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
        await supabase.from('categories').insert([{ type: 'team', name: fullName }]);
        alert("Đăng ký thành công! Kiểm tra email để xác nhận (nếu có) nhé.");
        setIsSignUp(false);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert(error.message);
    }
    setLoading(false);
  };

  // Tính năng Quên mật khẩu
  const handleForgotPassword = async () => {
    if (!email) {
      alert("Hạo ơi, hãy nhập Email vào ô trên trước khi bấm Quên mật khẩu nhé!");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin, // Link quay về trang web sau khi đổi pass
    });
    if (error) alert(error.message);
    else alert("Link đặt lại mật khẩu đã được gửi vào Email của Hạo rồi đó!");
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-6 font-sans">
      <div className="w-full max-w-md space-y-8 bg-slate-800 p-10 rounded-[40px] shadow-2xl border border-slate-700 relative overflow-hidden">
        
        <h2 className="text-3xl font-black text-center bg-gradient-to-r from-indigo-400 to-cyan-400 text-transparent bg-clip-text uppercase tracking-tight">
          {isSignUp ? 'TẠO TÀI KHOẢN' : 'CREATIVE WORKSPACE'}
        </h2>
        
        <div className="space-y-5">
          {/* Ô nhập tên khi Đăng ký */}
          {isSignUp && (
            <div className="relative">
              <UserCircle className="absolute left-4 top-4 w-5 h-5 text-slate-500" />
              <input 
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-700 border border-slate-600 text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all" 
                placeholder="Tên hiển thị của Hạo" 
                onChange={e => setFullName(e.target.value)} 
              />
            </div>
          )}

          {/* Ô nhập Email */}
          <div className="relative">
            <Mail className="absolute left-4 top-4 w-5 h-5 text-slate-500" />
            <input 
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-700 border border-slate-600 text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all" 
              type="email" 
              placeholder="Email" 
              onChange={e => setEmail(e.target.value)} 
            />
          </div>

          {/* Ô nhập Mật khẩu có Icon Con mắt */}
          <div className="relative">
            <Lock className="absolute left-4 top-4 w-5 h-5 text-slate-500" />
            <input 
              className="w-full pl-12 pr-12 py-4 rounded-2xl bg-slate-700 border border-slate-600 text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all" 
              type={showPassword ? "text" : "password"} 
              placeholder="Mật khẩu" 
              onChange={e => setPassword(e.target.value)} 
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4 text-slate-500 hover:text-indigo-400 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          
          {/* Nút Đăng nhập/Đăng ký */}
          <button 
            onClick={handleAuth} 
            className="w-full bg-indigo-600 p-4 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-900/40 disabled:opacity-50" 
            disabled={loading}
          >
            {loading ? 'Đang xử lý...' : (isSignUp ? 'HOÀN TẤT ĐĂNG KÝ' : 'ĐĂNG NHẬP')}
          </button>
          
          {/* Link Quên mật khẩu và Chuyển chế độ */}
          <div className="flex flex-col gap-3 items-center pt-2">
            {!isSignUp && (
              <button 
                onClick={handleForgotPassword}
                className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-widest"
              >
                Quên mật khẩu?
              </button>
            )}
            <button 
              onClick={() => setIsSignUp(!isSignUp)} 
              className="text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-widest transition-colors"
            >
              {isSignUp ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Đăng ký ngay'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}