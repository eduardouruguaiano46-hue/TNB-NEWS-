import React, { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  sendPasswordResetEmail 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  writeBatch 
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { 
  Lock, 
  User, 
  Mail, 
  Calendar, 
  AlertCircle,
  Eye,
  EyeOff,
  UserCheck,
  Sparkles
} from 'lucide-react';

interface LoginScreenProps {
  onAlert: (text: string, type: 'success' | 'info') => void;
}

export default function LoginScreen({ onAlert }: LoginScreenProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot_password'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Login Form States
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register Form States
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [zodiacSign, setZodiacSign] = useState('Áries');
  const [bio, setBio] = useState('');

  // Field Errors for Highlighting
  const [fieldErrors, setFieldErrors] = useState<{
    fullName?: string;
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    loginIdentifier?: string;
    loginPassword?: string;
  }>({});

  // Real-time username verification
  const handleUsernameChange = (val: string) => {
    setUsername(val);
    const clean = val.trim().toLowerCase().replace(/^@/, '');
    if (clean.length > 0) {
      if (clean.length < 3 || clean.length > 15) {
        setFieldErrors(prev => ({ ...prev, username: 'O identificador deve conter entre 3 e 15 caracteres.' }));
      } else if (!/^[a-z0-9_]+$/.test(clean)) {
        setFieldErrors(prev => ({ ...prev, username: 'Use apenas letras minúsculas, números e sublinhado (_).' }));
      } else {
        setFieldErrors(prev => {
          const next = { ...prev };
          delete next.username;
          return next;
        });
      }
    } else {
      setFieldErrors(prev => {
        const next = { ...prev };
        delete next.username;
        return next;
      });
    }
  };

  // Real-time email validation
  const handleEmailChange = (val: string) => {
    setEmail(val);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (val.length > 0) {
      if (!emailRegex.test(val.trim())) {
        setFieldErrors(prev => ({ ...prev, email: 'O e-mail informado é inválido.' }));
      } else {
        setFieldErrors(prev => {
          const next = { ...prev };
          delete next.email;
          return next;
        });
      }
    } else {
      setFieldErrors(prev => {
        const next = { ...prev };
        delete next.email;
        return next;
      });
    }
  };

  // Real-time password validation
  const handlePasswordChange = (val: string) => {
    setPassword(val);
    if (val.length > 0) {
      if (val.length < 8) {
        setFieldErrors(prev => ({ ...prev, password: 'A senha deve ter no mínimo 8 caracteres.' }));
      } else {
        setFieldErrors(prev => {
          const next = { ...prev };
          delete next.password;
          return next;
        });
      }
      
      if (confirmPassword && val !== confirmPassword) {
        setFieldErrors(prev => ({ ...prev, confirmPassword: 'As senhas não coincidem.' }));
      } else if (confirmPassword && val === confirmPassword) {
        setFieldErrors(prev => {
          const next = { ...prev };
          delete next.confirmPassword;
          return next;
        });
      }
    } else {
      setFieldErrors(prev => {
        const next = { ...prev };
        delete next.password;
        return next;
      });
    }
  };

  // Real-time confirm password validation
  const handleConfirmPasswordChange = (val: string) => {
    setConfirmPassword(val);
    if (val.length > 0) {
      if (val !== password) {
        setFieldErrors(prev => ({ ...prev, confirmPassword: 'As senhas não coincidem.' }));
      } else {
        setFieldErrors(prev => {
          const next = { ...prev };
          delete next.confirmPassword;
          return next;
        });
      }
    } else {
      setFieldErrors(prev => {
        const next = { ...prev };
        delete next.confirmPassword;
        return next;
      });
    }
  };

  // Login handler supporting both Username or Email
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setError(null);

    if (!loginIdentifier.trim() || !loginPassword) {
      setError('Preencha todos os campos obrigatórios.');
      const newErrors: any = {};
      if (!loginIdentifier.trim()) newErrors.loginIdentifier = 'Preencha todos os campos obrigatórios.';
      if (!loginPassword) newErrors.loginPassword = 'Preencha todos os campos obrigatórios.';
      setFieldErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      let emailToAuth = loginIdentifier.trim();
      if (!emailToAuth.includes('@')) {
        // Resolve email from username collection
        const cleanUsername = emailToAuth.toLowerCase().replace(/^@/, '');
        const usernameDocRef = doc(db, 'usernames', cleanUsername);
        const usernameSnap = await getDoc(usernameDocRef);
        if (usernameSnap.exists()) {
          emailToAuth = usernameSnap.data().email;
        } else {
          setError('Identificador não encontrado.');
          setFieldErrors({ loginIdentifier: 'Este identificador de usuário não foi localizado.' });
          setLoading(false);
          return;
        }
      }

      // Record login session flag to show WhatsApp Community Popup
      sessionStorage.setItem('tnb_just_logged_in', 'true');
      await signInWithEmailAndPassword(auth, emailToAuth, loginPassword);
      onAlert('Portal desbloqueado! Seja muito bem-vindo de volta.', 'success');
    } catch (err: any) {
      console.error(err);
      const isNetworkError = 
        err.code === 'auth/network-request-failed' || 
        err.code === 'unavailable' || 
        err.message?.toLowerCase().includes('network') || 
        err.message?.toLowerCase().includes('offline') || 
        err.message?.toLowerCase().includes('timeout');

      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError('E-mail ou senha incorretos. Verifique seus dados e tente novamente.');
        setFieldErrors({
          loginIdentifier: 'Verifique seu identificador ou e-mail.',
          loginPassword: 'Verifique sua senha.'
        });
      } else if (err.code === 'auth/too-many-requests') {
        setError('Acesso bloqueado temporariamente por excesso de tentativas.');
      } else if (isNetworkError) {
        setError('Não foi possível conectar ao servidor do TNB News. Verifique sua conexão com a internet ou tente novamente.');
      } else {
        setError('Erro de login: Verifique seus dados e tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Register Handler with all custom criteria validations
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setError(null);

    if (!email.trim() || !password || !fullName.trim() || !username.trim() || !confirmPassword) {
      setError('Preencha todos os campos obrigatórios.');
      const newErrors: any = {};
      if (!fullName.trim()) newErrors.fullName = 'Preencha todos os campos obrigatórios.';
      if (!username.trim()) newErrors.username = 'Preencha todos os campos obrigatórios.';
      if (!email.trim()) newErrors.email = 'Preencha todos os campos obrigatórios.';
      if (!password) newErrors.password = 'Preencha todos os campos obrigatórios.';
      if (!confirmPassword) newErrors.confirmPassword = 'Preencha todos os campos obrigatórios.';
      setFieldErrors(newErrors);
      return;
    }

    const cleanUsername = username.trim().toLowerCase().replace(/^@/, '');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let hasValidationError = false;
    const newErrors: any = {};

    if (!emailRegex.test(email.trim())) {
      newErrors.email = 'O e-mail informado é inválido.';
      hasValidationError = true;
    }

    if (cleanUsername.length < 3 || cleanUsername.length > 15) {
      newErrors.username = 'O identificador deve conter entre 3 e 15 caracteres.';
      hasValidationError = true;
    } else if (!/^[a-z0-9_]+$/.test(cleanUsername)) {
      newErrors.username = 'Use apenas letras minúsculas, números e sublinhado (_).';
      hasValidationError = true;
    }

    if (password.length < 8) {
      newErrors.password = 'A senha deve ter no mínimo 8 caracteres.';
      hasValidationError = true;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem.';
      hasValidationError = true;
    }

    if (hasValidationError) {
      setFieldErrors(newErrors);
      const firstError = Object.values(newErrors)[0] as string;
      setError(firstError);
      return;
    }

    setLoading(true);

    try {
      // Check unique username
      const usernameDocRef = doc(db, 'usernames', cleanUsername);
      const usernameDoc = await getDoc(usernameDocRef);

      if (usernameDoc.exists()) {
        setError('Nome de usuário já está em uso.');
        setFieldErrors({ username: 'Nome de usuário já está em uso.' });
        setLoading(false);
        return;
      }

      // Record login session flag to show WhatsApp Community Popup
      sessionStorage.setItem('tnb_just_logged_in', 'true');
      
      // Register Firebase Account
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      // Update Profile displayName
      await updateProfile(user, { displayName: fullName.trim() });

      // Save user profile with 200 initial credits
      const batch = writeBatch(db);
      const userDocRef = doc(db, 'users', user.uid);
      
      const newProfile = {
        uid: user.uid,
        fullName: fullName.trim(),
        username: cleanUsername,
        email: email.trim().toLowerCase(),
        createdAt: new Date().toISOString(),
        zodiacSign: zodiacSign,
        bio: bio.trim(),
        credits: 200, // Starting credits
        purchasedCampaigns: [],
        purchasedReports: []
      };

      batch.set(userDocRef, newProfile);
      batch.set(usernameDocRef, { uid: user.uid, email: email.trim().toLowerCase() });

      await batch.commit();

      onAlert('Sua conta esotérica foi criada com 200 créditos gratuitos!', 'success');
    } catch (err: any) {
      console.error(err);
      const isNetworkError = 
        err.code === 'auth/network-request-failed' || 
        err.code === 'unavailable' || 
        err.message?.toLowerCase().includes('network') || 
        err.message?.toLowerCase().includes('offline') || 
        err.message?.toLowerCase().includes('timeout');

      if (err.code === 'auth/email-already-in-use') {
        setError('O e-mail já está cadastrado.');
        setFieldErrors({ email: 'O e-mail já está cadastrado.' });
      } else if (err.code === 'auth/invalid-email') {
        setError('O e-mail informado é inválido.');
        setFieldErrors({ email: 'O e-mail informado é inválido.' });
      } else if (isNetworkError) {
        setError('Falha de conexão com o servidor. Verifique sua internet ou tente novamente.');
      } else {
        setError('Erro ao criar conta. Tente novamente mais tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Password reset logic
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setError(null);

    if (!email.trim()) {
      setError('Preencha todos os campos obrigatórios.');
      setFieldErrors({ email: 'Informe seu e-mail cadastrado.' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('O e-mail informado é inválido.');
      setFieldErrors({ email: 'O e-mail informado é inválido.' });
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      onAlert('Enviamos o e-mail de redefinição de senha! Verifique sua caixa de entrada.', 'info');
      setMode('login');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found') {
        setError('Nenhum usuário foi localizado com este e-mail.');
        setFieldErrors({ email: 'E-mail não localizado.' });
      } else if (err.code === 'auth/network-request-failed') {
        setError('Falha de conexão. Tente novamente.');
      } else {
        setError('Erro ao enviar e-mail de redefinição. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const switchToRegister = () => {
    setFieldErrors({});
    setError(null);
    setMode('register');
  };

  const switchToLogin = () => {
    setFieldErrors({});
    setError(null);
    setMode('login');
  };

  const switchToForgotPassword = () => {
    setFieldErrors({});
    setError(null);
    setMode('forgot_password');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-neutral-100 dark:bg-neutral-950 transition-colors w-full">
      <div className="max-w-md w-full bg-white dark:bg-neutral-900 rounded-3xl border-2 border-neutral-200 dark:border-neutral-800 p-8 shadow-2xl relative overflow-hidden transition-all duration-300">
        
        {/* Core Newspaper brand logo (Always displayed) */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl md:text-5xl font-black tracking-tighter text-red-700 dark:text-red-500 uppercase select-none">
            TNB NEWS
          </h1>
          <p className="font-serif italic text-xs text-neutral-500 tracking-wide mt-1">
            Tarot no Bolso News
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-950 dark:text-red-200 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-5" id="form-login-screen">
            <div>
              <label className="block text-[11px] font-mono font-bold uppercase text-neutral-700 dark:text-neutral-300 mb-1.5">
                Identificador (E-mail ou Username)
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input 
                  type="text" 
                  required
                  placeholder="seu@email.com ou username"
                  value={loginIdentifier}
                  onChange={(e) => {
                    setLoginIdentifier(e.target.value);
                    if (fieldErrors.loginIdentifier) {
                      setFieldErrors(prev => {
                        const next = { ...prev };
                        delete next.loginIdentifier;
                        return next;
                      });
                    }
                  }}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                    fieldErrors.loginIdentifier ? 'border-red-500 bg-red-50/5' : 'border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800'
                  } text-sm focus:outline-none focus:border-red-500 font-mono`}
                  id="input-login-identifier"
                />
              </div>
              {fieldErrors.loginIdentifier && (
                <p className="text-red-500 text-[10px] mt-1 font-mono">{fieldErrors.loginIdentifier}</p>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[11px] font-mono font-bold uppercase text-neutral-700 dark:text-neutral-300">
                  Senha
                </label>
                <button 
                  type="button"
                  onClick={switchToForgotPassword}
                  className="text-[11px] font-mono font-bold text-red-600 dark:text-red-400 hover:underline cursor-pointer"
                  id="link-forgot-password"
                >
                  Esqueci minha senha
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input 
                  type={showLoginPassword ? 'text' : 'password'} 
                  required
                  placeholder="Digite sua senha"
                  value={loginPassword}
                  onChange={(e) => {
                    setLoginPassword(e.target.value);
                    if (fieldErrors.loginPassword) {
                      setFieldErrors(prev => {
                        const next = { ...prev };
                        delete next.loginPassword;
                        return next;
                      });
                    }
                  }}
                  className={`w-full pl-10 pr-10 py-3 rounded-xl border ${
                    fieldErrors.loginPassword ? 'border-red-500 bg-red-50/5' : 'border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800'
                  } text-sm focus:outline-none focus:border-red-500 font-mono`}
                  id="input-login-password"
                />
                <button 
                  type="button" 
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
                  id="btn-toggle-login-password"
                  title={showLoginPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.loginPassword && (
                <p className="text-red-500 text-[10px] mt-1 font-mono">{fieldErrors.loginPassword}</p>
              )}
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 rounded-xl bg-red-700 hover:bg-red-800 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all duration-300 hover:scale-[1.01] flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50 shadow-md"
              id="btn-login-submit"
            >
              {loading ? 'Validando Credenciais...' : 'Entrar'}
            </button>

            <div className="text-center mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800">
              <span className="text-xs text-neutral-600 dark:text-neutral-400 font-mono">Não tem uma conta? </span>
              <button 
                type="button"
                onClick={switchToRegister}
                className="text-xs font-mono font-bold text-red-600 dark:text-red-400 hover:underline cursor-pointer"
                id="btn-switch-to-register"
              >
                Criar conta
              </button>
            </div>
          </form>
        )}

        {/* REGISTER FORM */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4" id="form-register-screen">
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-neutral-700 dark:text-neutral-300 mb-1.5">
                Nome Completo *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input 
                  type="text" 
                  required
                  placeholder="Seu Nome Completo"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (fieldErrors.fullName) {
                      setFieldErrors(prev => {
                        const next = { ...prev };
                        delete next.fullName;
                        return next;
                      });
                    }
                  }}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                    fieldErrors.fullName ? 'border-red-500 bg-red-50/5' : 'border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800'
                  } text-sm focus:outline-none focus:border-red-500 font-mono`}
                  id="input-register-fullname"
                />
              </div>
              {fieldErrors.fullName && (
                <p className="text-red-500 text-[10px] mt-1 font-mono">{fieldErrors.fullName}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase text-neutral-700 dark:text-neutral-300 mb-1.5">
                Identificador (username exclusivo) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-neutral-400 font-mono font-bold">@</span>
                <input 
                  type="text" 
                  required
                  placeholder="ex: tarot_lover"
                  value={username}
                  onChange={(e) => handleUsernameChange(e.target.value)}
                  className={`w-full pl-9 pr-4 py-3 rounded-xl border ${
                    fieldErrors.username ? 'border-red-500 bg-red-50/5' : 'border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800'
                  } text-sm focus:outline-none focus:border-red-500 font-mono`}
                  id="input-register-username"
                />
              </div>
              {fieldErrors.username ? (
                <p className="text-red-500 text-[10px] mt-1 font-mono">{fieldErrors.username}</p>
              ) : (
                <p className="text-[10px] text-neutral-500 mt-1 font-mono">Letras minúsculas, números e sublinhados (3 a 15 caracteres).</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase text-neutral-700 dark:text-neutral-300 mb-1.5">
                E-mail *
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input 
                  type="email" 
                  required
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                    fieldErrors.email ? 'border-red-500 bg-red-50/5' : 'border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800'
                  } text-sm focus:outline-none focus:border-red-500 font-mono`}
                  id="input-register-email"
                />
              </div>
              {fieldErrors.email && (
                <p className="text-red-500 text-[10px] mt-1 font-mono">{fieldErrors.email}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Signo *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 pointer-events-none" />
                  <select 
                    value={zodiacSign}
                    onChange={(e) => setZodiacSign(e.target.value)}
                    className="w-full pl-8 pr-2 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm focus:outline-none focus:border-red-500 font-mono cursor-pointer"
                    id="select-register-zodiac"
                  >
                    {['Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem', 'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes'].map(sign => (
                      <option key={sign} value={sign}>{sign}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Senha *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input 
                    type={showRegisterPassword ? 'text' : 'password'} 
                    required
                    placeholder="Mínimo 8 chars"
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    className={`w-full pl-10 pr-10 py-3 rounded-xl border ${
                      fieldErrors.password ? 'border-red-500 bg-red-50/5' : 'border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800'
                    } text-sm focus:outline-none focus:border-red-500 font-mono`}
                    id="input-register-password"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
                    title={showRegisterPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    id="btn-toggle-register-password"
                  >
                    {showRegisterPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="text-red-500 text-[10px] mt-1 font-mono">{fieldErrors.password}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase text-neutral-700 dark:text-neutral-300 mb-1.5">
                Confirmar Senha *
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input 
                  type={showConfirmPassword ? 'text' : 'password'} 
                  required
                  placeholder="Repita a senha criada"
                  value={confirmPassword}
                  onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                  className={`w-full pl-10 pr-10 py-3 rounded-xl border ${
                    fieldErrors.confirmPassword ? 'border-red-500 bg-red-50/5' : 'border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800'
                  } text-sm focus:outline-none focus:border-red-500 font-mono`}
                  id="input-register-confirmpassword"
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
                  title={showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  id="btn-toggle-confirm-password"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.confirmPassword && (
                <p className="text-red-500 text-[10px] mt-1 font-mono">{fieldErrors.confirmPassword}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase text-neutral-700 dark:text-neutral-300 mb-1.5">
                Biografia / Intuição (Opcional)
              </label>
              <textarea 
                placeholder="Fale um pouco sobre sua conexão espiritual..."
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm focus:outline-none focus:border-red-500 font-mono resize-none"
                id="textarea-register-bio"
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all duration-300 hover:scale-[1.01] flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50 shadow-md"
              id="btn-register-submit"
            >
              {loading ? 'Sincronizando com as Estrelas...' : 'Confirmar Cadastro'}
            </button>

            <div className="text-center mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800">
              <span className="text-xs text-neutral-600 dark:text-neutral-400 font-mono">Já possui acesso? </span>
              <button 
                type="button"
                onClick={switchToLogin}
                className="text-xs font-mono font-bold text-red-600 dark:text-red-400 hover:underline cursor-pointer"
                id="btn-switch-to-login"
              >
                Fazer Login
              </button>
            </div>
          </form>
        )}

        {/* FORGOT PASSWORD FORM */}
        {mode === 'forgot_password' && (
          <form onSubmit={handleForgotPassword} className="space-y-5" id="form-forgot-password-screen">
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-serif leading-relaxed text-center mb-2">
              Insira o seu e-mail cadastrado para enviarmos as instruções de redefinição de senha.
            </p>
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-neutral-700 dark:text-neutral-300 mb-1.5">
                Seu E-mail Cadastrado
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input 
                  type="email" 
                  required
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) {
                      setFieldErrors(prev => {
                        const next = { ...prev };
                        delete next.email;
                        return next;
                      });
                    }
                  }}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                    fieldErrors.email ? 'border-red-500 bg-red-50/5' : 'border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800'
                  } text-sm focus:outline-none focus:border-red-500 font-mono`}
                  id="input-forgot-email"
                />
              </div>
              {fieldErrors.email && (
                <p className="text-red-500 text-[10px] mt-1 font-mono">{fieldErrors.email}</p>
              )}
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all duration-300 hover:scale-[1.01] flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50 shadow-md"
              id="btn-forgot-submit"
            >
              {loading ? 'Enviando Link...' : 'Enviar Link de Recuperação'}
            </button>

            <div className="text-center mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800">
              <button 
                type="button"
                onClick={switchToLogin}
                className="text-xs font-mono font-bold text-red-600 dark:text-red-400 hover:underline cursor-pointer"
                id="btn-switch-from-forgot"
              >
                Voltar para o Login
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
