import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthWrapper } from "@/components/auth-provider";
import Home from "@/pages/home";
import Marketplace from "@/pages/marketplace";
import MyOrders from "@/pages/my-orders";
import FarmerProfile from "@/pages/farmer-profile";
import ProductDetail from "@/pages/product-detail";
import SignIn from "@/pages/auth/sign-in";
import SignUp from "@/pages/auth/sign-up";
import Checkout from "@/pages/checkout";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/marketplace" component={Marketplace} />
      <Route path="/my-orders" component={MyOrders} />
      <Route path="/farmers/:id" component={FarmerProfile} />
      <Route path="/products/:id" component={ProductDetail} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/auth/sign-in" component={SignIn} />
      <Route path="/auth/sign-up" component={SignUp} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthWrapper>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthWrapper>
    </QueryClientProvider>
  );
}

export default App;
