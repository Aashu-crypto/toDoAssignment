import { View, Text, FlatList, Button, TextInput } from "react-native";
import React, { useState, useEffect } from "react";

type Props = {};

const Todo = (props: Props) => {
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([]);
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
    <View className="flex-1 justify-center items-center ">
      <View className="flex-row mb-4">
        <TextInput
          className="flex-1 border border-gray-300 p-2"
          placeholder="New Todo"
          value={newTodo}
          onChangeText={setNewTodo}
        />
        <Button title="Add" onPress={addTodo} />
      </View>
      {/* <FlatList
        data={todos}
        renderItem={({ item }) => (
          <TodoItem todo={item} refreshTodos={loadTodos} />
        )}
        keyExtractor={(item) => item.id}
      /> */}
    </View>
  );
};

export default Todo;
