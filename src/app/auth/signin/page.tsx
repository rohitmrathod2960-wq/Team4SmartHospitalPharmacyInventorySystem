"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, User, Briefcase, Lock, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Role } from '@/lib/types';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function SignInPage() {
  const [role, setRole] = useState<Role>('staff');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Mock validation
      if (username && password) {
        // Store session info locally for the demo
        localStorage.setItem('user_session', JSON.stringify({
          id: '1',
          username,
          role,
          fullName: username.charAt(0).toUpperCase() + username.slice(1) + ' User'
        }));
        
        toast({
          title: "Sign in successful",
          description: `Welcome back, ${role}.`,
        });
        router.push(`/dashboard/${role}`);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please enter valid credentials.",
        });
      }
    }, 1500);
  };

  const roleOptions = [
    { id: 'admin' as Role, label: 'Admin', icon: Shield, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'manager' as Role, label: 'Manager', icon: Briefcase, color: 'text-violet-600', bg: 'bg-violet-50' },
    { id: 'staff' as Role, label: 'Staff', icon: User, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md auth-card-shadow border-none rounded-2xl overflow-hidden">
        <CardHeader className="text-center pt-8">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">DefenseLink</CardTitle>
          <CardDescription>Secure Inventory & Tracking System</CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <form onSubmit={handleSignIn} className="space-y-6">
            <div className="grid grid-cols-3 gap-3">
              {roleOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setRole(opt.id)}
                  className={cn(
                    "flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200",
                    role === opt.id 
                      ? `border-primary ${opt.bg}` 
                      : "border-transparent bg-muted/50 hover:bg-muted"
                  )}
                >
                  <opt.icon className={cn("w-6 h-6 mb-1", opt.color)} />
                  <span className="text-xs font-semibold">{opt.label}</span>
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="username" 
                    placeholder="Enter your username" 
                    className="pl-10"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/auth/forgot-password" title="Forgot Password link" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full h-11 bg-primary hover:bg-primary/90 rounded-xl font-semibold" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Sign In
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Don&apos;t have an account? </span>
              <Link href="/auth/register" className="text-primary font-semibold hover:underline">
                Register
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
