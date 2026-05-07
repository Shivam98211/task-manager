import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiActivity,
  FiAlertTriangle,
  FiCheckCircle,
  FiClock,
  FiFolder,
  FiGrid,
  FiLogOut,
  FiPlus,
  FiRefreshCw,
  FiUsers,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import API from "../services/api";

const emptyProject = {
  title: "",
  description: "",
};

const emptyTask = {
  title: "",
  description: "",
  project: "",
  assignedTo: "",
  dueDate: "",
};

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [projectForm, setProjectForm] = useState(emptyProject);
  const [taskForm, setTaskForm] = useState(emptyTask);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [activeSection, setActiveSection] = useState("dashboard");
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  const isAdmin = currentUser?.role === "admin";

  const authConfig = useMemo(
    () => ({
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }),
    []
  );

  const fetchWorkspace = useCallback(async () => {
    try {
      const [statsRes, projectsRes, tasksRes, usersRes] = await Promise.all([
        API.get("/dashboard/stats", authConfig),
        API.get("/projects", authConfig),
        API.get("/tasks", authConfig),
        API.get("/users", authConfig),
      ]);

      setStats(statsRes.data);
      setProjects(projectsRes.data);
      setTasks(tasksRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to load workspace");
    } finally {
      setLoading(false);
    }
  }, [authConfig]);

  useEffect(() => {
    queueMicrotask(fetchWorkspace);
  }, [fetchWorkspace]);

  const totalTasks = stats.totalTasks || 0;
  const pendingTasks = stats.pendingTasks || 0;
  const completedTasks = stats.completedTasks || 0;
  const inProgressTasks = stats.inProgressTasks || 0;
  const overdueTasks = stats.overdueTasks || 0;
  const completionRate = totalTasks
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  const statCards = [
    {
      title: "Total Tasks",
      value: totalTasks,
      icon: FiGrid,
      color: "bg-slate-950",
    },
    {
      title: "Pending",
      value: pendingTasks,
      icon: FiClock,
      color: "bg-amber-500",
    },
    {
      title: "In Progress",
      value: inProgressTasks,
      icon: FiActivity,
      color: "bg-blue-600",
    },
    {
      title: "Overdue",
      value: overdueTasks,
      icon: FiAlertTriangle,
      color: "bg-rose-600",
    },
  ];

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: FiGrid },
    { id: "projects", label: "Projects", icon: FiFolder },
    { id: "team", label: "Team", icon: FiUsers },
  ];

  const statusStyles = {
    pending: "border-amber-200 bg-amber-50 text-amber-700",
    "in-progress": "border-blue-200 bg-blue-50 text-blue-700",
    completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  };

  const formatStatus = (status) =>
    status === "in-progress"
      ? "In Progress"
      : status?.charAt(0).toUpperCase() + status?.slice(1);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleRefresh = () => {
    setLoading(true);
    setMessage("");
    fetchWorkspace();
  };

  const handleNavClick = (sectionId) => {
    setActiveSection(sectionId);
    document
      .getElementById(`${sectionId}-section`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleProjectSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      await API.post("/projects", projectForm, authConfig);
      setProjectForm(emptyProject);
      await fetchWorkspace();
      setMessage("Project created successfully");
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to create project");
    }
  };

  const handleTaskSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      await API.post("/tasks", taskForm, authConfig);
      setTaskForm(emptyTask);
      await fetchWorkspace();
      setMessage("Task created successfully");
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to create task");
    }
  };

  const updateTaskStatus = async (taskId, status) => {
    setMessage("");

    try {
      await API.put(`/tasks/${taskId}`, { status }, authConfig);
      await fetchWorkspace();
      setMessage("Task status updated");
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to update task");
    }
  };

  const isOverdue = (task) =>
    task.dueDate &&
    task.status !== "completed" &&
    new Date(task.dueDate) < new Date();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white px-5 py-6 lg:block">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-950 text-white">
            <FiGrid className="text-xl" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Team Task</p>
            <h1 className="text-lg font-bold">Manager</h1>
          </div>
        </div>

        <nav className="mt-10 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-semibold transition ${
                  isActive
                    ? "bg-slate-950 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon />
                {item.label}
              </button>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="absolute bottom-6 left-5 right-5 flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <FiLogOut />
          Logout
        </button>
      </aside>

      <main className="lg:pl-64">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-6 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                {currentUser?.role ? `${currentUser.role} workspace` : "Workspace"}
              </p>
              <h2 className="mt-1 text-3xl font-bold tracking-tight">
                Good to see you{currentUser?.name ? `, ${currentUser.name}` : ""}
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-500">
                Create projects, assign work to team members, track status, and
                watch overdue tasks from one role-aware dashboard.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <FiRefreshCw className={loading ? "animate-spin" : ""} />
                Refresh
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 lg:hidden"
              >
                <FiLogOut />
                Logout
              </button>
            </div>
          </div>

          <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-5 pb-4 sm:px-8 lg:hidden">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                    isActive
                      ? "bg-slate-950 text-white"
                      : "border border-slate-200 bg-white text-slate-600"
                  }`}
                >
                  <Icon />
                  {item.label}
                </button>
              );
            })}
          </div>
        </section>

        <section
          id="dashboard-section"
          className="mx-auto max-w-7xl scroll-mt-6 px-5 py-8 sm:px-8"
        >
          {message && (
            <div className="mb-5 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-800">
              {message}
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map((card) => {
              const Icon = card.icon;

              return (
                <article
                  key={card.title}
                  className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-500">
                        {card.title}
                      </p>
                      <p className="mt-3 text-4xl font-bold">
                        {loading ? "--" : card.value}
                      </p>
                    </div>
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-lg text-white ${card.color}`}
                    >
                      <Icon className="text-xl" />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_380px]">
            <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-xl font-bold">Tasks</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Assignment, ownership, due dates, and current status.
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700">
                    {completionRate}% complete
                  </span>
                </div>
                <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-emerald-600 transition-all"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {tasks.length === 0 && (
                  <div className="p-6 text-sm text-slate-500">
                    No tasks yet. Admins can create and assign the first task.
                  </div>
                )}

                {tasks.map((task) => (
                  <article
                    key={task._id}
                    className="grid gap-4 p-6 transition hover:bg-slate-50/80 lg:grid-cols-[1fr_190px]"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-lg font-bold">{task.title}</h4>
                        <span
                          className={`rounded-full border px-2.5 py-1 text-xs font-bold ${
                            statusStyles[task.status] ||
                            "border-slate-200 bg-slate-50 text-slate-700"
                          }`}
                        >
                          {formatStatus(task.status)}
                        </span>
                        {isOverdue(task) && (
                          <span className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700">
                            Overdue
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {task.description || "No description provided."}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
                        <span className="rounded-full bg-slate-100 px-3 py-1">
                          {task.project?.title || "No project"}
                        </span>
                        <span className="rounded-full bg-slate-100 px-3 py-1">
                          {task.assignedTo?.name || "Unassigned"}
                        </span>
                        <span className="rounded-full bg-slate-100 px-3 py-1">
                          Due {task.dueDate
                            ? new Date(task.dueDate).toLocaleDateString()
                            : "not set"}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                        Status
                      </label>
                      <select
                        value={task.status}
                        onChange={(event) =>
                          updateTaskStatus(task._id, event.target.value)
                        }
                        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-blue-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <div className="space-y-6">
              <section
                id="projects-section"
                className="scroll-mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h3 className="flex items-center gap-2 text-lg font-bold">
                  <FiFolder />
                  Projects
                </h3>
                <div className="mt-4 space-y-3">
                  {projects.length === 0 && (
                    <p className="text-sm text-slate-500">
                      No projects created yet.
                    </p>
                  )}

                  {projects.map((project) => (
                    <div
                      key={project._id}
                      className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-3"
                    >
                      <p className="font-bold">{project.title}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {project.description || "No description provided."}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {isAdmin && (
                <>
                  <form
                    onSubmit={handleProjectSubmit}
                    className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <h3 className="flex items-center gap-2 text-lg font-bold">
                      <FiFolder />
                      New Project
                    </h3>
                    <input
                      value={projectForm.title}
                      onChange={(event) =>
                        setProjectForm({
                          ...projectForm,
                          title: event.target.value,
                        })
                      }
                      placeholder="Project title"
                      className="mt-4 w-full rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-500"
                    />
                    <textarea
                      value={projectForm.description}
                      onChange={(event) =>
                        setProjectForm({
                          ...projectForm,
                          description: event.target.value,
                        })
                      }
                      placeholder="Project description"
                      className="mt-3 min-h-24 w-full rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-500"
                    />
                    <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800">
                      <FiPlus />
                      Create Project
                    </button>
                  </form>

                  <form
                    onSubmit={handleTaskSubmit}
                    className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <h3 className="flex items-center gap-2 text-lg font-bold">
                      <FiCheckCircle />
                      New Task
                    </h3>
                    <input
                      value={taskForm.title}
                      onChange={(event) =>
                        setTaskForm({ ...taskForm, title: event.target.value })
                      }
                      placeholder="Task title"
                      className="mt-4 w-full rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-500"
                    />
                    <textarea
                      value={taskForm.description}
                      onChange={(event) =>
                        setTaskForm({
                          ...taskForm,
                          description: event.target.value,
                        })
                      }
                      placeholder="Task description"
                      className="mt-3 min-h-20 w-full rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-500"
                    />
                    <select
                      value={taskForm.project}
                      onChange={(event) =>
                        setTaskForm({
                          ...taskForm,
                          project: event.target.value,
                        })
                      }
                      className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-500"
                    >
                      <option value="">Select project</option>
                      {projects.map((project) => (
                        <option key={project._id} value={project._id}>
                          {project.title}
                        </option>
                      ))}
                    </select>
                    <select
                      value={taskForm.assignedTo}
                      onChange={(event) =>
                        setTaskForm({
                          ...taskForm,
                          assignedTo: event.target.value,
                        })
                      }
                      className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-500"
                    >
                      <option value="">Assign to</option>
                      {users.map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.name} ({user.role})
                        </option>
                      ))}
                    </select>
                    <input
                      type="date"
                      value={taskForm.dueDate}
                      onChange={(event) =>
                        setTaskForm({
                          ...taskForm,
                          dueDate: event.target.value,
                        })
                      }
                      className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-500"
                    />
                    <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700">
                      <FiPlus />
                      Assign Task
                    </button>
                  </form>
                </>
              )}

              <section
                id="team-section"
                className="scroll-mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h3 className="flex items-center gap-2 text-lg font-bold">
                  <FiUsers />
                  Team
                </h3>
                <div className="mt-4 space-y-3">
                  {users.map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50 px-4 py-3"
                    >
                      <div>
                        <p className="font-bold">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-bold capitalize text-slate-700">
                        {user.role}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
