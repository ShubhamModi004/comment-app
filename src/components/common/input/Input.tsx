// libraries
import classNames from "classnames";
import React, { useCallback, useEffect, useRef, useState } from "react";

// styles
import styles from "./styles.module.scss";

export enum InputType {
  DEFAULT = "default",
  EMAIL = "email",
  PASSWORD = "password",
}

interface Props extends React.HTMLProps<HTMLInputElement> {
  label?: string;
  defaultValue?: string;
  maxCharacters?: number;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputType?: InputType;
  errorString?: string;
}

const Input: React.FC<Props> = ({
  label = "",
  defaultValue = "",
  maxCharacters = 100,
  handleChange,
  inputType = InputType["DEFAULT"],
  errorString = "",
  ...props
}: Props) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [value, setValue] = useState<string | number>("");
  const [error, setError] = useState<boolean>(false);
  const [focused, setFocused] = useState<boolean>(false);

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      setError(false);
      setValue(e.target.value);
      handleChange(e);
    },
    [handleChange]
  );

  useEffect(() => {
    if (errorString !== "") {
      setError(true);
    } else {
      setError(false);
    }
  }, [errorString]);

  useEffect(() => {
    if (focused && defaultValue) {
      setValue(defaultValue);
    }
  }, [defaultValue, focused]);

  const errorClass = error ? styles.error : styles.default_container;

  return (
    <div className={classNames(styles.container, errorClass)}>
      {label && (
        <div
          className={classNames(
            styles["header"],
            focused || inputRef?.current?.value || value
              ? styles["header_active"]
              : styles["header_inactive"]
          )}
        >
          <p className={classNames(styles["hint"], styles["g800"])}>{label}</p>
        </div>
      )}
      <input
        ref={inputRef}
        className={classNames(
          styles["text_input"],
          inputType === InputType["PASSWORD"]
            ? styles["password"]
            : styles["default"],
          focused || inputRef?.current?.value || value
            ? styles["input_active"]
            : ["input_inactive"]
        )}
        defaultValue={defaultValue}
        placeholder={""}
        onChange={onChange}
        disabled={String(value).length >= maxCharacters}
        type={inputType}
        onFocus={() => {
          setFocused(true);
        }}
        onBlur={() => {
          setFocused(false);
        }}
        {...props}
      />
      {errorString !== "" && (
        <div className={styles["email_body"]}>
          <p className={classNames(styles["hint"], styles["problem"])}>
            {errorString}
          </p>
        </div>
      )}
    </div>
  );
};

export default React.memo(Input);
