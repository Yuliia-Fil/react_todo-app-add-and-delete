import classNames from 'classnames';
import { ErrorMessage } from '../types/ErrorMessage';
import { Todo } from '../types/Todo';
import { changeTodo } from '../api/todos';
import { Form } from './Form';

type Props = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: (e: ErrorMessage) => void;
  title: string;
  setTitle: (t: string) => void;
  setTempTodo: (t: Todo | null) => void;
};
export const Header = ({
  todos,
  setTodos,
  setTempTodo,
  title,
  setTitle,
  setErrorMessage,
}: Props) => {
  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: todos.every(todo => todo.completed),
        })}
        data-cy="ToggleAllButton"
        onClick={() => {
          const allCompleted = todos.every(todo => todo.completed);

          const newStatus = allCompleted ? false : true;

          Promise.all(
            todos.map(todo => changeTodo(todo.id, { completed: newStatus })),
          )
            .then(() =>
              setTodos(
                todos.map(todo => {
                  return { ...todo, completed: newStatus };
                }),
              ),
            )
            .catch(() => setErrorMessage('Unable to update a todo'));
        }}
      />

      <Form
        title={title}
        setTodos={setTodos}
        setTitle={setTitle}
        setErrorMessage={setErrorMessage}
        setTempTodo={setTempTodo}
      />
    </header>
  );
};
