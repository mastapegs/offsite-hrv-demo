import { FC, MouseEventHandler, useContext, useState } from "react";
import SanityContext from "../../contexts/SanityContext";
import { User } from "../../types/hrv";
import { HeaderWrapper } from "../HeaderWrapper";

interface FormData {
  username: string;
  password: string;
}

export const Login: FC = () => {
  const { client, setUser, setIsAuthenticated, setMainView } = useContext(
    SanityContext
  );
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
  });

  const handleAuthentication: MouseEventHandler<HTMLButtonElement> = () => {
    client
      .fetch(`*[_type == "user" && username == $username][0]`, {
        username: formData.username,
      })
      .then((userFromSanity: User) => {
        if (userFromSanity === null) return;
        if (userFromSanity.password === formData.password) {
          setUser(userFromSanity);
          setIsAuthenticated(true);
          setMainView("jobs");
        }
      });
    setFormData({ username: "", password: "" });
  };

  const styleMap = {
    commonLabelStyles: "text-gray-700 text-sm",
    commonInputStyles:
      "mt-1.5 px-4 py-3 w-full border border-gray-700 rounded outline-none",
  };

  return (
    <div className="bg-background pb-4 min-h-screen">
      <HeaderWrapper>
        <div className="text-center">
          <div>
            <img className="mx-auto" src="/login-logo.svg" alt="Logo" />
          </div>
          <div className="text-2xl tracking-heading-primary">HomesRenewed</div>
          <div className="text-lg tracking-heading-secondary">COALITION</div>
          <div className="text-base text-purple-100 mt-6">
            Install grab bars professionally by following our instructions
          </div>
        </div>
      </HeaderWrapper>
      <div className="mt-8 text-xl text-center font-semibold text-gray-900">
        Login
      </div>
      <div className="px-6 mt-4 mx-auto max-w-sm">
        <label htmlFor="name">
          <div className={`${styleMap.commonLabelStyles}`}>Name</div>
          <input
            className={`${styleMap.commonInputStyles}`}
            id="name"
            type="text"
            placeholder="Enter Name"
            value={formData.username}
            onChange={(e) => {
              setFormData({ ...formData, username: e.target.value });
            }}
          />
        </label>
        <label htmlFor="password">
          <div className={`mt-4 ${styleMap.commonLabelStyles}`}>Password</div>
          <input
            className={`${styleMap.commonInputStyles}`}
            id="password"
            type="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
            }}
          />
        </label>
      </div>
      <button
        className="block mx-auto bg-purple-600 text-white my-7 px-24 py-5 rounded"
        type="button"
        onClick={handleAuthentication}
      >
        Log in
      </button>
    </div>
  );
};
