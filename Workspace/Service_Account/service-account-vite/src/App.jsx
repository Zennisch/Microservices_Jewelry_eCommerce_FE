import {Route, Routes} from 'react-router-dom';
import {AuthProvider} from 'container/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile/Profile';
import './App.css';

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/forgot-password" element={<ForgotPassword/>}/>
                <Route path="/reset-password" element={<ResetPassword/>}/>
                <Route path="/profile" element={<Profile/>}/>
                <Route path="*" element={<Login/>}/>
            </Routes>
        </AuthProvider>
    );
}

export default App;