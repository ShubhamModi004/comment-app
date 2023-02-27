import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";

// components
import Spinner from "./components/common/spinner";
//screens
const Login = React.lazy(() => import("./screens/login"));
const CommentSection = React.lazy(() => import("./screens/commentSection"));

const App = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/comments" element={<CommentSection />} />
      </Routes>
    </Suspense>
  );
};

export default App;
