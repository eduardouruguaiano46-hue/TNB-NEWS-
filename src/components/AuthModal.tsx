import React, { useState, useEffect } from 'react';
import { 
  X, Mail, Lock, User as UserIcon, Sparkles, AlertCircle, CheckCircle, 
  RefreshCw, Trash2, Calendar, Star, BookOpen, Shield, LogOut, ArrowRight, AtSign
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail, 
  signOut, 
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser,
  deleteUser
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  deleteDoc,
  writeBatch
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAlert: (text: string, type: 'success' | 'error') => void;
}

const ZODIAC_SIGNS = [
  { name: 'Áries', symbol: '♈', date: '21 Mar - 19 Abr' },
  { name: 'Touro', symbol: '♉', date: '20 Abr - 20 Mai' },
  { name: 'Gêmeos', symbol: '♊', date: '21 Mai - 20 Jun' },
  { name: 'Câncer', symbol: '♋', date: '21 Jun - 22 Jul' },
  { name: 'Leão', symbol: '♌', date: '23 Jul - 22 Ago' },
  { name: 'Virgem', symbol: '♍', date: '23 Ago - 22 Set' },
  { name: 'Libra', symbol: '♎', date: '23 Set - 22 Out' },
  { name: 'Escorpião', symbol: '♏', date: '23 Out - 21 Nov' },
  { name: 'Sagitário', symbol: '♐', date: '22 Nov - 21 Dez' },
  { name: 'Capricórnio', symbol: '♑', date: '22 Dez - 19 Jan' },
  { name: 'Aquário', symbol: '♒', date: '20 Jan - 18 Fev' },
  { name: 'Peixes', symbol: '♓', date: '19 Fev - 20 Mar' }
];

export default function AuthModal({ isOpen, onClose, onAlert }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot_password' | 'profile'>('login');
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [profileData, setProfileData] = useState<{
    uid: string;
    fullName: string;
    username: string;
    email: string;
    createdAt: string;
    zodiacSign: string;
    bio: string;
  } | null>(null);

  // Form Inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [zodiacSign, setZodiacSign] = useState('Áries');
  const [bio, setBio] = useState('');

  // UI States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        setLoading(true);
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const data = userDoc.data();
            setProfileData({
              uid: user.uid,
              fullName: data.fullName || user.displayName || '',
              username: data.username || '',
              email: data.email || user.email || '',
              createdAt: data.createdAt || '',
              zodiacSign: data.zodiacSign || 'Áries',
              bio: data.bio || ''
            });
            // Prefill inputs
            setFullName(data.fullName || user.displayName || '');
            setUsername(data.username || '');
            setZodiacSign(data.zodiacSign || 'Áries');
            setBio(data.bio || '');
          } else {
            // Document doesn't exist, create fallback
            const defaultProfile = {
              uid: user.uid,
              fullName: user.displayName || 'Membro do TNB',
              username: user.uid.substring(0, 10),
              email: user.email || '',
              createdAt: new Date().toISOString(),
              zodiacSign: 'Áries',
              bio: '',
              credits: 200,
              purchasedCampaigns: [],
              purchasedReports: []
            };
            await setDoc(userDocRef, defaultProfile);
            setProfileData(defaultProfile);
            setFullName(defaultProfile.fullName);
            setUsername(defaultProfile.username);
            setZodiacSign(defaultProfile.zodiacSign);
            setBio(defaultProfile.bio);
          }
          setMode('profile');
        } catch (err: any) {
          console.error("Erro ao carregar perfil:", err);
        } finally {
          setLoading(false);
        }
      } else {
        setProfileData(null);
        if (mode === 'profile') {
          setMode('login');
        }
      }
    });

    return () => unsubscribe();
  }, [mode]);

  if (!isOpen) return null;

  const validateUsername = (usernameStr: string) => {
    // lowercase alphanumeric and underscore only, min 3 characters
    const regex = /^[a-z0-9_]{3,15}$/;
    return regex.test(usernameStr);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onAlert('Acesso concedido! Bem-vindo de volta.', 'success');
      onClose();
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError('E-mail ou senha incorretos. Verifique suas credenciais.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Muitas tentativas malsucedidas. Tente novamente mais tarde.');
      } else {
        setError('Erro ao realizar o login. Verifique sua conexão e tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password || !fullName || !username) {
      setError('Todos os campos são obrigatórios para realizar o cadastro.');
      return;
    }

    if (password.length < 8) {
      setError('A senha deve conter no mínimo 8 caracteres por segurança.');
      return;
    }

    const cleanUsername = username.trim().toLowerCase().replace(/^@/, '');
    if (!validateUsername(cleanUsername)) {
      setError('Nome de usuário inválido. Use apenas letras minúsculas, números ou sublinhados (_) (entre 3 e 15 caracteres).');
      return;
    }

    setLoading(true);

    try {
      // 1. Check if username is already taken in firestore
      const usernameDocRef = doc(db, 'usernames', cleanUsername);
      const usernameDoc = await getDoc(usernameDocRef);

      if (usernameDoc.exists()) {
        setError('Este nome de usuário já está sendo utilizado por outro membro.');
        setLoading(false);
        return;
      }

      // 2. Create the Auth account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 3. Update auth display name
      await updateProfile(user, { displayName: fullName });

      // 4. Save username and profile documents using a batch write to ensure atomic security
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
        credits: 200,
        purchasedCampaigns: [],
        purchasedReports: []
      };

      batch.set(userDocRef, newProfile);
      batch.set(usernameDocRef, { uid: user.uid, email: email.trim().toLowerCase() });

      await batch.commit();

      onAlert('Sua conta foi criada com absoluto sucesso!', 'success');
      onClose();
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Este endereço de e-mail já está cadastrado em nosso portal.');
      } else if (err.code === 'auth/invalid-email') {
        setError('O formato do e-mail inserido é inválido.');
      } else {
        setError('Ocorreu um erro ao criar a conta. Tente novamente mais tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Informe seu e-mail cadastrado para redefinir a senha.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
      onAlert('Link de recuperação enviado com sucesso para o seu e-mail.', 'success');
      setMode('login');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found') {
        setError('Nenhuma conta foi localizada com o e-mail informado.');
      } else {
        setError('Erro ao enviar link de recuperação. Verifique o e-mail e tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !profileData) return;

    if (!fullName.trim()) {
      setError('O Nome Completo não pode ficar em branco.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Update display name in Auth
      await updateProfile(currentUser, { displayName: fullName.trim() });

      // Update in firestore document
      const userDocRef = doc(db, 'users', currentUser.uid);
      await setDoc(userDocRef, {
        ...profileData,
        fullName: fullName.trim(),
        zodiacSign: zodiacSign,
        bio: bio.trim()
      }, { merge: true });

      // Update local state
      setProfileData(prev => prev ? {
        ...prev,
        fullName: fullName.trim(),
        zodiacSign,
        bio: bio.trim()
      } : null);

      onAlert('Perfil atualizado com sucesso!', 'success');
    } catch (err: any) {
      console.error("Erro ao atualizar perfil:", err);
      setError('Erro ao salvar as alterações do seu perfil.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onAlert('Sessão encerrada com sucesso.', 'success');
      onClose();
    } catch (err) {
      console.error("Erro ao fazer logout:", err);
    }
  };

  const handleDeleteAccount = async () => {
    if (!currentUser || !profileData) return;

    setLoading(true);
    setError(null);

    try {
      const uid = currentUser.uid;
      const usernameValue = profileData.username;

      // 1. Delete Firestore user profile
      await deleteDoc(doc(db, 'users', uid));

      // 2. Delete Firestore username reservation
      if (usernameValue) {
        await deleteDoc(doc(db, 'usernames', usernameValue));
      }

      // 3. Delete Auth account
      await deleteUser(currentUser);

      onAlert('Sua conta foi excluída permanentemente de nossos sistemas.', 'success');
      setShowDeleteConfirm(false);
      onClose();
    } catch (err: any) {
      console.error("Erro ao excluir conta:", err);
      if (err.code === 'auth/requires-recent-login') {
        setError('Por motivos de segurança cibernética, você precisa sair e realizar login novamente antes de excluir sua conta de forma permanente.');
      } else {
        setError('Ocorreu um erro ao excluir sua conta. Verifique sua conexão.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 max-w-lg w-full overflow-hidden"
      >
        {/* HEADER SECTION */}
        <div className="bg-red-700 dark:bg-red-800 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-200 animate-pulse" />
            <h3 className="font-serif font-black text-sm md:text-base tracking-wider uppercase">
              {mode === 'login' && 'Autenticação de Membro'}
              {mode === 'register' && 'Criar Nova Conta'}
              {mode === 'forgot_password' && 'Recuperar Senha'}
              {mode === 'profile' && 'Minha Conta TNB NEWS'}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="text-white hover:text-red-200 bg-red-800/50 p-1.5 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-800 dark:text-red-300 rounded-xl text-xs flex items-start gap-2 animate-bounce">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* MODE: LOGIN */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-serif leading-relaxed">
                Bem-vindo ao portal de jornalismo esotérico. Insira suas credenciais abaixo para acessar recursos exclusivos de comunidade e salvar seu perfil.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-mono text-neutral-500 uppercase tracking-widest font-bold mb-1">Endereço de E-mail</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                    <input 
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu.email@exemplo.com"
                      className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950 focus:outline-none focus:ring-1 focus:ring-red-500 dark:focus:ring-red-600 focus:border-red-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-[10px] font-mono text-neutral-500 uppercase tracking-widest font-bold">Sua Senha</label>
                    <button 
                      type="button" 
                      onClick={() => setMode('forgot_password')}
                      className="text-[10px] font-mono font-bold text-red-600 dark:text-red-400 hover:underline"
                    >
                      Esqueci minha senha
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                    <input 
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950 focus:outline-none focus:ring-1 focus:ring-red-500 dark:focus:ring-red-600 focus:border-red-500"
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-red-700 hover:bg-red-800 text-white py-3 rounded-xl font-mono text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Acessar Conta'}
              </button>

              <div className="text-center pt-3 border-t border-neutral-100 dark:border-neutral-850">
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Ainda não faz parte da nossa comunidade?{' '}
                  <button 
                    type="button"
                    onClick={() => { setMode('register'); setError(null); }}
                    className="text-red-600 dark:text-red-400 font-bold hover:underline"
                  >
                    Cadastre-se Gratuitamente
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* MODE: REGISTER */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-serif leading-relaxed">
                Crie seu perfil exclusivo permanentemente integrado no TNB NEWS. Sua conta é pessoal, intransferível e seus dados são totalmente protegidos.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono text-neutral-500 uppercase tracking-widest font-bold mb-1">Nome Completo</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                    <input 
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Fulano de Tal"
                      className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950 focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-neutral-500 uppercase tracking-widest font-bold mb-1">Nome de Usuário (Único)</label>
                  <div className="relative">
                    <AtSign className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                    <input 
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="nome_usuario"
                      className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950 focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                  <p className="text-[9px] text-neutral-400 mt-1 font-mono">Letras, números e _ (sem espaços)</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-mono text-neutral-500 uppercase tracking-widest font-bold mb-1">Endereço de E-mail</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                    <input 
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu.email@exemplo.com"
                      className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950 focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-neutral-500 uppercase tracking-widest font-bold mb-1">Sua Senha (mín. 6 caracteres)</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                    <input 
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo de 6 dígitos"
                      className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950 focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono text-neutral-500 uppercase tracking-widest font-bold mb-1">Signo Solar</label>
                    <select
                      value={zodiacSign}
                      onChange={(e) => setZodiacSign(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950 focus:outline-none text-neutral-700 dark:text-neutral-250"
                    >
                      {ZODIAC_SIGNS.map(sig => (
                        <option key={sig.name} value={sig.name}>{sig.symbol} {sig.name} ({sig.date})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-neutral-500 uppercase tracking-widest font-bold mb-1">Biografia Esotérica (Opcional)</label>
                    <input 
                      type="text"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Sou cartomante, entusiasta, etc..."
                      className="w-full px-3 py-2.5 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950 focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-red-700 hover:bg-red-800 text-white py-3 rounded-xl font-mono text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Confirmar Cadastro'}
              </button>

              <div className="text-center pt-3 border-t border-neutral-100 dark:border-neutral-850">
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Já possui conta cadastrada?{' '}
                  <button 
                    type="button"
                    onClick={() => { setMode('login'); setError(null); }}
                    className="text-red-600 dark:text-red-400 font-bold hover:underline"
                  >
                    Realizar Login
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* MODE: FORGOT PASSWORD */}
          {mode === 'forgot_password' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-serif leading-relaxed">
                Insira o seu e-mail de cadastro para receber um link oficial de redefinição de senha diretamente na sua caixa de entrada.
              </p>

              <div>
                <label className="block text-[10px] font-mono text-neutral-500 uppercase tracking-widest font-bold mb-1">Endereço de E-mail Cadastrado</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                  <input 
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu.email@exemplo.com"
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button 
                  type="button"
                  onClick={() => { setMode('login'); setError(null); }}
                  className="w-1/2 bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-750 text-neutral-700 dark:text-neutral-200 py-3 rounded-xl font-mono text-xs font-bold tracking-wider uppercase transition-colors"
                >
                  Voltar ao Login
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-1/2 bg-red-700 hover:bg-red-800 text-white py-3 rounded-xl font-mono text-xs font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Enviar E-mail'}
                </button>
              </div>
            </form>
          )}

          {/* MODE: PROFILE */}
          {mode === 'profile' && profileData && (
            <div className="space-y-6">
              {/* Account Details Header */}
              <div className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-150 dark:border-neutral-850 p-4 rounded-2xl flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-red-150 dark:bg-red-950/80 text-red-700 dark:text-red-400 font-serif text-3xl font-black flex items-center justify-center shrink-0 shadow-inner">
                  {profileData.fullName.charAt(0).toUpperCase()}
                </div>
                <div className="text-center sm:text-left space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1.5">
                    <h4 className="font-serif font-black text-base text-neutral-950 dark:text-white uppercase">
                      {profileData.fullName}
                    </h4>
                    <span className="inline-block text-[8px] bg-red-750 text-white font-mono px-2 py-0.5 rounded-full uppercase font-bold tracking-widest w-max mx-auto sm:mx-0">
                      Membro Ativo
                    </span>
                  </div>
                  <p className="text-xs font-mono text-neutral-400 flex items-center justify-center sm:justify-start gap-1">
                    <AtSign className="w-3.5 h-3.5" /> {profileData.username}
                  </p>
                  <p className="text-[10px] font-mono text-neutral-500">
                    UID: <span className="font-semibold select-all bg-neutral-200 dark:bg-neutral-800 px-1 py-0.5 rounded">{profileData.uid}</span>
                  </p>
                </div>
              </div>

              {/* Edit Profile Form */}
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="border-t border-neutral-100 dark:border-neutral-850 pt-4">
                  <h5 className="font-serif font-bold text-xs uppercase text-neutral-800 dark:text-neutral-300 mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-red-600 dark:text-red-400" />
                    Informações e Cadastro
                  </h5>

                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-[10px] font-mono text-neutral-500 uppercase tracking-widest font-bold mb-1">Nome Completo</label>
                      <input 
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-1 focus:ring-red-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-mono text-neutral-500 uppercase tracking-widest font-bold mb-1">Signo Solar</label>
                        <select
                          value={zodiacSign}
                          onChange={(e) => setZodiacSign(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-250"
                        >
                          {ZODIAC_SIGNS.map(sig => (
                            <option key={sig.name} value={sig.name}>{sig.symbol} {sig.name} ({sig.date})</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-neutral-500 uppercase tracking-widest font-bold mb-1">E-mail de Login (Imutável)</label>
                        <input 
                          type="text"
                          disabled
                          value={profileData.email}
                          className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 text-neutral-400 cursor-not-allowed font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-neutral-500 uppercase tracking-widest font-bold mb-1">Biografia ou Interesses Esotéricos</label>
                      <textarea 
                        rows={2}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Escreva algo sobre você ou seus conhecimentos esotéricos..."
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-1 focus:ring-red-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit button for edit */}
                <div className="flex gap-2.5 pt-2">
                  <button 
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-red-700 hover:bg-red-800 text-white py-3 rounded-xl font-mono text-xs font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50"
                  >
                    {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Salvar Alterações'}
                  </button>
                  <button 
                    type="button"
                    onClick={handleLogout}
                    className="bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-750 text-neutral-700 dark:text-neutral-200 px-5 rounded-xl font-mono text-xs font-bold transition-all border border-neutral-200 dark:border-neutral-750 flex items-center gap-1.5"
                    title="Encerrar Sessão"
                  >
                    <LogOut className="w-4 h-4 text-red-500" /> Sair
                  </button>
                </div>
              </form>

              {/* Delete account panel */}
              <div className="border-t border-red-200 dark:border-red-950/80 pt-4 mt-6">
                <div className="bg-red-50/50 dark:bg-red-950/20 border border-red-150 dark:border-red-950/40 p-4 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2">
                    <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                    <h6 className="font-serif font-black text-xs uppercase text-red-850 dark:text-red-400">
                      Exclusão Permanente de Conta
                    </h6>
                  </div>
                  <p className="text-[11px] text-red-850 dark:text-red-300 font-serif leading-relaxed">
                    Você pode solicitar a exclusão definitiva do seu cadastro. Esta ação removerá permanentemente seu perfil esotérico, seu nome de usuário único de nossos bancos de dados e encerrará sua conta de autenticação de forma irreversível.
                  </p>

                  {!showDeleteConfirm ? (
                    <button 
                      type="button"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="bg-red-100 dark:bg-red-950 hover:bg-red-200 dark:hover:bg-red-900/60 text-red-700 dark:text-red-300 font-mono text-[10px] font-bold py-2 px-3 rounded-lg border border-red-200 dark:border-red-900 transition-colors uppercase tracking-wider"
                    >
                      Solicitar Exclusão Permanente
                    </button>
                  ) : (
                    <div className="bg-white dark:bg-neutral-900 p-3 rounded-xl border border-red-300 dark:border-red-900 space-y-2.5">
                      <p className="text-[11px] font-bold text-red-700">⚠️ Tem absoluta certeza de que deseja prosseguir com a exclusão? Isso é definitivo e irreversível!</p>
                      <div className="flex gap-2">
                        <button 
                          onClick={handleDeleteAccount}
                          disabled={loading}
                          className="bg-red-700 hover:bg-red-850 text-white font-mono text-[10px] font-bold py-1.5 px-3 rounded uppercase transition-colors"
                        >
                          {loading ? 'Processando...' : 'Sim, Excluir Definitivamente'}
                        </button>
                        <button 
                          onClick={() => setShowDeleteConfirm(false)}
                          className="bg-neutral-200 dark:bg-neutral-850 text-neutral-700 dark:text-neutral-250 font-mono text-[10px] font-bold py-1.5 px-3 rounded uppercase transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER BAR */}
        <div className="bg-neutral-50 dark:bg-neutral-950 px-6 py-3.5 border-t border-neutral-100 dark:border-neutral-850 flex items-center justify-between text-[10px] font-mono text-neutral-400">
          <span className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-neutral-500" />
            Conexão Criptografada HTTPS
          </span>
          <span>
            TNB Security Engine v1.0
          </span>
        </div>
      </motion.div>
    </div>
  );
}
