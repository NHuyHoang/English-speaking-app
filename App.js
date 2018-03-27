import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Record from './src/containers/RecordSection';
import Guideline from './src/containers/Guideline/Guideline';
import Test1 from './src/containers/Test1/Test1';
import { StackNavigator } from 'react-navigation';
import uiStyle from './src/components/ui'

export default class App extends React.Component {
  render() {
    return <RootStack style={styles.container} />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const RootStack = StackNavigator(
  {
    Home: {
      screen: Guideline,
    },
    Test1: {
      screen: Test1,
      header: {
        headerStyle: { height: 40 }
      }
    },

  },
  {
    initialRouteName: 'Home',
    navigationOptions: {
      headerStyle: {
        backgroundColor: uiStyle.colors._blue,
        height: 40,
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontFamily: uiStyle.fonts.font_bold,
        fontSize: uiStyle.fonts.title_size,
        fontWeight:'bold',
        alignSelf:'center'
      },
    },
  }
);
