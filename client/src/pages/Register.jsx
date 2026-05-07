import { useState } from "react";
import {
  FiArrowRight,
  FiCheckCircle,
  FiGrid,
  FiLock,
  FiMail,
  FiShield,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";

import API from "../services/api";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "../utils/validation";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "member",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });

    setFieldErrors({
      ...fieldErrors,
      [event.target.name]: "",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const nextFieldErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      role: ["admin", "member"].includes(formData.role)
        ? ""
        : "Select a valid role",
    };

    setFieldErrors(nextFieldErrors);

    if (Object.values(nextFieldErrors).some(Boolean)) {
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("/auth/register", {
        ...formData,
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
      });

      setSuccess(res.data.message || "Account created successfully");
      setTimeout(() => navigate("/"), 700);
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
        <main className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-xl"
            noValidate
          >
            <div className="mb-8 lg:hidden">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-950 text-white">
                  <FiGrid className="text-xl" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-600">
                    Team Task
                  </p>
                  <h1 className="text-xl font-bold">Manager</h1>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                Start your workspace
              </p>
              <h2 className="mt-2 text-3xl font-bold">Create an account</h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Add your details and choose a role to join the task board.
              </p>
            </div>

            {error && (
              <div className="mt-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                {error}
              </div>
            )}

            {success && (
              <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                {success}
              </div>
            )}

            <div className="mt-7 space-y-4">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">
                  Full name
                </span>
                <div className="mt-2 flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
                  <FiUser className="text-slate-400" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-slate-400"
                    required
                  />
                </div>
                {fieldErrors.name && (
                  <p className="mt-2 text-sm font-semibold text-rose-600">
                    {fieldErrors.name}
                  </p>
                )}
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">
                  Email address
                </span>
                <div className="mt-2 flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
                  <FiMail className="text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-slate-400"
                    required
                  />
                </div>
                {fieldErrors.email && (
                  <p className="mt-2 text-sm font-semibold text-rose-600">
                    {fieldErrors.email}
                  </p>
                )}
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">
                  Password
                </span>
                <div className="mt-2 flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
                  <FiLock className="text-slate-400" />
                  <input
                    type="password"
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-slate-400"
                    required
                  />
                </div>
                {fieldErrors.password && (
                  <p className="mt-2 text-sm font-semibold text-rose-600">
                    {fieldErrors.password}
                  </p>
                )}
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">
                  Role
                </span>
                <div className="mt-2 flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
                  <FiShield className="text-slate-400" />
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full bg-transparent text-sm font-medium outline-none"
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                {fieldErrors.role && (
                  <p className="mt-2 text-sm font-semibold text-rose-600">
                    {fieldErrors.role}
                  </p>
                )}
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {loading ? "Creating account..." : "Create account"}
              {!loading && <FiArrowRight />}
            </button>

            <p className="mt-6 text-center text-sm text-slate-600">
              Already have an account?
              <Link
                to="/"
                className="ml-2 font-bold text-blue-600 transition hover:text-blue-700"
              >
                Login
              </Link>
            </p>
          </form>
        </main>

        <section className="hidden bg-slate-950 px-12 py-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white text-slate-950">
              <FiGrid className="text-2xl" />
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-300">Team Task</p>
              <h1 className="text-2xl font-bold">Manager</h1>
            </div>
          </div>

          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-300">
              Designed for focused teams
            </p>
            <h2 className="mt-5 text-5xl font-bold leading-tight">
              Build a cleaner workflow from the first task.
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              Admins can organize projects and assign tasks. Members can follow
              priorities, update progress, and keep deadlines visible.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-white/10 p-4">
              <FiCheckCircle className="text-2xl text-emerald-300" />
              <p className="mt-3 text-sm font-semibold">Clear progress</p>
            </div>
            <div className="rounded-lg bg-white/10 p-4">
              <FiUsers className="text-2xl text-blue-300" />
              <p className="mt-3 text-sm font-semibold">Shared ownership</p>
            </div>
            <div className="rounded-lg bg-white/10 p-4">
              <FiShield className="text-2xl text-amber-300" />
              <p className="mt-3 text-sm font-semibold">Role controls</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Register;
