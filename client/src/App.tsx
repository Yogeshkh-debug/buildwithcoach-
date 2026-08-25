import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CartProvider } from "./contexts/CartContext";
import { CartDrawer, EmailPopup } from "./components/SiteComponents";
import Home from "./pages/Home";
import { AboutPage, ArticleDetailPage, ArticlesPage, ContactPage, DashboardPage, FreePlanPage, LoginPage, ProgramsPage, ToolsPage } from "./pages/ContentPages";

function LoginRoute() {
  return <LoginPage />;
}

function SignupRoute() {
  return <LoginPage signup />;
}

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/articles"} component={ArticlesPage} />
      <Route path={"/articles/:slug"} component={ArticleDetailPage} />
      <Route path={"/tools"} component={ToolsPage} />
      <Route path={"/free-plan"} component={FreePlanPage} />
      <Route path={"/programs"} component={ProgramsPage} />
      <Route path={"/about"} component={AboutPage} />
      <Route path={"/contact"} component={ContactPage} />
      <Route path={"/login"} component={LoginRoute} />
      <Route path={"/signup"} component={SignupRoute} />
      <Route path={"/dashboard"} component={DashboardPage} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <CartProvider>
            <Router />
            <CartDrawer />
            <EmailPopup />
          </CartProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
