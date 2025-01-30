import React, { useState, useEffect } from 'react';
import { View, Text, Button, ScrollView, TextInput } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import Checkbox from 'expo-checkbox';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const RutinasCrear = () => {
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDays, setSelectedDays] = useState<{ [key: string]: boolean }>({
    lunes: false,
    martes: false,
    miercoles: false,
    jueves: false,
    viernes: false,
    sabado: false,
    domingo: false,
  });
  const [notificationMessage, setNotificationMessage] = useState('');

  useEffect(() => {
    Notifications.requestPermissionsAsync();
  }, []);

  const scheduleNotification = async () => {
    const daysMapping: { [key: string]: number } = {
      domingo: 0,
      lunes: 1,
      martes: 2,
      miercoles: 3,
      jueves: 4,
      viernes: 5,
      sabado: 6,
    };

    Object.entries(selectedDays).forEach(async ([day, isSelected]) => {
      if (isSelected) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Recordatorio',
            body: notificationMessage || 'Es hora de tomar tu remedio', // Mensaje dinámico
          },
          trigger: {
            hour: selectedTime.getHours(),
            minute: selectedTime.getMinutes(),
            weekday: daysMapping[day],
            repeats: true,  // Se repite todos los días seleccionados
          } as Notifications.CalendarTriggerInput,
        });
      }
    });
  };

  return (
    <ScrollView style={{ padding: 20, backgroundColor: 'white' }}> {/* Fondo blanco */}
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Selecciona la hora</Text>
      <Button title="Elegir hora" onPress={() => setShowPicker(true)} />
      {showPicker && (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={(event, date) => {
            setShowPicker(false);
            if (date) setSelectedTime(date);
          }}
        />
      )}
      
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 20 }}>Selecciona los días</Text>
      {Object.keys(selectedDays).map((day) => (
        <View key={day} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
          <Checkbox
            value={selectedDays[day]}
            onValueChange={(newValue) => setSelectedDays({ ...selectedDays, [day]: newValue })}
          />
          <Text style={{ marginLeft: 10 }}>
            {day.charAt(0).toUpperCase() + day.slice(1)} {/* Asegúrate de que el texto esté dentro de <Text> */}
          </Text>
        </View>
      ))}
      
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginTop: 20, paddingLeft: 10 }}
        placeholder="Escribe tu mensaje de notificación"
        value={notificationMessage}
        onChangeText={setNotificationMessage}
      />

      <Button title="Programar Notificación" onPress={scheduleNotification} />
    </ScrollView>
  );
};

export default RutinasCrear;