import { Link } from "react-router";

export default function PublicNavigation() {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <Link
        to="/pub"
        className="flex flex-col space-y-3 md:space-y-0 md:flex-row items-center justify-between"
      >
        <h1 className="text-2xl font-bold text-gray-900">ธนาคารความดี</h1>
      </Link>
    </nav>
  );
}
