import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  Image as ImageIcon, 
  Upload, 
  LogOut, 
  Settings as SettingsIcon,
  LayoutDashboard,
  User,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Eye,
  EyeOff
} from 'lucide-react';

const compressImage = (base64Str: string, maxWidth = 1200, quality = 0.7): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (maxWidth / width) * height;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
  });
};

export const Admin = () => {
  const [isLocalAuth, setIsLocalAuth] = useState(() => localStorage.getItem('hc_admin_auth') === 'true');
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'projects' | 'settings'>('projects');
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!isLocalAuth) return;

    const fetchData = async () => {
      try {
        const [projectsRes, settingsRes] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/settings')
        ]);
        
        if (projectsRes.ok) setProjects(await projectsRes.json());
        if (settingsRes.ok) setSettings(await settingsRes.json());
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [isLocalAuth]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (loginData.username === 'haciel.site' && loginData.password === 'Casihan29!') {
      setIsLocalAuth(true);
      localStorage.setItem('hc_admin_auth', 'true');
      showStatus('success', 'Welcome back, Haciel!');
    } else {
      showStatus('error', 'Invalid username or password');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    setIsLocalAuth(false);
    localStorage.removeItem('hc_admin_auth');
  };

  const showStatus = (type: 'success' | 'error', msg: string) => {
    setStatus({ type, msg });
    setTimeout(() => setStatus(null), 3000);
  };

  const handleBack = () => {
    window.location.href = '/';
  };

  if (!isLocalAuth) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6 relative">
        <button 
          onClick={handleBack}
          className="absolute top-8 left-8 flex items-center gap-2 text-white/40 hover:text-white transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Site</span>
        </button>

        <AnimatePresence mode="wait">
          {status && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`fixed top-8 right-8 z-[100] px-6 py-4 rounded-2xl flex items-center gap-3 shadow-2xl ${status.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}
            >
              {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              <span className="font-medium">{status.msg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-12 max-w-md w-full"
        >
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
              <User className="text-white/20" size={40} />
            </div>
            <h1 className="text-3xl font-display font-bold mb-2 tracking-tight">Admin Portal</h1>
            <p className="text-white/40 text-sm">Enter credentials to manage your site</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">Username</label>
              <input 
                type="text"
                required
                value={loginData.username}
                onChange={e => setLoginData({...loginData, username: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-white/30 outline-none transition-all text-sm"
                placeholder="haciel.site"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  required
                  value={loginData.password}
                  onChange={e => setLoginData({...loginData, password: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-white/30 outline-none transition-all text-sm pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-white text-black font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all mt-4 shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Signing in...</span>
                </>
              ) : (
                'Sign In'
              )}
            </button>

            <div className="pt-6 text-center">
              <button 
                type="button"
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                className="text-[10px] uppercase tracking-widest text-white/20 hover:text-white/40 transition-colors"
              >
                Trouble signing in? Reset Portal
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 p-8 flex flex-col">
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 text-white/20 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-medium">Back to Site</span>
        </button>

        <div className="text-2xl font-display font-bold tracking-tighter mb-12">
          HC<span className="text-white/50">.</span> Admin
        </div>

        <nav className="flex-1 space-y-2">
          <button 
            onClick={() => setActiveTab('projects')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'projects' ? 'bg-white text-black font-bold' : 'text-white/40 hover:bg-white/5'}`}
          >
            <LayoutDashboard size={18} /> Projects
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'settings' ? 'bg-white text-black font-bold' : 'text-white/40 hover:bg-white/5'}`}
          >
            <SettingsIcon size={18} /> Settings
          </button>
        </nav>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-white/40 hover:text-red-400 transition-all mt-auto"
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-y-auto">
        <AnimatePresence mode="wait">
          {status && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`fixed top-8 right-8 z-[100] px-6 py-4 rounded-2xl flex items-center gap-3 shadow-2xl ${status.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}
            >
              {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              <span className="font-medium">{status.msg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {activeTab === 'projects' ? (
          <ProjectsTab projects={projects} showStatus={showStatus} />
        ) : (
          <SettingsTab settings={settings} showStatus={showStatus} />
        )}
      </main>
    </div>
  );
};

const ProjectsTab = ({ projects, showStatus }: { projects: any[], showStatus: any }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showStatus('success', 'Project deleted successfully');
      } else {
        showStatus('error', 'Failed to delete project');
      }
    } catch (err) {
      showStatus('error', 'Failed to delete project');
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h2 className="text-4xl font-display font-bold mb-2">Projects</h2>
          <p className="text-white/40">Manage your portfolio items</p>
        </div>
        <button 
          onClick={() => { setEditingProject(null); setIsModalOpen(true); }}
          className="px-6 py-3 bg-white text-black font-bold rounded-full flex items-center gap-2 hover:scale-105 transition-transform"
        >
          <Plus size={18} /> Add Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map(project => (
          <div key={project.id} className="glass-card p-6 flex gap-6 items-center group">
            <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
              <img src={project.imageUrl} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-lg font-bold truncate mb-1">{project.title}</h4>
              <p className="text-white/40 text-sm truncate">{project.category}</p>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => { setEditingProject(project); setIsModalOpen(true); }}
                className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white"
              >
                <Edit3 size={18} />
              </button>
              <button 
                onClick={() => handleDelete(project.id)}
                className="p-2 hover:bg-red-500/10 rounded-lg text-white/60 hover:text-red-400"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <ProjectFormModal 
            project={editingProject} 
            onClose={() => setIsModalOpen(false)} 
            showStatus={showStatus}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const ProjectFormModal = ({ project, onClose, showStatus }: { project: any, onClose: () => void, showStatus: any }) => {
  const [formData, setFormData] = useState({
    title: project?.title || '',
    category: project?.category || '',
    description: project?.description || '',
    details: project?.details || '',
    imageUrl: project?.imageUrl || '',
    link: project?.link || '',
    services: project?.services?.join(', ') || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = async () => {
      const compressed = await compressImage(reader.result as string);
      setFormData(prev => ({ ...prev, imageUrl: compressed }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = {
        ...formData,
        services: formData.services.split(',').map(s => s.trim()).filter(s => s)
      };

      const url = project ? `/api/projects/${project.id}` : '/api/projects';
      const method = project ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        showStatus('success', project ? 'Project updated successfully' : 'Project added successfully');
        onClose();
      } else {
        showStatus('error', 'Failed to save project');
      }
    } catch (err) {
      console.error("Submit Error:", err);
      showStatus('error', 'Failed to save project');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-6"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-10 relative"
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-white/40 hover:text-white">
          <X size={24} />
        </button>

        <h3 className="text-3xl font-display font-bold mb-8">{project ? 'Edit Project' : 'Add New Project'}</h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-white/40">Project Title</label>
              <input 
                type="text" 
                required
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-white/30 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-white/40">Category</label>
              <input 
                type="text" 
                required
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-white/30 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-white/40">Image</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="aspect-video bg-white/5 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition-all overflow-hidden relative group"
            >
              {formData.imageUrl ? (
                <>
                  <img src={formData.imageUrl} className="w-full h-full object-cover" alt="" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Upload size={32} />
                  </div>
                </>
              ) : (
                <>
                  <ImageIcon className="text-white/20 mb-4" size={48} />
                  <p className="text-white/40 text-sm">Click to upload or drag and drop</p>
                </>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              className="hidden" 
              accept="image/*" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-white/40">Short Description</label>
            <textarea 
              required
              rows={2}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-white/30 outline-none transition-all resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-white/40">Detailed Info</label>
            <textarea 
              rows={4}
              value={formData.details}
              onChange={e => setFormData({ ...formData, details: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-white/30 outline-none transition-all resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-white/40">Project Link (URL)</label>
            <input 
              type="url" 
              value={formData.link}
              onChange={e => setFormData({ ...formData, link: e.target.value })}
              placeholder="https://example.com"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-white/30 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-white/40">Services (comma separated)</label>
            <input 
              type="text" 
              value={formData.services}
              onChange={e => setFormData({ ...formData, services: e.target.value })}
              placeholder="e.g. Design, Development, Strategy"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-white/30 outline-none transition-all"
            />
          </div>

          <button 
            disabled={isSubmitting}
            className="w-full py-4 bg-white text-black font-bold rounded-full flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {project ? 'Update Project' : 'Add Project'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

const SettingsTab = ({ settings, showStatus }: { settings: any, showStatus: any }) => {
  const [formData, setFormData] = useState({
    name: settings?.name || '',
    email: settings?.email || '',
    phone: settings?.phone || '',
    location: settings?.location || '',
    about: settings?.about || '',
    profilePic: settings?.profilePic || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (settings) setFormData(settings);
  }, [settings]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const compressed = await compressImage(reader.result as string, 800, 0.6);
      setFormData(prev => ({ ...prev, profilePic: compressed }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        showStatus('success', 'Settings updated successfully');
      } else {
        showStatus('error', 'Failed to update settings');
      }
    } catch (err) {
      showStatus('error', 'Failed to update settings');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-12">
        <h2 className="text-4xl font-display font-bold mb-2">Settings</h2>
        <p className="text-white/40">Update your personal information</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="flex items-center gap-8 mb-12">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-32 h-32 rounded-full bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-all overflow-hidden relative group"
          >
            {formData.profilePic ? (
              <>
                <img src={formData.profilePic} className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Upload size={24} />
                </div>
              </>
            ) : (
              <User className="text-white/20" size={40} />
            )}
          </div>
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
          <div>
            <h4 className="text-xl font-bold mb-1">Profile Picture</h4>
            <p className="text-white/40 text-sm">Click the circle to upload a new photo</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-white/40">Full Name</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-white/30 outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-white/40">Email</label>
            <input 
              type="email" 
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-white/30 outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-white/40">Phone</label>
            <input 
              type="text" 
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-white/30 outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-white/40">Location</label>
            <input 
              type="text" 
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-white/30 outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-white/40">About Me</label>
          <textarea 
            rows={6}
            value={formData.about}
            onChange={e => setFormData({ ...formData, about: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-white/30 outline-none transition-all resize-none"
          />
        </div>

        <button 
          disabled={isSubmitting}
          className="w-full py-4 bg-white text-black font-bold rounded-full flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          Save Settings
        </button>
      </form>
    </div>
  );
};
