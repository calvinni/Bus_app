import React, { Component, Fragment, useState, useEffect, StatusBar } from 'react';
import { NavigationContainer, useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import { View, TouchableOpacity, Text, StyleSheet, Button, Alert, FlatList } from 'react-native';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Cache } from "react-native-cache";

function Home()  {
  const navigation = useNavigation();
  const route = useRoute();
  const cache = new Cache({
    namespace: "myapp",
    policy: {
      maxEntries: 100, // if unspecified, it can have unlimited entries
    },
      backend: AsyncStorage
  });
  const isFocused = useIsFocused();
  var [fav_data, setfav] = useState([]);
  const [isStateDirty, setStateDirty] = useState(false);
  var datalist = [];
  const [Theme, setTheme] = useState(null);
  const [Sortfav, setSortfav] = useState(null);

  Theme_token = async () => AsyncStorage.getItem('Theme');
  Sortfav_token = async () => AsyncStorage.getItem('Sortfav');
    
  Description_token = async () => AsyncStorage.getItem('Description');
  Code_token = async () => AsyncStorage.getItem('BusStopCode');

  const FetchTheme = async () => {
    try {
      var Themetoken = await this.Theme_token();
      setTheme(Themetoken)
    } 
    catch (error) {
      alert("Some error occured while fetching data. Check console logs for details.");
      console.log(error);
    }
  };

  const FetchSort = async () => {
    try {
      var Sorttoken = await this.Sortfav_token();
      setSortfav(Sorttoken)
      // console.log(Sorttoken)
    } 
    catch (error) {
      console.log("Some error occured while fetching data. Check console logs for details.");
      console.log(error);
    }
  };

  const fetchData = async() => {
    try {
      const entries = await cache.getAll();
      // console.dir(entries);
      var keys = Object.keys(entries);
        
      var count = 0
      for(k in keys) {
        var key = keys[count]
        var name = entries[keys[count]]
        var value = name["value"]
        var timestamp = name["created"]
        count++
        var updatedValue = {"key": key, "name": value, "time": timestamp};

        datalist.push(updatedValue);
      }
      setfav(datalist)
      
      datalist=[];
      setStateDirty(true);
    }
    catch(error){
      console.log(error);
    }
  }

  const checkroute = async() => {
    if (route.params?.name != undefined) {
      console.log("added latest fav");

      await cache.set(route.params.key, route.params.name);
      var updateFav = {"key": route.params.key, "name": route.params.name, "time": new Date()};
      setfav([...fav_data, updateFav]);
          
      navigation.setParams({ key: undefined, name: undefined }); // Clear navigation params
    }
  };
    
  const detailnav = (item) => {
    const keycode = item.key
    navigation.navigate('Details', {
        key: keycode,
      })
  };

  const unfav = async(key) => {
      await cache.remove(key);
        
      setfav(fav_data.filter(item => item.key !== key));
      console.log("unfaved")
    };  

  const unfavAlert = (item) => {
        Alert.alert('Unfavourite', 'Are you sure you want to unfavourite ' + item.name + '?', [
          {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          {text: 'OK', onPress: () => unfav(item.key)},
        ]);
      };

  useEffect(() => {
    if(!isStateDirty) //make it only run once
    {
      fetchData();
      console.log("fetched once")
    }
    FetchTheme();
    FetchSort();
    checkroute();
    console.log("Home")
  }, [isFocused]);
    
    return (
      <View style={Theme=='Dark'? styles.MainContainer_dark : styles.MainContainer}>

        <View style={styles.headerContainer}>
          <Text style={Theme=='Dark'? styles.tempText_dark : styles.tempText}>Search for bus stop</Text>
          <View style={styles.button}>
            <Button
              title="Search"
              onPress={() => {navigation.navigate('Search')}}
            />
          </View>
        </View>
        <View style={styles.bodyContainer}>
          <Text style={Theme=='Dark'? styles.FavText_dark : styles.FavText}>Favourites: </Text>
          <Text style={Theme=='Dark'? styles.Addstops_dark : styles.Addstops} onPress={() => navigation.navigate('Addfavourites', {fav_data})}>
            Add more stops <AntDesign name="pluscircleo" size={18} color={Theme=='Dark'? "white" : "black"} />
          </Text>
            <FlatList
              data={Sortfav=='time' ? fav_data.sort(function (a, b) {let x = new Date(a.time); let y = new Date(b.time); return x-y;}) : 
                    fav_data.sort(function (a, b) {if (a.name < b.name) {return -1;}if (a.name > b.name) {return 1;}return 0;})}
              extraData={Sortfav=='time' ? fav_data.sort(function (a, b) {let x = new Date(a.time); let y = new Date(b.time); return x-y;}) : 
                          fav_data.sort(function (a, b) {if (a.name < b.name) {return -1;}if (a.name > b.name) {return 1;}return 0;})}
              renderItem={({item}) => 
                <TouchableOpacity
                  style={Theme=='Dark'? styles.item_dark : styles.item}
                  onPress={() => detailnav(item)}
                >
                  <Text style={Theme=='Dark'? styles.itemtext_dark : styles.itemtext}>{item.name} </Text>
                  <Text style={styles.staricon} onPress={() => unfavAlert(item)}><AntDesign name="star" size={24} color={Theme=='Dark'? "white" : "black"} /></Text>
                </TouchableOpacity>
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
    marginVertical: 8,
    marginHorizontal: 16,
    paddingBottom: 20,
  },
  tempText: {
    fontSize: 35,
    color: 'black',
  },
  tempText_dark: {
    fontSize: 35,
    color: 'white',
  },
  button: {
    paddingLeft: 10,
    paddingRight: 10,
    alignSelf: 'stretch'
  },
  bodyContainer: {
    flex: 5,
    
  },
  FavText: {
    fontSize: 35,
    color: 'black',
    paddingLeft: 10,
  },
  FavText_dark: {
    fontSize: 35,
    color: 'white',
    paddingLeft: 10,
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
  Addstops: {
    fontSize: 20,
    paddingLeft: 10,
    alignSelf: 'center',
    color: 'black',
  },
  Addstops_dark: {
    fontSize: 20,
    paddingLeft: 10,
    alignSelf: 'center',
    color: 'white',
  },
  staricon: {
    position: 'absolute', 
    right: 5,
    top: 7,
  },
  
});

export default Home;