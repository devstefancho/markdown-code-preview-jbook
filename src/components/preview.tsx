import "./preview.css";
import { useEffect, useRef } from "react";

interface CodeCellProps {
  code: string;
}

const html = `
    <html>
      <head></head>
      <body>
        <div id="root"></div>
        <script>
          window.addEventListener('message', (event) => {
            try {
              root.innerHTML = '';
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

const Preview: React.FC<CodeCellProps> = ({ code }) => {
  const iframeRef = useRef<any>();

  useEffect(() => {
    iframeRef.current.scrdoc = html;
    setTimeout(() => {
      iframeRef.current.contentWindow.postMessage(code, "*");
    }, 50);
  }, [code]);

  return (
    <div className="preview-wrapper">
      <iframe ref={iframeRef} sandbox="allow-scripts" srcDoc={html} />
    </div>
  );
};

export default Preview;
