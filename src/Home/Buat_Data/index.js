import React, { Fragment, useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { CalendarList } from 'react-native-calendars';
import moment from 'moment';
import * as Calendar from 'expo-calendar';
import * as Localization from 'expo-localization';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { v4 as uuidv4 } from 'uuid';
import { tinggi_Keyboard } from '../../Hooks';
import { apiDATA } from '../../Data';
import { Routes } from '../../Navigasi';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: vw } = Dimensions.get('window');
// moment().format('YYYY/MM/DD')



const Buat_Data = ({ navigation, route }) => {
  const { updateTodo } = apiDATA((state) => ({
    updateTodo: state.updateTodo
  }));

  const keyboardHeight = tinggi_Keyboard();

  const createNewCalendar = route.params?.createNewCalendar ?? (() => null);
  const updateCurrentTask = route.params?.updateCurrentTask ?? (() => null);
  const currentDate = route.params?.currentDate ?? (() => null);

  const [selectedDay, setSelectedDay] = useState({
    [`${moment().format('YYYY')}-${moment().format('MM')}-${moment().format(
      'DD'
    )}`]: {
      selected: true,
      selectedColor: '#FFB6C1'
    }
  });
  const [currentDay, setCurrentDay] = useState(moment().format());
  const [taskText, setTaskText] = useState('');
  const [notesText, setNotesText] = useState('');
  const [visibleHeight, setVisibleHeight] = useState(
    Dimensions.get('window').height
  );
  const [isAlarmSet, setAlarmSet] = useState(false);
  const [alarmTime, setAlarmTime] = useState(moment().format());
  const [isDateTimePickerVisible, setDateTimePickerVisible] = useState(false);

  useEffect(() => {
    if (keyboardHeight > 0) {
      setVisibleHeight(Dimensions.get('window').height - keyboardHeight);
    } else if (keyboardHeight === 0) {
      setVisibleHeight(Dimensions.get('window').height);
    }
  }, [keyboardHeight]);

  const handleAlarmSet = () => {
    setAlarmSet(!isAlarmSet);
  };

  const synchronizeCalendar = async () => {
    const calendarId = await createNewCalendar();
    try {
      const createEventId = await addEventsToCalendar(calendarId);
      handleCreateEventData(createEventId);
    } catch (e) {
      Alert.alert(e.message);
    }
  };

  const addEventsToCalendar = async (calendarId) => {
    const event = {
      title: taskText,
      notes: notesText,
      startDate: moment(alarmTime).add(0, 'm').toDate(),
      endDate: moment(alarmTime).add(5, 'm').toDate(),
      timeZone: Localization.timezone
    };

    try {
      const createEventAsyncResNew = await Calendar.createEventAsync(
        calendarId.toString(),
        event
      );
      return createEventAsyncResNew;
    } catch (error) {
      console.log(error);
    }
  };

  const showDateTimePicker = () => setDateTimePickerVisible(true);

  const hideDateTimePicker = () => setDateTimePickerVisible(false);

  const handleCreateEventData = async (createEventId) => {
    const creatTodo = {
      key: uuidv4(),
      date: `${moment(currentDay).format('YYYY')}-${moment(currentDay).format(
        'MM'
      )}-${moment(currentDay).format('DD')}`,
      todoList: [
        {
          key: uuidv4(),
          title: taskText,
          notes: notesText,
          alarm: {
            time: alarmTime,
            isOn: isAlarmSet,
            createEventAsyncRes: createEventId
          },
          color: `rgb(${Math.floor(
            Math.random() * Math.floor(256)
          )},${Math.floor(Math.random() * Math.floor(256))},${Math.floor(
            Math.random() * Math.floor(256)
          )})`
        }
      ],
      markedDot: {
        date: currentDay,
        dots: [
          {
            key: uuidv4(),
            color: '#2E66E7',
            selectedDotColor: '#2E66E7'
          }
        ]
      }
    };
    navigation.navigate(Routes.HOME);
    await updateTodo(creatTodo);
    updateCurrentTask(currentDate);
  };

  const handleDatePicked = (date) => {
    const selectedDatePicked = currentDay;
    const hour = moment(date).hour();
    const minute = moment(date).minute();
    const newModifiedDay = moment(selectedDatePicked).hour(hour).minute(minute);
    setAlarmTime(newModifiedDay);
    hideDateTimePicker();
  };

  return (
    <Fragment>
      <DateTimePicker
        isVisible={isDateTimePickerVisible}
        onConfirm={handleDatePicked}
        onCancel={hideDateTimePicker}
        mode="time"
        date={new Date()}
        isDarkModeEnabled
      />

      <SafeAreaView style={styles.container}>
        <View
          style={{
            height: visibleHeight
          }}
        >
          <ScrollView
            contentContainerStyle={{
              paddingBottom: 100
            }}
          >
            <View style={styles.backButton}>
              <TouchableOpacity
                onPress={() => navigation.navigate(Routes.HOME)}
                style={{ marginRight: vw / 2 - 120, marginLeft: 20 }}
              >
                <Image
                  style={{ height: 25, width: 40 }}
                  source={require('../../../assets/back.png')}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              <Text style={styles.newTask}>Kegiatan Baru</Text>
            </View>
            <View style={styles.calenderContainer}>
              <CalendarList
                style={{
                  width: 350,
                  height: 350
                }}
                current={currentDay}
                minDate={moment().format()}
                horizontal
                pastScrollRange={0}
                pagingEnabled
                calendarWidth={350}
                onDayPress={(day) => {
                  setSelectedDay({
                    [day.dateString]: {
                      selected: true,
                      selectedColor: '#1c6fff'
                    }
                  });
                  setCurrentDay(day.dateString);
                  setAlarmTime(day.dateString);
                }}
                monthFormat="yyyy MMMM"
                hideArrows
                markingType="custom"
                theme={{
                  selectedDayBackgroundColor: '#000000',
                  selectedDayTextColor: '#3eb6f7',
                  todayTextColor: '#000000',
                  backgroundColor: '#3eb6f7',
                  calendarBackground: '#ADD8E6',
                  textDisabledColor: '#000000'
                }}
                markedDates={selectedDay}
              />
            </View>
            <View style={styles.taskContainer}>
              <TextInput
                style={styles.title}
                onChangeText={setTaskText}
                value={taskText}
                placeholder="Apa yang akan dilakukan?"
              />
              <Text
                style={{
                  fontSize: 14,
                  color: '#BDC6D8',
                  marginVertical: 10
                }}
              >
                Saran: 
              </Text>
              <View style={{ flexDirection: 'row' }}>
                <View style={styles.readBook}>
                  <Text style={{ textAlign: 'center', fontSize: 14 }}>
                    Belajar
                  </Text>
                </View>
                <View style={styles.design}>
                  <Text style={{ textAlign: 'center', fontSize: 14 }}>
                    Tugas
                  </Text>
                </View>
                <View style={styles.learn}>
                  <Text style={{ textAlign: 'center', fontSize: 14 }}>
                    Libur
                  </Text>
                </View>
              </View>
              <View style={styles.notesContent} />
              <View>
                <Text style={styles.notes}>Catatan</Text>
                <TextInput
                  style={{
                    height: 25,
                    fontSize: 19,
                    marginTop: 3
                  }}
                  onChangeText={setNotesText}
                  value={notesText}
                  placeholder="Inputkan kegiatan hari ini."
                />
              </View>
              <View style={styles.separator} />
              <View>
                <Text
                  style={{
                    color: '#0e1624',
                    fontSize: 16,
                    fontWeight: '600'
                  }}
                >
                  Jam Selesai Kegiatan
                </Text>
                <TouchableOpacity
                  onPress={() => showDateTimePicker()}
                  style={{
                    height: 25,
                    marginTop: 3
                  }}
                >
                  <Text style={{ fontSize: 19 }}>
                    {moment(alarmTime).format('h:mm A')}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.separator} />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <View>
                  <Text
                    style={{
                      color: '#0e1624',
                      fontSize: 16,
                      fontWeight: '600'
                    }}
                  >
                    Kegiatan Telah Mencapai Batas Waktu
                  </Text>
                  <View
                    style={{
                      height: 25,
                      marginTop: 3
                    }}
                  >
                    <Text style={{ fontSize: 19 }}>
                      {moment(alarmTime).format('h:mm A')}
                    </Text>
                  </View>
                </View>
                <Switch value={isAlarmSet} onValueChange={handleAlarmSet} />
              </View>
            </View>
            <TouchableOpacity
              disabled={taskText === ''}
              style={[
                styles.createTaskButton,
                {
                  backgroundColor:
                    taskText === '' ? 'rgba(46, 102, 231,0.5)' : '#ADD8E6'
                }
              ]}
              onPress={async () => {
                if (isAlarmSet) {
                  await synchronizeCalendar();
                }
                if (!isAlarmSet) {
                  handleCreateEventData();
                }
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  textAlign: 'center',
                  color: '#F8F8FF'
                }}
              >
                Tambahkan Kegiatan
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Fragment>
  );
}

export default Buat_Data

const styles = StyleSheet.create({
  createTaskButton: {
    width: 252,
    height: 48,
    alignSelf: 'center',
    marginTop: 20,
    borderRadius: 5,
    justifyContent: 'center'
  },
  separator: {
    height: 0.5,
    width: '100%',
    backgroundColor: '#000000',
    alignSelf: 'center',
    marginVertical: 20
  },
  notes: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600'
  },
  notesContent: {
    height: 0.5,
    width: '100%',
    backgroundColor: '#000000',
    alignSelf: 'center',
    marginVertical: 20
  },
  learn: {
    height: 23,
    width: 83,
    backgroundColor: '#E0FFFF',
    justifyContent: 'center',
    borderRadius: 5
  },
  design: {
    height: 23,
    width: 83,
    backgroundColor: '#F0FFFF',
    justifyContent: 'center',
    borderRadius: 5,
    marginRight: 7
  },
  readBook: {
    height: 23,
    width: 83,
    backgroundColor: '#ADD8E6',
    justifyContent: 'center',
    borderRadius: 5,
    marginRight: 7
  },
  title: {
    height: 25,
    borderColor: '#000000',
    borderLeftWidth: 1,
    paddingLeft: 8,
    fontSize: 19
  },
  taskContainer: {
    height: 400,
    width: 327,
    alignSelf: 'center',
    borderRadius: 20,
    shadowColor: '#FFF8DC',
    backgroundColor: '#FFF8DC',
    shadowOffset: {
      width: 3,
      height: 3
    },
    shadowRadius: 20,
    shadowOpacity: 0.2,
    elevation: 5,
    padding: 22
  },
  calenderContainer: {
    marginTop: 30,
    width: 350,
    height: 350,
    alignSelf: 'center'
  },
  newTask: {
    alignSelf: 'center',
    fontSize: 20,
    width: 120,
    height: 25,
    textAlign: 'center'
  },
  backButton: {
    flexDirection: 'row',
    marginTop: 20,
    width: '100%',
    alignItems: 'center'
  },
  container: {
    flex: 1,
    backgroundColor: '#FFB6C1'
  }
});