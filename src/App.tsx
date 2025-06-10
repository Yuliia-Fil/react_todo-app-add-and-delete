/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { ErrorMessage } from './types/ErrorMessage';
import { ErrorNotification } from './components/ErrorNotification';
import { ActiveLink } from './types/ActiveLink';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>('');
  const [activeLink, setActiveLink] = useState<ActiveLink>('all');
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (errorMessage) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = window.setTimeout(() => {
        setErrorMessage('');
        timeoutRef.current = null;
      }, 3000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [errorMessage]);

  useEffect(() => {
    getTodos()
      .then(todosFromServer => setTodos(todosFromServer))
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          todos={todos}
          setTodos={setTodos}
          setTempTodo={setTempTodo}
          title={title}
          setTitle={setTitle}
          setErrorMessage={setErrorMessage}
        />

        <TodoList
          todos={todos}
          tempTodo={tempTodo}
          loadingIds={loadingIds}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
          activeLink={activeLink}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            setTodos={setTodos}
            activeLink={activeLink}
            setActiveLink={setActiveLink}
            setErrorMessage={setErrorMessage}
            setLoadingIds={setLoadingIds}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
