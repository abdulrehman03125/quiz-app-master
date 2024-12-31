import React, { useEffect, useState } from "react";
import { Form, Input, Button, Radio, Select, notification } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../../components/navbar/Navbar";
import { httpClient } from "../../lib/httpclient";

const { Option } = Select;

const EditQuiz = () => {
  const [form] = Form.useForm();
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await httpClient.get(`/quiz/byid/${id}`);
        const fetchedQuiz = response.data;
        const formattedQuestions = fetchedQuiz.questions.map((question) => ({
          questionText: question.questionText,
          optionType: question.optionType,
          correctAnswer: question.correctAnswer,
          options: question.options.map((option) => ({
            optionText: option.optionText,
            isCorrect: option.isCorrect,
            optionid: option._id,
          })),
        }));

        form.setFieldsValue({
          title: fetchedQuiz.quiz.title,
          description: fetchedQuiz.quiz.description,
          questions: formattedQuestions,
        });

        setQuizData(fetchedQuiz);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id, form]);

  const openNotificationWithIcon = (type) => {
    api[type]({
      message: "Edit Quiz",
      description: "Quiz updated successfully!",
    });
  };

  const onFinish = async (values) => {
    try {
      const questions = values.questions.map((question) => ({
        questionText: question.questionText,
        optionType: question.optionType,
        correctAnswer: question.correctAnswer,
        options: question.options.map((option) => ({
          optionText: option.optionText,
          isCorrect: option.isCorrect,
          optionid: option.optionid,
        })),
      }));

      const updatedQuizData = {
        title: values.title,
        description: values.description,
        questions: questions,
      };
      console.log(updatedQuizData);
      

      await httpClient.put(`/quiz/update/${id}`, updatedQuizData);
      openNotificationWithIcon("success");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating quiz:", error);
      notification.error({
        message: "Update Failed",
        description: "Failed to update quiz. Please try again.",
      });
    }
  };

  const onValuesChange = (changedValues, allValues) => {
    const updatedQuestions = allValues.questions.map((question) => {
      const correctOption = question.options.find(
        (op) => op.isCorrect === true
      );
      return correctOption
        ? { ...question, correctAnswer: correctOption.optionid }
        : question;
    });
    form.setFieldsValue({ questions: updatedQuestions });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
    <Navbar/>
      <div className="bg-blue-100 w-full p-8">
        <div className="w-[800px] max-w-5xl mx-auto  bg-white p-8 rounded-lg shadow-lg ">
          {contextHolder}
          <Form
            form={form}
            onFinish={onFinish}
            onValuesChange={onValuesChange}
            autoComplete="off"
            layout="vertical"
            initialValues={{
              optionType: "radio",
              isCorrect: false,
            }}
          >
            {/* Title and Description Section */}
            <div className="w-full max-w-[800px] mx-auto mb-5 bg-slate-100 p-6 rounded-xl border-t-[20px] border-[#1677FF]">
              <h3 className="text-2xl font-semibold mb-4 text-gray-700">
                Edit Quiz
              </h3>
              <Form.Item
                name="title"
                label="Quiz Title"
                rules={[
                  { required: true, message: "Please enter the quiz title" },
                ]}
              >
                <Input
                  placeholder="Enter quiz title"
                  className="py-2 px-4 rounded-md"
                />
              </Form.Item>

              <Form.Item
                name="description"
                label="Quiz Description"
                rules={[
                  {
                    required: true,
                    message: "Please enter the quiz description",
                  },
                ]}
              >
                <Input.TextArea
                  placeholder="Enter quiz description"
                  className="py-2 px-4 rounded-md"
                  rows={4}
                />
              </Form.Item>
            </div>

            {/* Questions Section */}
            <Form.List name="questions">
              {(
                questionFields,
                { add: addQuestion, remove: removeQuestion }
              ) => (
                <>
                  {questionFields.map(
                    ({ key, name, fieldKey, ...restField }) => (
                      <div
                        key={key}
                        className="mb-10 p-6 bg-blue-100 border border-gray-300 rounded-lg shadow-md"
                      >
                        <h4 className="text-lg font-medium text-gray-700 mb-4">
                          Question {key + 1}
                        </h4>

                        <Form.Item
                          className="w-48"
                          {...restField}
                          name={[name, "optionType"]}
                          label="Choose option type"
                          rules={[
                            {
                              required: true,
                              message: "Please choose option type",
                            },
                          ]}
                        >
                          <Select>
                            <Option value="checkbox">Multiple Choice</Option>
                            <Option value="radio">Single Choice</Option>
                            <Option value="input">Short Answer</Option>
                          </Select>
                        </Form.Item>

                        <Form.Item
                          {...restField}
                          name={[name, "questionText"]}
                          label="Question Text"
                          rules={[
                            {
                              required: true,
                              message: "Please enter the question",
                            },
                          ]}
                        >
                          <Input
                            placeholder="Enter question"
                            className="py-2 px-4 rounded-md"
                          />
                        </Form.Item>

                        <Form.List name={[name, "options"]}>
                          {(
                            optionFields,
                            { add: addOption, remove: removeOption }
                          ) => (
                            <>
                              {optionFields.map((option) => (
                                <div
                                  key={option.key}
                                  className="p-4 mb-4 bg-gray-100 border rounded-lg"
                                >
                                  <Form.Item
                                    {...option}
                                    name={[option.name, "optionText"]}
                                    label={`Option ${option.key + 1}`}
                                    rules={[
                                      {
                                        required: true,
                                        message: "Please enter an option",
                                      },
                                    ]}
                                  >
                                    <Input
                                      placeholder="Enter option"
                                      className="py-2 px-4 rounded-md"
                                    />
                                  </Form.Item>

                                  <Form.Item
                                    {...option}
                                    name={[option.name, "isCorrect"]}
                                    label="Is this the correct option?"
                                    valuePropName="checked"
                                  >
                                    <Radio.Group>
                                      <Radio value={true}>Correct</Radio>
                                      <Radio value={false}>Incorrect</Radio>
                                    </Radio.Group>
                                  </Form.Item>

                                  <Button
                                    type="link"
                                    icon={<MinusCircleOutlined />}
                                    danger
                                    onClick={() => removeOption(option.name)}
                                  >
                                    Remove Option
                                  </Button>
                                </div>
                              ))}
                              <Form.Item>
                                <Button
                                  type="dashed"
                                  onClick={() => addOption()}
                                  block
                                  icon={<PlusOutlined />}
                                >
                                  Add Option
                                </Button>
                              </Form.Item>
                            </>
                          )}
                        </Form.List>

                        <Button
                          type="link"
                          onClick={() => removeQuestion(name)}
                          icon={<MinusCircleOutlined />}
                          danger
                        >
                          Remove Question
                        </Button>
                      </div>
                    )
                  )}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => addQuestion()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Add New Question
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
              >
                Update Quiz
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};

export default EditQuiz;
