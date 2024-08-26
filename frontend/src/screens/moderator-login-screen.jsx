import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useModeratorLoginMutation } from "../slices/users-api-slice";
import { setCredentials } from "../slices/auth-slice";
import { toast } from "react-toastify";

function ModeratorLoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login] = useModeratorLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/moderator/dashboard");
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate("/moderator/dashboard");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-gray-100 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">
          Moderator Login
        </h1>

        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="moderator-email"
            >
              Email Address
            </label>
            <input
              className="bg-white text-gray-900 shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-[#0e0d0e]"
              id="moderator-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="moderator-password"
            >
              Password
            </label>
            <input
              className="bg-white text-gray-900 shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-[#0e0d0e]"
              id="moderator-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              className="bg-[#0e0d0e] hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-[#0e0d0e]"
              type="submit"
            >
              Sign In
            </button>
            <a
              className="inline-block align-baseline font-bold text-sm text-[#0e0d0e] hover:text-gray-900"
              href="#"
            >
              Forgot Password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModeratorLoginScreen;
