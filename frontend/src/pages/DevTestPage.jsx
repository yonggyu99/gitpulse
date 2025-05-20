import React, { useState } from "react";
import IntroPage from "../components/IntroPage";
import DevTypeTest from "../components/dev-type-test";

const DevTestPage = () => {
  const [started, setStarted] = useState(false);

  return (
    <>
      {!started ? (
        <IntroPage
          onStart={() => {
            setStarted(true);
          }}
        />
      ) : (
        <DevTypeTest />
      )}
    </>
  );
};

export default DevTestPage;
