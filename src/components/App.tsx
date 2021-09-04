import { useState, useEffect, useRef } from "react";
import bundler from "../bundler/bundler";
import CodeEditor from "./code-editor";

const html = `
    <html>
      <head></head>
      <body>
        <div id="root"></div>
        <script>
          window.addEventListener('message', (event) => {
            try {
              eval(event.data);
            } catch (error) {
              const root = document.querySelector('#root');
              root.innerHTML = '<div style="color:red;"><h3>Runtime Error</h3>' + error + '</div>';
            }
          }, false)
        </script>
      </body>
    </html>
  `;

const App = () => {
  const iframeRef = useRef<any>();
  const prevCodeRef = useRef<string>("");
  const [code, setCode] = useState<string>("");

  const onClick = async () => {
    if (prevCodeRef.current === code) return;

    const output = await bundler(code);
    iframeRef.current.scrdoc = html;
    iframeRef.current.contentWindow.postMessage(output, "*");
    setCode(output);
    prevCodeRef.current = output;
  };

  return (
    <div>
      <CodeEditor initialValue="" onChange={setCode} />
      <button onClick={onClick}>Submit</button>
      <iframe ref={iframeRef} sandbox="allow-scripts" srcDoc={html} />
    </div>
  );
};

export default App;
