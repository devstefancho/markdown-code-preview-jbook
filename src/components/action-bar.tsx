import '@fortawesome/fontawesome-free/css/all.min.css';
import { useActions } from '../hooks/use-actions';
import './action-bar.css';

interface ActionBarProps {
  id: string;
}

const ActionBar: React.FC<ActionBarProps> = ({ id }) => {
  const { moveCell, deleteCell } = useActions();
  return (
    <div className='button-wrapper'>
      <button
        className='button is-primary is-small'
        onClick={() => moveCell(id, 'up')}
      >
        <span className='icon'>
          <i className='fas fa-arrow-up'></i>
        </span>
      </button>
      <button
        className='button is-primary is-small'
        onClick={() => moveCell(id, 'down')}
      >
        <span className='icon'>
          <i className='fas fa-arrow-down'></i>
        </span>
      </button>
      <button
        className='button is-primary is-small'
        onClick={() => deleteCell(id)}
      >
        <span className='icon'>
          <i className='fas fa-times'></i>
        </span>
      </button>
    </div>
  );
};

export default ActionBar;
