import React, { useState } from "react";
import { Navigate, Link, useNavigate, replace } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { getLoginErrorMessage } from "../../components/helper/UserAuthErrorMessageHelper";
import { authService } from "../../db/services/userAuthServices";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [show, setShow] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      await authService.signIn(email, password);
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setErrorMessage(getLoginErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-center items-center min-h-screen min-w-screen">
        <div className="w-lg bg-black text-white rounded-md p-8">
          <form onSubmit={onSubmit}>
            <div className="flex flex-col">
              {errorMessage && (
                <span className="text-red-500 font-bold italic text-sm text-center">
                  {errorMessage}
                </span>
              )}
              <label className="text-sm text-prod-pink font-bold">Email</label>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                placeholder="example@email.com"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                className="font-prodFont text-white text-sm placeholder:text-gray-500 p-3 rounded-sm my-3 w-full border border-gray-600 focus:outline-1"
              />
              <label className="text-sm text-prod-pink font-bold">Password</label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  placeholder="iloveprod55"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  className="font-prodFont text-white text-sm placeholder:text-gray-500 p-3 rounded-sm my-3 w-full border border-gray-600 focus:outline-1"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  aria-label={show ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 py-auto right-4 flex items-center focus:outline-hidden"
                >
                  {show ? (
                    <EyeOff size={22} className="text-prod-pink" />
                  ) : (
                    <Eye size={22} className="text-prod-pink" />
                  )}
                </button>
              </div>
              <button
                type="submit"
                className="bg-white text-black transition-colors ease-in-out hover:bg-prod-pink hover:text-white w-full mt-4 p-2 rounded-sm"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
