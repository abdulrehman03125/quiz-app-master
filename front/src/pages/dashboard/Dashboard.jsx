import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/navbar/Navbar";

import AllQuiz from "../../components/allQuiz/AllQuiz";
import { httpClient } from "../../lib/httpClient";

const Dashboard = () => {
  const [quiz, setQuiz] = useState(null);
  
  const navigate = useNavigate();

  const authSlice = useSelector((state) => state.authSlice);
  const user = authSlice.user;
  console.log(user.user._id);
  

  
  const getallQuiz = async () => {
    try {
      const res = await httpClient.get("/quiz/all");
      setQuiz(res.data);
    } catch (error) {
      console.error("Failed to fetch quizzes:", error);
    }
  };

  useEffect(() => {
    getallQuiz();
    if (user.user.role !== "admin") {
      navigate(`/myresult/${user.user._id}`)
    }
  }, [user.user]);

  useEffect(() => {
    if (user.user == null) {
      navigate("/");
    }
  }, [user.user, navigate]);

 

  if (user !== null) {
    if (user.user.role === "admin") {
      
      return (
        <>
          <Navbar />
          <AllQuiz quizdata={quiz} getallQuiz={getallQuiz}/>
        </>
      );
    }
    
  }

  return null; // Render nothing while user data is being verified
};

export default Dashboard;
