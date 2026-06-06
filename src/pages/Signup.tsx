import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ChevronRight, User, Mail, Lock, Leaf } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { registerUser } = useAuth();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (!formData.name || !formData.email || !formData.password) {
      toast({
        title: "Please fill in all fields",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const success = await registerUser(formData.email, formData.password, formData.name);
    
    if (success) {
      toast({
        title: `Welcome to MindBloom, ${formData.name}! 🌱`,
        description: "Your wellness journey starts here.",
      });
      navigate('/layout');
    } else {
      toast({
        title: "Registration failed",
        description: "Please try a different email or try again later.",
        variant: "destructive",
      });
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900/20 via-teal-800/10 to-cyan-900/20 flex items-center justify-center p-4 py-12 relative overflow-hidden">
      {/* Aesthetic layered background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(6,78,59,0.3),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.25),transparent_50%)]" />
      
      {/* Flowing shimmer lines */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent animate-pulse" />
      <div className="absolute bottom-0 right-0 w-3/4 h-px bg-gradient-to-l from-transparent via-teal-400/40 to-cyan-400/40 animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="max-w-md w-full space-y-8 relative z-10">
        <Card className="relative bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto shadow-xl border border-white/20">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-black text-gray-900">
              Join MindBloom
            </CardTitle>
            <CardDescription className="text-gray-600 text-lg">
              Create your account to start your wellness journey
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-8 pt-0">
            <form onSubmit={handleSignup} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-900 font-semibold flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-500" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="h-12 rounded-2xl border-2 border-gray-200 bg-white/70 backdrop-blur-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 text-lg px-4 shadow-sm hover:shadow-md"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-900 font-semibold flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-500" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="h-12 rounded-2xl border-2 border-gray-200 bg-white/70 backdrop-blur-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 text-lg px-4 shadow-sm hover:shadow-md"
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-900 font-semibold flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-500" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="h-12 rounded-2xl border-2 border-gray-200 bg-white/70 backdrop-blur-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 text-lg px-4 shadow-sm hover:shadow-md"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-900 font-semibold flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-500" />
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="h-12 rounded-2xl border-2 border-gray-200 bg-white/70 backdrop-blur-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 text-lg px-4 shadow-sm hover:shadow-md"
                  disabled={loading}
                />
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full h-14 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-600 text-white rounded-2xl text-xl font-bold shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                <span className="flex items-center justify-center gap-2 w-full">
                  {loading ? (
                    <>
                      Creating account...
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    </>
                  ) : (
                    <>
                      Create Account
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </Button>

              <div className="text-center pt-4">
                <p className="text-gray-600 text-sm leading-relaxed">
                  Already have an account?{' '}
                  <Link 
                    to="/login" 
                    className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline transition-all duration-200 inline-flex items-center gap-1"
                  >
                    Sign in
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
