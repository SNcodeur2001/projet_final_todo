import React, { useState, useRef } from "react";
import { useTask } from "../../contexts/TaskContext";
import { X, Check, AlertCircle } from "lucide-react";
import { useFormValidation } from "../../hooks/useFormValidation";
import { ValidationSchemas } from "../../utils/validation";
import ErrorMessage, { SuccessMessage } from "../common/ErrorMessage";
import UnifiedInput from "../common/UnifiedInput";

const TaskForm = ({ task, onClose }) => {
  const { createTask, updateTask } = useTask();
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState(null);

  const [audioFile, setAudioFile] = useState(null);
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const {
    values: formData,
    errors: fieldErrors,
    handleSubmit,
    getFieldProps,
    getFieldErrorMessage,
    setFieldError,
    isValid,
    isSubmitting,
  } = useFormValidation(
    {
      libelle: task?.libelle || "",
      description: task?.description || "",
      status: task?.status || "EN_ATTENTE",
      dateDebut: task?.dateDebut || "",
      dateFin: task?.dateFin || "",
    },
    ValidationSchemas.task,
    {
      validateOnChange: true,
      validateOnBlur: true,
    }
  );

  // Fonctions d'enregistrement audio
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    chunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => chunksRef.current.push(e.data);
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const file = new File([blob], `audio-${Date.now()}.webm`, {
        type: "audio/webm",
      });
      setAudioFile(file);
    };

    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  // Gestion du submit avec FormData pour inclure l'audio
  const onSubmit = async (formData) => {
    setError(null);
    try {
      const dataToSend = new FormData();
      
      // Validation des champs requis
      if (!formData.libelle?.trim()) {
        setError("Le titre est requis");
        return;
      }

      // Validation des dates
      if (formData.dateDebut && formData.dateFin) {
        const debut = new Date(formData.dateDebut);
        const fin = new Date(formData.dateFin);
        
        if (fin < debut) {
          setError("La date de fin doit être postérieure à la date de début");
          return;
        }
      }

      // Ajout des données au FormData
      dataToSend.append("libelle", formData.libelle.trim());
      if (formData.description) {
        dataToSend.append("description", formData.description.trim());
      }
      dataToSend.append("status", formData.status || "EN_ATTENTE");
      if (formData.dateDebut) {
        dataToSend.append("dateDebut", new Date(formData.dateDebut).toISOString());
      }
      if (formData.dateFin) {
        dataToSend.append("dateFin", new Date(formData.dateFin).toISOString());
      }
      
      // Ajout du fichier audio si présent
      if (audioFile) {
        dataToSend.append("audio", audioFile);
      }

      if (task) {
        await updateTask(task.id, dataToSend);
        setSuccessMessage("Tâche modifiée avec succès !");
      } else {
        await createTask(dataToSend);
        setSuccessMessage("Tâche créée avec succès !");
      }

      setTimeout(() => {
        setSuccessMessage("");
        onClose();
      }, 1500);
    } catch (error) {
      setError(error.message || "Une erreur est survenue");
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach(err => {
          if (err.field) {
            setFieldError(err.field, err.message);
          }
        });
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        {/* Header */}
        <div className="task-form-header">
          <h3 className="task-form-title">
            {task ? "Modifier la tâche" : "Nouvelle tâche"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-400">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="ml-3 text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {successMessage && <SuccessMessage message={successMessage} />}

          <div className="space-y-4">
            <UnifiedInput
              type="text"
              label="Titre"
              required
              fieldProps={getFieldProps("libelle")}
              fieldError={getFieldErrorMessage("libelle")}
            />

            <UnifiedInput
              type="textarea"
              label="Description"
              rows={5}
              fieldProps={getFieldProps("description")}
              fieldError={getFieldErrorMessage("description")}
            />

            <UnifiedInput
              type="select"
              label="Statut"
              fieldProps={getFieldProps("status")}
              fieldError={getFieldErrorMessage("status")}
              options={[
                { value: "EN_ATTENTE", label: "En attente" },
                { value: "EN_COURS", label: "En cours" },
                { value: "TERMINE", label: "Terminé" },
              ]}
            />

            <div className="grid grid-cols-2 gap-4">
              <UnifiedInput
                type="datetime-local"
                label="Date de début"
                fieldProps={getFieldProps("dateDebut")}
                fieldError={getFieldErrorMessage("dateDebut")}
              />

              <UnifiedInput
                type="datetime-local"
                label="Date de fin"
                fieldProps={getFieldProps("dateFin")}
                fieldError={getFieldErrorMessage("dateFin")}
              />
            </div>

            {/* Enregistrement audio */}
            <div className="audio-recorder">
              <button
                type="button"
                onClick={recording ? stopRecording : startRecording}
                className="btn btn-audio"
              >
                {recording
                  ? "Arrêter l'enregistrement"
                  : "Enregistrer un audio"}
              </button>
              {audioFile && (
                <div className="mt-2">
                  <audio controls src={URL.createObjectURL(audioFile)} />
                  <span className="text-sm text-gray-600">
                    {audioFile.name}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="task-form-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={isSubmitting}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="task-form-submit"
              disabled={isSubmitting || !isValid}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  {task ? "Modification..." : "Création..."}
                </span>
              ) : (
                <span className="flex items-center">
                  <Check className="w-4 h-4 mr-2" />
                  {task ? "Modifier" : "Créer"}
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
