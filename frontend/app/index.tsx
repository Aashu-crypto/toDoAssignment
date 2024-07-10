import React, { useEffect, useState } from "react";
import { Button, KeyboardAvoidingView, Platform, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemedView } from "@/components/ThemedView";
import Enter from "../components/Enter";
import Todo from "../components/Todo";

const HomeScreen: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const data = await AsyncStorage.getItem("userEmail");
      setUserId(data);
    };
    fetchUser();
  }, []);

  const handleDelete = async () => {
    try {
      await AsyncStorage.removeItem("userEmail");
      setUserId(null);
    } catch (error) {
      console.error("Failed to delete the user email:", error);
    }
  };

  const handleUserIdSubmit = (id: string) => {
    setUserId(id);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ThemedView className="p-4 flex-1 bg-slate-100">
        <Button title="Delete" onPress={handleDelete} />
        <Text>userID: {userId}</Text>
        {userId === null || userId.length === 0 ? (
          <Enter onUserIdSubmit={handleUserIdSubmit} />
        ) : (
          <Todo userId={userId} />
        )}
      </ThemedView>
    </KeyboardAvoidingView>
  );
};

export default HomeScreen;
