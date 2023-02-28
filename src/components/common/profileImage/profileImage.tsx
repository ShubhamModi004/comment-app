
import classNames from "classnames";
import { HTMLProps } from "react";

// components
import Avatar, { AvatarSize } from "../Avatar";
// styles
import styles from "./styles.module.scss";
interface IImageUploaderProps extends HTMLProps<HTMLDivElement> {
    imageUrl?: File | undefined | ArrayBuffer | null | string;
    imageUploading?: boolean;
    handleOnImageChange: any;
}
const ImageUploader = ({
    imageUploading,
    imageUrl,
    handleOnImageChange,
}: IImageUploaderProps): JSX.Element => {
    return (
        <div id={`image_upload_button`} className={styles["avatar_wrapper"]}>
            <input
                onChange={handleOnImageChange}
                className={styles["avatar_top"]}
                type="file"
                name="picture"
                accept="image/x-png,image/jpeg,image/jpg,image/webp,image/png"
                id="picture"
            />
            {imageUploading ? (
                <div className={styles["avatar_loading"]}>
                    <p className={classNames(styles["subtitle1"], styles["g900"])}>
                        loading...
                    </p>
                </div>
            ) : (
                <Avatar
                    avatarSize={AvatarSize.LARGE}
                    className={styles["avatar"]}
                    source={imageUrl}
                    alt=""
                />
            )}
        </div>
    );
};

export default ImageUploader;




// import React, { useRef } from 'react'
// import { storage } from '../../../config/firebase';
// import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
// // styles
// import styles from "./styles.module.scss";

// interface Props extends React.HTMLProps<HTMLInputElement> {
//     label?: string;
//     name?: string;
//     handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
// }

// const ProfileImage: React.FC<Props> = ({
//     label = "",
//     name = "",
//     handleChange,
//     ...props
// }) => {
//     const inputRef = useRef(null);

//     const handleClick = () => {
//         // 👇️ open file input box on click of other element
//         if (inputRef.current) {
//             inputRef.current.onClick();
//         }

//     };

//     const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         event.preventDefault()
//         const file = event.target.files && event.target.files[0]

//         if (!file) return;

//         const storageRef = ref(storage, `files/${file.name}`);
//         const uploadTask = uploadBytesResumable(storageRef, file);

//         uploadTask.on("state_changed",
//             (snapshot) => {
//                 // const progress =
//                 //     Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
//                 // setProgresspercent(progress);
//             },
//             (error) => {
//                 alert(error);
//             },
//             () => {
//                 getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
//                     // setImgUrl(downloadURL)
//                 });
//             }
//         );
//     };

//     return (
//         <div>
//             <input
//                 // style={{ display: 'none' }}
//                 ref={inputRef}
//                 type="file"
//                 onChange={handleFileChange}
//                 {...props}
//             />
//             <img className={styles["image-container"]} onClick={handleClick} alt={require('../../assets/images/user.png')} src={require('../../assets/images/user.png')} />
//         </div>
//     )
// }


// export default ProfileImage

