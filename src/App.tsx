import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import AdminLogin from "./Admin/Admin-Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/AdminControl" element={<AdminLogin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;