/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';
import { changeTodo, deleteTodo } from '../api/todos';
import { ErrorMessage } from '../types/ErrorMessage';

type Props = {
  todo: Todo;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: (e: ErrorMessage) => void;
  isLoading: boolean;
};

export const TodoItem = ({
  todo,
  setTodos,
  setErrorMessage,
  isLoading,
}: Props) => {
  const [todoLoading, setTodoLoading] = useState(false);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
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
              .then(() =>
                setTodos(prevTodos =>
                  prevTodos.map(prevTodo => {
                    if (prevTodo.id !== todo.id) {
                      return prevTodo;
                    }

                    return {
                      ...prevTodo,
                      completed: !todo.completed,
                    };
                  }),
                ),
              )
              .catch(() => setErrorMessage('Unable to update a todo'))
              .finally(() => setTodoLoading(false));
          }}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => {
          setTodoLoading(true);
          deleteTodo(todo.id)
            .then(() =>
              setTodos(prevTodos =>
                prevTodos.filter(prevTodo => prevTodo.id !== todo.id),
              ),
            )
            .catch(() => setErrorMessage('Unable to delete a todo'))
            .finally(() => setTodoLoading(false));
        }}
      >
        ×
      </button>

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
  );
};
