// libraries
import classNames from "classnames";
import React, { useCallback, useEffect, useRef, useState } from "react";

// styles
import styles from "./styles.module.scss";

// animatioms
import { useSpring, animated } from "@react-spring/web";

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  defaultValue?: string | number;
  maxCharacters?: number;
  // eslint-disable-next-line no-unused-vars
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSave: () => void;
  onCancel: () => void;
  height?: string;
  textRows?: number;
}

const TextArea: React.FC<Props> = ({
  defaultValue = "",
  maxCharacters = 100,
  handleChange,
  onSave,
  onCancel,
  height,
  textRows = 1,
  ...props
}: Props) => {
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const [focused, setFocused] = useState<boolean>(false);

  const [animatedStyles] = useSpring(
    () => ({
      from: { opacity: 0, transform: "translateY(-40px)" },
      to: { opacity: 1, transform: "translateY(0px)" },
    }),
    []
  );

  const rows = Math.ceil(maxCharacters / 100);

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
      handleChange(e);
    },
    [handleChange]
  );

  useEffect(() => {
    if (defaultValue !== props?.value) {
      setFocused(true);
    } else {
      setFocused(false);
    }
  }, [defaultValue, props?.value]);

  return (
    <div style={{ height: height }} className={classNames(styles["container"])}>
      <textarea
        ref={inputRef}
        rows={textRows || rows}
        className={classNames(styles["text_area"])}
        maxLength={maxCharacters}
        aria-label="maximum height"
        defaultValue={defaultValue}
        onChange={onChange}
        style={{ minHeight: !height ? `${rows - 0.5}rem` : `${rows - 1}rem` }}
        onPaste={(event) => {
          event.preventDefault();
        }}
        {...props}
      />
      {focused && (
        <animated.div style={animatedStyles} className={styles["actions"]}>
          <div
            onClick={() => {
              onSave();
              setFocused(false);
            }}
            className={styles["actions_save"]}
          >
            <img src={require("../../../assets/images/save.png")} alt="save" />
          </div>
          <div
            onClick={() => {
              onCancel();
              setFocused(false);
            }}
            className={styles["actions_cancel"]}
          >
            <img
              src={require("../../../assets/images/cancel.png")}
              alt="cancel"
            />
          </div>
        </animated.div>
      )}
    </div>
  );
};

export default React.memo(TextArea);
