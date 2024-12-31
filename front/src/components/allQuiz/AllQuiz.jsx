import React, { useEffect, useState } from "react";
import {
  FileText,
  FilePlus,
  Pencil,
  Share2,
  ChartNoAxesCombined,
  Trash2,
} from "lucide-react";
import { notification, Skeleton } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { DownOutlined, MoreOutlined } from "@ant-design/icons";
import { Dropdown, Space } from "antd";
import { httpClient } from "../../lib/httpClient";

const AllQuiz = ({ quizdata,getallQuiz }) => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()
  const allQuiz = quizdata?.quizzes;
  console.log(allQuiz);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleDropdownLink = (e, id, action) => {
    e.preventDefault();
    
  };

  // Delete Quiz
  const handleDeleteQuiz = async (id) => {
    try {
      await httpClient.delete(`/quiz/delete/${id}`);
     
      // Show success notification
      notification.success({
        message: 'Quiz Deleted',
        description: 'The quiz has been deleted successfully.',
        duration: 2,
      });
      setTimeout(() => {
        getallQuiz()
      }, 2000); // 2000ms = 2 seconds delay
    } catch (error) {
      message.error('Failed to delete quiz.');
      console.error("Error deleting quiz:", error);
      
    }
  };

  return (
    <div className="p-6 md:p-12 lg:p-16 bg-blue-100 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold text-gray-800">All Quizzes</h1>
          <Link
            to="/quizform"
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-500 transition-colors duration-300 ease-in-out"
          >
            <FilePlus size={24} />
            <span className="text-lg font-medium">Create New Quiz</span>
          </Link>
        </div>

        {/* Quizzes Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Loading Skeletons
            Array(allQuiz?.length)
              .fill()
              .map((_, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300 ease-in-out relative"
                >
                  <Skeleton active />
                </div>
              ))
          ) : allQuiz?.length > 0 ? (
            allQuiz.map((quiz) => {
              const items = [
                {
                  label: (
                    <Link to={`/editquiz/${quiz._id}`}>
                      <Pencil size={18} strokeWidth={1.5} />
                    </Link>
                  ),
                  key: "0",
                },
                {
                  label: (
                    <a
                      onClick={(e) => handleDropdownLink(e, quiz._id, "share")}
                    >
                      <Share2 className="cursor-pointer" size={18} strokeWidth={1.5} />
                    </a>
                  ),
                  key: "1",
                },
                {
                  label: (
                    <Link to={`/quizresults/${quiz._id}`} >
                      <ChartNoAxesCombined
                        className="cursor-pointer"
                        size={18}
                        strokeWidth={1.5}
                      />
                    </Link>
                  ),
                  key: "3",
                },
                {
                  label: (
                  
                      <Trash2 onClick={()=>handleDeleteQuiz(quiz._id)} size={18} className="cursor-pointer" strokeWidth={1.5} />
                    
                  ),
                  key: "4",
                },
              ];

              return (
                <Link to={`/quizdetail/${quiz._id}`}
                  key={quiz._id}
                  className="relative bg-white p-6 rounded-lg shadow-lg  border-s-8 border-blue-600 cursor-pointer  hover:shadow-lg transition-shadow duration-300 ease-in-out"
                >
                  {/* Dropdown positioned at the top-right corner */}
                  <Dropdown
                    menu={{
                      items,
                    }}
                    trigger={["click"]}
                    className="absolute top-4 right-4"
                  >
                    <a onClick={(e) => e.preventDefault()}>
                      <Space>
                      <MoreOutlined className="text-2xl font-bold"/>
                      </Space>
                    </a>
                  </Dropdown>

                  <div className="flex items-center justify-center mb-4">
                    <FileText size={60} color="blue" strokeWidth="0.6" />
                  </div>
                  <h2 className="text-xl text-center font-semibold text-gray-700 mb-3">
                    {quiz.title}
                  </h2>
                </Link>
              );
            })
          ) : (
            <div className="text-center col-span-full p-6 bg-white rounded-lg shadow-md border border-gray-200">
              <p className="text-lg text-gray-500">No quizzes available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllQuiz;
