import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList } from "react-native";
import { fetchTodos, createTodo } from "../api";
import TodoItem from "@/components/TodoItem";
import { ThemedView } from "@/components/ThemedView";

const HomeScreen: React.FC = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const userId = "user123"; // Replace with the actual user ID logic

  const loadTodos = async () => {
    const data = await fetchTodos(userId);
    setTodos(data);
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const addTodo = async () => {
    await createTodo(newTodo, userId);
    setNewTodo("");
    loadTodos();
  };

  return (
    <ThemedView className="p-4 flex-1">
      <Text className="text-2xl font-bold mb-4">Todo List</Text>
      <View className="flex-row mb-4">
        <TextInput
          className="flex-1 border border-gray-300 p-2"
          placeholder="New Todo"
          value={newTodo}
          onChangeText={setNewTodo}
        />
        <Button title="Add" onPress={addTodo} />
      </View>
      <FlatList
        data={todos}
        renderItem={({ item }) => (
          <TodoItem todo={item} refreshTodos={loadTodos} />
        )}
        keyExtractor={(item) => item.id}
      />
    </ThemedView>
  );
};

export default HomeScreen;
