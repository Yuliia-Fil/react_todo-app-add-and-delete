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
  isLoading: boolean;
};

export const TodoItem = ({
  todo,
  updateTodos,
  setErrorMessage,
  isLoading,
}: Props) => {
  const [hovered, setHovered] = useState(false);
  const [todoLoading, setTodoLoading] = useState(false);

  // const isLoading = todoLoadingProp ?? todoLoading;

  return (
    <>
      <div
        data-cy="Todo"
        className={classNames('todo', { completed: todo.completed })}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseMove={() => {
          if (!hovered) {
            setHovered(true);
          }
        }}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            onChange={() => {
              setTodoLoading(true);
              changeTodo(todo.id, { completed: !todo.completed })
                .then(() => updateTodos())
                .catch(() => setErrorMessage('Unable to update a todo'))
                .finally(() => setTodoLoading(false));
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
            'is-active': isLoading || todoLoading,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
