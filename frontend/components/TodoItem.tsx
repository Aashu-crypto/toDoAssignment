import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { updateTodo, deleteTodo } from '../api';

interface TodoItemProps {
  todo: {
    id: string;
    title: string;
    completed: boolean;
  };
  refreshTodos: () => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, refreshTodos }) => {
  const toggleComplete = async () => {
    await updateTodo(todo.id, todo.title, !todo.completed);
    refreshTodos();
  };

  const removeTodo = async () => {
    await deleteTodo(todo.id);
    refreshTodos();
  };

  return (
    <View className="flex-row justify-between items-center p-2 border-b border-gray-200">
      <TouchableOpacity onPress={toggleComplete}>
        <Text className={todo.completed ? 'line-through' : ''}>{todo.title}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={removeTodo}>
        <Text className="text-red-500">Delete</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TodoItem;
