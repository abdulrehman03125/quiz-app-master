import React, { useEffect } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, notification } from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { loginAsyncCall, resetisRegister } from "../../store/authSlice";
import { useSelector, useDispatch } from "react-redux";

const Login = () => {
  // Extract relevant state from Redux store
  const authSlice = useSelector((state) => state.authSlice);
  const user = authSlice.user;
  const error = authSlice.error;
  const errorMessage = authSlice.errorMessage;
  const isLoading = authSlice?.isLoading;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Function to handle form submission
  const onFinish = (values) => {
    dispatch(loginAsyncCall(values));
  };

  useEffect(() => {
    // Reset any previous registration state when the login component mounts
    dispatch(resetisRegister());

    // If the user is authenticated
    if (user) {
      // Determine where to redirect the user after login
      const from = location.state?.from?.pathname || "/dashboard";
      console.log("Redirecting to:", from);

      // Show a success notification

      if(user){
        notification.success({
          message: "Login Successful",
          description: "You have successfully logged in! Redirecting...",
          duration: 2,
        });
      }
     

      // Redirect to the original requested path or to the dashboard
      navigate(from, { replace: true });
    }

    // If there's an error during login, display an error notification
    if (error) {
      notification.error({
        message: "Login Failed",
        description:
          errorMessage || "An error occurred during login. Please try again.",
      });
    }
  }, [user, error, errorMessage, navigate, dispatch, location]);

  // If the user is not authenticated, display the login form
  if (!user) {
    return (
      <div className="bg-blue-200 pt-20 pb-[150px] h-screen">
        <div className="w-full max-w-[600px] mx-auto bg-slate-100 p-12 rounded-xl border-t-[20px] border-blue-700 ">
          <div>
            <h1 className="text-center text-5xl mb-14">Login</h1>
          </div>
          <Form
            name="login"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
          >
            <Form.Item
              name="email"
              rules={[{ required: true, message: "Please input your Email!" }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Email" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: "Please input your Password!" }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item>
              <div className="flex justify-between">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
                <a href="#">Forgot password</a>
              </div>
            </Form.Item>

            <Form.Item>
              <Button loading={isLoading}  block type="primary" htmlType="submit">
                Log in
              </Button>
            </Form.Item>
          </Form>

          <p className="text-center">
            Don't have an account?{" "}
            <Link to="/register" className="font-medium underline text-blue-700">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // Optionally, render a loading indicator while redirecting
  return null;
};

export default Login;
