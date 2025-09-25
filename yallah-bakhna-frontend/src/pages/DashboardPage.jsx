import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTask } from '../contexts/TaskContext';
import TaskStats from '../components/tasks/TaskStats';
import TaskList from '../components/tasks/TaskList';
import TaskForm from '../components/tasks/TaskForm';
import TaskFilters from '../components/tasks/TaskFilters';
import PermissionsList from '../components/permissions/PermissionsList';
import AttachmentList from '../components/attachements/AttachmentList';
import ErrorMessage from '../components/common/ErrorMessage';
import { Plus, Users, Paperclip, CheckSquare } from 'lucide-react';
import NotificationBell from '../components/notifications/NotificationBell';

const DashboardPage = () => {
  const { user } = useAuth();
  const { error: taskError, clearError, filter, setFilter, searchTerm, setSearchTerm } = useTask();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [activeSection, setActiveSection] = useState('tasks');
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Initialize state from URL on component mount
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    const urlFilter = searchParams.get('filter') || 'ALL';
    const urlPage = parseInt(searchParams.get('page')) || 1;

    if (isInitialLoad) {
      setSearchTerm(urlSearch);
      setFilter(urlFilter);
      setCurrentPage(urlPage);
      setIsInitialLoad(false);
    }
  }, [searchParams, setSearchTerm, setFilter, isInitialLoad]);

  // Sync URL with state changes
  useEffect(() => {
    if (isInitialLoad) return;

    const newSearchParams = new URLSearchParams();

    if (searchTerm) {
      newSearchParams.set('search', searchTerm);
    }
    if (filter && filter !== 'ALL') {
      newSearchParams.set('filter', filter);
    }
    if (currentPage > 1) {
      newSearchParams.set('page', currentPage.toString());
    }

    const currentParams = searchParams.toString();
    const newParams = newSearchParams.toString();

    if (currentParams !== newParams) {
      setSearchParams(newSearchParams, { replace: true });
    }
  }, [searchTerm, filter, currentPage, isInitialLoad, searchParams, setSearchParams]);

  return (
    <div className="space-y-4 fade-in">
      {/* Error Message for Task Operations */}
      {taskError && (
        <ErrorMessage
          message={taskError}
          type="error"
          dismissible
          onDismiss={clearError}
        />
      )}

      {/* Header */}
      <div className="dashboard-card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">
              Bienvenue, {user?.prenom} {user?.nom}
            </h1>
            <p className="text-gray-600">
              Gérez vos tâches efficacement
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <NotificationBell />
            <button
              onClick={() => setShowTaskForm(true)}
              className="btn btn-primary flex items-center space-x-2 px-6 py-3"
            >
              <Plus className="w-5 h-5" />
              <span>Nouvelle tâche</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="dashboard-nav">
        <nav className="dashboard-nav-item">
          {[
            { id: 'tasks', label: 'Tâches', icon: CheckSquare },
            { id: 'permissions', label: 'Permissions', icon: Users },
            { id: 'attachments', label: 'Pièces jointes', icon: Paperclip }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeSection === tab.id
                    ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Stats Overview - Only show for tasks section */}
      {activeSection === 'tasks' && (
        <TaskStats />
      )}

      {/* Content Sections */}
      {activeSection === 'tasks' && (
        <div className="dashboard-stats">
          <div className="dashboard-stats-header">
            <div className="flex items-center space-x-2">
              <div className="dashboard-stats-icon">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-secondary-900">Vos tâches</h2>
            </div>
            <div className="flex items-center space-x-2">
              <TaskFilters />
            </div>
          </div>
          <TaskList
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {activeSection === 'permissions' && (
        <div className="card">
          <div className="flex items-center space-x-2 mb-6">
            <div className="dashboard-stats-icon-large">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-secondary-900">Gestion des permissions</h2>
          </div>
          <PermissionsList taskId={null} />
        </div>
      )}

      {activeSection === 'attachments' && (
        <div className="card">
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-500 rounded-lg flex items-center justify-center">
              <Paperclip className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-secondary-900">Gestion des pièces jointes</h2>
          </div>
          <AttachmentList taskId={null} />
        </div>
      )}

      {/* Task Form Modal */}
      {showTaskForm && (
        <TaskForm onClose={() => setShowTaskForm(false)} />
      )}
    </div>
  );
};

export default DashboardPage;