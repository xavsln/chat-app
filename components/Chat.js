import React from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView } from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebase = require("firebase");
require("firebase/firestore");

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      uid: 0,
      loggedInText: "Please wait, you are getting logged in",
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

  componentDidMount() {
    let name = this.props.route.params.name;

    // Set the title of the page as the name of the User
    this.props.navigation.setOptions({ title: name });

    // Listen to autentication events
    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }
      this.setState({
        uid: user.uid,
        messages: [],
        loggedInText: "Hello there",
      });

      // Creating a reference to ChatMessages collection
      this.referenceChatMessages = firebase.firestore().collection("messages");
      // Listen for collection changes
      this.unsubscribe = this.referenceChatMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate);
    });
  }

  componentWillUnmount() {
    // Stop listening for authentication
    this.authUnsubscribe();
    this.unsubscribe();
  }

  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.addMessages();
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

  render() {
    let { screenColor } = this.props.route.params;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: screenColor,
        }}
      >
        <Text>{this.state.loggedInText}</Text>
        <GiftedChat
          // renderBubble={this.renderBubble.bind(this)}
          showUserAvatar={true}
          messages={this.state.messages}
          renderBubble={this.renderBuble}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: this.state.uid,
            avatar: "https://placeimg.com/140/140/people",
          }}
        />

        {/* To solve keyboard issues with some Android versions: */}
        {Platform.OS === "android" ? (
          <KeyboardAvoidingView behavior='height' />
        ) : null}
      </View>
    );
  }
}
