import { useState, useEffect, useRef } from "react";
import * as esbuild from "esbuild-wasm";
import { unpkgPathPlugin } from "../plugins/unpkg-path-plugin";
import { fetchPlugin } from "../plugins/fetch-plugin";
import CodeEditor from "./code-editor";

const App = () => {
  const ref = useRef<any>();
  const iframeRef = useRef<any>();
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");

  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: "https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm", // url is public/esbuild.wasm
    });
  };

  useEffect(() => {
    startService();
  }, []);

  const onClick = async () => {
    if (!ref.current) {
      return;
    }

    console.log(iframeRef.current);
    iframeRef.current.scrdoc = html;

    const result = await ref.current.build({
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      define: {
        "process.env.NODE_ENV": '"production"',
        global: "window", // replace global to window
      },
    });

    // const result = await ref.current.transform(input, {
    //   loader: 'jsx',
    //   target: ['es2015'],
    // });
    // setCode(result.code);

    // setCode(result.outputFiles[0].text);
    iframeRef.current.contentWindow.postMessage(
      result.outputFiles[0].text,
      "*"
    );
  };

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

  return (
    <div>
      <CodeEditor initialValue="const a = 1;" />
      <textarea value={input} onChange={(e) => setInput(e.target.value)} />
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      {/* <pre>{code}</pre> */}
      <iframe ref={iframeRef} sandbox="allow-scripts" srcDoc={html} />
    </div>
  );
};

export default App;
