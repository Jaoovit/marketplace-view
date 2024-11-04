import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import { Link } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

const AdvertisementDetails = () => {
    const { id } = useParams();
    const [ad, setAd] = useState(null);
    const [user, setUser] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const fetchAdDetails = async () => {
            try {
                const res = await fetch(`${apiUrl}/advertisement/${id}`);
                const data = await res.json();
                setAd(data.advertisement);
                if (data.advertisement) {
                    const userId = data.advertisement.userId;
                    const userRes = await fetch(`${apiUrl}/user/${userId}`);
                    const userData = await userRes.json();
                    console.log(userData)
                    setUser(userData.user);
                }
            } catch (error) {
                console.error("Error fetching advertisement details:", error);
            }
        };

        fetchAdDetails();
    }, [id]);

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === ad.images.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? ad.images.length - 1 : prevIndex - 1
        );
    };

    if (!ad) return <p>Loading advertisement details...</p>;

    return (
        <div className="container mx-auto p-4">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden p-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">{ad.title}</h2>
                <p className="text-gray-700 mb-6">{ad.description}</p>

                {ad.images && ad.images.length > 0 && (
                    <div className="relative mb-8">
                        <img
                            src={ad.images[currentImageIndex].imageUrl}
                            alt={`Image ${currentImageIndex + 1} for ad ${ad.id}`}
                            className="w-full h-80 object-cover rounded-md transition-opacity duration-500 ease-in-out"
                        />
                        <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-200 text-gray-700 p-2 rounded-full hover:bg-gray-300 transition-all duration-300 ease-in-out focus:outline-none"
                        >
                            ◄
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-200 text-gray-700 p-2 rounded-full hover:bg-gray-300 transition-all duration-300 ease-in-out focus:outline-none"
                        >
                            ►
                        </button>
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                            {ad.images.map((_, index) => (
                                <span
                                    key={index}
                                    className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                                        index === currentImageIndex
                                            ? 'bg-blue-500'
                                            : 'bg-gray-400'
                                    }`}
                                ></span>
                            ))}
                        </div>
                    </div>
                )}

                <p className="text-sm text-gray-500">
                    Created on: {new Date(ad.createdAt).toLocaleDateString()}
                </p>

                {user && (
                    <div className="mt-6 border-t pt-4">
                        <h3 className="text-xl font-semibold text-gray-800">Posted by</h3>
                        <p className="text-gray-700">Name: {user.name}</p>
                        <p className="text-gray-700">Email: {user.email}</p>
                        <p className="text-gray-700">Phone number: {user.phone}</p>
                        <p className="text-gray-700">Location: {user.location}</p>
                        <div className="text-center mt-4">
                                    <Link
                                        to={`/user/${user.id}`}
                                        className="inline-block px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300"
                                    >
                                        View User
                                    </Link>
                                </div>
                    </div>
                    
                )}
            </div>
        </div>
    );
};

export default AdvertisementDetails;

