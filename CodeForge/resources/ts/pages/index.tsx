import React from "react";
import { useState } from "react";

const Index = () => {
    const [counter, updateCounter] = useState<number>(0);
    return (
        <span
            className="m-1 p-1 bg-green-200 text-black"
            style={{ userSelect: "none"}}
            onClick={() => updateCounter((prevState) => prevState + 1)}
        >
            You have clicked this span {counter} times!
        </span>
    );
};

export default Index;
