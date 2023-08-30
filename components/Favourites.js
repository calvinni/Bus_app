import React, { Component, Fragment, useState, useEffect, StatusBar } from 'react';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, SafeAreaView, Text, View, TextInput, Image, Button, FlatList, TouchableOpacity, } from 'react-native';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { Cell, Section, TableView } from 'react-native-tableview-simple';
import SearchableDropdown from 'react-native-searchable-dropdown';
import * as BusStopData from './Static_data/Bus_stops.json';

const Data = BusStopData.value;
const Data_description = BusStopData.value.map(function(item) {
  return {
    name: item.Description
  };
});

const Item = ({title}) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

const Addfavourites = () => {
  var [selectedItems, setSelectedItems] = useState({});
  if (Object.keys(selectedItems).length > 0) {
      console.log('Object is NOT empty');
      var SelectedFilter = Data.filter(x => x.Description === selectedItems.name);
    }
  
  console.log(selectedItems);
  console.log(SelectedFilter);
 
  return (
    <SafeAreaView>
      {/* <View style={styles.headerContainer}> */}
        <Text style={styles.tempText}>State bus stop</Text>
      {/* </View> */}
      <SearchableDropdown
        onTextChange={(text) => console.log(text)}
        // On text change listner on the searchable input
        selectedItems={selectedItems}
        onItemSelect={(name) => setSelectedItems(name)}
        // onItemSelect called after the selection from the dropdown
        containerStyle={{ padding: 5 }}
        // suggestion container style
        textInputStyle={{
          // inserted text style
          padding: 12,
          borderWidth: 1,
          borderColor: "#ccc",
          backgroundColor: "#FAF7F6",
        }}
        itemStyle={{
          // single dropdown item style
          padding: 10,
          marginTop: 2,
          backgroundColor: "#FAF9F8",
          borderColor: "#bbb",
          borderWidth: 1,
        }}
        itemTextStyle={{
          // text style of a single dropdown item
          color: "#222",
        }}
        itemsContainerStyle={{
          // items container style you can pass maxHeight
          // to restrict the items dropdown hieght
          maxHeight: 250,
        }}
        items={Data_description}
        // mapping of item array
        defaultIndex={"Description"}
        // default selected item index
        placeholder="Description"
        // place holder for the search input
        resetValue={false}
        // reset textInput Value with true and false state
      />
      <FlatList
        data={SelectedFilter}
        renderItem={({item}) => <Item title={item.Description} />}
        keyExtractor={item => item.BusStopCode}
        extraData={SelectedFilter}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tempText: {
    paddingLeft: 10,
    fontSize: 35,
    // color: '#fff',
  },
  
  item: {
    backgroundColor: '#f9c2ff',
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 15,
  },
   });

export default Addfavourites;