/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';

import { Todo } from './types/Todo';
import { TodoItem } from './components/TodoItem';
import classNames from 'classnames';
import { ErrorMessage } from './types/ErrorMessage';
import { Form } from './components/Form';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [activeTodos, setActiveTodos] = useState<Todo[]>([]);
  const [completedTodos, setCompletedTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>('');
  const [activeLink, setActiveLink] = useState('all');

  const updateTodos = useCallback(
    (link = activeLink) => {
      switch (link) {
        case 'all':
          getTodos()
            .then(allTodos => {
              setTodos(allTodos);
              setActiveTodos(allTodos.filter(todo => !todo.completed));
              setCompletedTodos(allTodos.filter(todo => todo.completed));
            })
            .catch(() => setErrorMessage('Unable to load todos'));

          break;
        case 'active':
          getTodos()
            .then(allTodos => {
              setTodos(allTodos.filter(todo => !todo.completed));
              setActiveTodos(allTodos.filter(todo => !todo.completed));
              setCompletedTodos(allTodos.filter(todo => todo.completed));
            })
            .catch(() => setErrorMessage('Unable to load todos'));

          break;
        case 'completed':
          getTodos()
            .then(allTodos => {
              setTodos(allTodos.filter(todo => todo.completed));
              setActiveTodos(allTodos.filter(todo => !todo.completed));
              setCompletedTodos(allTodos.filter(todo => todo.completed));
            })
            .catch(() => setErrorMessage('Unable to load todos'));

          break;
      }
    },
    [activeLink],
  );

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

  useEffect(() => updateTodos(), [updateTodos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          <Form
            title={title}
            updateTodos={updateTodos}
            setTitle={setTitle}
            setErrorMessage={setErrorMessage}
            setTempTodo={setTempTodo}
          />
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {todos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              updateTodos={updateTodos}
              setErrorMessage={setErrorMessage}
            />
          ))}
          {tempTodo && (
            <TodoItem
              key={tempTodo.id}
              todo={tempTodo}
              updateTodos={updateTodos}
              setErrorMessage={setErrorMessage}
              todoLoading={true}
            />
          )}
        </section>

        {/* Hide the footer if there are no todos */}
        {activeTodos.length + completedTodos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${activeTodos.length} items left`}
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={classNames('filter__link', {
                  selected: activeLink === 'all',
                })}
                data-cy="FilterLinkAll"
                onClick={() => {
                  setActiveLink('all');
                  updateTodos('all');
                }}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames('filter__link', {
                  selected: activeLink === 'active',
                })}
                data-cy="FilterLinkActive"
                onClick={() => {
                  setActiveLink('active');
                  updateTodos('active');
                }}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames('filter__link', {
                  selected: activeLink === 'completed',
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => {
                  setActiveLink('completed');
                  updateTodos('completed');
                }}
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={completedTodos.length === 0 ? true : false}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
