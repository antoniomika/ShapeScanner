/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/emin93/react-native-template-typescript
 *
 * @format
 */

import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import ScanScreen from "./ScanScreen";

export default class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <ScanScreen
          users={{
            "Nick Peariso": "fb514d28-0336-453e-8168-843cbfefe0df",
            "Brandon Gohsman": "b5ca072b-1765-4ec8-95b2-18f7df9a4548",
            "Brandon Hazelton": "bh7c585160-9ce7-4572-be03-a62df3adc23c",
            "Justin Denick": "800f669f-25a0-4332-aae1-3ab6be1ae543",
            "Bryan O'Rear": "8a075d78-3028-4694-a607-9de645f0eed5",
            "Nolan Orfield": "b141cb23-8575-4663-aed7-7f1f1132c90f",
            "Andrew Muth": "0c2d1d5b-c901-4930-b7c0-5f90a1584fde",
            "Mark Angeloni": "43a78bae-b7cf-4a0b-ba07-203ddb875c68",
            "Frank Arant": "e360afa5-70c9-4bb1-ad8c-632ac7b4d5f6"
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  }
});
