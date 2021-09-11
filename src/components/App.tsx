import { useState, useRef, useEffect } from "react";
import bundler from "../bundler/bundler";
import Preview from "./preview";
import CodeEditor from "./code-editor";
import Resizable from "./resizable";

const App = () => {
  const prevCodeRef = useRef<string>("");
  const [code, setCode] = useState<string>("");
  const [input, setInput] = useState<string>("");

  useEffect(() => {
    const timer = setTimeout(async () => {
      const output = await bundler(input);
      setCode(output);
      prevCodeRef.current = output;
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [input]);

  return (
    <Resizable direction="vertical">
      <div style={{ height: "100%", display: "flex", flexDirection: "row" }}>
        <Resizable direction="horizontal">
          <CodeEditor initialValue="" onChange={setInput} />
          {/* <button onClick={onClick}>Submit</button> */}
        </Resizable>
        <Preview code={code} />
      </div>
    </Resizable>
  );
};

export default App;
