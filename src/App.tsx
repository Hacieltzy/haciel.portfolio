/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { 
  Palette, 
  Video, 
  Code, 
  TrendingUp, 
  Phone, 
  Mail, 
  MapPin, 
  ArrowRight, 
  ChevronDown,
  Github,
  Instagram,
  Linkedin,
  Send,
  Menu,
  X,
  MessageSquare,
  Bot,
  User,
  Loader2,
  ExternalLink,
  Settings as SettingsIcon
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown';
import { Admin } from './Admin';

// --- Components ---

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([
    { role: 'bot', text: 'Hello! I am **Haciel\'s AI Assistant**. How can I assist you with your creative or technical needs today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            role: "user",
            parts: [{ text: `You are a highly professional AI assistant for Haciel Casihan, a premier freelance digital creative in Metro Manila. 
            
            Haciel's Expertise:
            * **Graphic Design**: Canva, Adobe Photoshop, Branding, Marketing Creatives.
            * **Video Editing**: CapCut, High-engagement Reels, Promotional Content.
            * **Web Development**: React, Next.js, TypeScript, Tailwind CSS.
            * **Digital Marketing**: Facebook Ads Strategy, Content Creation.

            Key Projects:
            * **WOODTEQPH Prime Corporation**: Specialized in Architectural Glass, Aluminum, and Modular Cabinetry.
            * **Halal Mountain Honey**: 100% Organic Pure Honey branding.

            Contact Details:
            * **Email**: hacielcasihan.freelance@gmail.com
            * **Phone**: 09271178232

            Guidelines:
            1. Be **extremely professional**, polite, and helpful.
            2. Use **Markdown formatting** (asterisks for bolding key terms) to make the text readable and structured.
            3. If asked about pricing, suggest a consultation via email or phone.
            4. Keep responses concise but comprehensive.
            
            User Query: ${userMessage}` }]
          }
        ],
      });

      const botText = response.text || "I apologize, but I encountered an error. Please try again or contact Haciel directly.";
      setMessages(prev => [...prev, { role: 'bot', text: botText }]);
    } catch (error) {
      console.error('Chatbot error:', error);
      setMessages(prev => [...prev, { role: 'bot', text: "I'm sorry, I am currently experiencing connectivity issues. Please reach out to Haciel via **email**." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-50 p-4 bg-white text-black rounded-full shadow-2xl flex items-center justify-center"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-8 z-50 w-[380px] max-w-[calc(100vw-2rem)] glass-card overflow-hidden flex flex-col h-[550px] shadow-2xl border border-white/20"
          >
            <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                  <Bot size={20} className="text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">Haciel's AI Concierge</h4>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    <p className="text-[10px] text-white/40 uppercase tracking-widest">Active Now</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-hide">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-white text-black rounded-tr-none shadow-lg' 
                      : 'bg-white/5 text-white/90 border border-white/10 rounded-tl-none'
                  }`}>
                    <div className="prose prose-invert prose-sm max-w-none">
                      <Markdown>{msg.text}</Markdown>
                    </div>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none">
                    <div className="flex gap-1">
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-white/10 bg-white/5">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type your message..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-5 pr-12 text-sm outline-none focus:border-white/30 transition-all placeholder:text-white/20"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 text-white/40 hover:text-white disabled:opacity-30 transition-colors"
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="text-[9px] text-center text-white/20 mt-3 uppercase tracking-tighter">Powered by Gemini AI Technology</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const ProjectModal = ({ project, onClose }: { project: any, onClose: () => void }) => {
  if (!project) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="glass-card w-full max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-hide relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-10 p-2 bg-black/50 rounded-full hover:bg-white hover:text-black transition-all"
        >
          <X size={20} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="h-64 md:h-full">
            <img 
              src={project.image} 
              alt={project.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="p-8 md:p-12">
            <span className="text-xs uppercase tracking-[0.3em] text-white/40 mb-4 block">{project.category}</span>
            <h3 className="text-3xl md:text-4xl font-display font-bold mb-6">{project.title}</h3>
            
            <div className="space-y-6 text-white/60 font-body leading-relaxed">
              <p>{project.details}</p>
              
              {project.services && (
                <div>
                  <h4 className="text-white font-bold mb-3 text-sm uppercase tracking-widest">Services Provided</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.services.map((s: string) => (
                      <span key={s} className="px-3 py-1 bg-white/5 rounded-full text-xs text-white/70 border border-white/10">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {project.contact && (
                <div className="pt-6 border-t border-white/10">
                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <Phone size={14} />
                    <span>{project.contact}</span>
                  </div>
                  {project.address && (
                    <div className="flex items-center gap-2 text-sm text-white/60 mt-2">
                      <MapPin size={14} />
                      <span>{project.address}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-10 flex gap-4">
              {project.link && (
                <a 
                  href={project.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-white/90 transition-all flex items-center gap-2"
                >
                  View Project <ExternalLink size={16} />
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Navbar = ({ onAdminClick, isAdminLoggedIn }: { onAdminClick: () => void, isAdminLoggedIn: boolean }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Skills', href: '#skills' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-black/80 backdrop-blur-md py-4' : 'bg-transparent py-8'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-display font-bold tracking-tighter"
        >
          HC<span className="text-white/50">.</span>
        </motion.div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link, i) => (
            <motion.a
              key={link.name}
              href={link.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              {link.name}
            </motion.a>
          ))}
          
          <div className="flex items-center gap-4">
            <button 
              onClick={onAdminClick}
              className={`p-2 rounded-full transition-all ${isAdminLoggedIn ? 'text-emerald-400 bg-emerald-400/10' : 'text-white/20 hover:text-white hover:bg-white/5'}`}
              title="Admin Settings"
            >
              <SettingsIcon size={20} />
            </button>
            <motion.a
              href="#contact"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-6 py-2 bg-white text-black text-sm font-bold rounded-full hover:bg-white/90 transition-all"
            >
              Let's Talk
            </motion.a>
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <button 
            onClick={onAdminClick}
            className={`p-2 rounded-full ${isAdminLoggedIn ? 'text-emerald-400' : 'text-white/20'}`}
          >
            <SettingsIcon size={20} />
          </button>
          <button className="text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black border-b border-white/10 overflow-hidden"
          >
            <div className="flex flex-col p-6 space-y-4">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-xl font-medium text-white/70"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden px-6">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        style={{ y: y1, opacity }}
        className="relative z-10 text-center max-w-4xl"
      >
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-block text-sm uppercase tracking-[0.4em] text-white/50 mb-6"
        >
          Creative Freelancer
        </motion.span>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl md:text-8xl lg:text-9xl font-display font-bold mb-8 tracking-tighter leading-none"
        >
          Haciel <br />
          <span className="text-white/20 italic">Casihan</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto font-body leading-relaxed mb-12"
        >
          I help businesses build a powerful online presence through modern design, 
          engaging video content, and high-converting websites.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col md:flex-row items-center justify-center gap-6"
        >
          <a href="#portfolio" className="group flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform">
            View My Work <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <a href="#contact" className="px-8 py-4 border border-white/20 rounded-full hover:bg-white/5 transition-colors">
            Get in Touch
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
      >
        <span className="text-[10px] uppercase tracking-widest text-white/30">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent" />
      </motion.div>
    </section>
  );
};

const About = ({ settings }: { settings: any }) => {
  return (
    <section id="about" className="py-32 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="aspect-[4/5] rounded-2xl overflow-hidden glass-card p-2">
            <img 
              src={settings?.profilePic || "https://picsum.photos/seed/haciel/800/1000"} 
              alt={settings?.name || "Haciel Casihan"} 
              className="w-full h-full object-cover rounded-xl grayscale hover:grayscale-0 transition-all duration-700"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-sm uppercase tracking-[0.4em] text-white/50 mb-6">About Me</h2>
          <h3 className="text-4xl md:text-5xl font-display font-bold mb-8 leading-tight">
            Crafting digital experiences in <span className="text-white/40 italic">{settings?.location || "Metro Manila"}</span>
          </h3>
          <div className="space-y-6 text-white/60 font-body text-lg leading-relaxed">
            {settings?.about ? (
              <p>{settings.about}</p>
            ) : (
              <>
                <p>
                  Haciel Casihan is a freelance digital creative specializing in graphic design, 
                  video editing, website development, and digital marketing.
                </p>
                <p>
                  He helps businesses, startups, and individuals create professional visuals, 
                  marketing content, and modern websites that strengthen their online presence.
                </p>
              </>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-8 mt-12">
            <div>
              <h4 className="text-white font-bold mb-2">Location</h4>
              <p className="text-white/50 text-sm">{settings?.location || "Metro Manila, Philippines"}</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-2">Experience</h4>
              <p className="text-white/50 text-sm">Freelance Specialist</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Services = () => {
  const services = [
    {
      title: 'Graphic Design',
      icon: <Palette className="text-white" size={32} />,
      description: 'Visual storytelling through professional branding and marketing materials.',
      items: ['Social Media Graphics', 'Posters', 'Infographics', 'Marketing Creatives', 'Branding Materials']
    },
    {
      title: 'Video Editing',
      icon: <Video className="text-white" size={32} />,
      description: 'Engaging video content optimized for social media and promotions.',
      items: ['Reels Editing', 'Promotional Videos', 'Social Media Video Content']
    },
    {
      title: 'Web Development',
      icon: <Code className="text-white" size={32} />,
      description: 'Modern, high-performance websites built with React, Next.js, and TypeScript.',
      items: [
        'React & Next.js Development',
        'TypeScript & JavaScript (ES6+)',
        'HTML5 & CSS3 (Modern Standards)',
        'Tailwind CSS & Responsive UI',
        'E-commerce & Landing Pages'
      ]
    },
    {
      title: 'Digital Marketing',
      icon: <TrendingUp className="text-white" size={32} />,
      description: 'Strategic ad campaigns and content creation to grow your brand.',
      items: ['Social Media Ads', 'Facebook Ads Campaign', 'Content Creation', 'Marketing Creative Design']
    }
  ];

  return (
    <section id="services" className="py-32 px-6 bg-white/[0.02]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-sm uppercase tracking-[0.4em] text-white/50 mb-6">My Services</h2>
          <h3 className="text-4xl md:text-6xl font-display font-bold">What I <span className="text-white/40 italic">Deliver</span></h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10 }}
              className="glass-card p-8 group hover:bg-white/10 transition-all duration-500"
            >
              <div className="mb-8 p-4 bg-white/5 rounded-2xl inline-block group-hover:scale-110 transition-transform duration-500">
                {service.icon}
              </div>
              <h4 className="text-2xl font-display font-bold mb-4">{service.title}</h4>
              <p className="text-white/40 text-sm mb-6 leading-relaxed">{service.description}</p>
              <ul className="space-y-3">
                {service.items.map((item) => (
                  <li key={item} className="text-white/50 text-sm flex items-center gap-2">
                    <div className="w-1 h-1 bg-white/30 rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Skills = () => {
  const skillGroups = [
    {
      category: 'Graphic Design',
      skills: [
        { name: 'Canva', level: 95 },
        { name: 'Adobe Photoshop', level: 85 },
        { name: 'Typography', level: 90 },
        { name: 'Layout Design', level: 88 }
      ]
    },
    {
      category: 'Video Editing',
      skills: [
        { name: 'CapCut', level: 95 },
        { name: 'Short-form Video', level: 92 },
        { name: 'Reels Editing', level: 94 }
      ]
    },
    {
      category: 'Web Development',
      skills: [
        { name: 'HTML5 / CSS3', level: 95 },
        { name: 'JavaScript (ES6+)', level: 88 },
        { name: 'TypeScript', level: 82 },
        { name: 'React / Next.js', level: 85 },
        { name: 'Tailwind CSS', level: 94 }
      ]
    },
    {
      category: 'Marketing',
      skills: [
        { name: 'Social Media Marketing', level: 88 },
        { name: 'Facebook Ads', level: 85 },
        { name: 'Content Strategy', level: 90 },
        { name: 'Ad Campaign Setup', level: 82 }
      ]
    }
  ];

  return (
    <section id="skills" className="py-32 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <h2 className="text-sm uppercase tracking-[0.4em] text-white/50 mb-6">Expertise</h2>
        <h3 className="text-4xl md:text-6xl font-display font-bold">My <span className="text-white/40 italic">Toolkit</span></h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {skillGroups.map((group, i) => (
          <motion.div
            key={group.category}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-10"
          >
            <h4 className="text-xl font-display font-bold mb-8 border-b border-white/10 pb-4">{group.category}</h4>
            <div className="space-y-8">
              {group.skills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-white/70">{skill.name}</span>
                    <span className="text-sm font-medium text-white/40">{skill.level}%</span>
                  </div>
                  <div className="h-[2px] w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const Portfolio = ({ projects }: { projects: any[] }) => {
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const displayProjects = projects.length > 0 ? projects : [
    {
      title: 'WOODTEQPH Prime Corporation',
      category: 'Web Development & Branding',
      image: 'https://picsum.photos/seed/woodwork/800/600',
      details: 'WOODTEQPH Prime Corporation emerged in response to the growing demand for special setup designs in Architectural Glass and aluminum windows. Originally established as WOODTEQ WOOD PRODUCTS MANUFACTURING in March 2022, the company has evolved to include a broader scope, incorporating specializations in modular cabinetry and countertop installation.',
      services: ['Modular Cabinet', 'Walk In Closet/Wardrobe', 'Aluminum Windows/Doors', 'Composite Panel', 'Glass Railings', 'Shower Enclosure', 'Vanity', 'Wood Floor Planks', 'Furniture Fitouts'],
      contact: '0918-902-1215',
      address: '343 West Service Road, Poblete Compound, Sun Valley, Parañaque City'
    },
    {
      title: 'Halal Mountain Honey',
      category: 'Graphic Design & Marketing',
      image: 'https://picsum.photos/seed/honey/800/600',
      details: '100% Organic Raw & Unfiltered Pure Local Honey. Fresh from the mountains of Mindanao. No additives, no preservatives. Sweetness, naturally.',
      tagline: '100% Raw. Real. Pure.',
      contact: '09544238777'
    }
  ];

  return (
    <section id="portfolio" className="py-32 px-6 bg-white/[0.02]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div>
            <h2 className="text-sm uppercase tracking-[0.4em] text-white/50 mb-6">Portfolio</h2>
            <h3 className="text-4xl md:text-6xl font-display font-bold">Selected <span className="text-white/40 italic">Works</span></h3>
          </div>
          <p className="text-white/50 max-w-md font-body">
            A showcase of my recent projects across design, video, and development.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProjects.map((project, i) => (
            <motion.div
              key={project.id || project.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelectedProject(project)}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer"
            >
              <img 
                src={project.imageUrl || project.image} 
                alt={project.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                <span className="text-xs uppercase tracking-widest text-white/50 mb-2">{project.category}</span>
                <h4 className="text-2xl font-display font-bold text-white">{project.title}</h4>
                <div className="mt-4 w-10 h-[2px] bg-white transform -translate-x-4 group-hover:translate-x-0 transition-transform duration-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal 
            project={{ ...selectedProject, image: selectedProject.imageUrl || selectedProject.image }} 
            onClose={() => setSelectedProject(null)} 
          />
        )}
      </AnimatePresence>
    </section>
  );
};

const Contact = ({ settings }: { settings: any }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [responseMsg, setResponseMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setResponseMsg(data.message || 'Message sent successfully!');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
        setResponseMsg(data.error || 'Something went wrong.');
      }
    } catch (error) {
      setStatus('error');
      setResponseMsg('Failed to connect to the server.');
    }
  };

  return (
    <section id="contact" className="py-32 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-sm uppercase tracking-[0.4em] text-white/50 mb-6">Contact</h2>
          <h3 className="text-4xl md:text-6xl font-display font-bold mb-12">Let's build <br /><span className="text-white/40 italic">something great</span></h3>
          
          <div className="space-y-10">
            <div className="flex items-start gap-6">
              <div className="p-4 bg-white/5 rounded-2xl">
                <Phone className="text-white" size={24} />
              </div>
              <div>
                <h4 className="text-white/50 text-sm uppercase tracking-widest mb-1">Phone</h4>
                <p className="text-xl font-medium">{settings?.phone || "09271178232"}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-6">
              <div className="p-4 bg-white/5 rounded-2xl">
                <Mail className="text-white" size={24} />
              </div>
              <div>
                <h4 className="text-white/50 text-sm uppercase tracking-widest mb-1">Email</h4>
                <p className="text-xl font-medium">{settings?.email || "hacielcasihan.freelance@gmail.com"}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-6">
              <div className="p-4 bg-white/5 rounded-2xl">
                <MapPin className="text-white" size={24} />
              </div>
              <div>
                <h4 className="text-white/50 text-sm uppercase tracking-widest mb-1">Location</h4>
                <p className="text-xl font-medium">{settings?.location || "Metro Manila, Philippines"}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-6 mt-16">
            <a href="#" className="p-4 glass-card hover:bg-white hover:text-black transition-all">
              <Instagram size={20} />
            </a>
            <a href="#" className="p-4 glass-card hover:bg-white hover:text-black transition-all">
              <Linkedin size={20} />
            </a>
            <a href="#" className="p-4 glass-card hover:bg-white hover:text-black transition-all">
              <Github size={20} />
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="glass-card p-10 md:p-12"
        >
          {status === 'success' ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Send className="text-white" size={32} />
              </div>
              <h4 className="text-2xl font-display font-bold mb-4">Message Sent!</h4>
              <p className="text-white/60 mb-8">{responseMsg}</p>
              <button 
                onClick={() => setStatus('idle')}
                className="px-8 py-3 border border-white/20 rounded-full hover:bg-white/5 transition-colors"
              >
                Send Another Message
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-white/40">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe" 
                  className="w-full bg-transparent border-b border-white/10 py-4 focus:border-white outline-none transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-white/40">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com" 
                  className="w-full bg-transparent border-b border-white/10 py-4 focus:border-white outline-none transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-white/40">Message</label>
                <textarea 
                  rows={4} 
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell me about your project..." 
                  className="w-full bg-transparent border-b border-white/10 py-4 focus:border-white outline-none transition-colors resize-none"
                />
              </div>
              
              {status === 'error' && (
                <p className="text-red-400 text-sm">{responseMsg}</p>
              )}

              <button 
                disabled={status === 'loading'}
                className="w-full group flex items-center justify-center gap-3 py-5 bg-white text-black font-bold rounded-full hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? 'Sending...' : 'Send Message'} 
                <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-12 border-t border-white/5 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-xl font-display font-bold tracking-tighter">
          HC<span className="text-white/50">.</span>
        </div>
        <p className="text-white/30 text-sm font-body text-center">
          © 2026 Haciel Casihan. Freelance Creative Designer & Web Developer
        </p>
        <div className="flex gap-8">
          <a href="#" className="text-white/30 hover:text-white transition-colors text-sm">Privacy</a>
          <a href="#" className="text-white/30 hover:text-white transition-colors text-sm">Terms</a>
        </div>
      </div>
    </footer>
  );
};

// --- Main App ---

export default function App() {
  const [projects, setProjects] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(window.location.pathname === '/admin');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    const handleLocationChange = () => {
      setIsAdmin(window.location.pathname === '/admin');
    };
    window.addEventListener('popstate', handleLocationChange);
    
    // Listen for Auth state
    const isLocalAuth = localStorage.getItem('hc_admin_auth') === 'true';
    setIsAdminLoggedIn(isLocalAuth);

    // Fetch Projects
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects');
        if (res.ok) {
          const data = await res.json();
          setProjects(data);
        }
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      }
    };

    // Fetch Settings
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (err) {
        console.error("Failed to fetch settings:", err);
      }
    };

    fetchProjects();
    fetchSettings();

    // Refresh data every 10 seconds (simple polling since we don't have sockets yet)
    const interval = setInterval(() => {
      fetchProjects();
      fetchSettings();
    }, 10000);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      clearInterval(interval);
    };
  }, []);

  const toggleAdmin = () => {
    window.location.href = isAdmin ? '/' : '/admin';
  };

  if (isAdmin) {
    return <Admin />;
  }

  return (
    <div className="min-h-screen selection:bg-white selection:text-black">
      <Navbar onAdminClick={toggleAdmin} isAdminLoggedIn={isAdminLoggedIn} />
      <main>
        <Hero />
        <About settings={settings} />
        <Services />
        <Skills />
        <Portfolio projects={projects} />
        <Contact settings={settings} />
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}
