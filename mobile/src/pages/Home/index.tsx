import React, { useState, useEffect } from 'react';
import { Feather as Icon, FontAwesome } from '@expo/vector-icons';
import { View, ImageBackground, Image, StyleSheet, Text, Alert } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import Select from 'react-native-picker-select';
import axios from 'axios';

interface IBGEUFResponse {
  nome: string;
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

interface UF {
  nome: string;
  sigla: string;
}

const Home = () => {
  const navigation = useNavigation();

  const [ufs, setUFs] = useState<UF[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const [selectedUF, setSelectedUF] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');


  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
      const ufInitials = response.data.map(uf => ({ sigla: uf.sigla, nome: uf.nome }));

      setUFs(ufInitials);
    })
  }, [])

  useEffect(() => {
    if (selectedUF === '0') {
      return;
    }

    axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`).then(response => {
      const citiesName = response.data.map(city => city.nome);

      setCities(citiesName);
    })
  }, [selectedUF])

  function handleNavigateToPoints() {
    if (selectedUF != "0" && selectedCity != "0") {
      navigation.navigate("Points", { uf: selectedUF, city: selectedCity })
    } else {
      Alert.alert("Ooops...", "Preciso que você escolha um Estado e uma Cidade.")
    }
  }

  function handleSelectUF(uf: string) {
    setSelectedUF(uf);
  }

  function handleSelectCity(city: string) {
      setSelectedCity(city);
  }

  return (
    <ImageBackground
      source={require('../../assets/home-background.png')}
      style={styles.container}
      imageStyle={{ width: 274, height: 368 }}
    >
      <View style={styles.main}>
        <Image source={require('../../assets/logo.png')} />
        <Text style={styles.title}>Seu marketplace de coleta de resíduos.</Text>
        <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
      </View>

      <View style={styles.select}>
        <Select
          value={selectedUF}
          onValueChange={(value) => handleSelectUF(value)}
          placeholder={{
            label: "Selecione um Estado...",
            value: "0"
          }}
          Icon={() => (
            <FontAwesome name="chevron-down" color="#34CB79" size={24} />
          )}
          items={ufs.map(uf => ({ label: uf.nome, value: uf.sigla }))}
          style={{
            ...pickerSelectStyles,
          }}
        />
      </View>

      <View style={styles.select}>
        <Select
          value={selectedCity}
          onValueChange={(value) => handleSelectCity(value)}
          placeholder={{
            label: "Selecione uma Cidade...",
            value: "0"
          }}
          Icon={() => (
            <FontAwesome name="chevron-down" color="#34CB79" size={24} />
          )}
          items={cities.map(city => ({ label: city, value: city }))}
          style={{
            ...pickerSelectStyles,
          }}
        />
      </View>

      <View style={styles.footer}>
        <RectButton style={styles.button} onPress={handleNavigateToPoints}>
          <View style={styles.buttonIcon}>
            <Text>
              <Icon name="arrow-right" color="#FFF" size={24} />
            </Text>
          </View>
          <Text style={styles.buttonText}>Entrar</Text>
        </RectButton>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {
    paddingVertical: 5
  },

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
  },

  iconContainer: {
    top: 10,
    right: 10,
  }
})

export default Home;
