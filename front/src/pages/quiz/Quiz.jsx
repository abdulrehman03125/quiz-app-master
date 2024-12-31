import { Form, Input, Button, Radio, Select } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import FormItem from "antd/es/form/FormItem";
import axios from "axios";
import { notification, Space } from "antd";
import { useRef, useState } from "react";

import { useNavigate } from "react-router-dom";
import { httpClient } from "../../lib/httpClient";


const { Option } = Select; // Ensure this import for using the Select Option

const Quiz = ({ formtitle, formdescription }) => {
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate()


  const openNotificationWithIcon = (type) => {
    api[type]({
      message: "Upload Quiz",
      description: "Quiz uploaded successfully ",
    });
  };

  const creatQuizform = async (values, formtitle, formdescription) => {
    try {
      
      const questions = values.questions.map((question) => ({
        optionType: question.optionType,
        questionText: question.questionText,
        correctAnswer:question.correctAnswer,
        options: question.options.map((option) => ({
          optionText: option.optionText,
          isCorrect: option.isCorrect,
          optionid:option.optionid
        })),
      }));
      const questionIds = [];
      for (const question of questions) {
        const response = await httpClient.post(
          "/question/creat",
          question
        );
        questionIds.push(response.data.question._id);
      }

      const quizData = {
        title: formtitle,
        description: formdescription,
        questions: questionIds,
      };

      const quizResponse = await httpClient.post(
        "/quiz/creat",
        quizData
      );
     

      // Assuming the response contains the quiz ID
      const quizId = quizResponse.data.quiz._id;
      const quizLink = `http://localhost:5173/startquiz/${quizId}`;
     
      openNotificationWithIcon("success");
      console.log("Quiz uploaded successfully");

      // Display the quiz link
      alert(
        `Quiz created successfully! Share this link with students: ${quizLink}`
      );

      form.resetFields();
      navigate("/dashboard")
    } catch (error) {
      console.error("Error:", error.message);
      console.error("Failed to upload quiz. Please try again.");
    }
  };

  const onFinish = (values) => {
    const isValid = values.questions.every((question) => question.correctAnswer);
    
    if (!isValid) {
      notification.error({
        message: "Validation Error",
        description: "Please select the correct answer for each question.",
      });
      return;
    }
  
    creatQuizform(values, formtitle, formdescription);
    console.log(values, formtitle, formdescription);
  };

  // Handler function to detect changes in form values
  // const onValuesChange = (changedValues, allValues) => {

  //   allValues.questions?.forEach((q) => {
  //     q?.options?.forEach((op) => {
  //       if (op?.isCorrect == true) {
  //         q.correctAnswer = op.optionid;
  //         form.setFieldsValue({
  //           [q.correctAnswer]: op.optionid,
  //         });
  //       }
  //     });
  //   });
  // };

  // const onValuesChange = (changedValues, allValues) => {
  //   allValues.questions?.forEach((q, qIndex) => {
  //     const correctOption = q?.options?.find(op => op?.isCorrect === true);
  //     if (correctOption) {
  //       q.correctAnswer = correctOption.optionid; 
  //       form.setFieldsValue({
  //         [`questions[${qIndex}].correctAnswer`]: correctOption.optionid,
  //       });
  //     }
  //   });
  // };

  // const onValuesChange = (changedValues, allValues) => {
  //   allValues.questions?.forEach((q, qIndex) => {
  //     const correctOption = q?.options?.find((op) => op?.isCorrect === true);
  //     if (correctOption) {
  //       // Update the correctAnswer field with the correct option's ID
  //       q.correctAnswer = correctOption.optionid;
  
  //       // Ensure the form updates the correctAnswer field for each question
  //       form.setFieldsValue({
  //         questions: allValues.questions.map((question, index) =>
  //           index === qIndex ? { ...question, correctAnswer: correctOption.optionid } : question
  //         ),
  //       });
  //     }
  //   });
  // };

  const onValuesChange = (changedValues, allValues) => {
    const updatedQuestions = allValues.questions.map((question, qIndex) => {
      // Find the option marked as correct
      const correctOption = question?.options?.find((op) => op?.isCorrect === true);
      
      if (correctOption) {
        return {
          ...question,
          correctAnswer: correctOption.optionid, // Set correctAnswer
        };
      } else {
        return question;
      }
    });
  
    // Update the form values
    form.setFieldsValue({
      questions: updatedQuestions,
    });
  };
  
  
  return (
    <>
      <div className="w-full max-w-3xl mx-auto mt-10 bg-transparent p-6 rounded-lg ">
        <h2 className="text-3xl font-bold text-center mb-6">Questions</h2>
        {contextHolder}
        <Form
          form={form}
          onFinish={onFinish}
          onValuesChange={onValuesChange}
          autoComplete="off"
          layout="vertical"
          initialValues={{
            optionType: "radio", // Set default optionType here
            isCorrect: false,
          }}
        >
          <Form.List name="questions">
            {(questionFields, { add: addQuestion, remove: removeQuestion }) => (
              <>
                {questionFields.map(
                  ({
                    key: questionKey,
                    name: questionName,
                    fieldKey: questionFieldKey,
                    ...restQuestionField
                  }) => (
                    <div
                      key={questionKey}
                      className="mb-10 p-4 bg-blue-50 rounded-lg shadow-md"
                    >
                      <FormItem
                        className="w-60"
                        {...restQuestionField}
                        name={[questionName, "optionType"]}
                        fieldKey={[questionFieldKey, "optionType"]}
                        label={"Choose option type"}
                        rules={[
                          {
                            required: true,
                            message: "Please choose option type",
                          },
                        ]}
                        initialValue="radio" // Set the default value here
                      >
                        <Select
                          value="radio"
                          options={[
                            {
                              value: "checkbox",
                              label: "Multiple Choice",
                            },
                            {
                              value: "radio",
                              label: "Single Choice",
                            },
                            {
                              value: "input",
                              label: "Short Answer",
                            },
                          ]}
                        ></Select>
                      </FormItem>

                      <Form.Item
                        className="bg-blue-300  pt-2 ps-6 pe-6 pb-7 shadow-md shadow-slate-400"
                        {...restQuestionField}
                        name={[questionName, "questionText"]}
                        fieldKey={[questionFieldKey, "questionText"]}
                        label={<span>{`Question ${questionKey + 1}`} </span>}
                        optionid={questionKey + 1}
                        rules={[
                          {
                            required: true,
                            message: "Please enter a question",
                          },
                        ]}
                      >
                        <Input placeholder="Enter question" className="p-2" />
                      </Form.Item>

                      <Form.Item name={[questionName, "correctAnswer"]} style={{display:"none"}}>
                        <Input placeholder="Enter something" />
                      </Form.Item>

                      <Form.List name={[questionName, "options"]}>
                        {(
                          optionFields,
                          { add: addOption, remove: removeOption }
                        ) => (
                          <>
                            {optionFields.map(
                              ({
                                key: optionKey,
                                name: optionName,
                                fieldKey: optionFieldKey,
                                ...restOptionField
                              }) => (
                                <div
                                  key={optionKey}
                                  className={`p-6 mb-6  shadow-lg shadow-slate-400 ${
                                    form.getFieldValue([
                                      "questions",
                                      questionName,
                                      "options",
                                      optionName,
                                      "isCorrect",
                                    ])
                                      ? "bg-green-500"
                                      : "bg-gray-300"
                                  }`}
                                >
                                  <Form.Item
                                    {...restOptionField}
                                    name={[optionName, "optionText"]}
                                    fieldKey={[optionFieldKey, "optionText"]}
                                    label={<span > {`Option ${optionKey + 1}`}</span>}
                                    rules={[
                                      {
                                        message: "Please enter an option"
                                      },
                                    ]}
                                  >
                                    <Input
                                      placeholder="Enter option"
                                      className="p-2"
                                    />
                                  </Form.Item>

                                  <Form.Item
                                    {...restOptionField}
                                    name={[optionName, "optionid"]}
                                    fieldKey={[optionFieldKey, "optionid"]}
                                    style={{ display: "none" }}
                                    initialValue={optionKey + 1}
                                    rules={[]}
                                  >
                                    <Input  placeholder="Enter option ID" />
                                  </Form.Item>

                                  <Form.Item
                                    {...restOptionField}
                                    name={[optionName, "isCorrect"]}
                                    fieldKey={[optionFieldKey, "isCorrect"]}
                                    label={<span >{"Is this the correct option?"}</span>}
                                  >
                                    <Radio.Group
                                     className="inline"
                                      onChange={(e) => {
                                        form.setFieldsValue({
                                          questions:
                                            form.getFieldValue("questions"),
                                        });
                                      }}
                                    >
                                      <Radio  className="inline " value={true}>Correct</Radio>
                                      <Radio className="inline "  value={false}>Incorrect</Radio>
                                    </Radio.Group>
                                  </Form.Item>

                                  <Button
                                    type="link"
                                    onClick={() => removeOption(optionName)}
                                    icon={<MinusCircleOutlined />}
                                    danger
                                    className="inline mt-0 pt-0"
                                  >
                                    Remove Option
                                  </Button>
                                </div>
                              )
                            )}
                            <Form.Item>
                              <Button
                                type="dashed"
                                onClick={() => addOption()}
                                block
                                icon={<PlusOutlined />}
                                className=" border-solid border-sky-900 " 
                              >
                                Add Option
                              </Button>
                            </Form.Item>
                          </>
                        )}
                      </Form.List>
                      <Button
                        type="link"
                        onClick={() => removeQuestion(questionName)}
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
                    className="bg-slate-900 text-white"
                  >
                    Add New Question
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <Form.Item>
            <Button  type="primary" htmlType="submit" block>
              Submit Quiz
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default Quiz;
