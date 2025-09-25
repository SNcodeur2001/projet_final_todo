import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Check, Edit2, Trash2, Clock, Eye } from "lucide-react";
import { useTask } from "../../contexts/TaskContext";
import { taskService } from "../../services/taskService";
import TaskForm from "./TaskForm";
import { useAuth } from "../../contexts/AuthContext";

const TaskCard = ({ task }) => {
  const { user } = useAuth();
  const [attachments, setAttachments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [error, setError] = useState(null);
  const [userPermission, setUserPermission] = useState(null);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(true);

  const { markAsComplete, deleteTask } = useTask();
  const navigate = useNavigate();

  // Récupérer les pièces jointes
  useEffect(() => {
    const fetchAttachments = async () => {
      if (!task.id) return;
      try {
        const response = await taskService.getAttachments(task.id);
        const attachmentsData = response.data?.data || response.data || [];
        setAttachments(Array.isArray(attachmentsData) ? attachmentsData : []);
      } catch (err) {
        console.error("Erreur lors du chargement des fichiers:", err);
        setAttachments([]);
      }
    };
    fetchAttachments();
  }, [task.id]);

  // Permissions utilisateur
  useEffect(() => {
    const fetchUserPermission = async () => {
      setIsLoadingPermissions(true);
      try {
        const permissions = await taskService.getTaskPermissions(task.id);
        const permissionObj = permissions.find(
          (p) => String(p.userId) === String(user.id)
        );
        setUserPermission(permissionObj?.permission?.toUpperCase() || null);
      } catch (err) {
        console.error("Erreur permissions:", err);
        setUserPermission(null);
      } finally {
        setIsLoadingPermissions(false);
      }
    };
    if (user && task.id) fetchUserPermission();
    else setIsLoadingPermissions(false);
  }, [user, task.id]);

  const canModify =
    userPermission === "MODIFY_ONLY" || userPermission === "FULL_ACCESS";
  const canDelete = userPermission === "FULL_ACCESS";
  const isCreator = user?.id === task.userId;

  const handleMarkComplete = async (e) => {
    e.stopPropagation();
    setIsLoading(true);
    setError(null);
    try {
      await markAsComplete(task.id);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors du marquage");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm("Voulez-vous vraiment supprimer cette tâche ?")) return;
    setIsLoading(true);
    setError(null);
    try {
      await deleteTask(task.id);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la suppression");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="task-card border rounded-md p-4 bg-white shadow-sm hover:shadow-md transition">
        {error && (
          <div className="error-message flex items-center gap-1 mb-2 text-red-600 text-xs">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        {/* Header */}
        <div className="task-header flex justify-between items-center mb-2">
          <h3 className="task-title font-semibold">{task.libelle}</h3>
          <span
            className={`task-status px-2 py-1 rounded text-xs ${
              task.status === "TERMINE"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {task.status === "TERMINE" ? "Terminé" : "En cours"}
          </span>
        </div>

        {/* Description */}
        {task.description && (
          <p className="task-description text-gray-700 mb-3">{task.description}</p>
        )}

        {/* Media : Audio + Images */}
        <div className="task-media flex flex-col gap-3 mb-3">
          {/* Audio */}
          {task.audioUrl && (
            <div className="task-audio p-3 bg-gray-50 border border-gray-200 rounded-md flex items-center gap-3">
              <audio controls className="w-full">
                <source src={task.audioUrl} type="audio/mpeg" />
              </audio>
              <span
                className="text-sm text-gray-600 truncate"
                title={task.audioUrl.split("/").pop()}
              >
                {task.audioUrl.split("/").pop()}
              </span>
            </div>
          )}

          {/* Images */}
          {attachments.length > 0 && (
            <div className="task-images grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-60 overflow-y-auto">
              {attachments
                .filter((att) => att.mimetype.startsWith("image/"))
                .map((att) => (
                  <img
                    key={att.filename}
                    src={`${import.meta.env.VITE_API_URL1}/uploads/images/${att.filename}`}
                    alt={att.originalName}
                    className="w-full h-40 object-cover rounded-md border"
                  />
                ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="task-actions flex justify-between items-center mt-3 flex-wrap gap-2">
          <div className="task-date flex items-center gap-1 text-gray-500 text-sm">
            <Clock className="w-4 h-4" />
            <span>
              {task.createdAt && !isNaN(new Date(task.createdAt).getTime())
                ? new Date(task.createdAt).toLocaleDateString()
                : ""}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {task.status !== "TERMINE" && (
              <button
                onClick={handleMarkComplete}
                disabled={isLoading}
                className="btn-complete p-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                <Check className="w-4 h-4" />
              </button>
            )}

            {(isCreator || canModify) && !isLoadingPermissions && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowEditForm(true);
                }}
                disabled={isLoading}
                className="btn-edit p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}

            {(isCreator || canDelete) && !isLoadingPermissions && (
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="btn-delete p-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/tasks/${task.id}`);
              }}
              className="btn-view p-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Formulaire édition */}
      {showEditForm && (
        <TaskForm
          task={task}
          onClose={() => setShowEditForm(false)}
          isEditing={true}
          onError={(errorMessage) => setError(errorMessage)}
        />
      )}
    </>
  );
};

export default TaskCard;
