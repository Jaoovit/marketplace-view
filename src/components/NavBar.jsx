import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavBar = () => {
    const { isLoggedIn, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-white text-lg font-semibold">
                    Marketplace
                </Link>
                <div>
                {isLoggedIn ? (
                <div className='flex justify-between items-center gap-8'>
                    <Link to="/profile" className="text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-600">
                        Profile
                    </Link>
                    <Link to="/my-advertisements" className="text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-600">
                        My Advertisements
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



