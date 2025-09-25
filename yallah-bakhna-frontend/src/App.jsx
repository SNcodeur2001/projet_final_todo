import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { TaskProvider } from './contexts/TaskContext';
import Layout from './components/common/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TaskDetailsPage from './pages/TaskDetailsPage';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route
      path="/"
      element={
        <PrivateRoute>
          <Layout>
            <DashboardPage />
          </Layout>
        </PrivateRoute>
      }
    />
    <Route
      path="/tasks/:id"
      element={
        <PrivateRoute>
          <Layout>
            <TaskDetailsPage />
          </Layout>
        </PrivateRoute>
      }
    />
  </Routes>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <TaskProvider>
          <AppRoutes />
        </TaskProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;