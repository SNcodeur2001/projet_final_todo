import React, { useState, useEffect, useCallback } from 'react';
import { Plus, UserCheck, UserX, AlertCircle, Users } from 'lucide-react';
import { taskService } from '../../services/taskService';
import PermissionForm from './PermissionForm';

const PermissionsList = ({ taskId }) => {
  const [permissions, setPermissions] = useState([]);
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPermissions = useCallback(async () => {
    if (!taskId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await taskService.getTaskPermissions(taskId);
      // Handle different response structures
      const permissionsData = response.data?.data || response.data || [];
      setPermissions(Array.isArray(permissionsData) ? permissionsData : []);
    } catch (error) {
      setError(error.message);
      setPermissions([]); // Ensure permissions is always an array
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  // Fetch users for displaying names
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await taskService.getUsers();
        const usersData = response.data?.data || response.data || [];
        setUsers(Array.isArray(usersData) ? usersData : []);
      } catch (error) {
        console.error('Erreur lors du chargement des utilisateurs:', error);
        // Set some mock users for development
        setUsers([
          { id: 1, prenom: 'Alice', nom: 'Dupont', login: 'alice.dupont' },
          { id: 2, prenom: 'Bob', nom: 'Martin', login: 'bob.martin' },
          { id: 3, prenom: 'Claire', nom: 'Dubois', login: 'claire.dubois' }
        ]);
      }
    };

    if (taskId) {
      fetchUsers();
    }
  }, [taskId]);

  const handleRemovePermission = async (userId) => {
    if (window.confirm('Êtes-vous sûr de vouloir retirer cette permission ?')) {
      try {
        await taskService.removePermission(taskId, userId);
        setPermissions(permissions.filter(p => p.userId !== userId));
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const permissionLabels = {
    READ_ONLY: { label: 'Lecture seule', color: 'bg-gray-100 text-gray-800' },
    MODIFY_ONLY: { label: 'Modification', color: 'bg-blue-100 text-blue-800' },
    FULL_ACCESS: { label: 'Accès complet', color: 'bg-green-100 text-green-800' }
  };

  if (!taskId) {
    return (
      <div className="text-center py-12">
        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Gestion des permissions</h3>
        <p className="text-gray-600">
          Sélectionnez une tâche dans l'onglet "Tâches" pour gérer ses permissions.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Permissions</h3>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Plus className="w-4 h-4 mr-2" />
          <span>Ajouter permission</span>
        </button>
      </div>

      {permissions.length === 0 ? (
        <p className="text-gray-500 text-center py-4">Aucune permission accordée</p>
      ) : (
        <div className="space-y-3">
          {permissions.map((permission) => {
            // Find user data for this permission
            const user = users.find(u => u.id === permission.userId);

            return (
              <div key={permission.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <UserCheck className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium">
                      {user ? `${user.prenom} ${user.nom}` : `Utilisateur ${permission.userId}`}
                    </p>
                    <p className="text-sm text-gray-500">
                      {user ? `@${user.login}` : 'Chargement...'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    permissionLabels[permission.permission].color
                  }`}>
                    {permissionLabels[permission.permission].label}
                  </span>
                  <button
                    onClick={() => handleRemovePermission(permission.userId)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <UserX className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <PermissionForm
          taskId={taskId}
          onClose={() => {
            setShowForm(false);
            setError(null);
          }}
          onAdd={(newPermission) => {
            setPermissions([...permissions, newPermission]);
            setShowForm(false);
            setError(null);
          }}
          onError={setError}
        />
      )}
    </div>
  );
};

export default PermissionsList;