import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

const SearchResults = () => {
  const location = useLocation();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const query = new URLSearchParams(location.search).get('query');

  useEffect(() => {

    setError('');
    
    if (!query) return;

    const fetchAds = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${apiUrl}/search?query=${encodeURIComponent(query)}`);
        const data = await response.json();
        
        if (response.ok) {
          setAds(data.advertisements);
        } else {
          setError(data.message || 'Error fetching search results');
        }
      } catch (err) {
        setError('Error fetching search results');
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, [query]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        <div>{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Search Results for "{query}"
      </h1>
      {ads.length === 0 ? (
        <p>No advertisements found</p>
      ) : (
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
      )}
    </div>
  );
};

export default SearchResults;







