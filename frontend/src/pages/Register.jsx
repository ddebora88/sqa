import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api/client.js";
import { useAuth } from "../api/auth-context.jsx";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "farmer" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token, user } = await api.register(form);
      login(token, user);
      navigate(user.role === "farmer" ? "/farmer" : "/mill");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold text-leaf-800 mb-6">Buat Akun</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Nama" value={form.name} onChange={update("name")} required />
        <Field
          label="Email"
          type="email"
          value={form.email}
          onChange={update("email")}
          required
        />
        <Field
          label="Kata sandi (min. 8 karakter)"
          type="password"
          value={form.password}
          onChange={update("password")}
          required
          minLength={8}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Peran</label>
          <select
            value={form.role}
            onChange={update("role")}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-leaf-600"
          >
            <option value="farmer">Petani</option>
            <option value="mill">PKS (Pabrik Kelapa Sawit)</option>
          </select>
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-leaf-700 hover:bg-leaf-800 disabled:opacity-60 text-white py-2.5 rounded-md font-medium"
        >
          {loading ? "Memproses..." : "Daftar"}
        </button>
      </form>
      <p className="text-sm text-gray-600 mt-4">
        Sudah punya akun?{" "}
        <Link to="/login" className="text-leaf-700 font-medium hover:underline">
          Masuk
        </Link>
      </p>
    </div>
  );
}

function Field({ label, ...inputProps }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        {...inputProps}
        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-leaf-600"
      />
    </div>
  );
}
