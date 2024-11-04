import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

const Home = () => {
    const [ads, setAds] = useState([]);

    const getAds = async (url) => {
        try {
            const res = await fetch(url);
            const data = await res.json();
            setAds(data.advertisements);
        } catch (error) {
            console.error("Error fetching ads:", error);
        }
    };

    useEffect(() => {
        const adsUrl = `${apiUrl}/advertisements`;
        getAds(adsUrl);
    }, []);

    return (
        <div className="container mx-auto p-4">
            {ads.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {ads.map((ad) => (
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
                <p className="text-gray-700 text-center">Loading ads...</p>
            )}
        </div>
    );
};

export default Home;

