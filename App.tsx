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
import { dashboardUrl, loginUrl, property, flat } from "./env";

/*
<div class="col-xs-12 text-center"> 
  <h5><i class="fa fa-signal fa-fw"></i> U-703 | Meter No : 99597000099</h5> 
  <hr> <h3>Current Balance: <i class="fa fa-inr fa-fw text-danger">
  </i> -407.71</h3> 
  <h5>Last Read @: <i 2020-03-18="" 00:15:20"=""></i> 2020-03-18 00:15:20</h5> <hr> </div>
*/

// Boolean to avoid people from tapping the refresh button multiple times

let isFetching = false;

// easter egg
let pressCount = 1;

const refreshBill = async (updateBill, updateStatus, updateFlat) => {
  isFetching = true;
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
    const mainText = dashboardPage
      .split('<h5><i class="fa fa-signal fa-fw"></i>')[1]
      .split("</h5> <hr> </div>")[0];

    const flatNumber = mainText.split(" |")[0];
    const bill = mainText
      .split("<h3>Current Balance:")[1]
      .split("</h3>")[0]
      .split("</i>")[1];
    const lastRead =
      "last read: " + mainText.split("Last Read @: <i ")[1].split('"></i>')[0];

    updateBill(bill);
    // updateBill(
    //   dashboardPage
    // .split("<h3>Current Balance:")[1]
    // .split("</h3>")[0]
    // .split("</i>")[1]
    // );
    updateFlat(flatNumber.replace("-", " "));
    updateStatus(lastRead);
    isFetching = false;
  }
};

const App = () => {
  const {
    contentContainer,
    billText,
    statusContainer,
    statusText,
    reload,
    flatNumber
  } = styles;

  const [flat, updateFlat] = useState("");

  const [bill, updateBill] = useState("loading...");
  const [status, updateStatus] = useState("logging in...");

  useEffect(() => {
    refreshBill(updateBill, updateStatus, updateFlat);
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
          <Text style={flatNumber}>{flat}</Text>

          <Text style={billText}>{bill}</Text>
          <TouchableOpacity
            onPress={() => {
              pressCount++;
              if (pressCount > 50) {
                updateStatus("");
                updateFlat("Congratulations!!!");
                updateBill(
                  `You won! \nYou have pressed the refresh button 50 times!\nContact the creator of the app with code IPRESSED50 to get free coffee!`
                );
              } else if (!isFetching)
                refreshBill(updateBill, updateStatus, updateFlat);
            }}
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
  reload: { color: "#16a085", marginTop: 30, fontSize: 40 },
  billText: { color: "#95a5a6", fontSize: 20, textAlign: "center" },
  statusText: { color: "#7f8c8d", fontSize: 20 },
  statusContainer: {
    width: "100%",
    position: "absolute",
    bottom: 50,
    alignItems: "center"
  },
  flatNumber: {
    color: "#cccccc",
    marginTop: 30,
    marginBottom: 30,
    fontSize: 40
  }
});

export default App;
