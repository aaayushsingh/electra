/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/emin93/react-native-template-typescript
 *
 * @format
 */

import React, { Fragment, useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  TouchableOpacity
} from "react-native";

import { Colors } from "react-native/Libraries/NewAppScreen";
import { dashboardUrl, loginUrl, property, flat } from "./.env";

const refreshBill = async (updateBill, updateStatus) => {
  const resp = await fetch(loginUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      property,
      flat
    }),
    credentials: "include"
  });

  const response = await resp.json();

  if (response.status == true) {
    updateStatus("logged in, getting data...");
    const dashboard = await fetch(dashboardUrl, {
      method: "GET",
      credentials: "include"
    });
    const dashboardPage = await dashboard.text();
    // console.log(JSON.stringify(dashboardPage));
    updateBill(
      dashboardPage
        .split("<h3>Current Balance:")[1]
        .split("</h3>")[0]
        .split("</i>")[1]
    );
    updateStatus("");
  }
};

const App = () => {
  const {
    contentContainer,
    billText,
    statusContainer,
    statusText,
    reload
  } = styles;

  const [bill, updateBill] = useState("Loading...");
  const [status, updateStatus] = useState("logging in...");

  useEffect(() => {
    refreshBill(updateBill, updateStatus);
  }, []);

  return (
    <Fragment>
      <StatusBar
        barStyle="light-content"
        translucent={true}
        backgroundColor="#34495e"
      />
      <SafeAreaView>
        <View style={contentContainer}>
          <Text style={billText}> {bill}</Text>
          <TouchableOpacity
            onPress={() => refreshBill(updateBill, updateStatus)}
          >
            <Text style={reload}>&#x21BA;</Text>
          </TouchableOpacity>
        </View>
        <View style={statusContainer}>
          <Text style={statusText}> {status}</Text>
        </View>
      </SafeAreaView>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2c3e50"
  },
  reload: { color: "#16a085", fontSize: 60 },
  billText: { color: "#95a5a6", fontSize: 60 },
  statusText: { color: "#7f8c8d", fontSize: 20 },
  statusContainer: {
    width: "100%",
    position: "absolute",
    bottom: 50,
    alignItems: "center"
  }
});

export default App;
