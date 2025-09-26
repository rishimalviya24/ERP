// components/ProjectCard.jsx
import React from "react";

const ProjectCard = ({ project, onEdit, onDelete, canEdit, canDelete, status }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case "upcoming": return { bg: "bg-blue-100", text: "text-blue-800", label: "Upcoming" };
      case "active": return { bg: "bg-green-100", text: "text-green-800", label: "Active" };
      case "completed": return { bg: "bg-gray-100", text: "text-gray-800", label: "Completed" };
      case "on-hold": return { bg: "bg-yellow-100", text: "text-yellow-800", label: "On Hold" };
      case "overdue": return { bg: "bg-red-100", text: "text-red-800", label: "Overdue" };
      default: return { bg: "bg-gray-100", text: "text-gray-800", label: "Unknown" };
    }
  };

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case "critical": return { bg: "bg-red-100", text: "text-red-800", label: "Critical", icon: "🔴" };
      case "high": return { bg: "bg-orange-100", text: "text-orange-800", label: "High", icon: "🟠" };
      case "medium": return { bg: "bg-yellow-100", text: "text-yellow-800", label: "Medium", icon: "🟡" };
      case "low": return { bg: "bg-green-100", text: "text-green-800", label: "Low", icon: "🟢" };
      default: return { bg: "bg-gray-100", text: "text-gray-800", label: "Normal", icon: "⚪" };
    }
  };

  const statusConfig = getStatusConfig(status);
  const priorityConfig = getPriorityConfig(project.priority);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  const calculateProgress = () => {
    if (status === "completed") return 100;
    if (status === "upcoming") return 0;
    const now = new Date();
    const start = new Date(project.start_date);
    const end = new Date(project.end_date);
    const total = end - start;
    const elapsed = now - start;
    if (elapsed < 0) return 0;
    if (elapsed > total) return 100;
    return Math.round((elapsed / total) * 100);
  };

  const progress = calculateProgress();
  const assignedEmployees = project.employees || [];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-900 flex-1">{project.project_name}</h3>
              <span className="text-lg ml-2">{priorityConfig.icon}</span>
            </div>
            {project.description && <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.description}</p>}
          </div>

          {(canEdit || canDelete) && (
            <div className="flex items-center space-x-1 ml-4">
              {canEdit && <button onClick={() => onEdit(project)}>Edit</button>}
              {canDelete && <button onClick={() => onDelete(project._id)}>Delete</button>}
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between mb-2 text-sm text-gray-700">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${progress === 100 ? "bg-green-500" : "bg-blue-500"}`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="text-sm text-gray-500 mt-2">
          <div>Dates: {formatDate(project.start_date)} - {formatDate(project.end_date)}</div>
          <div>Manager: {project.manager?.username || "Unassigned"}</div>
          <div>Budget: ${project.budget?.toLocaleString() || 0}</div>
          <div>{assignedEmployees.length} employee{assignedEmployees.length !== 1 ? "s" : ""} assigned</div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg flex justify-between items-center">
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>{statusConfig.label}</span>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityConfig.bg} ${priorityConfig.text}`}>{priorityConfig.label}</span>
      </div>
    </div>
  );
};

export default ProjectCard;
