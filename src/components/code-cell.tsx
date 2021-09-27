import './code-cell.css';
import { useEffect } from 'react';
import Preview from './preview';
import CodeEditor from './code-editor';
import Resizable from './resizable';
import { Cell } from '../redux';
import { useActions } from '../hooks/use-actions';
import { useTypedSelector } from '../hooks/use-typed-selector';

interface CellCodeProps {
  cell: Cell;
}

const CodeCell: React.FC<CellCodeProps> = ({ cell }) => {
  const bundle = useTypedSelector((state) => state.bundles[cell.id]);
  const cumulativeCode = useTypedSelector((state) => {
    const { data, order } = state.cells;
    const orderedData = order.map((id) => data[id]);

    const cumulativeCode = [
      `
      import _React from 'react';
      import _ReactDOM from 'react-dom';
      const show = (input) => {
        const root = document.querySelector('#root');
        if (typeof input === 'object') {
          console.log(input)
          if (input.$$typeof && input.props) {
            _ReactDOM.render(input, root);
          } else {
            root.innerHTML = JSON.stringify(input);
          }
        } else {
          root.innerHTML = input;
        }
      }
      `,
    ];
    for (let c of orderedData) {
      if (c.type === 'code') {
        cumulativeCode.push(c.content);
      }
      if (c.id === cell.id) {
        break;
      }
    }
    return cumulativeCode;
  });
  const { updateCell, createBundle } = useActions();

  useEffect(() => {
    if (!bundle) {
      createBundle(cell.id, cumulativeCode.join('\n'));
      return;
    }

    const timer = setTimeout(async () => {
      createBundle(cell.id, cumulativeCode.join('\n'));
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cell.id, cumulativeCode.join('\n'), createBundle]);

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
