import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useTask } from '../../contexts/TaskContext';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const { tasks } = useTask();

  useEffect(() => {
    // Filtrer les tâches terminées récemment (dans les dernières 24h)
    const recentlyCompleted = tasks.filter(task => {
      if (task.status !== 'TERMINE') return false;
      const completedAt = new Date(task.updatedAt);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return completedAt > yesterday;
    });

    setNotifications(recentlyCompleted);
  }, [tasks]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-800 transition-colors"
      >
        <Bell className="h-6 w-6" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-50">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">
              Tâches terminées récemment
            </h3>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-gray-500 text-center">
                Aucune tâche terminée récemment
              </div>
            ) : (
              notifications.map(task => (
                <div
                  key={task.id}
                  className="p-4 border-b border-gray-100 hover:bg-gray-50"
                >
                  <div className="flex items-start">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">
                        {task.libelle}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Terminée le {new Date(task.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;