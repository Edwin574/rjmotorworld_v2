import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AdminProvider } from "./contexts/AdminContext";
import MainLayout from "./layouts/MainLayout";

// Pages
import HomePage from "@/pages/home";
import CarsPage from "@/pages/cars";
import NewCarsPage from "@/pages/cars/new";
import UsedCarsPage from "@/pages/cars/used";
import CarDetailsPage from "@/pages/car/[id]";
import SellPage from "@/pages/sell";
import AboutPage from "@/pages/about";
import ContactPage from "@/pages/contact";
import AdminLoginPage from "@/pages/admin";
import AdminDashboardPage from "@/pages/admin/dashboard";
import AdminCarsPage from "@/pages/admin/cars";
import AdminInquiriesPage from "@/pages/admin/inquiries";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/cars" component={CarsPage} />
      <Route path="/cars/new" component={NewCarsPage} />
      <Route path="/cars/used" component={UsedCarsPage} />
      <Route path="/car/:id" component={CarDetailsPage} />
      <Route path="/sell" component={SellPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/contact" component={ContactPage} />
      
      {/* Admin routes */}
      <Route path="/admin" component={AdminLoginPage} />
      <Route path="/admin/dashboard" component={AdminDashboardPage} />
      <Route path="/admin/cars" component={AdminCarsPage} />
      <Route path="/admin/inquiries" component={AdminInquiriesPage} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminProvider>
        <MainLayout>
          <Router />
        </MainLayout>
        <Toaster />
      </AdminProvider>
    </QueryClientProvider>
  );
}

export default App;
