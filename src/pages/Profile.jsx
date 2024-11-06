import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_URL;

const Profile = () => {
    const { userId, isLoggedIn } = useAuth();
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const [newLocation, setNewLocation] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [newProfileImage, setNewProfileImage] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        const fetchUser = async () => {
            if (!userId) {
                setError("User ID is missing.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${apiUrl}/user/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`Error fetching user: ${response.statusText}`);
                }

                const data = await response.json();
                setUser(data.user);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId, isLoggedIn, navigate]);

    // Function to handle location update
    const updateLocation = async () => {
        try {
            const response = await fetch(`${apiUrl}/location/${userId}`, {
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
            setNewLocation(''); // Clear the input
        } catch (err) {
            setError(err.message);
        }
    };

    // Function to handle description update
    const updateDescription = async () => {
        try {
            const response = await fetch(`${apiUrl}/description/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ newDescription }),
            });

            if (!response.ok) throw new Error('Failed to update description');

            const data = await response.json();
            setUser((prevUser) => ({ ...prevUser, description: data.updatedDescription }));
            setNewDescription(''); // Clear the input
        } catch (err) {
            setError(err.message);
        }
    };

    // Function to handle profile image update
    const updateProfileImage = async () => {
        if (!newProfileImage) {
            setError('Please select an image to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('profileImage', newProfileImage);

        try {
            const response = await fetch(`${apiUrl}/profileImage/${userId}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: formData,
            });

            if (!response.ok) throw new Error('Failed to update profile image');

            const data = await response.json();
            setUser((prevUser) => ({ ...prevUser, profileImage: data.updatedProfileImage }));
            setNewProfileImage(null); // Clear the file input
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    if (!user) {
        return <div>No user data available.</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-3xl font-bold mb-4">Profile</h2>
            {user.profileImage ? (
                <img
                    src={user.profileImage}
                    alt={`${user.username}'s profile`}
                    className="w-32 h-32 rounded-full mb-4 object-cover"
                />
            ) : (
                <div className="w-32 h-32 rounded-full mb-4 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                </div>
            )}
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p><strong>Profession:</strong> {user.profession}</p>
            <p><strong>Location:</strong> {user.location}</p>
            <p><strong>Description:</strong> {user.description}</p>

            {/* Update Location */}
            <div className="mt-4">
                <input
                    type="text"
                    placeholder="New Location"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="border p-2 mb-2 w-full rounded"
                />
                <button
                    onClick={updateLocation}
                    className="w-full px-4 py-2 mb-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300"
                >
                    Update Location
                </button>
            </div>

            {/* Update Description */}
            <div className="mt-4">
                <textarea
                    placeholder="New Description"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="border p-2 mb-2 w-full rounded"
                />
                <button
                    onClick={updateDescription}
                    className="w-full px-4 py-2 mb-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300"
                >
                    Update Description
                </button>
            </div>

            {/* Update Profile Image */}
            <div className="mt-4">
                <input
                    type="file"
                    onChange={(e) => setNewProfileImage(e.target.files[0])}
                    className="mb-2"
                />
                <button
                    onClick={updateProfileImage}
                    className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300"
                >
                    Update Profile Image
                </button>
            </div>
        </div>
    );
};

export default Profile;





