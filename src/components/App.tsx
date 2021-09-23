import TextEditor from './text-editor';
import { Provider } from 'react-redux';
import { store } from '../redux';
import CellList from './cell-list';

const App = () => {
  return (
    <Provider store={store}>
      <CellList />
    </Provider>
  );
};

export default App;
