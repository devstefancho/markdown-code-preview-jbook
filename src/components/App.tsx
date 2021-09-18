import TextEditor from './text-editor';
import { Provider } from 'react-redux';
import { store } from '../redux';

const App = () => {
  return (
    <Provider store={store}>
      <div>
        <TextEditor />
      </div>
    </Provider>
  );
};

export default App;
