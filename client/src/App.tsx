import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth";
import Home from "@/pages/home";
import Auth from "@/pages/auth";
import Dashboard from "@/pages/dashboard";
import Consultation from "@/pages/consultation";
import Chat from "@/pages/chat";
import AnonymousChat from "@/pages/anonymous-chat";
import Profile from "@/pages/profile";
import Reports from "@/pages/reports";
import About from "@/pages/about";
import HowItWorks from "@/pages/how-it-works";
import Contact from "@/pages/contact";
import Doctors from "@/pages/doctors";
import AdminDoctors from "@/pages/admin-doctors";
import HealthPassport from "@/pages/health-passport";
import HealthPassportView from "@/pages/health-passport-view";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/auth" component={Auth} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/consultation" component={Consultation} />
      <Route path="/consultation/new" component={Consultation} />
      <Route path="/consultation/:id/chat" component={Chat} />
      <Route path="/chat" component={Chat} />
      <Route path="/anonymous-chat" component={AnonymousChat} />
      <Route path="/profile" component={Profile} />
      <Route path="/reports" component={Reports} />
      <Route path="/about" component={About} />
      <Route path="/how-it-works" component={HowItWorks} />
      <Route path="/doctors" component={Doctors} />
      <Route path="/admin/doctors" component={AdminDoctors} />
      <Route path="/health-passport" component={HealthPassport} />
      <Route path="/health-passport/:userId" component={HealthPassportView} />
      <Route path="/contact" component={Contact} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
