import "./preview.css";
import { useEffect, useRef } from "react";

interface CodeCellProps {
  code: string;
  err: string;
}

const html = `
    <html>
      <head></head>
      <body>
        <div id="root"></div>
        <script>
          const handleError = (error) => {
              const root = document.querySelector('#root');
              root.innerHTML = '<div style="color:red;"><h3>Runtime Error</h3>' + error + '</div>';
          }
          window.addEventListener('error', (event) => {
            event.preventDefault();
            handleError(event.message);
          })
          window.addEventListener('message', (event) => {
            try {
              root.innerHTML = '';
              eval(event.data);
            } catch (error) {
              handleError(error);
            }
          }, false)
        </script>
      </body>
    </html>
  `;

const Preview: React.FC<CodeCellProps> = ({ code, err }) => {
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
      {err && <div className="preview-error">{err}</div>}
    </div>
  );
};

export default Preview;
