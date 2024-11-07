import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const apiUrl = import.meta.env.VITE_API_URL;

const AdvertisementDetails = () => {
  const { id } = useParams();
  const { userId, isLoggedIn } = useAuth();
  const [ad, setAd] = useState(null);
  const [user, setUser] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [editData, setEditData] = useState({ title: '', description: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');

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
          setUser(userData.user);
        }
      } catch (error) {
        console.error("Error fetching advertisement details:", error);
      }
    };

    fetchAdDetails();
  }, [id]);

  const deleteImage = async (imageId) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      try {
        const response = await fetch(`${apiUrl}/advertisement/image/${imageId}/${userId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!response.ok) throw new Error('Failed to delete image');
        window.location.reload();
      } catch (err) {
        setError(err.message);
      }
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

      setAd((prevAd) => ({ ...prevAd, title: editData.title }));
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

      setAd((prevAd) => ({ ...prevAd, description: editData.description }));
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

    setAdding(true);

    try {
      const response = await fetch(`${apiUrl}/advertisement/${adId}/images/${userId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload image.');

      window.location.reload();

      setSelectedFile(null);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setAdding(false);
    }
  };

  const deleteAdvertisement = async () => {
    if (window.confirm("Are you sure you want to delete this advertisement?")) {
      try {
        const response = await fetch(`${apiUrl}/advertisement/${ad.id}/${userId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) throw new Error('Failed to delete advertisement');

        window.location.href = '/';
      } catch (error) {
        console.error('Error deleting advertisement:', error);
        alert('Error deleting advertisement.');
      }
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      ad.images && ad.images.length > 0
        ? prevIndex === ad.images.length - 1
          ? 0
          : prevIndex + 1
        : 0
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      ad.images && ad.images.length > 0
        ? prevIndex === 0
          ? ad.images.length - 1
          : prevIndex - 1
        : 0
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
              src={ad.images[currentImageIndex]?.imageUrl || ''}
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

            {ad.userId === userId && (
              <div className="absolute top-0 right-0 p-2">
                <button
                  onClick={() => deleteImage(ad.images[currentImageIndex].id)}
                  className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition duration-300"
                >
                  X
                </button>
              </div>
            )}

            <div className="flex justify-center mt-4 space-x-2">
              {ad.images.map((image, index) => (
                <div key={index} className="relative">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      currentImageIndex === index ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  ></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {isLoggedIn && ad.userId === userId && (
          <div className="mt-4">
            <input
              type="text"
              placeholder="New Title"
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              className="border p-2 mb-2 w-full rounded"
            />
            <button
              onClick={() => updateAdvertisementTitle(ad.id)}
              className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300"
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

            <input
              type="file"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className="block w-full mb-2"
            />
            <button
              onClick={() => handleImageUpload(ad.id)}
              className="w-full px-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition duration-300"
              disabled={error || !selectedFile || adding}
            >
              {adding ? 'Adding Image...' : 'Add Image'}
            </button>

            <button
              onClick={deleteAdvertisement}
              className="w-full px-4 py-2 mt-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition duration-300"
            >
              Delete Advertisement
            </button>
          </div>
        )}

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


