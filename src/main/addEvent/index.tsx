//import liraries
import React, {useState} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import Header from '../../component/header';
import {Colors, Sizes} from '../../constant';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';

type inputBoxtype = {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
};

function generateRandomId() {
  const randomString = Math.random().toString(36).substring(2, 10);
  const timestamp = Date.now().toString(36);
  return randomString + timestamp;
}

type eventStateType = {
  eventName: string;
  date: moment.Moment;
  startTime: moment.Moment;
  endTime: moment.Moment;
  description: string;
  id?: string;
};
const InputBox = ({onChangeText, value, placeholder}: inputBoxtype) => {
  return (
    <View>
      <TextInput value={value} style={styles.input} {...{onChangeText}} />
    </View>
  );
};

const CustomDatePicker = () => {
  return <DateTimePicker value={new Date()} onChange={() => true} />;
};

// create a component
const AddEvent = () => {
  const [event, stateEvent] = useState<eventStateType>({
    date: moment(),
    description: '',
    endTime: moment(),
    eventName: '',
    startTime: moment(),
  });
  return (
    <View style={styles.container}>
      <Header left title="Add New Event" />

      <View style={styles.content}>
        <Text style={styles.title}>Information Event</Text>
        <InputBox
          placeholder="Event name"
          value={event.eventName}
          onChangeText={(text: string) => {
            stateEvent({
              ...event,
              eventName: text,
            });
          }}
        />
        <InputBox
          placeholder="Event name"
          value={event.eventName}
          onChangeText={(text: string) => {
            stateEvent({
              ...event,
              eventName: text,
            });
          }}
        />
      </View>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 1.5 * Sizes.space.xlarge,
  },
  input: {
    marginTop: Sizes.space.large,
    paddingHorizontal: Sizes.space.medium,
    height: 50,
    borderColor: Colors.colors.grey0,
    borderRadius: Sizes.space.small,
    borderWidth: 1,
  },
  title: {
    marginBottom: 2 * Sizes.space.xlarge,
    fontSize: Sizes.f_Size.large,
    color: Colors.colors.primary,
    fontWeight: '600',
  },
});

//make this component available to the app
export default AddEvent;
