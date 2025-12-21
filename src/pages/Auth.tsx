import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  Mail,
  Lock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [universityId, setUniversityId] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email: string) => {
    const eduPattern = /^[^\s@]+@[^\s@]+\.edu$/i;
    setIsValidEmail(eduPattern.test(email));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    validateEmail(newEmail);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await login(loginEmail, loginPassword);
      // Redirect to the page they were trying to access, or to browse
      const from = location.state?.from?.pathname || "/browse";
      navigate(from, { replace: true });
    } catch (error: any) {
      setError(error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      await register({
        username,
        email,
        firstName,
        lastName,
        universityId,
        password,
      });
      navigate("/browse");
    } catch (error: any) {
      setError(error.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container flex items-center justify-center py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Badge variant="outline" className="mb-4">
              <ShieldCheck className="mr-2 h-3 w-3" />
              Verified Students Only
            </Badge>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome to UniSell
            </h1>
            <p className="mt-2 text-muted-foreground">
              Sign in with your university email to get started
            </p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Login to Your Account</CardTitle>
                  <CardDescription>
                    Enter your credentials to access your account
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">University Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="student@university.edu"
                          className="pl-10"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="login-password"
                          type="password"
                          placeholder="Enter your password"
                          className="pl-10"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" className="rounded" />
                        Remember me
                      </label>
                      <Link
                        to="/forgot-password"
                        className="text-sm text-primary hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-4">
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? "Logging in..." : "Login"}
                    </Button>
                    {error && (
                      <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                        <p className="text-sm text-destructive">{error}</p>
                      </div>
                    )}
                    <p className="text-center text-sm text-muted-foreground">
                      Don't have an account?{" "}
                      <Link to="#" className="text-primary hover:underline">
                        Sign up
                      </Link>
                    </p>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="signup">
              <Card>
                <CardHeader>
                  <CardTitle>Create Your Account</CardTitle>
                  <CardDescription>
                    Use your university email to verify your student status
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleRegister}>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first-name">First Name</Label>
                        <Input
                          id="first-name"
                          type="text"
                          placeholder="John"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name">Last Name</Label>
                        <Input
                          id="last-name"
                          type="text"
                          placeholder="Doe"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        type="text"
                        placeholder="johndoe123"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="university-id">University ID</Label>
                      <Input
                        id="university-id"
                        type="text"
                        placeholder="U12345"
                        value={universityId}
                        onChange={(e) => setUniversityId(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">University Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="student@university.edu"
                          className="pl-10"
                          value={email}
                          onChange={handleEmailChange}
                        />
                        {email && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            {isValidEmail ? (
                              <CheckCircle2 className="h-4 w-4 text-success" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-destructive" />
                            )}
                          </div>
                        )}
                      </div>
                      {email && !isValidEmail && (
                        <p className="text-xs text-destructive">
                          Please use your university .edu email address
                        </p>
                      )}
                      {isValidEmail && (
                        <p className="text-xs text-success">
                          ✓ Valid university email
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="Create a strong password"
                          className="pl-10"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="confirm-password"
                          type="password"
                          placeholder="Re-enter your password"
                          className="pl-10"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                      {password &&
                        confirmPassword &&
                        password !== confirmPassword && (
                          <p className="text-xs text-destructive">
                            Passwords do not match
                          </p>
                        )}
                    </div>
                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        id="terms"
                        className="mt-1 rounded"
                      />
                      <label
                        htmlFor="terms"
                        className="text-sm text-muted-foreground"
                      >
                        I agree to the{" "}
                        <Link
                          to="/terms"
                          className="text-primary hover:underline"
                        >
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                          to="/privacy"
                          className="text-primary hover:underline"
                        >
                          Privacy Policy
                        </Link>
                      </label>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-4">
                    {error && (
                      <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                        <p className="text-sm text-destructive">{error}</p>
                      </div>
                    )}
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={
                        !isValidEmail ||
                        password !== confirmPassword ||
                        isLoading
                      }
                    >
                      {isLoading ? "Creating Account..." : "Create Account"}
                    </Button>
                    <div className="rounded-lg border border-success/20 bg-success/5 p-4">
                      <p className="text-sm text-muted-foreground">
                        <ShieldCheck className="mr-2 inline h-4 w-4 text-success" />
                        Your account will be created immediately and you can
                        start using the marketplace
                      </p>
                    </div>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
