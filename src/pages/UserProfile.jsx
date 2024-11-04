import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";

const apiUrl = import.meta.env.VITE_API_URL;

const UserProfile = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserProfileAndAds = async () => {
            try {
                const userResponse = await fetch(`${apiUrl}/user/${id}`);
                if (!userResponse.ok) {
                    throw new Error('User not found');
                }
                const userData = await userResponse.json();
                setUser(userData.user);

                const adsResponse = await fetch(`${apiUrl}/user/${id}/advertisements`);
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

    if (loading) return <p>Loading user information...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="container mx-auto p-4">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden p-6">
                <div className="flex items-center mb-4">
                    <img
                        src={user.profileImage}
                        alt={`${user.name}'s profile`}
                        className="w-24 h-24 rounded-full border-2 border-gray-300 mr-4"
                    />
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">{user.name}</h2>
                        <p className="text-gray-700"><strong>Username:</strong> {user.username}</p>
                        <p className="text-gray-700"><strong>Email:</strong> {user.email}</p>
                    </div>
                </div>
                <p className="text-gray-700 mb-2"><strong>Phone number:</strong> {user.phone}</p>
                <p className="text-gray-700 mb-2"><strong>Profession:</strong> {user.profession}</p>
                <p className="text-gray-700 mb-2"><strong>Location:</strong> {user.location}</p>
                <p className="text-gray-700 mb-2"><strong>Joined on:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="mt-6">
                <h3 className="text-2xl font-semibold">Advertisements</h3>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-4">
                    {ads.length > 0 ? (
                        ads.map((ad) => (
                            <div key={ad.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
                                <div className="p-4">
                                    <h4 className="text-xl font-semibold text-gray-800 mb-2">{ad.title}</h4>
                                    <p className="text-gray-600 mb-4">{ad.description}</p>
                                    <img
                                        src={ad.images[0]?.imageUrl}
                                        alt={`Image for ad ${ad.id}`}
                                        className="w-full h-48 object-cover rounded-md mb-4"
                                    />
                                    <p className="text-sm text-gray-500">Created on: {new Date(ad.createdAt).toLocaleDateString()}</p>
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

