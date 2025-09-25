import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTask } from '../../contexts/TaskContext';
import TaskCard from './TaskCard';
import LoadingSpinner from '../common/LoadingSpinner';
import { FileText, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

const TaskList = () => {
  const { tasks, loading, error, filter, searchTerm } = useTask();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(parseInt(searchParams.get('perPage')) || 3);

  // Utiliser les tâches filtrées du contexte
  const { filteredTasks } = useTask();

  // Pagination
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
    
    // Update URL
    const newParams = new URLSearchParams(searchParams);
    newParams.set('perPage', newItemsPerPage.toString());
    newParams.delete('page'); // Reset page parameter
    setSearchParams(newParams, { replace: true });
  };

  // Gestion de la pagination via l'URL
  useEffect(() => {
    const urlPage = parseInt(searchParams.get('page')) || 1;
    if (urlPage !== currentPage) {
      setCurrentPage(urlPage);
    }
  }, [searchParams]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Grille de tâches */}
      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <>
          {filteredTasks.length === 0 ? (
            <div className="text-center py-16 fade-in">
              <div className="relative mx-auto w-24 h-24 mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-accent-400 rounded-2xl opacity-20 animate-pulse-slow"></div>
                <div className="relative w-full h-full bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl flex items-center justify-center border-2 border-primary-100">
                  <FileText className="w-10 h-10 text-primary-400" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-accent-400 to-primary-400 rounded-full flex items-center justify-center animate-bounce-subtle">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                Aucune tâche trouvée
              </h3>
              <p className="text-secondary-600 max-w-sm mx-auto leading-relaxed">
                Commencez par créer votre première tâche pour organiser votre travail efficacement.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedTasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>

              {/* Pagination et sélection d'items par page */}
              {filteredTasks.length > 0 && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
                  {/* Items per page selector */}
                  <div className="flex items-center space-x-2">
                    <label htmlFor="itemsPerPage" className="text-sm text-gray-600">
                      Éléments par page :
                    </label>
                    <select
                      id="itemsPerPage"
                      value={itemsPerPage}
                      onChange={handleItemsPerPageChange}
                      className="border rounded-md px-2 py-1 text-sm bg-white"
                    >
                      <option value="3">3</option>
                      <option value="6">6</option>
                      <option value="9">9</option>
                      <option value="12">12</option>
                    </select>
                  </div>

                  {/* Pagination buttons */}
                  {totalPages > 1 && (
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border rounded-md disabled:opacity-50"
                      >
                        Précédent
                      </button>
                      {[...Array(totalPages)].map((_, index) => (
                        <button
                          key={index + 1}
                          onClick={() => handlePageChange(index + 1)}
                          className={`px-4 py-2 border rounded-md ${
                            currentPage === index + 1 
                              ? 'bg-primary-600 text-white' 
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border rounded-md disabled:opacity-50"
                      >
                        Suivant
                      </button>
                    </div>
                  )}
                </div>
              )}

              {paginatedTasks.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  Aucune tâche ne correspond à vos critères
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default TaskList;