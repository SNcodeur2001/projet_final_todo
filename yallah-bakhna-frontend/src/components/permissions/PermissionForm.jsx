import React, { useState, useEffect } from 'react';
import { X, Search, User, Users } from 'lucide-react';
import { taskService } from '../../services/taskService';
import { useAuth } from '../../contexts/AuthContext';

const PermissionForm = ({ taskId, onClose, onAdd }) => {
  const { user: currentUser } = useAuth();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedPermission, setSelectedPermission] = useState('READ_ONLY');
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await taskService.getUsers();
        let usersData = response.data?.data || response.data || [];

        // Ensure usersData is an array
        if (!Array.isArray(usersData)) {
          usersData = [];
        }

        // Filter out the current user
        const filteredUsers = usersData.filter(user => user.id !== currentUser?.id);

        setUsers(filteredUsers);
      } catch (error) {
        console.error('Erreur lors du chargement des utilisateurs:', error);
        // Set some mock users for development (excluding current user)
        const mockUsers = [
          { id: 1, prenom: 'Alice', nom: 'Dupont', login: 'alice.dupont' },
          { id: 2, prenom: 'Bob', nom: 'Martin', login: 'bob.martin' },
          { id: 3, prenom: 'Claire', nom: 'Dubois', login: 'claire.dubois' }
        ];

        // Filter out current user from mock data too
        const filteredMockUsers = mockUsers.filter(user => user.id !== currentUser?.id);
        setUsers(filteredMockUsers);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [currentUser]);

  // Filtrer les utilisateurs selon le terme de recherche
  const filteredUsers = users.filter(user =>
    user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.login.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Vérifier si un utilisateur est déjà sélectionné
  const isUserSelected = (userId) => {
    return selectedUsers.some(user => user.id === userId);
  };

  // Ajouter un utilisateur à la sélection
  const addUser = (user) => {
    if (!isUserSelected(user.id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  // Retirer un utilisateur de la sélection
  const removeUser = (userId) => {
    setSelectedUsers(selectedUsers.filter(user => user.id !== userId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedUsers.length === 0) {
      setError('Veuillez sélectionner au moins un utilisateur');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const results = [];
      const errors = [];

      // Ajouter les permissions pour chaque utilisateur sélectionné
      for (const user of selectedUsers) {
        try {
          const permissionData = {
            userId: user.id,
            permission: selectedPermission
          };
          const response = await taskService.addPermission(taskId, permissionData);
          const newPermission = response.data?.data || response.data;
          if (newPermission) {
            results.push(newPermission);
          }
        } catch (userError) {
          errors.push(`${user.prenom} ${user.nom}: ${userError.message || 'Erreur'}`);
        }
      }

      // Notifier le composant parent des permissions ajoutées
      if (results.length > 0) {
        results.forEach(permission => onAdd(permission));
      }

      // Fermer le modal si au moins une permission a été ajoutée
      if (results.length > 0) {
        onClose();
      }

      // Afficher les erreurs s'il y en a
      if (errors.length > 0) {
        setError(`Erreurs: ${errors.join('; ')}`);
      }

    } catch (error) {
      setError(error.message || 'Erreur lors de l\'ajout des permissions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-medium">Ajouter une permission</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-400">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Utilisateurs sélectionnés */}
          {selectedUsers.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Utilisateurs sélectionnés ({selectedUsers.length})
              </label>
              <div className="flex flex-wrap gap-2 p-3 bg-blue-50 rounded-md border">
                {selectedUsers.map((user) => (
                  <span
                    key={user.id}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    <User className="w-3 h-3 mr-1" />
                    {user.prenom} {user.nom}
                    <button
                      type="button"
                      onClick={() => removeUser(user.id)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recherche d'utilisateurs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Search className="w-4 h-4 inline mr-1" />
              Rechercher des utilisateurs
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Tapez un nom, prénom ou login..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              {searchTerm && (
                <div className="absolute right-3 top-3 text-gray-400 text-sm">
                  {filteredUsers.length} résultat{filteredUsers.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          </div>

          {/* Liste des utilisateurs filtrés */}
          {loadingUsers ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
              <span className="ml-2 text-sm text-gray-500">Chargement des utilisateurs...</span>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="w-4 h-4 inline mr-1" />
                Utilisateurs disponibles
              </label>
              <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-md">
                {filteredUsers.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    {searchTerm ? 'Aucun utilisateur trouvé' : 'Aucun utilisateur disponible'}
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        onClick={() => addUser(user)}
                        className={`p-3 cursor-pointer hover:bg-gray-50 flex items-center justify-between ${
                          isUserSelected(user.id) ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                        }`}
                      >
                        <div className="flex items-center">
                          <User className="w-4 h-4 text-gray-400 mr-3" />
                          <div>
                            <div className="font-medium text-gray-900">
                              {user.prenom} {user.nom}
                            </div>
                            <div className="text-sm text-gray-500">
                              @{user.login}
                            </div>
                          </div>
                        </div>
                        {isUserSelected(user.id) && (
                          <div className="text-blue-600 text-sm font-medium">
                            ✓ Sélectionné
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Type de permission */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de permission
            </label>
            <select
              value={selectedPermission}
              onChange={(e) => setSelectedPermission(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="READ_ONLY">Lecture seule</option>
              <option value="MODIFY_ONLY">Modification</option>
              <option value="FULL_ACCESS">Accès complet</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || selectedUsers.length === 0}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Ajout...' : `Ajouter ${selectedUsers.length > 0 ? `(${selectedUsers.length})` : ''}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PermissionForm;