import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../api/auth-context.jsx";

export default function Navbar() {
  const { session, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="bg-leaf-700 text-white shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold text-lg">
          <span aria-hidden="true">🌴</span>
          AgriTrace
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          {session ? (
            <>
              <span className="hidden sm:inline text-leaf-100">
                {session.user.name} · {session.user.role === "farmer" ? "Petani" : "PKS"}
              </span>
              <Link
                to={session.user.role === "farmer" ? "/farmer" : "/mill"}
                className="hover:underline"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="bg-leaf-800 hover:bg-leaf-900 px-3 py-1.5 rounded-md"
              >
                Keluar
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">
                Masuk
              </Link>
              <Link
                to="/register"
                className="bg-leaf-800 hover:bg-leaf-900 px-3 py-1.5 rounded-md"
              >
                Daftar
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
