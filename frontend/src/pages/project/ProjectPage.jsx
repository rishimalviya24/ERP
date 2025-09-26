// pages/ProjectPage.jsx
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useProject } from "../../hooks/useProject";
import ProjectCard from "../../pages/project/ProjectCard";
import ProjectForm from "../../components/Students/ProjectForm";
import Modal from "../../components/Enrollment/Modal";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyState, { NoDataFound, NoSearchResults } from "../../components/EmptyState";

const ProjectPage = () => {
  const { projects = [], loading, error, fetchAllProjects, deleteProject } = useProject();
  const { user } = useSelector((state) => state.auth);

  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  useEffect(() => {
    fetchAllProjects();
  }, []);

  const handleEdit = (project) => {
    setEditingProject(project);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project? This will also remove all employee assignments.")) {
      try {
        await deleteProject(id);
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProject(null);
  };

  const getProjectStatus = (project) => {
    const now = new Date();
    const startDate = new Date(project.start_date);
    const endDate = new Date(project.end_date);

    if (project.status === "completed") return "completed";
    if (project.status === "on-hold") return "on-hold";
    if (now < startDate) return "upcoming";
    if (now > endDate) return "overdue";
    return "active";
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.project_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const projectStatus = getProjectStatus(project);
    const matchesStatus = statusFilter === "all" || projectStatus === statusFilter;
    const matchesPriority = priorityFilter === "all" || project.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const canManageProjects = user && ["admin", "instructor"].includes(user.role);

  const stats = {
    total: projects.length,
    active: projects.filter((p) => getProjectStatus(p) === "active").length,
    completed: projects.filter((p) => getProjectStatus(p) === "completed").length,
    overdue: projects.filter((p) => getProjectStatus(p) === "overdue").length,
  };

  if (loading && projects.length === 0) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
              <p className="mt-2 text-sm text-gray-600">Manage employee projects and assignments</p>
            </div>
            {canManageProjects && (
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Project
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm font-medium text-gray-600">Total Projects</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm font-medium text-gray-600">Active</p>
          <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm font-medium text-gray-600">Completed</p>
          <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm font-medium text-gray-600">Overdue</p>
          <p className="text-2xl font-bold text-gray-900">{stats.overdue}</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="all">All Status</option>
          <option value="upcoming">Upcoming</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="on-hold">On Hold</option>
          <option value="overdue">Overdue</option>
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="all">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      {error && <div className="mb-6 text-red-600">{error}</div>}

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        searchTerm ? (
          <NoSearchResults searchTerm={searchTerm} onClearSearch={() => setSearchTerm("")} />
        ) : (
          <NoDataFound
            entityName="projects"
            action={canManageProjects ? { label: "Create Project", onClick: () => setShowModal(true) } : null}
          />
        )
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onEdit={handleEdit}
              onDelete={handleDelete}
              canEdit={canManageProjects}
              canDelete={user && user.role === "admin"}
              status={getProjectStatus(project)}
            />
          ))}
        </div>
      )}

      {/* Project Form Modal */}
      {showModal && (
        <Modal onClose={handleCloseModal}>
          <ProjectForm project={editingProject} onClose={handleCloseModal} />
        </Modal>
      )}
    </div>
  );
};

export default ProjectPage;
