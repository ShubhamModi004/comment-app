import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

// styles
import styles from "./login.module.scss";
//firebase
import { createUser, Type } from "../../database/user";

import LoginForm, { FormData } from "../../components/Login/loginForm";
import { uploadImage } from "../../database/imageupload";

const Login = (): JSX.Element => {
  const navigation = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
    profileImage: "",
    name: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [loginForm, setLoginForm] = useState<Type>(Type["LOGIN"]);
  const [image, setImage] =
    useState<File | undefined | ArrayBuffer | null | string>(undefined);
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);

  const handleOnImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const image = e?.target?.files && e?.target?.files[0];
    if (image) {
      const reader = new FileReader();
      reader?.addEventListener("load", () => {
        setImage(reader?.result);
      });
      reader.readAsDataURL(image);
      setImageFile(image);
    }
  };

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
        let url = "";
        if (imageFile) {
          url = await uploadImage(imageFile);
        }
        await createUser(
          formData?.email,
          formData?.password,
          loginForm,
          formData?.name,
          url
        );
        setLoading(false);
        navigation("/comments");
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    },
    [
      formData?.email,
      formData?.name,
      formData?.password,
      imageFile,
      loginForm,
      navigation,
    ]
  );

  return (
    <div className={styles["container"]}>
      <LoginForm
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        formData={formData}
        loginForm={loginForm}
        setLoginForm={setLoginForm}
        handleOnImageChange={handleOnImageChange}
        image={image}
        loading={loading}
      />
    </div>
  );
};

export default Login;
