import React from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView } from "react-native";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

import { ActionSheetProvider } from "@expo/react-native-action-sheet";
// import action button
import CustomActions from "./CustomActions";

const firebase = require("firebase");
require("firebase/firestore");

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      uid: 0,
      loggedInText: "Please wait, you are getting logged in",
      isConnected: false,
    };

    // Web app's Firebase configuration
    const firebaseConfig = {
      apiKey: "AIzaSyAppRDsUUc3zgohRLglnXWjns0B3mVwmr8",
      authDomain: "chat-app-a386f.firebaseapp.com",
      projectId: "chat-app-a386f",
      storageBucket: "chat-app-a386f.appspot.com",
      messagingSenderId: "793264254907",
      appId: "1:793264254907:web:d598bc9d803fcf958c9e9e",
    };

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    this.referenceChatMessages = firebase.firestore().collection("messages");
  }

  // Get messages stored locally on the user's mobile
  async getMessages() {
    let messages = "";
    try {
      messages = (await AsyncStorage.getItem("messages")) || [];
      this.setState({
        messages: JSON.parse(messages),
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  async saveMessages() {
    try {
      await AsyncStorage.setItem(
        "messages",
        JSON.stringify(this.state.messages)
      );
    } catch (error) {
      console.log(error.message);
    }
  }

  async deleteMessages() {
    try {
      await AsyncStorage.removeItem("messages");
      this.setState({
        messages: [],
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  componentDidMount() {
    let name = this.props.route.params.name;

    // Set the title of the page as the name of the User
    this.props.navigation.setOptions({ title: name });

    // Check whether User is online or offline
    NetInfo.fetch().then((connection) => {
      // If User is online
      if (connection.isConnected) {
        console.log("online");

        this.setState({
          isConnected: true,
        });

        console.log(this.state.isConnected);

        // Listen to autentication events
        this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
          if (!user) {
            firebase.auth().signInAnonymously();
          }
          this.setState({
            uid: user.uid,
            messages: [],
            loggedInText: "",
          });

          // Creating a reference to ChatMessages collection
          this.referenceChatMessages = firebase
            .firestore()
            .collection("messages");
          // Listen for collection changes
          this.chatSubscription = this.referenceChatMessages
            .orderBy("createdAt", "desc")
            .onSnapshot(this.onCollectionUpdate);
        });

        // If User is offline
      } else {
        console.log("offline");

        this.getMessages();
      }
    });
  }

  componentWillUnmount() {
    // Stop listening for authentication
    if (this.isConnected) {
      this.authUnsubscribe();
      this.chatSubscription();
    }
  }

  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.addMessages();
        this.saveMessages();
      }
    );
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: "white",
          },
          right: {
            backgroundColor: "lightblue",
          },
        }}
      />
    );
  }

  // Only display the input tool bar when the User is connected
  renderInputToolbar(props) {
    // console.log(this.state.isConnected);
    if (this.state.isConnected == false) {
    } else {
      return <InputToolbar {...props} />;
    }
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user,
      });
    });
    this.setState({
      messages,
    });
  };

  // Add message to Firestore
  addMessages() {
    const message = this.state.messages[0];

    // add a new message to the collection
    this.referenceChatMessages.add({
      uid: this.state.uid,
      _id: message._id,
      text: message.text,
      createdAt: message.createdAt,
      user: message.user,
    });
  }

  renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  };

  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  }

  render() {
    let { screenColor } = this.props.route.params;

    return (
      <ActionSheetProvider>
        <View
          style={{
            flex: 1,
            backgroundColor: screenColor,
          }}
        >
          <Text>{this.state.loggedInText}</Text>
          <GiftedChat
            renderBubble={this.renderBubble.bind(this)}
            showUserAvatar={true}
            messages={this.state.messages}
            renderInputToolbar={this.renderInputToolbar.bind(this)}
            onSend={(messages) => this.onSend(messages)}
            user={{
              _id: this.state.uid,
              avatar: "https://placeimg.com/140/140/people",
            }}
            renderActions={this.renderCustomActions.bind(this)}
            renderCustomView={this.renderCustomView}
          />

          {/* To solve keyboard issues with some Android versions: */}
          {Platform.OS === "android" ? (
            <KeyboardAvoidingView behavior='height' />
          ) : null}
        </View>
      </ActionSheetProvider>
    );
  }
}
