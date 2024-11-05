// src/pages/Profile.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const apiUrl = import.meta.env.VITE_API_URL;

const Profile = () => {
    const { userId } = useAuth();
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
    }, [userId]);

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
        </div>
    );
};

export default Profile;



