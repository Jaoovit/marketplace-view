import { useState } from 'react';
import { useAuth } from '../context/AuthContext'; 
import { useNavigate } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_URL;

const AddAdvertisement = () => {
    const { isLoggedIn, userId  } = useAuth();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleImageChange = (event) => {
        setImages(event.target.files);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
      
        formData.append('title', title);
        formData.append('description', description);
      
        for (let i = 0; i < images.length; i++) {
          formData.append('images', images[i]);
        }
      
        try {
          const response = await fetch(`${apiUrl}/advertisement/${userId}`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: formData,
          });
      
          if (!response.ok) {
            const errorData = await response.json();
            if (errorData.message === "You can't create more them 5 advertisements") {
              setError("You have reached the maximum number of advertisements allowed.");
            } else {
              throw new Error(errorData.message || 'Failed to create advertisement');
            }
          } else {
            navigate(`/user/${userId}`);
          }
        } catch (err) {
          setError(err.message);
        }
      };

    if (!isLoggedIn) {
        return <div>Please log in to add an advertisement.</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-3xl font-bold mb-4">Add New Advertisement</h2>
            {error && <div className="text-red-500">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block">Title:</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block">Description:</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="w-full p-2 border rounded"
                    ></textarea>
                </div>
                <div>
                    <label htmlFor="images" className="block">Images:</label>
                    <input
                        type="file"
                        id="images"
                        multiple
                        onChange={handleImageChange}
                        required
                        className="border rounded"
                    />
                </div>
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                    Add Advertisement
                </button>
            </form>
        </div>
    );
};

export default AddAdvertisement;