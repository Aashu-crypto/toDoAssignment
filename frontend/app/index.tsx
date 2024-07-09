import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList } from "react-native";
import { fetchTodos, createTodo } from "../api";
import TodoItem from "@/components/TodoItem";
import { ThemedView } from "@/components/ThemedView";
import Enter from "../components/Enter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Todo from "../components/Todo";

const HomeScreen: React.FC = () => {

  
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const fetchUser = async () => {
      const data = await AsyncStorage.getItem("userEmail");
      console.log(data);
      setUserId(data);
    };
    fetchUser();
  }, []);

  return (
    <ThemedView className="p-4 flex-1">
      {userId.length == 0 ? (
        <Enter />
      ) : (
       <Todo/>
      )}
    </ThemedView>
  );
};

export default HomeScreen;
