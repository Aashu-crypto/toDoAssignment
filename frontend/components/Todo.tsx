import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Pressable,
} from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import { Replicache, MutatorDefs } from "replicache";
import { backendHost } from "@/constants/config";
import 'react-native-get-random-values';

interface TodoItem {
  id: string;
  title: string;
  userId: string;
  completed: boolean;
}

interface TodoProps {
  userId: string;
}

interface Mutators extends MutatorDefs {
  createTodo: (
    tx: any,
    { id, title, userId, completed }: TodoItem
  ) => Promise<void>;
  updateTodo: (
    tx: any,
    { id, title, completed }: { id: string; title: string; completed: boolean }
  ) => Promise<void>;
  deleteTodo: (tx: any, { id }: { id: string }) => Promise<void>;
  completeTodo: (
    tx: any,
    { id, completed }: { id: string; completed: boolean }
  ) => Promise<void>;
}

const Todo: React.FC<TodoProps> = ({ userId }) => {
  const [newTodo, setNewTodo] = useState<string>("");
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [rep, setRep] = useState<Replicache<Mutators> | null>(null);

  useEffect(() => {
    const initReplicache = async () => {
      const rep = new Replicache<Mutators>({
        licenseKey: "l8db88c384b22423eac07b5e033f3e69e",
        name: `Aashu`,
        pushURL: `${backendHost}/replicache-push`,
        pullURL: `${backendHost}/replicache-pull`,
        mutators: {
          async createTodo(tx, { id, title, userId, completed }) {
            await tx.put(`todo/${id}`, { id, title, userId, completed });
          },
          async updateTodo(tx, { id, title, completed }) {
            const todo = await tx.get(`todo/${id}`);
            if (todo) {
              await tx.put(`todo/${id}`, { ...todo, title, completed });
            }
          },
          async deleteTodo(tx, { id }) {
            await tx.del(`todo/${id}`);
          },
          async completeTodo(tx, { id, completed }) {
            const todo = await tx.get(`todo/${id}`);
            if (todo) {
              await tx.put(`todo/${id}`, { ...todo, completed });
            }
          },
        },
      });

      setRep(rep);

      const unsubscribe = rep.subscribe(
        (tx) => tx.scan({ prefix: "todo/" }).entries().toArray(),
        {
          onData: (entries: [string, TodoItem][]) => {
            setTodos(entries.map(([_, value]) => value));
          },
        }
      );

      return () => unsubscribe();
    };

    initReplicache();
  }, [userId]);

  const handleToDoAdd = () => {
    if (rep) {
      const id = `todo-${Math.random().toString(36).substr(2, 9)}`;
      rep.mutate.createTodo({ id, title: newTodo, userId, completed: false });
      setNewTodo("");
    }
  };

  const handleDelete = (id: string) => {
    if (rep) {
      rep.mutate.deleteTodo({ id });
    }
  };

  const handleUpdate = (id: string, title: string, completed: boolean) => {
    if (rep) {
      rep.mutate.updateTodo({ id, title, completed });
    }
  };

  const renderItem = ({ item }: { item: TodoItem }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemContent}>
        <Checkbox
          style={styles.checkbox}
          value={item.completed}
          onValueChange={(newValue) =>
            handleUpdate(item.id, item.title, newValue)
          }
          color={item.completed ? "#55BCF6" : "#55BCF6"}
        />
        <Text style={styles.itemText}>{item.title}</Text>
      </View>
      <Pressable onPress={() => handleDelete(item.id)}>
        <MaterialIcons name="delete-outline" size={20} color="#E8EAED" />
      </Pressable>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1, marginHorizontal: 12 }}>
        <View style={{ padding: 8, marginTop: 56 }}>
          <Text style={{ fontSize: 24, fontWeight: "bold" }}>
            Today’s tasks: {userId}
          </Text>
        </View>
        <FlatList
          data={todos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={{ marginTop: 20 }}
        />
        <View
          style={{
            flexDirection: "row",
            marginBottom: 16,
            position: "absolute",
            bottom: 4,
            paddingHorizontal: 12,
          }}
        >
          <TextInput
            style={{
              flex: 1,
              padding: 8,
              borderRadius: 24,
              backgroundColor: "white",
              shadowOpacity: 0.3,
              textAlign: "center",
            }}
            placeholder="Write a task"
            placeholderTextColor="#E8EAED"
            value={newTodo}
            onChangeText={setNewTodo}
          />
          <TouchableOpacity
            style={{
              backgroundColor: "white",
              width: 56,
              height: 56,
              borderRadius: 28,
              justifyContent: "center",
              alignItems: "center",
              shadowOpacity: 0.3,
              marginLeft: 8,
            }}
            onPress={handleToDoAdd}
          >
            <AntDesign name="plus" size={32} color="#E8EAED" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Todo;

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: "white",
    marginVertical: 8,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  checkbox: {
    borderRadius: 4,
  },
  itemText: {
    fontSize: 14,
  },
});
