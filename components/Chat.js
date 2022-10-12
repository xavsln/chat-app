import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default class Chat extends React.Component {
  componentDidMount() {
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });

    // this.props.navigation.setOptions({ title: screenColor });
  }
  render() {
    let { screenColor } = this.props.route.params;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: screenColor,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Hello from the Chat screen!</Text>
      </View>
    );
  }
}
