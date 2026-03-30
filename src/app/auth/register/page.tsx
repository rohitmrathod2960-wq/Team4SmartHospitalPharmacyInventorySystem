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
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function RegisterPage() {
  const [role, setRole] = useState<Role>('pharmacist');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleRegister = async (e: any) => {
    e.preventDefault();

    const email = formData.email.trim().toLowerCase();

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Enter a valid email address.",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Passwords do not match.",
      });
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Create user in Firebase Authentication
      const normalizedEmail = formData.email.trim().toLowerCase();
      const username = formData.username.trim() || formData.fullName.replace(/\s+/g, "").toLowerCase();

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        normalizedEmail,
        formData.password
      );

      const user = userCredential.user;

      try {
        await setDoc(doc(db, "users", user.uid), {
          fullName: formData.fullName.trim(),
          username,
          email: normalizedEmail,
          role,
          createdAt: new Date(),
        });
      } catch (firestoreError: any) {
        console.error("Firestore permission error during registration:", firestoreError);
        // If settings block users from creating their own profile, the error will be "permission-denied"
        toast({
          variant: "destructive",
          title: "Profile creation failed",
          description:
            firestoreError.code === "permission-denied"
              ? "Firestore security rules disallow writing /users/<uid>. Update your rules to allow the signed-in user to write their own document."
              : "Could not save profile data. Please try again.",
        });

        // Optional cleanup: remove the auth user if profile write is mandatory.
        // await deleteUser(user); // enable after importing deleteUser from firebase/auth if desired.

        return;
      }

      toast({
        title: "Account created",
        description: "Registration successful. Please sign in.",
      });

      router.push("/auth/signin");

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message,
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
      <Card className="w-full max-w-lg auth-card-shadow border-none rounded-2xl overflow-hidden">
        <CardHeader className="text-center pt-8">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Create Account</CardTitle>
          <CardDescription>Join the Inventra network</CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <form onSubmit={handleRegister} className="space-y-6">

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  required
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    className="pl-10"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="johndoe"
                  required
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                />
              </div>

            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-primary hover:bg-primary/90 rounded-xl font-semibold"
              disabled={loading}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Create Account
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                Already have an account?
              </span>{" "}
              <Link
                href="/auth/signin"
                className="text-primary font-semibold hover:underline"
              >
                Sign In
              </Link>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}