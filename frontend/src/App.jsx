import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import SimpleHome from './pages/SimpleHome';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import SimplePostDetail from './pages/SimplePostDetail';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<SimpleHome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/post/:id" element={<SimplePostDetail />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
