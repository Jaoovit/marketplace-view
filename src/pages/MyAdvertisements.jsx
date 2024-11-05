import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

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
            {advertisements.length === 0 ? (
                <p>You have no advertisements.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {advertisements.map((ad) => (
                        <div key={ad.id} className="border border-gray-300 p-4 rounded-md shadow-sm">
                            <h3 className="text-xl font-semibold">{ad.title}</h3>
                            <p className="text-gray-700">{ad.description}</p>
                            {ad.images && ad.images.length > 0 && (
                                <img
                                    src={ad.images[0].url}
                                    alt={ad.title}
                                    className="mt-2 w-full h-48 object-cover rounded-md"
                                />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyAdvertisements;

