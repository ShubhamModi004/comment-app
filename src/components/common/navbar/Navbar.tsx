import classNames from "classnames";
import styles from "./styles.module.scss";

interface Props {
  onLogout: () => void;
}

const Navbar = ({ onLogout }: Props) => {
  return (
    <div className={styles["container"]}>
      <h1 className={classNames(styles["primary"])}>Commently</h1>
      <div
        onClick={onLogout}
        className={classNames(styles["logout"], styles["pointer"])}
      >
        <h3 className={classNames(styles["problem"])}>Logout</h3>
        <img
          className={classNames(styles["icon"], styles["mr5"])}
          src={require("../../../assets/images/logout.png")}
          alt="logout"
        />
      </div>
    </div>
  );
};

export default Navbar;
