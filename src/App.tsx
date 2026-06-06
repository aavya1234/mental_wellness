import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import MoodTracker from "./pages/MoodTracker";
import Chat from "./pages/Chat";
import Games from "./pages/Games";
import NotFound from "./pages/NotFound";

import MindfulMatching from "./pages/games/MindfulMatching";
import BreathingExercise from "./pages/games/BreathingExercise";
import PositivityTrivia from "./pages/games/PositivityTrivia";
import MoodColorPicker from "./pages/games/MoodColorPicker";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/mood" element={<MoodTracker />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/games" element={<Games />} />

            <Route path="/games/mindful-matching" element={<MindfulMatching />} />
            <Route path="/games/breathing-exercise" element={<BreathingExercise />} />
            <Route path="/games/positivity-trivia" element={<PositivityTrivia />} />
            <Route path="/games/mood-color-picker" element={<MoodColorPicker />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
