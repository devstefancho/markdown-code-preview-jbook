import "bulmaswatch/superhero/bulmaswatch.min.css";
import "./code-editor.css";
import MonacoEditor, { EditorDidMount } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { useRef } from "react";
import prettier from "prettier";
import parser from "prettier/parser-babel";

interface CodeEditorProps {
  initialValue: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialValue }) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const onEditorDidMount: EditorDidMount = (getValue, monacoEditor) => {
    editorRef.current = monacoEditor;
    // detect text change
    monacoEditor.onDidChangeModelContent(() => {
      // console.log(getValue());
    });

    monacoEditor.updateOptions({ tabSize: 2 });
  };
  const onFormatterClick = () => {
    if (!editorRef.current) {
      return;
    }

    const unformatted = editorRef.current.getModel()?.getValue() ?? "";
    const format = prettier
      .format(unformatted, {
        parser: "babel",
        plugins: [parser],
        useTabs: false,
        semi: true,
        singleQuote: true,
      })
      .replace(/\n$/, ""); // delete last new line
    editorRef.current.setValue(format);
  };
  return (
    <div className="editor-wrapper">
      <button
        className="button button-small is-primary is-small button-format"
        onClick={onFormatterClick}
      >
        Formatter
      </button>
      <MonacoEditor
        editorDidMount={onEditorDidMount}
        value={initialValue}
        theme="dark"
        language="javascript"
        height={500}
        options={{
          wordWrap: "on",
          minimap: { enabled: false },
          showUnused: false,
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: 16,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;
