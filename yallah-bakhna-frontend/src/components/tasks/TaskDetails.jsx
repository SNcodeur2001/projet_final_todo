import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Users, Paperclip } from 'lucide-react';
import { taskService } from '../services/taskService';
import PermissionsList from '../components/permissions/PermissionsList';
import AttachmentList from '../attachements/AttachmentList';
import LoadingSpinner from '../components/common/LoadingSpinner';

const TaskDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [activeTab, setActiveTab] = useState('details');
  const [loading, setLoading] = useState(true);

  const fetchTask = useCallback(async () => {
    try {
      const response = await taskService.getTaskById(id);
      setTask(response.data.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  const tabs = [
    { id: 'details', label: 'Détails', icon: Edit },
    { id: 'permissions', label: 'Permissions', icon: Users },
    { id: 'attachments', label: 'Pièces jointes', icon: Paperclip }
  ];

  const statusColors = {
    EN_ATTENTE: 'bg-yellow-100 text-yellow-800',
    EN_COURS: 'bg-blue-100 text-blue-800',
    TERMINE: 'bg-green-100 text-green-800'
  };

  if (loading) return <LoadingSpinner />;
  if (!task) return <div>Tâche non trouvée</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{task.libelle}</h1>
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
              {task.status.replace('_', ' ')}
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          <button className="btn btn-secondary flex items-center space-x-2">
            <Edit className="w-4 h-4" />
            <span>Modifier</span>
          </button>
          <button className="btn btn-danger flex items-center space-x-2">
            <Trash2 className="w-4 h-4" />
            <span>Supprimer</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="card">
        {activeTab === 'details' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Description</h3>
              <p className="text-gray-600">{task.description || 'Aucune description'}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Informations</h3>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Statut</dt>
                  <dd className="mt-1 text-sm text-gray-900">{task.status.replace('_', ' ')}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Créateur</dt>
                  <dd className="mt-1 text-sm text-gray-900">Vous</dd>
                </div>
              </dl>
            </div>
          </div>
        )}

        {activeTab === 'permissions' && (
          <PermissionsList taskId={task.id} />
        )}

        {activeTab === 'attachments' && (
          <AttachmentList taskId={task.id} />
        )}
      </div>
    </div>
  );
};

export default TaskDetailsPage;