import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const apiUrl = import.meta.env.VITE_API_URL;

const UserProfile = () => {
    const { id } = useParams();
    const { userId: loggedInUserId, isLoggedIn } = useAuth();
    const [user, setUser] = useState(null);
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newLocation, setNewLocation] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [newProfileImage, setNewProfileImage] = useState(null);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchUserProfileAndAds = async () => {
            try {
                const userResponse = await fetch(`${apiUrl}/user/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                if (!userResponse.ok) {
                    throw new Error('User not found');
                }
                const userData = await userResponse.json();
                setUser(userData.user);

                const adsResponse = await fetch(`${apiUrl}/user/${id}/advertisements`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                if (!adsResponse.ok) {
                    throw new Error('Advertisements not found');
                }
                const adsData = await adsResponse.json();
                setAds(adsData.advertisements);

            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfileAndAds();
    }, [id]);

    const updateLocation = async () => {
        if (!newLocation.trim()) {
            setError('Location cannot be empty.');
            return;
        }

        try {
            setUpdating(true);
            const response = await fetch(`${apiUrl}/location/${loggedInUserId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ newLocation }),
            });

            if (!response.ok) throw new Error('Failed to update location');

            const data = await response.json();
            setUser((prevUser) => ({ ...prevUser, location: data.updatedLocation }));
            setNewLocation('');
            setError('');
        } catch (err) {
            setError(err.message);
        } finally {
            setUpdating(false);
        }
    };

    const updateDescription = async () => {
        if (!newDescription.trim()) {
            setError('Description cannot be empty.');
            return;
        }

        try {
            setUpdating(true);
            const response = await fetch(`${apiUrl}/description/${loggedInUserId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ newDescription }),
            });

            if (!response.ok) throw new Error('Failed to update description');

            const data = await response.json();
            setUser((prevUser) => ({ ...prevUser, description: data.updatedDescription }));
            setNewDescription('');
            setError('');
        } catch (err) {
            setError(err.message);
        } finally {
            setUpdating(false);
        }
    };

    const updateProfileImage = async () => {
        if (!newProfileImage) {
            setError('Please select an image to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('profileImage', newProfileImage);

        try {
            setUpdating(true);
            const response = await fetch(`${apiUrl}/profileImage/${loggedInUserId}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: formData,
            });

            if (!response.ok) throw new Error('Failed to update profile image');

            const data = await response.json();
            setUser((prevUser) => ({ ...prevUser, profileImage: data.updatedProfileImage }));
            setNewProfileImage(null);
            setError('');
        } catch (err) {
            setError(err.message);
        } finally {
            setUpdating(false);
        }
    };

    const deleteAdvertisement = async (adId) => {
        try {
            const response = await fetch(`${apiUrl}/advertisement/${adId}/${loggedInUserId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) throw new Error('Failed to delete advertisement');
            setAds(ads.filter((ad) => ad.id !== adId));
            setError('');
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <p>Loading user information...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="container mx-auto p-4">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden p-6">
                <div className="flex items-center mb-4">
                    <img
                        src={user.profileImage || '/default-profile.png'}
                        alt={`${user.name}'s profile`}
                        className="w-24 h-24 rounded-full border-2 border-gray-300 mr-4"
                    />
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">{user.name}</h2>
                        <p className="text-gray-700"><strong>Username:</strong> {user.username}</p>
                        <p className="text-gray-700"><strong>Email:</strong> {user.email}</p>
                    </div>
                </div>
                <p className="text-gray-700 mb-2"><strong>Name:</strong> {user.name}</p>
                <p className="text-gray-700 mb-2"><strong>Profession:</strong> {user.profession}</p>
                <p className="text-gray-700 mb-2"><strong>Description:</strong> {user.description}</p>
                <p className="text-gray-700 mb-2"><strong>Phone number:</strong> {user.phone}</p>
                <p className="text-gray-700 mb-2"><strong>Email:</strong> {user.email}</p>
                <p className="text-gray-700 mb-2"><strong>Profession:</strong> {user.profession}</p>
                <p className="text-gray-700 mb-2"><strong>Location:</strong> {user.location}</p>
                <p className="text-gray-700 mb-2"><strong>Joined on:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>

                {isLoggedIn && parseInt(id, 10) === loggedInUserId && (
                    <div className="mt-6 border-t pt-4">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Edit Profile</h3>

                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="New Location"
                                value={newLocation}
                                onChange={(e) => setNewLocation(e.target.value)}
                                className="border p-2 mb-2 w-full rounded"
                            />
                            <button
                                onClick={updateLocation}
                                className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300"
                                disabled={updating}
                            >
                                {updating ? 'Updating...' : 'Update Location'}
                            </button>
                        </div>

                        <div className="mb-4">
                            <textarea
                                placeholder="New Description"
                                value={newDescription}
                                onChange={(e) => setNewDescription(e.target.value)}
                                className="border p-2 mb-2 w-full rounded"
                            />
                            <button
                                onClick={updateDescription}
                                className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300"
                                disabled={updating}
                            >
                                {updating ? 'Updating...' : 'Update Description'}
                            </button>
                        </div>

                        <div className="mb-4">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setNewProfileImage(e.target.files[0])}
                                className="block w-full mb-2"
                            />
                            <button
                                onClick={updateProfileImage}
                                className="w-full px-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition duration-300"
                                disabled={updating}
                            >
                                {updating ? 'Updating...' : 'Update Profile Image'}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-6">
                <h3 className="text-2xl font-semibold">Advertisements</h3>

                {isLoggedIn && parseInt(id, 10) === loggedInUserId && (
                    <Link
                        to="/advertisement/new"
                        className="mb-4 inline-block px-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition duration-300"
                    >
                        Add New Advertisement
                    </Link>
                )}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-4">
                    {ads.length > 0 ? (
                        ads.map((ad) => (
                            <div key={ad.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
                                <div className="p-4">
                                    <h4 className="text-xl font-semibold text-gray-800 mb-2">{ad.title}</h4>
                                    <p className="text-gray-600 mb-4">{ad.description}</p>
                                    {ad.images && ad.images.length > 0 ? (
                                        <img
                                            src={ad.images[0].imageUrl}
                                            alt={`Image for ad ${ad.id}`}
                                            className="w-full h-48 object-cover rounded-md mb-4"
                                        />
                                    ) : (
                                        <p className="text-gray-500 mb-4">No images available</p>
                                    )}
                                    <p className="text-sm text-gray-500">Created on: {new Date(ad.createdAt).toLocaleDateString()}</p>

                                    {isLoggedIn && parseInt(id, 10) === loggedInUserId && (
                                        <button
                                            onClick={() => deleteAdvertisement(ad.id)}
                                            className="mt-4 w-full px-4 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition duration-300"
                                        >
                                            Delete Advertisement
                                        </button>
                                    )}
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
                        ))
                    ) : (
                        <p className="text-gray-700 text-center">No advertisements found for this user.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;