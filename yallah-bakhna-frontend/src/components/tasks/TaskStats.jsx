import React from 'react';
import { useTask } from '../../contexts/TaskContext';
import { CheckCircle, Clock, AlertCircle, ListTodo } from 'lucide-react';

const TaskStats = () => {
  const { tasks } = useTask();

  const stats = [
    {
      label: 'Total',
      value: tasks.length,
      icon: ListTodo,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      label: 'En attente',
      value: tasks.filter(t => t.status === 'EN_ATTENTE').length,
      icon: Clock,
      color: 'text-yellow-600 bg-yellow-100'
    },
    {
      label: 'En cours',
      value: tasks.filter(t => t.status === 'EN_COURS').length,
      icon: AlertCircle,
      color: 'text-orange-600 bg-orange-100'
    },
    {
      label: 'Terminées',
      value: tasks.filter(t => t.status === 'TERMINE').length,
      icon: CheckCircle,
      color: 'text-green-600 bg-green-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="card">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TaskStats;