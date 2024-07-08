import { Text, View } from "react-native";
import React, { useState } from "react";
import { TextInput } from "react-native-gesture-handler";

type Props = {};

const SignIn = (props: Props) => {
  const [userId, setUserId] = useState<string>("");
  return (
    <View>
      <Text>SignIn</Text>
      <TextInput
        placeholder="Enter Your Unique name"
        onChangeText={(e) => setUserId(e)}
      />
    </View>
  );
};

export default SignIn;
