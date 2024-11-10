import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const NavBar = () => {
    const { isLoggedIn, logout, userId } = useAuth();
    const navigate = useNavigate();
    const [query, setQuery] = useState("");

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (!query) return
        navigate(`/search?query=${query}`)
        setQuery("")
    };

    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-white text-lg font-semibold">
                    Marketplace
                </Link>

                {/* Search Bar */}
                <form onSubmit={handleSearchSubmit} className="flex items-center">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search ads..."
                        className="p-2 rounded-l-md text-black"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
                    >
                        Search
                    </button>
                </form>

                <div>
                    {isLoggedIn ? (
                        <div className="flex justify-between items-center gap-8">
                            <Link
                                to={`/user/${userId}`}
                                className="text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Profile
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="text-white bg-red-500 px-4 py-2 rounded hover:bg-red-600"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-600">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default NavBar;