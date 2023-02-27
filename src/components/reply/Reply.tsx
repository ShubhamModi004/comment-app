import styles from "./styles.module.scss";
import { replyType } from "./types";

const Reply = ({
  name = "",
  comment = "",
  upvotes = [],
  upvote,
}: replyType) => {
  return (
    <div className={styles["reply-container"]}>
      <div className={styles["image-container"]}>
        <div className={styles["image"]}>
          <p>{name[0]}</p>
        </div>
      </div>
      <div className={styles["text-container"]}>
        <div className={styles["box"]}>
          <p className={styles["name"]}>{name}</p>
          <p className={styles["comment"]}>{comment}</p>
        </div>
        <div className={styles["action-row"]}>
          {upvote && (
            <div onClick={upvote} className={styles["action-row"]}>
              {" "}
              <img
                className={styles["icon"]}
                src={require("../../assets/images/arrow-up.png")}
                alt="upvote"
              />{" "}
              <p>{upvotes.length}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reply;
