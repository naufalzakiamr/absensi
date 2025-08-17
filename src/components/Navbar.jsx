import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Aplikasi Absensi</h1>
        <ul className="flex gap-6">
          <li>
            <Link
              to="/"
              className={`hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors ${
                location.pathname === "/" ? "bg-blue-700 font-bold" : ""
              }`}
            >
              📋 Form Absensi
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
