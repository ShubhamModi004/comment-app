import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

// styles
import styles from "./login.module.scss";
//firebase
import { createUser, Type } from "../../database/user";
//components
import Spinner from "../../components/common/spinner";

import LoginForm, { FormData } from "../../components/Login/loginForm";

const Login = (): JSX.Element => {
  const navigation = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
    profileImage: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [loginForm, setLoginForm] = useState<Type>(Type["LOGIN"]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e?.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      try {
        const results = await createUser(
          formData?.email,
          formData?.password,
          loginForm
        );
        setLoading(false);
        navigation("/comments", { state: results });
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    },
    [formData?.email, formData?.password, loginForm, navigation]
  );

  return (
    <div className={styles["container"]}>
      {!loading && (
        <LoginForm
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          formData={formData}
          loginForm={loginForm}
          setLoginForm={setLoginForm}
        />
      )}
      {loading && <Spinner />}
    </div>
  );
};

export default Login;
