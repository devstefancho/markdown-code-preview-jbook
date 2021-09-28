import './code-cell.css';
import { useEffect } from 'react';
import Preview from './preview';
import CodeEditor from './code-editor';
import Resizable from './resizable';
import { Cell } from '../redux';
import { useActions } from '../hooks/use-actions';
import { useTypedSelector } from '../hooks/use-typed-selector';
import { useCumulativeCode } from '../hooks/use-cumulative-code';

interface CellCodeProps {
  cell: Cell;
}

const CodeCell: React.FC<CellCodeProps> = ({ cell }) => {
  const bundle = useTypedSelector((state) => state.bundles[cell.id]);
  const { updateCell, createBundle } = useActions();
  const cumulativeCode = useCumulativeCode(cell.id);

  useEffect(() => {
    if (!bundle) {
      createBundle(cell.id, cumulativeCode);
      return;
    }

    const timer = setTimeout(async () => {
      createBundle(cell.id, cumulativeCode);
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cell.id, cumulativeCode, createBundle]);

  return (
    <Resizable direction='vertical'>
      <div
        style={{
          height: 'calc(100% - 10px)',
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <Resizable direction='horizontal'>
          <CodeEditor
            initialValue={cell.content}
            onChange={(value) => updateCell(cell.id, value)}
          />
        </Resizable>
        <div className='preview-wrapper'>
          {!bundle || bundle.loading ? (
            <div className='progress-cover'>
              <progress
                className='progress progress-size is-small is-primary'
                max='100'
              >
                Loading
              </progress>
            </div>
          ) : (
            <Preview code={bundle.code} err={bundle.err} />
          )}
        </div>
      </div>
    </Resizable>
  );
};

export default CodeCell;
