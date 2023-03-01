import React, { useEffect, useState, useMemo, useCallback } from "react";
import classNames from "classnames";

// styles
import styles from "./styles.module.scss";

// animations
import { useSpring, animated } from "@react-spring/web";
import { Type } from "../../../database/user";

// components
import Spinner from "../../common/spinner";
import Input, { InputType } from "../../common/input";
import Button from "../../common/button";
import ImageUploader from "../../common/profileImage/profileImage";

// types
export type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
  profileImage: string;
  name: string;
};

export interface Props {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formData: FormData;
  loginForm: Type;
  setLoginForm: (loginForm: Type) => void;
  handleOnImageChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  image?: File | undefined | ArrayBuffer | null | string;
  loading?: boolean;
}

const LoginForm = ({
  handleSubmit,
  handleChange,
  formData,
  loginForm,
  setLoginForm,
  handleOnImageChange,
  loading = false,
  image,
}: Props): JSX.Element => {
  const textLoginAnimation = useSpring({
    opacity: loginForm === Type["LOGIN"] ? 1 : 0,
    transform:
      loginForm === Type["LOGIN"] ? "translateX(0)" : "translateX(-40px)",
    display: loginForm === Type["LOGIN"] ? "block" : "none",
  });

  const textSignUpAnimation = useSpring({
    opacity: loginForm === Type["SIGNUP"] ? 1 : 0,
    transform:
      loginForm === Type["SIGNUP"] ? "translateX(0)" : "translateX(-40px)",
    display: loginForm === Type["SIGNUP"] ? "block" : "none",
  });

  // verification
  const [name, setName] = useState<string>("");
  const [emailVerified, setEmailVerified] = useState<string>("");
  const [passwordVerified, setPasswordVerified] = useState<string>("");
  const [confirmPasswordVerified, setConfirmPasswordVerified] =
    useState<string>("");

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(formData?.email)
      ? setEmailVerified("")
      : setEmailVerified("Enter a valid email address");
  }, [formData?.email]);

  useEffect(() => {
    return formData?.name !== "" ? setName("") : setName("Enter name");
  }, [formData?.name]);

  useEffect(() => {
    if (formData?.password?.length > 5) {
      return setPasswordVerified("");
    } else {
      return setPasswordVerified("Password must be greater than 5 digits");
    }
  }, [formData?.password]);

  useEffect(() => {
    if (formData?.confirmPassword !== formData.password) {
      setConfirmPasswordVerified("Confirm password should be same as password");
    } else {
      setConfirmPasswordVerified("");
    }
  }, [formData?.confirmPassword, formData.password]);

  const disabled = useMemo(() => {
    if (formData.email === "" || emailVerified !== "") return true;
    if (loginForm === Type["LOGIN"]) {
      if (formData?.password === "" || passwordVerified !== "") return true;
    } else {
      if (formData?.password === "" || passwordVerified !== "") return true;
      if (formData?.confirmPassword === "" || confirmPasswordVerified !== "")
        return true;
    }
    return false;
  }, [
    confirmPasswordVerified,
    emailVerified,
    formData?.confirmPassword,
    formData.email,
    formData?.password,
    loginForm,
    passwordVerified,
  ]);

  const headerSection = useCallback(() => {
    return (
      <>
        <div className={styles["header_section"]}>
          <div className={styles["header_section_left"]}>
            <h2>Welcome to</h2>
            <h1 className={classNames(styles["primary"])}>Commently</h1>
          </div>
          <div className={styles["header_section_right"]}>
            <p className={classNames(styles["hint"], styles["g800"])}>
              <animated.span style={textLoginAnimation}>
                Don't have an account?
              </animated.span>
              <animated.span style={textSignUpAnimation}>
                Aleady have an account?
              </animated.span>
              <span
                onClick={() =>
                  loginForm === Type["LOGIN"]
                    ? setLoginForm(Type["SIGNUP"])
                    : setLoginForm(Type["LOGIN"])
                }
                className={classNames(
                  styles["primary"],
                  styles["hint"],
                  styles["underline"],
                  styles["pointer"],
                  styles["ml3"]
                )}
              >
                <animated.span style={textLoginAnimation}>
                  Sign up
                </animated.span>
                <animated.span style={textSignUpAnimation}>Login</animated.span>
              </span>
            </p>
          </div>
        </div>
        <h1 className={classNames(styles["text_large"], styles["mv1"])}>
          <animated.span style={textLoginAnimation}>Sign In</animated.span>
          <animated.span style={textSignUpAnimation}>Sign Up</animated.span>
        </h1>
      </>
    );
  }, [loginForm, setLoginForm, textLoginAnimation, textSignUpAnimation]);

  const inputSection = useCallback(() => {
    return (
      <div className={styles.mv1}>
        <animated.div style={textSignUpAnimation} className={styles.mv2}>
          <ImageUploader
            imageUploading={false}
            imageUrl={image}
            handleOnImageChange={handleOnImageChange}
          />
        </animated.div>
        <animated.div style={textSignUpAnimation} className={styles.mv2}>
          <Input
            errorString={name}
            label="Name"
            handleChange={handleChange}
            inputType={InputType["DEFAULT"]}
            name="name"
          />
        </animated.div>
        <animated.div
          style={
            loginForm === Type.LOGIN ? textLoginAnimation : textSignUpAnimation
          }
          className={styles.mv2}
        >
          <Input
            errorString={emailVerified}
            label="Email"
            handleChange={handleChange}
            inputType={InputType["EMAIL"]}
            name="email"
          />
        </animated.div>
        <animated.div
          style={
            loginForm === Type.LOGIN ? textLoginAnimation : textSignUpAnimation
          }
          className={styles.mv2}
        >
          <Input
            errorString={passwordVerified}
            label="Password"
            handleChange={handleChange}
            inputType={InputType["PASSWORD"]}
            name="password"
          />
        </animated.div>
        <animated.div style={textSignUpAnimation} className={styles.mv2}>
          <Input
            errorString={confirmPasswordVerified}
            label="Confirm Password"
            handleChange={handleChange}
            inputType={InputType["PASSWORD"]}
            name="confirmPassword"
          />
        </animated.div>
      </div>
    );
  }, [
    confirmPasswordVerified,
    emailVerified,
    handleChange,
    handleOnImageChange,
    image,
    loginForm,
    name,
    passwordVerified,
    textLoginAnimation,
    textSignUpAnimation,
  ]);

  const buttonSection = useCallback(() => {
    return (
      <div className={styles["button_container"]}>
        <Button disabled={disabled || loading} type="submit">
          {loading ? (
            <Spinner />
          ) : (
            <>
              <animated.span style={textLoginAnimation}>Login</animated.span>
              <animated.span style={textSignUpAnimation}>Sign up</animated.span>
            </>
          )}
        </Button>
      </div>
    );
  }, [disabled, loading, textLoginAnimation, textSignUpAnimation]);

  return (
    <form onSubmit={handleSubmit} className={styles["form"]}>
      {headerSection()}
      {inputSection()}
      {buttonSection()}
    </form>
  );
};

export default LoginForm;
