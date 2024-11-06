import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_URL;

const MyAdvertisements = () => {
    const { isLoggedIn, userId } = useAuth();
    const [advertisements, setAdvertisements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editData, setEditData] = useState({ title: '', description: '' });
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        } else {
            fetchAdvertisements();
        }
    }, [isLoggedIn, userId, navigate]);

    const fetchAdvertisements = async () => {
        setLoading(true);
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

    const updateAdvertisementTitle = async (adId) => {
        try {
            const response = await fetch(`${apiUrl}/advertisement/title/${adId}/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ newTitle: editData.title }),
            });

            if (!response.ok) throw new Error('Failed to update title');

            await fetchAdvertisements();
            setEditData({ ...editData, title: '' });
        } catch (err) {
            setError(err.message);
        }
    };

    const updateAdvertisementDescription = async (adId) => {
        try {
            const response = await fetch(`${apiUrl}/advertisement/description/${adId}/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ newDescription: editData.description }),
            });

            if (!response.ok) throw new Error('Failed to update description');

            await fetchAdvertisements();
            setEditData({ ...editData, description: '' });
        } catch (err) {
            setError(err.message);
        }
    };

    const handleImageUpload = async (adId) => {
        if (!selectedFile) {
            setError('Please select an image.');
            return;
        }

        const formData = new FormData();
        formData.append('image', selectedFile);

        setUploading(true);

        try {
            const response = await fetch(`${apiUrl}/advertisement/${adId}/images/${userId}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: formData,
            });

            if (!response.ok) throw new Error('Failed to upload image.');

            await fetchAdvertisements();
            setSelectedFile(null);
            setError('');
        } catch (err) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500 my-4">{error}</div>;

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
                                <p className="text-gray-800 mb-2">{ad.description}</p>
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

                                <div className="my-4">
                                    <input
                                        type="text"
                                        placeholder="New Title"
                                        value={editData.title}
                                        onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                                        className="border p-2 mb-2 w-full rounded"
                                    />
                                    <button
                                        onClick={() => updateAdvertisementTitle(ad.id)}
                                        className="w-full px-4 py-2 mb-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300"
                                    >
                                        Update Title
                                    </button>

                                    <textarea
                                        placeholder="New Description"
                                        value={editData.description}
                                        onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                        className="border p-2 mb-2 w-full rounded"
                                    />
                                    <button
                                        onClick={() => updateAdvertisementDescription(ad.id)}
                                        className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300"
                                    >
                                        Update Description
                                    </button>
                                </div>

                                <div className="my-4">
                                    <input
                                        type="file"
                                        onChange={(e) => setSelectedFile(e.target.files[0])}
                                        className="block w-full mb-2"
                                    />
                                    <button
                                        onClick={() => handleImageUpload(ad.id)}
                                        className="w-full px-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition duration-300"
                                        disabled={error || !selectedFile || uploading}
                                    >
                                        {uploading ? 'Uploading...' : 'Add Image'}
                                    </button>
                                </div>

                                <div className="text-center mt-4 flex justify-center gap-4">
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






