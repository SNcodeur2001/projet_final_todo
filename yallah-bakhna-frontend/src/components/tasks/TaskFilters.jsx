import React, { useState, useEffect, useCallback } from 'react';
import { useTask } from '../../contexts/TaskContext';
import { Search } from 'lucide-react';
import UnifiedInput from '../common/UnifiedInput';

const TaskFilters = () => {
  const { filter, setFilter, searchTerm, setSearchTerm, tasks } = useTask();
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  // Update local search term when context changes
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  // Debounced search update
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(localSearchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearchTerm, setSearchTerm]);

  const handleClearSearch = () => {
    setLocalSearchTerm('');
    setSearchTerm('');
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const filterOptions = [
    { value: 'ALL', label: 'Toutes', count: tasks.length },
    { value: 'EN_ATTENTE', label: 'En attente', count: tasks.filter(t => t.status === 'EN_ATTENTE').length },
    { value: 'EN_COURS', label: 'En cours', count: tasks.filter(t => t.status === 'EN_COURS').length },
    { value: 'TERMINE', label: 'Terminées', count: tasks.filter(t => t.status === 'TERMINE').length }
  ];

  return (
    <div className="space-y-4 mb-6">
      {/* Search Input */}
      <UnifiedInput
        type="search"
        placeholder="Rechercher des tâches..."
        fieldProps={{
          name: 'search',
          value: localSearchTerm,
          onChange: (e) => setLocalSearchTerm(e.target.value),
          onBlur: () => {}
        }}
        onClearSearch={handleClearSearch}
        showClearButton={true}
        leftIcon={<Search className="h-5 w-5 text-gray-400" />}
      />

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleFilterChange(option.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === option.value
                ? 'bg-primary-500 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {option.label} ({option.count})
          </button>
        ))}
      </div>
    </div>
  );
};

export default TaskFilters;