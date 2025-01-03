// src/App.jsx
import { Routes, Route } from 'react-router-dom';
// import { ThemeProvider } from './context/ThemeContext'; // Import the ThemeProvider
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import LandingPage from './components/LandingPage/LandingPage';
import FormDashboard from './components/FormDashboard/FormDashboard';
import Setting from './components/settings/Setting';
import Workspace from './components/Workspace/Workspace';
import ChatbotForm from './components/ChatBot/ChatBot';

const App = () => {
  return (
    // <ThemeProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Formdashboard" element={<FormDashboard />} />
        <Route path="/setting" element={<Setting />} />
        <Route path="/workspace" element={<Workspace />} />
        <Route path="/chatbot" element={<ChatbotForm />} />
      </Routes>
    // </ThemeProvider>
  );
};

export default App;
