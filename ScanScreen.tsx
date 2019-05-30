"use strict";

import React, { Component } from "react";

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Picker,
  Alert
} from "react-native";

import QRCodeScanner from "react-native-qrcode-scanner";
import NfcManager, { NfcAdapter } from "react-native-nfc-manager";

interface IUsersObj {
  [key: string]: string;
}

interface IScanScreenProps {
  users: IUsersObj;
  url: string;
}

interface IScanScreenState {
  currentUrl: string;
  selectedUser: string;
  nfcSupported: boolean;
  started: boolean;
  users: IUsersObj;
}

class ScanScreen extends Component<IScanScreenProps, IScanScreenState> {
  static defaultProps = {
    users: {},
    url: ""
  };

  constructor(props: IScanScreenProps) {
    super(props);

    const users = props.users;
    const keys = Object.keys(users);

    this.state = {
      currentUrl: ScanScreen.cleanPath(props.url),
      selectedUser: keys.length > 0 ? users[keys[0]] : "",
      nfcSupported: false,
      started: false,
      users: users
    };
  }

  static cleanPath(url: string) {
    if (url.charAt(url.length - 1) == "/") {
      url = url.substr(0, url.length - 1);
    }
    return url;
  }

  componentDidMount() {
    NfcManager.isSupported().then(nfcSupported => {
      this.setState({ nfcSupported });
      if (nfcSupported) {
        NfcManager.start({
          onSessionClosedIOS: () => {
            console.log("ios session closed");
          }
        })
          .then(result => {
            NfcManager.registerTagEvent(
              tag => {
                console.log(tag);
                if (tag.ndefMessage) {
                  this.setState({
                    currentUrl: ScanScreen.cleanPath(tag.ndefMessage.toString())
                  });
                } else {
                  Alert.alert("Tag Data", JSON.stringify(tag), undefined, {
                    cancelable: false
                  });
                }
              },
              "Hold your device over the tag",
              {
                invalidateAfterFirstRead: true,
                isReaderModeEnabled: true,
                readerModeFlags:
                  NfcAdapter.FLAG_READER_NFC_A |
                  NfcAdapter.FLAG_READER_SKIP_NDEF_CHECK
              }
            );
            console.log("start OK", result);
          })
          .catch(error => {
            console.warn("start fail", error);
            this.setState({ nfcSupported: false });
          });
      }
    });
  }

  async onPress() {
    try {
      let response = await fetch(
        this.state.currentUrl + "/" + this.state.selectedUser
      );

      this.setState({ started: !this.state.started });

      return response;
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    return (
      <QRCodeScanner
        onRead={e => {
          if (this.state.started) {
            Alert.alert(
              "Session Already Started",
              "Please end the current session before scanning a new code.",
              undefined,
              { cancelable: false }
            );
            return;
          }
          this.setState({ currentUrl: ScanScreen.cleanPath(e.data) });
        }}
        reactivate={true}
        // @ts-ignore
        cameraStyle={{ overflow: "hidden" }}
        topContent={
          <View>
            <Text style={styles.centerText}>
              {this.state.currentUrl
                ? "Scanned URL: " + this.state.currentUrl
                : "Scan a QR Code to see its context"}
            </Text>
            {this.state.currentUrl && this.state.selectedUser ? (
              <View>
                <Text style={styles.centerText2}>
                  {this.state.currentUrl + "/" + this.state.selectedUser}
                </Text>
                <TouchableOpacity
                  onPress={this.onPress.bind(this)}
                  style={styles.buttonTouchable}
                >
                  <Text style={styles.buttonText}>
                    {!this.state.started ? "Start Session" : "End Session"}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        }
        bottomContent={
          <View>
            <Picker
              selectedValue={this.state.selectedUser}
              style={{ width: 300 }}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ selectedUser: itemValue })
              }
            >
              {Object.keys(this.state.users).map(user => {
                return (
                  <Picker.Item
                    key={user}
                    label={user}
                    value={this.state.users[user]}
                  />
                );
              })}
            </Picker>
          </View>
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  centerText: {
    textAlign: "center",
    fontWeight: "500",
    fontSize: 14,
    paddingTop: 50,
    color: "#777"
  },
  centerText2: {
    textAlign: "center",
    fontSize: 14,
    color: "#777"
  },
  buttonText: {
    textAlign: "center",
    fontSize: 18,
    color: "rgb(0,122,255)"
  },
  buttonTouchable: {
    paddingTop: 4
  }
});

export default ScanScreen;
