import { deleteTodo } from '../api/todos';
import { ErrorMessage } from '../types/ErrorMessage';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: (e: ErrorMessage) => void;
  setLoadingIds: (ids: number[]) => void;
};
export const ClearCompletedButton = ({
  todos,
  setTodos,
  setErrorMessage,
  setLoadingIds,
}: Props) => {
  return (
    <button
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      disabled={todos.every(todo => !todo.completed) ? true : false}
      onClick={() => {
        const completedTodos = todos.filter(todo => todo.completed);

        setLoadingIds(completedTodos.map(todo => todo.id));
        Promise.all(completedTodos.map(todo => deleteTodo(todo.id)))
          .then(() => setTodos(todos.filter(todo => !todo.completed)))
          .catch(() => setErrorMessage('Unable to delete a todo'))
          .finally(() => setLoadingIds([]));
      }}
    >
      Clear completed
    </button>
  );
};
