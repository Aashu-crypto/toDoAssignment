import React from 'react';
import { View } from 'react-native';
import TodoItem from './TodoItem';
import { styled } from 'nativewind';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoListProps {
  todos: Todo[];
  onUpdate: (id: string) => void;
  onDelete: (id: string) => void;
  onComplete: (id: string) => void;
}

const StyledView = styled(View);

const TodoList: React.FC<TodoListProps> = ({ todos, onUpdate, onDelete, onComplete }) => {
  return (
    <StyledView className="p-4">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onComplete={onComplete}
        />
      ))}
    </StyledView>
  );
};

export default TodoList;
