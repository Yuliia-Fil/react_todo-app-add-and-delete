import { useEffect, useRef, useState } from 'react';
import { addTodo, USER_ID } from '../api/todos';
import { ErrorMessage } from '../types/ErrorMessage';
import { Todo } from '../types/Todo';

type Props = {
  title: string;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setTitle: (t: string) => void;
  setErrorMessage: (e: ErrorMessage) => void;
  setTempTodo: (x: Todo | null) => void;
};

export const Form = ({
  title,
  setTitle,
  setErrorMessage,
  setTempTodo,
  setTodos,
}: Props) => {
  const [formLoading, setFormLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!formLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [formLoading]);

  return (
    <form
      onSubmit={event => {
        event.preventDefault();

        if (!title.trim()) {
          setErrorMessage('Title should not be empty');

          return;
        }

        setFormLoading(true);

        setTempTodo({
          title: title.trim(),
          id: 0,
          userId: USER_ID,
          completed: false,
        });

        addTodo({
          userId: USER_ID,
          title: title.trim(),
          completed: false,
        })
          .then(newTodo => {
            setTodos(prevTodos => [...prevTodos, newTodo]);
            setTitle('');
            setTempTodo(null);
          })
          .catch(error => {
            setErrorMessage('Unable to add a todo');
            setTempTodo(null);
            throw error;
          })
          .finally(() => setFormLoading(false));
      }}
    >
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        ref={inputRef}
        disabled={formLoading}
        value={title}
        onChange={e => {
          setTitle(e.target.value);
          setErrorMessage('');
        }}
      />
    </form>
  );
};
