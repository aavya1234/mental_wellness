import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, Mail, Calendar, Award, TrendingUp, LogOut, Settings, Bell } from 'lucide-react';

interface ProfileProps {
  user: { id: string; email: string; name: string };
  onBack: () => void;
  onLogout: () => void;
}

const Profile = ({ user, onBack, onLogout }: ProfileProps) => {
  const stats = [
    { label: 'Days Active', value: '14', icon: Calendar },
    { label: 'Mood Entries', value: '28', icon: TrendingUp },
    { label: 'Wellness Points', value: '450', icon: Award },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-soft/10 to-secondary-soft/10 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        </div>

        {/* Profile Card */}
        <Card className="bg-card/80 border-border/50 shadow-gentle overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-primary via-wellness to-secondary"></div>
          <CardContent className="relative pt-0">
            <div className="flex flex-col items-center -mt-12">
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-wellness rounded-full flex items-center justify-center text-3xl font-bold text-primary-foreground border-4 border-card shadow-calm">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-bold text-foreground mt-4">{user.name}</h2>
              <p className="text-muted-foreground flex items-center gap-2 mt-1">
                <Mail className="w-4 h-4" /> {user.email}
              </p>
              <Badge className="mt-3 bg-secondary/20 text-secondary border-0">Wellness Enthusiast</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat, idx) => (
            <Card key={idx} className="bg-card/80 border-border/50 shadow-gentle">
              <CardContent className="p-4 text-center">
                <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Settings */}
        <Card className="bg-card/80 border-border/50 shadow-gentle">
          <CardHeader>
            <CardTitle className="text-lg">Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="ghost" className="w-full justify-start gap-3 h-12">
              <Settings className="w-5 h-5 text-muted-foreground" /> Account Settings
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 h-12">
              <Bell className="w-5 h-5 text-muted-foreground" /> Notifications
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 h-12 text-destructive hover:text-destructive" onClick={onLogout}>
              <LogOut className="w-5 h-5" /> Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
export default Profile;