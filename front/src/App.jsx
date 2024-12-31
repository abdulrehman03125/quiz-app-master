import { useEffect } from "react";
import './App.css'
import { Route, Routes, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Quizform from "./pages/quizform/Quizform.jsx";
import StartQuiz from "./pages/startQuiz/StartQuiz.jsx";
import Login from "./pages/login/Login.jsx";
import UserRegister from "./pages/userRegister/UserRegister.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import QuizDetail from "./pages/quizdetail/QuizDetail.jsx";
import EditQuiz from "./pages/editQuiz/EditQuiz.jsx";
import NotFound from "./pages/notFound/NotFound.jsx";
import { persistor } from "./Store/store.js";
import { logout } from "./Store/authSlice"; 
import MyResults from "./pages/myResults/MyResults.jsx";
import { httpClient } from "./lib/httpClient.js";
import ProtectedRoute from './pages/ProtectedRoute.jsx'; 
import QuizResults from "./pages/myResults/QuizResults.jsx";

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authSlice = useSelector((state) => state.authSlice);
  const token = authSlice.accessToken;

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await httpClient.post("/user/verify", { token });
        if (res.data.error === true) {
          await persistor.purge();
          dispatch(logout());
          navigate("/");  
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        await persistor.purge();
        dispatch(logout());
        navigate("/");  
      }
    };

    if (token) {
      verifyToken();
    }
  }, [token, dispatch, navigate]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<UserRegister />} />
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/quizform" element={<Quizform />} />
        <Route path="/startquiz/:id" element={<StartQuiz />} />
        <Route path="/quizdetail/:id" element={<QuizDetail />} />
        <Route path="/editquiz/:id" element={<EditQuiz />} />
        <Route path="/myresult/:id?" element={<MyResults />} />
        <Route path= "/quizresults/:id" element={<QuizResults/>}/>
      </Route>

      {/* Fallback for unmatched routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
