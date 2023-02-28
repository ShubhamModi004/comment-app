// libraries
import classNames from "classnames";
import React, { useCallback, useEffect, useRef, useState } from "react";

import Spinner from "../spinner";

// styles
import styles from "./styles.module.scss";

interface Props extends React.HTMLProps<HTMLTextAreaElement> {
  maxCharacters?: number;
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  loading?: boolean;
  submit: () => void;
  value: string;
}

const TextInput: React.FC<Props> = ({
  maxCharacters = 100,
  handleChange,
  loading = false,
  submit,
  ...props
}: Props) => {
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const [hovered, setHovered] = useState<boolean>(false);

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>): void => {

      handleChange(e);
    },
    [handleChange]
  );

  const style = {
    display: "inline-block",
    transform: hovered ? `translateX(2px)` : `translateX(0px)`,
    transition: `transform ${150}ms`,
  };

  useEffect(() => {
    if (!hovered) {
      return;
    }
    const timeoutId = window.setTimeout(() => {
      setHovered(false);
    }, 150);
    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [hovered]);

  const trigger = () => {
    setHovered(true);
  };

  return (
    <div className={classNames(styles.container)}>
      <textarea
        ref={inputRef}
        className={classNames(styles["text_input"])}
        placeholder={"Start typing ..."}
        onChange={onChange}
        {...props}
      />
      <div
        onMouseEnter={trigger}
        style={style}
        onClick={submit}
        className={classNames(styles["button_container"], styles["pointer"])}
      >
        {loading ? (
          <Spinner />
        ) : (
          <img src={require("../../../assets/images/send.png")} alt="send" />
        )}
      </div>
    </div>
  );
};

export default React.memo(TextInput);
