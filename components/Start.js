import React from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";

export default class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = { text: "", screenColor: "" };
  }

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require("../assets/background-image.png")}
          style={styles.image}
        >
          {/* -- App title area -- */}
          <View style={styles.titleArea}>
            <Text style={styles.titleText}>Chat App</Text>
          </View>

          {/* -- User Welcome area - User can enter name, select background color and move to Chat page -- */}
          <View style={styles.welcomeBox}>
            <TextInput
              style={styles.inputText}
              onChangeText={(text) => this.setState({ text })}
              value={this.state.text}
              placeholder='Your Name'
            />

            <View style={styles.backgroundSelectionArea}>
              <Text style={styles.backgroundSelectionText}>
                Choose Background Color:
              </Text>

              <View
                style={{
                  // flex: 0.5,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: "3%",
                }}
              >
                <TouchableOpacity
                  style={{
                    width: 50,
                    height: 50,
                    backgroundColor: "#090C08",
                    borderRadius: 50 / 2,
                  }}
                  onPress={() => {
                    this.setState({ screenColor: "#090C08" });
                  }}
                ></TouchableOpacity>
                <TouchableOpacity
                  style={{
                    width: 50,
                    height: 50,
                    backgroundColor: "#474056",
                    borderRadius: 50 / 2,
                  }}
                  onPress={() => {
                    this.setState({ screenColor: "#474056" });
                  }}
                ></TouchableOpacity>
                <TouchableOpacity
                  style={{
                    width: 50,
                    height: 50,
                    backgroundColor: "#8A95A5",
                    borderRadius: 50 / 2,
                  }}
                  onPress={() => {
                    this.setState({ screenColor: "#8A95A5" });
                  }}
                ></TouchableOpacity>
                <TouchableOpacity
                  style={{
                    width: 50,
                    height: 50,
                    backgroundColor: "#B9C6AE",
                    borderRadius: 50 / 2,
                  }}
                  onPress={() => {
                    this.setState({ screenColor: "#B9C6AE" });
                  }}
                ></TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.chatButton}
              color='#757083'
              onPress={() =>
                this.props.navigation.navigate("Chat", {
                  name: this.state.text,
                  screenColor: this.state.screenColor,
                })
              }
            >
              <Text style={styles.chatButtonText}>Start Chatting</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  image: {
    flex: 1,
    resizeMode: "cover",
  },
  titleArea: {
    flex: 0.56,
    margin: "6%",
    alignItems: "center",
    justifyContent: "center",
  },
  titleText: {
    color: "white",
    fontSize: "45",
    fontWeight: "600",
  },
  welcomeBox: {
    flex: 0.44,
    borderRadius: 10,
    margin: "6%",
    marginBottom: "40%",
    backgroundColor: "white",

    alignItems: "center",
    padding: "6%",
    justifyContent: "space-between",
  },

  inputText: {
    height: 50,
    width: "100%",
    borderColor: "gray",
    borderRadius: 8,
    borderWidth: 1,
    fontSize: "16",
    fontWeight: "300",
    color: "#757083",
    opacity: "50%",
    padding: "3%",
  },

  backgroundSelectionArea: {
    width: "100%",
  },

  backgroundSelectionText: {
    fontSize: "16",
    fontWeight: "300",
    color: "#757083",
    opacity: "100%",
  },

  chatButton: {
    color: "red",
    fontSize: "16",
    fontWeight: "600",

    height: 50,
    width: "100%",
    backgroundColor: "#757083",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  chatButtonText: {
    color: "#FFFFFF",
    fontSize: "16",
    fontWeight: "600",
  },
});
