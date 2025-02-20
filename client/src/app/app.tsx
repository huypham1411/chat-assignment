import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from '../components/Navbar';
import LoginPage from '../pages/LoginPage';
import { useAuthStore } from '../store/useAuthStore';
import { Loader } from 'lucide-react';
import HomePage from '../pages/HomePage';
import { Toaster } from 'react-hot-toast';

export function App() {
  const { authUser, isLoggingIn } = useAuthStore();

  if (isLoggingIn)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div data-theme={'coffee'}>
      <Toaster />
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
      </Routes>
    </div>
  );
}

export default App;
