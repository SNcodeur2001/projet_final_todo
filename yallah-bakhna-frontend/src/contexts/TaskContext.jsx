/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { taskService } from '../services/taskService';
import { useAuth } from './AuthContext';
import { formatError } from '../utils/errorHandler';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [recentlyCompletedTasks, setRecentlyCompletedTasks] = useState([]);
  const { isAuthenticated } = useAuth();

  const fetchTasks = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await taskService.getTasks();
      setTasks(response.data || []);
    } catch (error) {
      const formattedError = formatError(error);
      setError(formattedError.message);
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Recharger les tâches quand l'utilisateur est authentifié
  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    }
  }, [isAuthenticated, fetchTasks]);

  const createTask = async (taskData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await taskService.createTask(taskData);
      setTasks(prev => [...prev, response.data]);
      return response.data;
    } catch (error) {
      const formattedError = formatError(error);
      setError(formattedError.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id, taskData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await taskService.updateTask(id, taskData);
      setTasks(prev => prev.map(task =>
        task.id === id ? response.data : task
      ));
      return response.data;
    } catch (error) {
      if (error.response?.status === 403) {
        setError(error.response.data.message || 'Vous n\'avez pas la permission de modifier cette tâche');
      } else {
        setError('Une erreur est survenue lors de la modification de la tâche');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id) => {
    setError(null);
    try {
      await taskService.deleteTask(id);
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (error) {
      const formattedError = formatError(error);
      setError(formattedError.message);
      throw error;
    }
  };

  // Fonction pour marquer une tâche comme terminée
  const markAsComplete = async (taskId) => {
    setError(null);
    try {
      const response = await taskService.markAsComplete(taskId);
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId 
            ? { ...task, status: 'TERMINE', updatedAt: new Date().toISOString() }
            : task
        )
      );

      // Ajouter aux notifications récentes
      setRecentlyCompletedTasks(prev => [
        { ...response.data, updatedAt: new Date().toISOString() },
        ...prev
      ]);

      return response.data;
    } catch (error) {
      const formattedError = formatError(error);
      setError(formattedError.message);
      throw error;
    }
  };

  const clearError = () => {
    setError(null);
  };

  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Apply status filter
    if (filter !== 'ALL') {
      filtered = filtered.filter(task => task.status === filter);
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(task =>
        task.libelle?.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [tasks, filter, searchTerm]);

  const value = {
    tasks,
    filteredTasks,
    loading,
    error,
    filter,
    setFilter,
    searchTerm,
    setSearchTerm,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    markAsComplete,
    clearError,
    recentlyCompletedTasks,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};