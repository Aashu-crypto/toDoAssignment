import {
  View,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
type Props = {};

const Enter = (props: Props) => {
  const [mail, setMail] = useState<string>();
  const handleSubmit = async () => {
    if (mail) {
      try {
        await AsyncStorage.setItem("userEmail", mail);
        Alert.alert("Success", "Email saved successfully!");
      } catch (e) {
        Alert.alert("Error", "Failed to save email.");
      }
    } else {
      Alert.alert("Error", "Please enter an email.");
    }
  };
  return (
    <View className="flex-1 justify-center items-center ">
      <Text>Enter Your Email</Text>
      <TextInput
        placeholder="mail"
        onChangeText={(e: string) => setMail(e)}
        className=" border p-2 w-11/12 rounded-sm"
      />
      <TouchableOpacity
        className="p-2 border mt-5 focus:bg-cyan-300"
        onPress={handleSubmit}
      >
        <Text>Submit</Text>
      </TouchableOpacity>
    </View>
  );
  f;
};

export default Enter;
