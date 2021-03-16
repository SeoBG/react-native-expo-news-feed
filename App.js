import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, FlatList, Image, ActivityIndicator, Button } from 'react-native';

import { ListItem, SearchBar } from 'react-native-elements'

export default class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      data: [],
      error: null,
      search: '',
    };

    this.arrayholder = [];
  }
  
  componentDidMount() {
    this.makeRemoteRequest();
  }

  makeRemoteRequest = () => {
    const url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=27680766bb6749fabb17dd2bcb919552`;
    this.setState({ loading: true });

    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState({
          data: res.articles,
          error: res.error || null,
          loading: false,
        });
        this.arrayholder = res.articles;
      })
      .catch(error => {
        this.setState({ error, loading: false });
      });
  };

  // Search bar 
  searchFilterFunction = text => {
    const newData = this.arrayholder.filter(item => {
      const itemData = `${item.title.toUpperCase()}`;
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      data: newData,
    });
  };

  render() {


    //LOADING
    if (this.state.loading) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <SearchBar
          placeholder="Type Here..."
          onChangeText={text => this.searchFilterFunction(text)}
          value={this.state.data}
        />
        <FlatList
          containerStyle={{ marginBottom: 50 }}
          data={this.state.data}
          renderItem={({ item }) => (
              <View style={{ flexDirection: 'row',  margin: 10, borderWidth: 1, padding: 3 }}>
                <View style={{width: '60%'}}>
                <Image
                  resizeMode={'cover'}
                  style={styles.imageStyle}
                  source={{ uri: item.urlToImage }}
                />
                </View>
                <View style={{width: '40%',}}>
                  <Text style={styles.titleStyle}>{item.title}</Text>
                  
                </View>
              </View>

          )}
          keyExtractor={item => item.title}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageStyle: {
    
    height: 200,
  },
  titleStyle: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 5
  },
  contentStyle: {
    fontSize: 14,
    padding: 5
  }
});
