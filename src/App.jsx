import { Outlet } from 'react-router-dom';
import NavBar from './components/NavBar';
import { AuthProvider } from './context/AuthContext'; // Import the AuthProvider
import './App.css';

function App() {
    return (
        <AuthProvider>
            <div>
                <NavBar />
                <Outlet />
            </div>
        </AuthProvider>
    );
}

export default App;
