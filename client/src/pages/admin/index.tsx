import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AdminAuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/utils/validators";
import { useToast } from "@/hooks/use-toast";

const formSchema = loginSchema;
type FormValues = z.infer<typeof formSchema>;

const AdminLoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: ""
    }
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/admin/dashboard");
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      const success = await login(data.username, data.password);
      if (success) {
        router.push("/admin/dashboard");
      } else {
        toast({
          title: "Authentication Failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-20 bg-gray-50 min-h-screen flex items-center">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-primary">Admin Login</h1>
              <p className="text-gray-medium mt-2">Access the dealership management system</p>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <Label className="block text-gray-medium font-medium mb-2">Email Address</Label>
                      <FormControl>
                        <Input 
                          placeholder="admin@example.com" 
                          {...field}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <Label className="block text-gray-medium font-medium mb-2">Password</Label>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          {...field}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-primary text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 transition"
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
                
                <div className="mt-4 text-center">
                  <a href="/" className="text-primary hover:underline">Return to website</a>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminLoginPage;
