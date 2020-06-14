import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Picker, } from 'react-native';
import { PieChart } from 'react-native-svg-charts'
import axios from 'axios'

const api = axios.create({
  baseURL: "https://covid19-brazil-api.now.sh/api/report/v1"
})

const colors = ["#7CEA9C", "#3777FF", "#EF2D56"]

export default function App() {
  const [cases, setCases] = useState({})

  const casesData = [ 
    { 
      title: "Confirmados",
      value: cases.confirmed,
    }, 
    {
      title: "Recuperados",
      value: cases.recovered, 
    },
    {
      title: "Mortos",
      value: cases.deaths
    }
  ]

  const pieData = casesData.map(({value}, index) => ({
    value,
    key: `${index}-${value}`,
    svg: {
      fill: colors[index]
    }
  }))
  const date = cases.updated_at

  useEffect(() => {
    api.get('/brazil').then(response => {
      const { data } = response.data
      setCases(data)
    })
  }, [])

  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Casos de Covid-19</Text>
      <Text>Data de atualização:<Text> {date.slice(0, 10)}</Text></Text>
      <PieChart
        style={{height: 300}}
        data={pieData}
      />
      <ScrollView 
        style={styles.casesContainer}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      >
        {casesData.map((value, index) => (
          <View style={styles.caseContent}>
              <View style={{
                width: 3,
                height: "100%",
                position: "absolute",
                bottom: 0,
                left: 0,
                backgroundColor: colors[index]
              }}/>
              <Text style={styles.caseTitle}>{casesData[index].title}:</Text>
              <Text style={styles.caseNumber}>{casesData[index].value}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 15
  },
  title: {
    marginTop: 40,
    fontSize: 24,
    fontWeight: "bold",
  },
  casesContainer: {
    marginTop: 20,
  },
  caseContent: {
    width: 120,
    height: 60,
    paddingHorizontal: 10,
    marginRight: 10,
    justifyContent: "center",
    position: "relative",
    borderWidth: 1.5,
    borderColor: "#ebebeb",
    borderRadius: 5,
    overflow: "hidden",
  },
  caseTitle: {
    fontWeight: "bold"
  },
});
