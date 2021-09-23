import { useState, useRef, useEffect } from 'react';
import bundler from '../bundler/bundler';
import Preview from './preview';
import CodeEditor from './code-editor';
import Resizable from './resizable';
import { Cell } from '../redux';
import { useActions } from '../hooks/use-actions';

interface CellCodeProps {
  cell: Cell;
}

const CodeCell: React.FC<CellCodeProps> = ({ cell }) => {
  const prevCodeRef = useRef<string>('');
  const [code, setCode] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { updateCell } = useActions();

  useEffect(() => {
    const timer = setTimeout(async () => {
      const output = await bundler(cell.content);
      setCode(output.code);
      setError(output.err);
      prevCodeRef.current = output.code;
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [cell.content]);

  return (
    <Resizable direction='vertical'>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'row' }}>
        <Resizable direction='horizontal'>
          <CodeEditor
            initialValue={cell.content}
            onChange={(value) => updateCell(cell.id, value)}
          />
        </Resizable>
        <Preview code={code} err={error} />
      </div>
    </Resizable>
  );
};

export default CodeCell;
