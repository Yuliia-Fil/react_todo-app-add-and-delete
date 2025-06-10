import { ActiveLink } from '../types/ActiveLink';
import { ErrorMessage } from '../types/ErrorMessage';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: (e: ErrorMessage) => void;
  activeLink: ActiveLink;
  loadingIds: number[];
};

export const TodoList = ({
  todos,
  tempTodo,
  setTodos,
  setErrorMessage,
  loadingIds,
  activeLink,
}: Props) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos
        .filter(todo => {
          switch (activeLink) {
            case 'all':
              return true;
            case 'active':
              return !todo.completed;
            case 'completed':
              return todo.completed;
          }
        })
        .map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            isLoading={loadingIds.includes(todo.id)}
            setTodos={setTodos}
            setErrorMessage={setErrorMessage}
          />
        ))}
      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
          isLoading={true}
        />
      )}
    </section>
  );
};
