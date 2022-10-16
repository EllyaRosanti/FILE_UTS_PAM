import React, { Component } from 'react';
import { Platform, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TempApp } from '../component';
import { CalendarNavigation } from '../Navigasi';
import * as Calendar from 'expo-calendar';

class Route extends Component {
  async componentDidMount() {
    await this._askForCalendarPermissions();
    await this._askForReminderPermissions();

    StatusBar.pushStackEntry({
      animated: true,
      barStyle: 'dark-content'
    });
  }

  _askForCalendarPermissions = async () => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status === 'granted') {
      const calendars = await Calendar.getCalendarsAsync(
        Calendar.EntityTypes.EVENT
      );
      console.log('Keseluruhan Kalender:');
      console.log({ calendars });
    }
  };

  _askForReminderPermissions = async () => {
    if (Platform.OS === 'android') {
      return true;
    }

    const { status } = await Calendar.requestRemindersPermissionsAsync();
    if (status === 'granted') {
      const calendars = await Calendar.getRemindersPermissionsAsync(
        Calendar.EntityTypes.REMINDER
      );
      console.log('Keseluruhan Kalender:');
      console.log({ calendars });
    }
  };

  render = () => (
    <SafeAreaProvider style={{ backgroundColor: '#3895ff' }}>
      <TempApp>
        <CalendarNavigation />
      </TempApp>
    </SafeAreaProvider>
  );
}

export default Route;