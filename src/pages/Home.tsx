import wellnessHero from '@/assests/wellness-hero1.jpg';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Heart, 
  Brain, 
  Gamepad2, 
  TrendingUp, 
  MessageCircle, 
  Shield, 
  Users, 
  Menu,
  X,
  Sparkles,
  Target,
  Award,
  Clock,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Leaf
} from 'lucide-react';


const Home = () => {
  const navigate = useNavigate();
const handleLogin = () => navigate('/login');
const handleSignup = () => navigate('/signup');

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Insights',
      description: 'Our intelligent AI analyzes your emotions and provides personalized wellness recommendations.',
      color: 'bg-primary text-primary-foreground'
    },
    {
      icon: TrendingUp,
      title: 'Mood Tracking',
      description: 'Track your emotional patterns over time with beautiful charts and actionable insights.',
      color: 'bg-secondary text-secondary-foreground'
    },
    {
      icon: Gamepad2,
      title: 'Mindful Games',
      description: 'Engage in therapeutic games designed to reduce stress and improve mental clarity.',
      color: 'bg-accent text-accent-foreground'
    },
    {
      icon: MessageCircle,
      title: 'AI Chat Support',
      description: 'Real-time emotional support through our compassionate AI wellness companion.',
      color: 'bg-accent text-accent-foreground'
    },
    {
      icon: Shield,
      title: 'Private & Secure',
      description: 'Your emotional data is encrypted and never shared. Your wellness journey stays yours.',
      color: 'bg-primary text-primary-foreground'
    },
    {
      icon: Award,
      title: 'Daily Affirmations',
      description: 'Start each day with personalized affirmations tailored to your emotional needs.',
      color: 'bg-secondary text-secondary-foreground'
    }
  ];

  const stats = [
    { value: '50K+', label: 'Active Users', icon: Users },
    { value: '95%', label: 'Feel Better', icon: Heart },
    { value: '1M+', label: 'Moods Tracked', icon: TrendingUp },
    { value: '24/7', label: 'AI Support', icon: Clock }
  ];

  const scrollToSection = useCallback((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
  {/* Aesthetic layered gradient mesh - 2025 trend [web:21] */}
  <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/10 via-teal-800/5 to-cyan-900/15" />
  
  {/* Subtle glowing waves */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(6,78,59,0.3),transparent_50%)]" />
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.25),transparent_50%)]" />
  
  {/* Flowing shimmer lines */}
  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent animate-pulse" style={{ animationDelay: '0s' }} />
  <div className="absolute bottom-0 right-0 w-3/4 h-px bg-gradient-to-l from-transparent via-teal-400/40 to-cyan-400/40 animate-pulse" style={{ animationDelay: '2s' }} />
  
  {/* Geometric soft shapes */}
  <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
  <div className="absolute bottom-1/3 right-1/5 w-48 h-24 bg-cyan-500/15 rounded-[50%] blur-xl rotate-12 animate-pulse" style={{ animationDelay: '3s' }} />
</div>


      {/* Navbar */}
      <nav className="sticky top-0 left-0 right-0 z-50 backdrop-blur-lg bg-transparent border-b border-border/50 supports-[backdrop-filter:blur()]:bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3" onClick={() => scrollToSection('hero')}>
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition-transform">
                <Leaf className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">MindfulMe</span>
            </div>

            {/* Desktop Navigation */}
            <div className=" hidden md:flex items-center gap-8">
              {[
                { label: 'Home', id: 'hero' },
                { label: 'About', id: 'about' },
                { label: 'Features', id: 'features' },
                { label: 'Contact', id: 'contact' }
              ].map(({ label, id }) => (
                <button 
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className="text-muted-foreground hover:text-foreground transition-all duration-200 font-medium hover:scale-105"
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={handleLogin}
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 hover:scale-105 text-primary-foreground rounded-xl px-8 h-11 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
              >
                Login
              </Button>
              <Button 
                onClick={handleSignup}
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 hover:scale-105 text-primary-foreground rounded-xl px-8 h-11 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
              >
                Create Account
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl">
            <div className="px-4 py-6 space-y-4">
              {[
                { label: 'Home', id: 'hero' },
                { label: 'About Us', id: 'about' },
                { label: 'Features', id: 'features' }
              ].map(({ label, id }) => (
                <button 
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className="block w-full text-left text-muted-foreground hover:text-foreground py-3 px-2 rounded-lg hover:bg-muted transition-all font-medium"
                >
                  {label}
                </button>
              ))}
              <div className="pt-4 space-y-3 border-t border-border/50">
                <Button 
                  variant="outline" 
                  onClick={handleLogin}
                  className="w-full rounded-xl h-12"
                >
                  Login
                </Button>
                <Button 
                  onClick={handleSignup}
                  className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-xl h-12 font-semibold shadow-lg"
                >
                  Create Account
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex py-8 items-center justify-center pt-2 pb-30 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-10">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-24 items-center">
            {/* Left Content */}
            <div className="space-y-3 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-full px-6 py-3 text-sm font-medium text-primary max-w-max mx-auto lg:mx-0">
                <Sparkles className="w-4 h-4" />
                AI-Powered Emotional Wellness
              </div>
              
              <h1 className="text-4xl  font-black leading-tight text-foreground">
                Transform Your
                <span className=" text-6xl block bg-gradient-to-r from-primary via-purple-600 to-secondary bg-clip-text text-transparent">
                  Mental Wellness
                </span>
              </h1>
              
              <p className="text-xl md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Experience the future of emotional health with AI-powered mood tracking, 
                mindful games, and personalized support that truly understands you.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Button 
                  size="sm"
                  onClick={handleSignup}
                  className="bg-gradient-to-r from-primary via-purple-600 to-secondary hover:opacity-90 text-primary-foreground rounded-2xl px-10 py-6 text-lg font-bold shadow-2xl hover:shadow-3xl hover:scale-[1.02] transition-all duration-300 group"
                >
                  Start Your Journey Free
                  <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  size="sm"
                  variant="outline"
                  onClick={() => scrollToSection('features')}
                  className="rounded-2xl px-10 py-6 text-lg border-2 border-primary/30 hover:bg-primary/10 backdrop-blur-sm hover:scale-[1.02] transition-all duration-300 font-semibold"
                >
                  Explore Features
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-5">
                {stats.map((stat, index) => (
                  <div 
                    key={index} 
                    className="group text-center px-2 py-2 rounded-2xl bg-gradient-to-br from-background/50 to-muted backdrop-blur-lg border border-border/30 shadow-xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                  >
                    <stat.icon className="w-6 h-6 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
                    <span className="text-2xl lg:text-2xl font-black text-foreground block leading-tight">{stat.value}</span>
                    <span className="text-muted-foreground text-sm font-medium mt-1">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-br from-primary/10 via-purple-500/5 to-secondary/10 rounded-2xl blur-xl animate-pulse" />
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border/20 bg-gradient-to-br from-background/50 to-card/40 backdrop-blur-xl">
                <img 
                  src={wellnessHero} 
                  alt="AI-powered wellness journey with mood tracking and mindful games"
                  className="w-full h-[450px] object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-12 right-12">
                  <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-3 border border-white/80 shadow-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-xl">
                        <Heart className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-bold  text-xl text-foreground">Your Wellness Journey</p>
                        <p className="text-sm text-muted-foreground font-medium">Starts with a single breath</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-10 px-3 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-green-50/30 to-blue-50/20" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8 lg:order-2">
              <div className="inline-flex items-center gap-3 bg-emerald-100/80 backdrop-blur-sm border border-emerald/30 rounded-2xl px-6 py-3 text-sm font-semibold text-emerald-800 max-w-max">
                <Target className="w-4 h-4" />
                Our Mission
              </div>
              
              <h2 className="text-4xl font-black leading-tight">
                Empowering Your
                <span className=" text-6xl block bg-gradient-to-r from-emerald-600 via-green-600 to-blue-600 bg-clip-text text-transparent">
                  Emotional Journey
                </span>
              </h2>
              
              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p>
                  At MindfulMe, we believe everyone deserves access to quality mental health support. Our platform combines cutting-edge AI technology with evidence-based wellness practices.
                </p>
                <p>
                  Privacy-first approach ensures your emotional data stays secure while our AI adapts to your unique needs 24/7.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 lg:gap-4 pt-6">
  {[
    'Evidence-based therapeutic techniques',
    'AI that learns and adapts to your needs',
    'Privacy-first approach to your data',
    'Available 24/7, whenever you need support'
  ].map((item, index) => (
    <div key={index} className="group flex items-start gap-3 p-4 rounded-xl bg-white/70 backdrop-blur-sm border border-border/20 hover:bg-white hover:shadow-md transition-all duration-300 hover:-translate-x-1">
      <div className="w-7 h-7 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-105 transition-all">
        <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </div>
      <span className="font-medium text-sm leading-relaxed text-foreground/90">{item}</span>
    </div>
  ))}
</div>


              <Button 
                onClick={handleSignup}
                size="lg"
                className="bg-gradient-to-r from-emerald-500 via-green-600 to-blue-600 hover:opacity-90 text-white rounded-2xl px-12 py-8 text-xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300"
              >
                Join Our Community
              </Button>
            </div>

            <div className="lg:order-1 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald/10 via-green/5 to-blue/10 rounded-3xl blur-xl" />
              <Card className="relative bg-white/30 backdrop-blur-2xl border-0 rounded-3xl shadow-2xl overflow-hidden">
                <CardContent className="p-8">
                  <div className="grid  grid-cols-2 gap-6">
                    {[
                      { value: '5+', label: 'Years of Research', color: 'from-emerald-500 to-green-600' },
                      { value: '20+', label: 'Mental Health Experts', color: 'from-blue-500 to-indigo-600' },
                      { value: '150+', label: 'Countries Reached', color: 'from-purple-500 to-violet-600' },
                      { value: '4.9', label: 'User Rating', color: 'from-orange-500 to-red-500' }
                    ].map(({ value, label, color }, index) => (
                      <div key={index} className="group text-center p-5 rounded-3xl bg-gradient-to-br from-white/70 to-white/100 backdrop-blur-xl border border-white/50 hover:shadow-xl transition-all hover:scale-105">
                        <div className={`text-5xl font-black bg-gradient-to-r ${color} bg-clip-text text-transparent mb-4`}>
                          {value}
                        </div>
                        <div className="text-lg font-semibold text-foreground/90">{label}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-20">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100/80 to-pink-100/80 backdrop-blur-sm rounded-full px-4 py-2 text-lg font-bold max-w-max mx-auto">
              <Sparkles className="w-5 h-5 relative -top-0.5" />
              Powerful Features
            </div>
            <h2 className="text-4xl l font-black leading-tight text-foreground">
              Everything You Need for
              <span className="block  text-6xl bg-gradient-to-r from-rose-500 via-pink-600 to-orange-500 bg-clip-text text-transparent">
                Complete Wellness
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Comprehensive tools designed by mental health professionals to support every aspect of your emotional journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="group relative bg-white/60 backdrop-blur-xl border-0 rounded-3xl p-2 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:-translate-y-4 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardContent className="relative p-8 space-y-6 pt-10">
                  <div className={`absolute top-2 left-1/2 -translate-x-1/2 w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-300`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground text-center group-hover:text-primary transition-colors">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-lg text-center opacity-90">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/70 via-purple-50/50 to-pink-50/70" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="space-y-8">
            <h2 className="text-5xl  font-black leading-tight text-foreground">
              Ready to Begin Your
              <span className="block text-7xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Wellness Journey?
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Join thousands of people who have already transformed their mental health with MindfulMe.
            </p>
            <div className="flex flex-col lg:flex-row items-center justify-center gap-6">
              <Button 
                size="lg"
                onClick={handleSignup}
                className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-90 text-white rounded-2xl px-12 py-8 text-xl font-bold shadow-2xl hover:shadow-3xl hover:scale-[1.02] transition-all duration-300 group"
              >
                Get Started Free
                <ChevronRight className="w-5 h-5 ml-4 group-hover:translate-x-2 transition-transform" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={handleLogin}
                className="rounded-2xl px-12 py-6 text-xl border-2 border-white/30 hover:bg-white/80 backdrop-blur-xl font-bold hover:scale-[1.02] transition-all duration-300 h-[72px]"
              >
                I Have an Account
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-t from-card to-muted/50 border-t border-border/30 py-10 relative overflow-hidden" id="contact">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/3 via-transparent to-secondary/3" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
            {/* Brand */}
            <div className="space-y-6 col-span-2 lg:col-span-1">
              <div className="flex items-center gap-6">
                <div className="w-20 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-xl">
                  <Leaf className="w-7 h-7 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-2xl font-black bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">MindfulMe</h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-xs">Your companion on the journey to emotional wellness and mental clarity.</p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold text-foreground mb-6">Quick Links</h4>
              <div className="space-y-3">
                {[
                  { label: 'About Us', onClick: () => scrollToSection('about') },
                  { label: 'Features', onClick: () => scrollToSection('features') },
                  { label: 'Get Started', onClick: handleSignup }
                ].map(({ label, onClick }, index) => (
                  <button 
                    key={index}
                    onClick={onClick}
                    className="block text-muted-foreground hover:text-primary text-base font-medium transition-all duration-200 hover:translate-x-2"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-lg font-bold text-foreground mb-6">Support</h4>
              <div className="space-y-3 ">
                <a href="#" className="block hover:text-primary transition-colors">Help Center</a>
                <a href="#" className="block hover:text-primary transition-colors">Privacy Policy</a>
                <a href="#" className="block hover:text-primary transition-colors">Terms of Service</a>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-bold text-foreground mb-6">Contact</h4>
              <div className="space-y-4">
                <a href="mailto:hello@mindfulme.com" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group">
                  <Mail className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                  hello@mindfulme.com
                </a>
                <a href="tel:+15551234567" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group">
                  <Phone className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                  +1 (555) 123-4567
                </a>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>India</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border/30 mt-10 pt-6 text-center">
            <p className="text-muted-foreground text-lg">
              © {new Date().getFullYear()} MindfulMe. All rights reserved. Made with 💚 for your wellness journey.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
