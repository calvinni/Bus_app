import React, { Component, Fragment, useState, useEffect, StatusBar } from 'react';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { StyleSheet, SafeAreaView, Text, View, TextInput, Image, Button, FlatList, TouchableOpacity, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SearchableDropdown from 'react-native-searchable-dropdown';
import * as BusStopData from './static_data/Bus_stops.json';

const Data = BusStopData.value;

function Search() {
  const navigation = useNavigation();
  const [Theme, setTheme] = useState(null);

  Theme_token = async () => AsyncStorage.getItem('Theme');

  const Data_description = Data.map(function(item) {
    return {
      name: item.Description
    };
  });

  var [selectedItems, setSelectedItems] = useState({});
  if (Object.keys(selectedItems).length > 0) {
      var SelectedFilter = Data.filter(x => x.Description.toLowerCase().includes(selectedItems.name.toLowerCase()));
    }
  
  const detailnav = (item) => {
    const keycode = item.BusStopCode
    navigation.navigate('Details', {
        key: keycode,
      })
  };

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

  useEffect(() => {
        FetchTheme();
        console.log("Search")
    }, []);
 
  return (
    <SafeAreaView style={Theme=='Dark'? styles.MainContainer_dark : styles.MainContainer}>
      {/* <View style={styles.headerContainer}> */}
        <Text style={Theme=='Dark'? styles.tempText_dark : styles.tempText}>Search your bus stop</Text>
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
        items={Data_description}
        // mapping of item array
        defaultIndex={"Bus stop name"}
        // default selected item index
        placeholder="Bus stop name"
        // place holder for the search input
        placeholderTextColor={Theme=='Dark'? 'white' : 'black'}
        resetValue={false}
        // reset textInput Value with true and false state
      />
      <FlatList
        data={SelectedFilter}
        renderItem={({item}) => 
          // <Item title={item.Description} onPress={() => navigation.goBack()}/>
          <TouchableOpacity
            style={Theme=='Dark'? styles.item_dark : styles.item}
            onPress={() => detailnav(item)}
            // onPress={() => testnavi()}
          >
            <Text style={Theme=='Dark'? styles.itemtext_dark : styles.itemtext}>{item.Description}</Text>
          </TouchableOpacity>
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

export default Search;