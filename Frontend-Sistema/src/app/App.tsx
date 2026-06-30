import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppRoutes } from "./app.routes";
import { AuthProvider } from "./core/contexts/AuthContext";
import { ErrorBoundary } from "./core/components/ErrorBoundary";
import { ToastProvider } from "./shared/components/Toast";

const queryClient = new QueryClient();

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </AuthProvider>
        </QueryClientProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;