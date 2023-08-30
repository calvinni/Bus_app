import React, {useEffect, useState} from 'react';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {ActivityIndicator, FlatList, Text, View, StyleSheet} from 'react-native';
import { apiKey } from './components/keys/LTA_APIKey';
import Weather from './components/weather';
import Home from './components/Home';
import Addfavourites from './components/Favourites';
import Search from './components/Search';

const App = () => {
  const [isLoading, setLoading] = useState(true);
  const [Json_data, setJson_data] = useState([]);
  const [BusStopCode, setBusStopCode] = useState([]);
  const [BusNumber, setBusNumber] = useState([]);
  const [Service, setService] = useState([]);

  // const getBusData = async () => {
  //   try {
      
  //     var myHeaders = new Headers();
  //     myHeaders.append("Accountkey", apiKey);
  //     myHeaders.append("accept", "application/json");

  //     var requestOptions = {
  //       method: 'GET',
  //       headers: myHeaders,
  //       redirect: 'follow'
  //     };
  //     fetch("http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode=83139", requestOptions)
  //       .then(res => res.json())
  //       .then(json => {
  //         // console.log(json);
  //         setJson_data(json);
  //         setBusStopCode(json.BusStopCode);
  //         setBusNumber(json.Services[0].ServiceNo);
  //         setService(json.Services[0].Operator);
  //         // console.log(BusStopCode);
  //         // console.log(BusNumber);
  //         // console.log(Service);
  //       });
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   getBusData();
  //   console.log("working as intended");
  // }, []);

  const Stack = createNativeStackNavigator();

  return (
    // <View style={styles.container}>
    //     {isLoading ? <Text>Fetching The Weather</Text> : 
    //     <Weather BusStopCode={BusStopCode} BusNumber={BusNumber} Service={Service} />}
    // </View>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} options={{ title: "Home", headerTitleAlign: "center" }} />
        <Stack.Screen name="Addfavourites" component={Addfavourites} options={{ title: "Add Favourites", headerTitleAlign: "center" }} />
        <Stack.Screen name="Search" component={Search} options={{ title: "Search", headerTitleAlign: "center" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});

export default App;