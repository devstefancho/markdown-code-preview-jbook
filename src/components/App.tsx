import { useState, useRef } from "react";
import bundler from "../bundler/bundler";
import Preview from "./preview";
import CodeEditor from "./code-editor";

const App = () => {
  const prevCodeRef = useRef<string>("");
  const [code, setCode] = useState<string>("");
  const [input, setInput] = useState<string>("");

  const onClick = async () => {
    if (prevCodeRef.current === input) return;

    const output = await bundler(input);
    setCode(output);
    prevCodeRef.current = output;
  };

  return (
    <div>
      <CodeEditor initialValue="" onChange={setInput} />
      <button onClick={onClick}>Submit</button>
      <Preview code={code} />
    </div>
  );
};

export default App;
