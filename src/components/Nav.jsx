import { Link } from "react-router";

export function Nav() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <ul className="flex justify-between items-center">
        <li className="text-2xl font-bold">
          <Link to="/" className="nav-link">
            Japanese Lyrics
          </Link>
        </li>
        <div className="flex gap-6">
          <li className="text-sm font-bold">
            <Link to="/search" className="nav-link">
              Single Song Search
            </Link>
          </li>
        </div>
      </ul>
    </nav>
  );
}
