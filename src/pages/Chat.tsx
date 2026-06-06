import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { wellnessApi, ChatMessage } from '@/services/wellnessApi';
import { useToast } from '@/hooks/use-toast';
import { MessageCircle, Send, Bot, User, Heart, AlertTriangle, Shield, X, Calendar } from 'lucide-react';

const Chat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showSessions, setShowSessions] = useState(false);
  const [previousSessions, setPreviousSessions] = useState<any[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatHistory = async () => {
    try {
      const history = await wellnessApi.getChatHistory(user!.id);
      setMessages(history);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load chat history", variant: "destructive" });
    }
  };

  const handleNewSession = async () => {
    await wellnessApi.startNewChatSession(user!.id);
    setMessages([]);
    toast({ title: "New session started", description: "Your chat has been reset." });
  };

  const handlePreviousSessions = async () => {
    try {
      setLoading(true);
      // Mock API call - replace with your actual API
      const sessions = await wellnessApi.getPreviousSessions?.(user!.id) || [];
      setPreviousSessions(sessions);
      setShowSessions(true);
      toast({ title: "Sessions loaded", description: `${sessions.length} previous sessions found.` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to load previous sessions", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage = currentMessage;
    setCurrentMessage('');
    setLoading(true);
    setIsTyping(true);

    const tempMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: user!.id,
      message: userMessage,
      emotion: '',
      risk: 'low',
      agentResponse: '',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, tempMessage]);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const response = await wellnessApi.sendChatMessage(userMessage, user!.id);

      setMessages(prev => [...prev.slice(0, -1), response]);

      if (response.risk === 'high') {
        toast({
          title: "High-risk detected",
          description: "A counselor has been notified for immediate assistance.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to send message", variant: "destructive" });
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'high': return <AlertTriangle className="h-3 w-3" />;
      case 'medium': return <Shield className="h-3 w-3" />;
      default: return <Heart className="h-3 w-3" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-7xl space-y-6 bg-gradient-to-r from-emerald-600 via-teal-300 to-cyan-100 backdrop-blur-sm bg-white/60 rounded-3xl p-4 shadow-2xl border border-emerald-200/50">
          <h1 className="text-4xl font-black bg-clip-text  drop-shadow-2xl">
            AI Wellness Chat 💬
          </h1>
          <p className="text-lg text-emerald-700 font-light max-w-xl mx-auto leading-relaxed">
            Share your thoughts and feelings with our supportive AI companion
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4">
          <Button 
            onClick={handleNewSession} 
            className="h-12 px-8 text-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-xl hover:shadow-emerald-400/50 font-bold rounded-2xl transition-all duration-300"
          >
            New Session
          </Button>
          <Button 
            onClick={handlePreviousSessions} 
            className="h-12 px-8 text-lg bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 shadow-xl hover:shadow-teal-400/50 font-bold rounded-2xl transition-all duration-300"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Previous Sessions'}
          </Button>
        </div>

        {/* Main Chat Container */}
        <Card className="h-[150vh] max-h-[800px] flex flex-col shadow-2xl border-emerald-200/50 backdrop-blur-xl bg-white/80 hover:shadow-emerald-300/30 transition-all">
          <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-b border-emerald-200/30">
            <CardTitle className="flex items-center gap-3 text-2xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              <MessageCircle className="h-8 w-8" />
              Wellness Support Chat
            </CardTitle>
            <CardDescription className="text-emerald-600 font-medium">
              Safe space to express your feelings. AI provides support and detects when you need extra help.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex-1 overflow-hidden flex flex-col p-6 space-y-6">
            <div className="flex-1 overflow-y-auto space-y-6 pr-2 scrollbar-thin scrollbar-thumb-emerald-300 scrollbar-track-emerald-100">
              {messages.length === 0 ? (
                <div className="text-center py-20 text-emerald-500/60">
                  <Bot className="h-24 w-24 mx-auto mb-8 opacity-70" />
                  <p className="text-3xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    Welcome to your wellness chat!
                  </p>
                  <p className="text-xl max-w-md mx-auto leading-relaxed">I'm here to listen and support you. How are you feeling today?</p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div key={message.id || index} className="space-y-3">
                    {/* User Message */}
                    <div className="flex items-start gap-3 justify-end">
                      <div className="flex-1 max-w-[50%]">
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-6 rounded-3xl rounded-br-lg shadow-xl">
                          <p className="text-lg leading-relaxed">{message.message}</p>
                        </div>
                        <div className="flex items-center gap-3 mt-3 justify-end">
                          <span className="text-sm text-emerald-600 font-medium">
                            {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                          {message.risk && (
                            <Badge className={`text-xs font-bold px-3 py-1 shadow-md ${getRiskColor(message.risk)}`}>
                              <span className="flex items-center gap-1">{getRiskIcon(message.risk)}{message.risk.toUpperCase()}</span>
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg">
                        <User className="h-6 w-6 text-white" />
                      </div>
                    </div>

                    {/* AI Response */}
                    {message.agentResponse && (
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 shadow-lg flex-shrink-0">
                          <Bot className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1 max-w-50%]">
                          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-3xl rounded-bl-lg border border-emerald-200/50 shadow-xl">
                            <p className="text-lg leading-relaxed text-emerald-800">{message.agentResponse}</p>
                          </div>
                          <div className="flex items-center gap-2 mt-3 text-sm text-emerald-600 font-medium">
                            <Bot className="h-4 w-4" />
                            AI Wellness Assistant
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}

              {isTyping && (
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 shadow-lg">
                    <Bot className="h-6 w-6 text-white" />
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl rounded-bl-lg border border-emerald-200/50 shadow-xl flex items-center gap-3">
                    <div className="flex gap-1">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce"></div>
                      <div className="w-3 h-3 bg-teal-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <span className="text-lg font-medium text-emerald-700">AI is thinking...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </CardContent>

          {/* Input Area */}
          <div className="p-8 border-t border-emerald-200/30 bg-gradient-to-r from-emerald-50 to-teal-50/50">
            <div className="flex items-end gap-4 max-w-4xl mx-auto">
              <Input
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share your thoughts and feelings... (Enter to send)"
                disabled={loading}
                className="flex-1 h-16 text-lg px-6 py-4 border-2 border-emerald-200 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/30 rounded-3xl shadow-lg hover:shadow-emerald-200/50 transition-all"
              />
              <Button
                onClick={handleSendMessage}
                disabled={loading || !currentMessage.trim()}
                className="h-16 w-16 p-0 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-2xl hover:shadow-emerald-500/50 rounded-3xl transition-all duration-300"
              >
                <Send className="h-6 w-6" />
              </Button>
            </div>
            <p className="text-xs text-emerald-600 mt-4 text-center font-medium max-w-2xl mx-auto">
              💚 This AI provides emotional support but is not a replacement for professional mental health care.
            </p>
          </div>
        </Card>

        {/* Previous Sessions Modal */}
        {showSessions && (
          <Card className="backdrop-blur-xl bg-white/80 shadow-2xl border-emerald-200/50 max-h-[400px] overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-teal-500/10 to-cyan-500/10 flex flex-row justify-between items-center">
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent flex items-center gap-2">
                📚 Previous Sessions ({previousSessions.length})
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSessions(false)}
                className="h-8 w-8 rounded-full hover:bg-teal-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-6 max-h-[300px] overflow-y-auto space-y-4">
              {previousSessions.length > 0 ? (
                previousSessions.map((session, index) => (
                  <div key={index} className="p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl border border-teal-200/50 hover:shadow-md transition-all cursor-pointer group">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-bold text-teal-800 text-lg group-hover:text-teal-900">
                        Session #{session.id?.slice(-4) || index + 1}
                      </div>
                      <Badge className="bg-teal-500/20 text-teal-700 border-teal-300 font-semibold">
                        {new Date(session.createdAt).toLocaleDateString()}
                      </Badge>
                    </div>
                    <p className="text-sm text-teal-700 line-clamp-2 leading-relaxed">
                      {session.firstMessage || 'Started a new conversation...'}
                    </p>
                    <div className="flex items-center gap-2 mt-3 text-xs text-teal-600">
                      <span>{session.messageCount || 0} messages</span>
                      <span>•</span>
                      <span>{new Date(session.lastActivity).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-teal-500/60">
                  <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-xl font-medium">No previous sessions</p>
                  <p className="text-sm mt-1">Start chatting to create your first session!</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Chat;
