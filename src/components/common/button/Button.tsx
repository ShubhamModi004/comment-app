import classNames from "classnames";
import React from "react";
import { animated, useSpring } from "@react-spring/web";

// styles
import styles from "./styles.module.scss";

export enum ButtonSize {
  SMALL = "small",
  LARGE = "large",
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize;
}

const Button: React.FC<ButtonProps> = ({
  size = ButtonSize["LARGE"],
  children,
  ...props
}: ButtonProps): JSX.Element => {
  const [springs, api] = useSpring(() => ({
    from: { scale: 1 },
  }));

  const mouseEnter = () => {
    api.start({
      from: {
        scale: 1,
      },
      to: {
        scale: 1.02,
      },
    });
  };

  const mouseLeave = () => {
    api.start({
      from: {
        scale: 1.02,
      },
      to: {
        scale: 1,
      },
    });
  };

  return (
    <animated.button
      onMouseEnter={mouseEnter}
      onMouseLeave={mouseLeave}
      className={classNames(
        styles[`button`],
        styles[`button_${size}`],
        props?.disabled ? styles["button_disabled"] : styles["button_default"]
      )}
      onClick={(e) => {
        props.onClick && props.onClick(e);
      }}
      style={{ ...springs }}
      {...props}
    >
      {children}
    </animated.button>
  );
};

export default Button;
