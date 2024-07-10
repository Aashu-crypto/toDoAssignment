import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { backendHost } from "@/constants/config";
import axios from "axios";
const Enter = () => {
  const [mail, setMail] = useState<string>();

  const inputOpacity = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);

  useEffect(() => {
    inputOpacity.value = withTiming(1, { duration: 1000 });
    buttonOpacity.value = withTiming(1, { duration: 1500 });
  }, []);

  const inputAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: inputOpacity.value,
    };
  });

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: buttonOpacity.value,
    };
  });

  const handleSubmit = async () => {
    if (mail) {
      try {
        // Make the API request
        console.log(`${backendHost}/`);
        
        const response = await axios.post(`${backendHost}/user`, {
          userId: mail,
        });

        console.log(response);
        await AsyncStorage.setItem("userEmail", mail);
        // Alert the user
        Alert.alert("Success", "Your ID has been saved successfully!");
      } catch (e) {
        console.log(e);

        Alert.alert("Error", "Failed to save your ID.");
      }
    } else {
      Alert.alert("Error", "Please enter a valid ID.");
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-gray-100 p-5">
      <MaterialIcons
        name="account-circle"
        size={100}
        color="#007BFF"
        className="mb-5"
      />
      <Text className="text-2xl font-bold mb-4">Welcome</Text>
      <Text className="text-base text-center text-gray-600 mb-5">
        Please enter your unique ID (email or name) to access your tasks.
      </Text>
      <Animated.View
        style={[{ width: "91.66%" }, inputAnimatedStyle]}
        className="mb-5"
      >
        <View className="flex-row items-center border border-gray-300 rounded-lg bg-white p-3 shadow-md">
          <MaterialIcons name="email" size={24} color="gray" />
          <TextInput
            placeholder="Enter your ID"
            onChangeText={(e: string) => setMail(e)}
            className="flex-1 ml-2 text-base"
          />
        </View>
      </Animated.View>
      <Animated.View
        style={[{ width: "91.66%" }, buttonAnimatedStyle]}
        className="rounded-lg overflow-hidden shadow-md"
      >
        <TouchableOpacity onPress={handleSubmit}>
          <LinearGradient
            colors={["#4c669f", "#3b5998", "#192f6a"]}
            start={[0, 0]}
            end={[1, 1]}
            className="py-3"
          >
            <Text className="text-white text-center text-lg font-semibold">
              Submit
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default Enter;
