import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_URL;

const MyAdvertisements = () => {
    const { isLoggedIn, userId } = useAuth();
    const [advertisements, setAdvertisements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        } else {
            const fetchAdvertisements = async () => {
                try {
                    const response = await fetch(`${apiUrl}/user/${userId}/advertisements`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    });

                    if (!response.ok) throw new Error('Failed to fetch advertisements');

                    const data = await response.json();
                    setAdvertisements(data.advertisements);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };

            fetchAdvertisements();
        }
    }, [isLoggedIn, userId, navigate]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-3xl font-bold mb-4">My Advertisements</h2>
            <Link
                to="/advertisement/new"
                className="mb-4 inline-block px-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition duration-300"
            >
                Add New Advertisement
            </Link>

            {advertisements.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {advertisements.map((ad) => (
                        <div key={ad.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
                            <div className="p-4">
                                <h2 className="text-xl font-semibold text-gray-800 mb-2">{ad.title}</h2>
                                <div className="mb-4">
                                    {ad.images && ad.images.length > 0 ? (
                                        <img
                                            src={ad.images[0].imageUrl}
                                            alt={`Image for ad ${ad.id}`}
                                            className="w-full h-48 object-cover rounded-md"
                                        />
                                    ) : (
                                        <p className="text-gray-500">No images available</p>
                                    )}
                                </div>
                                <p className="text-sm text-gray-500">
                                    Created on: {new Date(ad.createdAt).toLocaleDateString()}
                                </p>
                                <div className="text-center mt-4">
                                    <Link
                                        to={`/advertisement/${ad.id}`}
                                        className="inline-block px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-700 text-center">You have no advertisements.</p>
            )}
        </div>
    );
};

export default MyAdvertisements;





