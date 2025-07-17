import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { auth } from "./lib/auth";
import Login from "@/pages/login";
import Catalog from "@/pages/catalog";
import SubCatalog from "@/pages/sub-catalog";
import Product from "@/pages/product";
import { FavoritesPage } from "@/pages/favorites";
import { ShopPage } from "@/pages/shop";
import { NewPage } from "@/pages/new";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(auth.getUser());

  useEffect(() => {
    return auth.subscribe(setUser);
  }, []);

  if (!user) {
    return <Redirect to="/login" />;
  }

  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/catalog">
        <ProtectedRoute>
          <Catalog />
        </ProtectedRoute>
      </Route>
      <Route path="/favorites">
        <ProtectedRoute>
          <FavoritesPage />
        </ProtectedRoute>
      </Route>
      <Route path="/shop">
        <ProtectedRoute>
          <ShopPage />
        </ProtectedRoute>
      </Route>
      <Route path="/new">
        <ProtectedRoute>
          <NewPage />
        </ProtectedRoute>
      </Route>
      <Route path="/anime/:animeId">
        <ProtectedRoute>
          <SubCatalog />
        </ProtectedRoute>
      </Route>
      <Route path="/character/:characterId">
        <ProtectedRoute>
          <Product />
        </ProtectedRoute>
      </Route>
      <Route path="/">
        <Redirect to="/catalog" />
      </Route>
      <Route>
        <Redirect to="/catalog" />
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
