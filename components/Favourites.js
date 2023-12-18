import React, { Component, Fragment, useState, useEffect, StatusBar } from 'react';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { StyleSheet, SafeAreaView, Text, View, TextInput, Image, Button, FlatList, TouchableOpacity, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Cache } from "react-native-cache";
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import SearchableDropdown from 'react-native-searchable-dropdown';
import * as BusStopData from './static_data/Bus_stops.json';

const Data = BusStopData.value;

function Addfavourites() {
  const navigation = useNavigation();
  const route = useRoute();
  const [Theme, setTheme] = useState(null);

  Theme_token = async () => AsyncStorage.getItem('Theme');

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

  const favData = route.params.fav_data;
  // console.log(favData);
  const favData_name = favData.map(function(item) {
    return {
      name: item.name
    };
  });
  // console.log(favData_name);

  const Data_description = Data.map(function(item) {
    return {
      name: item.Description
    };
  });

  const filteredlist = Data.filter(filter => !favData_name.some(el => el.name === filter.Description));
  const filteredname = Data_description.filter(filter => !favData_name.some(el => el.name === filter.name));
  // console.log(filteredlist);
  
  var [selectedItems, setSelectedItems] = useState({});
  if (Object.keys(selectedItems).length > 0) {
      var SelectedFilter = filteredlist.filter(x => x.Description.toLowerCase().includes(selectedItems.name.toLowerCase()));
    }

  const cacheData = async (item) => {
    const Filter = item.Description
    const Selected_Filter = Data.filter(x => x.Description == Filter);
    const cache_data_BusStopCode = Selected_Filter.map(function(item) {return item.BusStopCode}).toString();
    const cache_data_Description = Selected_Filter.map(function(item) {return item.Description}).toString();
    try {
      console.log("Item with BusStopCode: " + cache_data_BusStopCode + ", and Description: " + cache_data_Description + " successfully cached.")
      navigation.navigate('Home', {
        key: cache_data_BusStopCode,
        name: cache_data_Description
      })
    } 
    catch (error) {
      console.log("Some error occured while caching data. Check console logs for details.");
      console.log(error);
    }
  };
  
  const favAlert = (item) => {
        Alert.alert('Favourite', 'Do you want to favourite '+ item.Description + '?', [
          {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          {text: 'OK', onPress: () => cacheData(item)},
        ]);
      };
  
  useEffect(() => {
      FetchTheme();
      console.log("Favourites")
    }, []);
 
  return (
    <SafeAreaView style={Theme=='Dark'? styles.MainContainer_dark : styles.MainContainer}>
      {/* <View style={styles.headerContainer}> */}
        <Text style={Theme=='Dark'? styles.tempText_dark : styles.tempText}>State bus stop</Text>
      {/* </View> */}
      <SearchableDropdown
        onTextChange={(text) => setSelectedItems({name: text})}
        // On text change listner on the searchable input
        selectedItems={selectedItems}
        // onItemSelect={(name) => setSelectedItems(name)}
        onItemSelect={(name) => setSelectedItems(name)}
        // onItemSelect called after the selection from the dropdown
        containerStyle={{ padding: 5 }}
        // suggestion container style
        textInputStyle={Theme=='Dark'? styles.dropdowninput_dark : styles.dropdowninput}
        itemStyle={Theme=='Dark'? styles.dropdownitem_dark : styles.dropdownitem}
        itemTextStyle={Theme=='Dark'? styles.dropdownitemtext_dark : styles.dropdownitemtext}
        itemsContainerStyle={{
          // items container style you can pass maxHeight
          // to restrict the items dropdown hieght
          maxHeight: 250,
        }}
        items={filteredname}
        // mapping of item array
        defaultIndex={"Bus stop name"}
        // default selected item index
        placeholder="Bus stop name"
        placeholderTextColor={Theme=='Dark'? 'white' : 'black'}
        // place holder for the search input
        resetValue={false}
        // reset textInput Value with true and false state
      />
      <FlatList
        data={SelectedFilter}
        renderItem={({item}) => 
          // <Item title={item.Description} onPress={() => navigation.goBack()}/>
          <View
            style={Theme=='Dark'? styles.item_dark : styles.item}
            // onPress={() => cacheData(item)}
            // onPress={() => testnavi()}
          >
            <Text style={Theme=='Dark'? styles.itemtext_dark : styles.itemtext}>{item.Description}</Text>
            <Text style={styles.staricon} onPress={() => favAlert(item)}><AntDesign name="staro" size={24} color={Theme=='Dark'? "white" : "black"} /></Text>
          </View>
          }
          
        keyExtractor={item => item.BusStopCode}
        extraData={SelectedFilter}
      />
    </SafeAreaView>
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
  tempText: {
    fontSize: 35,
    color: 'black',
  },
  tempText_dark: {
    fontSize: 35,
    color: 'white',
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
    position: 'absolute', 
    right: 5,
    top: 7,
  },
  dropdowninput: {
    padding: 10,
    marginTop: 2,
    backgroundColor: "#FAF9F8",
    borderColor: "#bbb",
    borderWidth: 1,
  },
  dropdowninput_dark: {
    padding: 10,
    marginTop: 2,
    backgroundColor: "#2E1A47",
    color: 'white',
    borderColor: "#bbb",
    borderWidth: 1,
  },
  dropdownitem: {
    padding: 10,
    marginTop: 2,
    backgroundColor: "#FAF9F8",
    borderColor: "#bbb",
    borderWidth: 1,
  },
  dropdownitem_dark: {
    padding: 10,
    marginTop: 2,
    backgroundColor: "#2E1A47",
    color: 'white',
    borderColor: "#bbb",
    borderWidth: 1,
  },
  dropdownitemtext: {
    color: "#222",
  },
  dropdownitemtext_dark: {
    color: "white",
  },
   });

export default Addfavourites;