import React, { Component, Fragment, useState, useEffect, StatusBar, useRef } from 'react';
import { NavigationContainer, useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import { View, TouchableOpacity, Text, StyleSheet, Button, Alert, FlatList, Platform } from 'react-native';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import moment from 'moment';
import { apiKey } from './keys/LTA_APIKey';
import * as BusStopData from './static_data/Bus_stops.json';

async function schedulePushNotification(item) {
  var noti_trigger_time = moment(item.NextBus.EstimatedArrival).diff(new Date(), 'seconds') - 60;
  const add_time2 = moment(item.NextBus2.EstimatedArrival).diff(new Date(), 'seconds') - 60;
  // console.log(noti_trigger_time)
  // console.log(add_time2)
  
  if (noti_trigger_time <= 0) {
    noti_trigger_time = add_time2
    // console.log(noti_trigger_time)
  }
  await Notifications.scheduleNotificationAsync({
      content: {
      title: "Your bus is arriving! 🚌",
      body: 'Bus ' + item.ServiceNo + ' is arriving soon.',
      data: { data: 'Any data comes here' },
    },
    trigger: { seconds: noti_trigger_time },
  });
  // console.log(noti_trigger_time)

  Alert.alert('Notification set', 'An alert is set for ' + item.ServiceNo, [
    {text: 'Cancel'},
    {text: 'OK'},
  ]);
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync({
        projectId: '34c40a9e-0aa2-443c-9ab2-da47a5548b54', //Uses the expo project "notification-example" id
    })).data;
    // console.log(finalStatus)
    // console.log(token)
  }
  else {
    alert("Must use android for push notifications")
  }
  return token;
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const Data = BusStopData.value;

function Details()  {
    const [Theme, setTheme] = useState(null);
    const route = useRoute();
    const [Json_Services, setJson_Services] = useState([]);
    const [seconds, setSeconds] = useState(0);

    const busstopcode = route.params.key;
    Theme_token = async () => AsyncStorage.getItem('Theme');

    const FetchTheme = async () => {
      try {
        var Themetoken = await this.Theme_token();
        setTheme(Themetoken)
      } 
      catch (error) {
        console.log("Some error occured while fetching data. Check console logs for details.");
        console.log(error);
      }
    };
    
    const Busstopdescription = Data.filter(filter => filter.BusStopCode === busstopcode).map(function(item) {
      return item.Description;
    });

    const fetchBuses = async() => {
      try {
        var myHeaders = new Headers();
        myHeaders.append("Accountkey", apiKey);
        myHeaders.append("accept", "application/json");

        var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
        };
        
        fetch('http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode=' + busstopcode, requestOptions)
          .then(res => res.json())
          .then(json => {
            if (Object.keys(json.Services).length > 0) {
              setJson_Services(json.Services);
            }
            else {
              console.log('Object is empty');
            }
          });
      } catch (error) {
        console.error(error);
      } 
    };

    useEffect(() => {
      FetchTheme();
      fetchBuses();
      console.log("details");
      registerForPushNotificationsAsync();
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 60000);
    }, [seconds]);

    return (
      <View style={Theme=='Dark'? styles.MainContainer_dark : styles.MainContainer}>

        <View style={styles.headerContainer}>
          <Text style={Theme=='Dark'? styles.tempText_dark : styles.tempText}>{Busstopdescription}</Text>
        </View>
        
        <View style={styles.bodyContainer}>
            <FlatList
              // data = {datalist_example}
              data={Json_Services}
              extraData={Json_Services}
              renderItem={({item}) => 
                <View
                  style={Theme=='Dark'? styles.item_dark : styles.item}
                  // onPress={() => detailnav(item)}
                >
                  <Text style={Theme=='Dark'? styles.itemtext_dark : styles.itemtext}>
                    <Text style={styles.staricon} onPress={async () => {await schedulePushNotification(item);}}>
                      <MaterialCommunityIcons name="bell" size={18} color={Theme=='Dark'? "white" : "black"} />
                    </Text>
                    Bus {item.ServiceNo}
                  </Text>
                  
                  <Text style={Theme=='Dark'? styles.busNum1_dark : styles.busNum1}>
                    |  {moment(item.NextBus.EstimatedArrival).diff(new Date(), 'minutes') > 1? 
                    moment(item.NextBus.EstimatedArrival).diff(new Date(), 'minutes') + ' mins'
                    : 'arr'}
                  </Text>               
                  <Text style={Theme=='Dark'? styles.busNum2_dark : styles.busNum2}>
                    |  {isNaN(moment(item.NextBus2.EstimatedArrival).diff(new Date(), 'minutes'))? 
                    'NaN'
                    : moment(item.NextBus2.EstimatedArrival).diff(new Date(), 'minutes') + ' mins'}
                  </Text>
                  <Text style={Theme=='Dark'? styles.busNum3_dark : styles.busNum3}>
                    |  {isNaN(moment(item.NextBus3.EstimatedArrival).diff(new Date(), 'minutes'))? 
                    'NaN'
                    : moment(item.NextBus3.EstimatedArrival).diff(new Date(), 'minutes') + ' mins'}
                  </Text>
                </View>
              }
              ListEmptyComponent={
                <Text style={Theme=='Dark'? styles.emptyText_dark : styles.emptyText}>No buses are available at the moment</Text>
              }
              keyExtractor={item => item.key}
              
              />
        </View>
      </View>
    );
  }

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  MainContainer_dark: {
    flex: 1,
    backgroundColor: '#0C090A',
  },
  headerContainer: {
    alignItems: 'center',
    backgroundColor:'grey',
    height: 70,
  },
  tempText: {
    fontSize: 35,
    color: 'black',
  },
  tempText_dark: {
    fontSize: 35,
    color: 'white',
  },
  bodyContainer: {
    flex: 5,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  item_dark: {
    backgroundColor: '#2E1A47',
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  itemtext: {
    color: 'black',
  },
  itemtext_dark: {
    color: 'white',
  },
  staricon: {
    right: 5,
    top: 7,
  },
  busNum1: {
    position: 'absolute', 
    left: '30%',
    top: 10,
    color: 'black',
  },
  busNum1_dark: {
    position: 'absolute', 
    left: '30%',
    top: 10,
    color: 'white',
  },
  busNum2: {
    position: 'absolute', 
    left: '55%',
    top: 10,
    color: 'black',
  },
  busNum2_dark: {
    position: 'absolute', 
    left: '55%',
    top: 10,
    color: 'white',
  },
  busNum3: {
    position: 'absolute', 
    left: '80%',
    top: 10,
    color: 'black',
  },
  busNum3_dark: {
    position: 'absolute', 
    left: '80%',
    top: 10,
    color: 'white',
  },
  emptyText: {
    fontSize: 20,
    textAlign: 'center',
    color: 'black',
  },
  emptyText_dark: {
    fontSize: 20,
    textAlign: 'center',
    color: 'white',
  },
});

export default Details;