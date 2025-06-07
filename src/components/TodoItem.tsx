/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';
import { changeTodo, deleteTodo } from '../api/todos';
import { ErrorMessage } from '../types/ErrorMessage';

type Props = {
  todo: Todo;
  updateTodos: () => void;
  setErrorMessage: (e: ErrorMessage) => void;
  todoLoading?: boolean;
};

export const TodoItem = ({
  todo,
  updateTodos,
  setErrorMessage,
  todoLoading: todoLoadingProp,
}: Props) => {
  const [checked, setChecked] = useState(todo.completed);
  const [hovered, setHovered] = useState(false);
  const [todoLoading, setTodoLoading] = useState(false);

  const isLoading = todoLoadingProp ?? todoLoading;

  return (
    <>
      <div
        data-cy="Todo"
        className={classNames('todo', { completed: checked })}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={checked}
            onChange={e => {
              setChecked(e.target.checked);
              changeTodo(todo.id, { completed: e.target.checked }).then(() =>
                updateTodos(),
              );
            }}
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          {todo.title}
        </span>

        {/* Remove button appears only on hover */}

        {hovered && (
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => {
              setTodoLoading(true);
              deleteTodo(todo.id)
                .then(() => updateTodos())
                .catch(() => setErrorMessage('Unable to delete a todo'))
                .finally(() => setTodoLoading(false));
            }}
          >
            ×
          </button>
        )}

        <div
          data-cy="TodoLoader"
          className={classNames('modal', 'overlay', {
            'is-active': isLoading,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
