import React from "react";

// components
import Button, { ButtonSize } from "../../common/button";
import TextInput from "../../common/textInput";
import Spinner from "../../common/spinner";

// styles
import styles from "./styles.module.scss";

interface Props {
  value: string;
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  submit: () => void;
  loading?: boolean;
}

const InputAction = ({
  value,
  handleChange,
  submit,
  loading = false,
}: Props): JSX.Element => {
  return (
    <div className={styles["input_section"]}>
      <div className={styles["input_section_container"]}>
        <TextInput
          value={value}
          handleChange={handleChange}
          loading={loading}
          submit={submit}
        />
      </div>
    </div>
  );
};

export default React.memo(InputAction);
