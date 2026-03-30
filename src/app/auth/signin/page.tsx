"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, User, Briefcase, Lock, Mail, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Role } from '@/lib/types';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { auth, db } from "@/lib/firebase";
import { collection, doc, query, where, getDocs, updateDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function SignInPage() {

  const [role, setRole] = useState<Role>('pharmacist');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  const handleSignIn = async (e: any) => {

    e.preventDefault();
    setLoading(true);

    const normalizedEmail = email.trim().toLowerCase();

    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: "Enter a valid email address.",
      });
      setLoading(false);
      return;
    }

    try {

      const userCredential = await signInWithEmailAndPassword(auth, normalizedEmail, password);
      const user = userCredential.user;

      let userRole: Role = role;

      try {
        await updateDoc(doc(db, "users", user.uid), {
          lastLogin: serverTimestamp()
        });

        const userDoc = await getDoc(doc(db, "users", user.uid));

        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData?.role) {
            userRole = userData.role as Role;
          }
        }
      } catch (firestoreError) {
        console.warn("Firestore fallback during sign in:", firestoreError);
      }

      localStorage.setItem(
        "user_session",
        JSON.stringify({
          uid: user.uid,
          email: user.email,
          role: userRole,
        })
      );
      localStorage.setItem("role", userRole);

      toast({
        title: "Sign in successful",
        description: `Welcome back, ${userRole}.`,
      });

      if (userRole === "pharmacist") {
  router.push("/dashboard/staff");
} else {
  router.push(`/dashboard/${userRole}`);
}

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: error.message || "Incorrect email or password.",
      });
    } finally {
      setLoading(false);
    }

  };

  const roleOptions = [
    { id: 'admin' as Role, label: 'Admin', icon: Shield, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'manager' as Role, label: 'Manager', icon: Briefcase, color: 'text-violet-600', bg: 'bg-violet-50' },
    { id: 'pharmacist' as Role, label: 'Pharmacist', icon: User, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (

    <div className="min-h-screen flex items-center justify-center p-4 bg-background auth-background">

      <Card className="w-full max-w-md auth-card-shadow border-none rounded-2xl overflow-hidden">

        <CardHeader className="text-center pt-8">

          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>

          <CardTitle className="text-2xl font-bold tracking-tight">
            Inventra
          </CardTitle>

          <CardDescription>
            Secure Inventory & Tracking System
          </CardDescription>

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

                  <span className="text-xs font-semibold">
                    {opt.label}
                  </span>

                </button>

              ))}

            </div>

            <div className="space-y-4">

              <div className="space-y-2">

                <Label htmlFor="email">Email</Label>

                <div className="relative">

                  <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />

                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

                </div>

              </div>

              <div className="space-y-2">

                <Label htmlFor="password">Password</Label>

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

                {/* ADDED FORGOT PASSWORD LINK */}

                <div className="flex justify-end">

                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-primary font-medium hover:underline"
                  >
                    Forgot Password?
                  </Link>

                </div>

              </div>

            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-primary hover:bg-primary/90 rounded-xl font-semibold"
              disabled={loading}
            >

              {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}

              Sign In

            </Button>

            <div className="text-center text-sm">

              <span className="text-muted-foreground">
                Don&apos;t have an account?
              </span>

              {" "}

              <Link
                href="/auth/register"
                className="text-primary font-semibold hover:underline"
              >
                Register
              </Link>

            </div>

          </form>

        </CardContent>

      </Card>

    </div>

  );

}