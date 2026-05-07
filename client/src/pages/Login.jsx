import { useState } from "react";
import {
  FiArrowRight,
  FiCheckCircle,
  FiGrid,
  FiLock,
  FiMail,
  FiUsers,
} from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";

import API from "../services/api";
import { validateEmail, validatePassword } from "../utils/validation";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setFieldErrors({
      ...fieldErrors,
      [e.target.name]: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const nextFieldErrors = {
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
    };

    setFieldErrors(nextFieldErrors);

    if (Object.values(nextFieldErrors).some(Boolean)) {
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("/auth/login", formData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
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
              Full-stack workspace
            </p>
            <h2 className="mt-5 text-5xl font-bold leading-tight">
              Manage projects, teams, and task progress in one place.
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              Sign in to create projects, assign work, update task status, and
              monitor overdue items with role-based access.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-white/10 p-4">
              <FiCheckCircle className="text-2xl text-emerald-300" />
              <p className="mt-3 text-sm font-semibold">Status tracking</p>
            </div>
            <div className="rounded-lg bg-white/10 p-4">
              <FiUsers className="text-2xl text-blue-300" />
              <p className="mt-3 text-sm font-semibold">Team assignment</p>
            </div>
            <div className="rounded-lg bg-white/10 p-4">
              <FiLock className="text-2xl text-amber-300" />
              <p className="mt-3 text-sm font-semibold">Role access</p>
            </div>
          </div>
        </section>

        <main className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-xl"
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
                Welcome back
              </p>
              <h2 className="mt-2 text-3xl font-bold">Login to workspace</h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Enter your credentials to continue managing projects and tasks.
              </p>
            </div>

            {error && (
              <div className="mt-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                {error}
              </div>
            )}

            <div className="mt-7 space-y-4">
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
                    placeholder="Enter your password"
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
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {loading ? "Signing in..." : "Login"}
              {!loading && <FiArrowRight />}
            </button>

            <p className="mt-6 text-center text-sm text-slate-600">
              Do not have an account?
              <Link
                to="/register"
                className="ml-2 font-bold text-blue-600 transition hover:text-blue-700"
              >
                Create one
              </Link>
            </p>
          </form>
        </main>
      </div>
    </div>
  );
}

export default Login;
