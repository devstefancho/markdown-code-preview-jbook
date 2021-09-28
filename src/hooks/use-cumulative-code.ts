import { useTypedSelector } from './use-typed-selector';

export const useCumulativeCode = (cellId: string) => {
  return useTypedSelector((state) => {
    const { data, order } = state.cells;
    const orderedData = order.map((id) => data[id]);

    const showFunc = `
      import _React from 'react';
      import _ReactDOM from 'react-dom';

      var show = (input) => {
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
      `;
    const showFuncNoOperation = `var show = () => {}`;
    const cumulativeCode = [];
    for (let c of orderedData) {
      if (c.type === 'code') {
        if (c.id === cellId) {
          cumulativeCode.push(showFunc);
        } else {
          cumulativeCode.push(showFuncNoOperation);
        }
        cumulativeCode.push(c.content);
      }
      if (c.id === cellId) {
        break;
      }
    }
    return cumulativeCode.join('\n');
  });
};
