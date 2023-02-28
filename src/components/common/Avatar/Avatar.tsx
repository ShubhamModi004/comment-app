import classNames from "classnames";
import React from "react";

// styles
import styles from "./avatarStyles.module.scss";

export enum AvatarSize {
  SMALLER = "smaller",
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large",
}

export interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  avatarSize?: AvatarSize;
  source?: File | undefined | ArrayBuffer | null | string;
}

const Avatar: React.FC<AvatarProps> = ({
  avatarSize = AvatarSize["SMALL"],
  source,
  children,
  ...props
}: AvatarProps): JSX.Element => {
  const image = source || require("../../../assets/images/user.png");
  return (
    <div
      className={classNames(
        styles["avatar_container"],
        styles[`${avatarSize}`]
      )}>
      <img className={styles["avatar_img"]} src={image} alt='profileImage' />
      <span className={styles["avatar_icon"]}>{children}</span>
    </div>
  );
};

export default Avatar;
