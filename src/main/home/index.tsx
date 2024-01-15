//import liraries
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  CalendarList,
  Calendar,
  DateData,
  LocaleConfig,
  Agenda,
} from 'react-native-calendars';
import Header from '../../component/header';
import {Colors, Sizes} from '../../constant';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment, {Moment} from 'moment';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {nativeStackType} from '../../navigation';

const {width} = Dimensions.get('window');
const CALENDAR_WIDTH = width;
type eventType = {
  id: number;
  time: string;
  title: string;
  startTime: string;
  endTIme: string;
  place: string;
  hours: string;
};

type event = {
  item: eventType;
};
const EVENT_DATA = [
  {
    id: 1,
    time: '10:45 Am',
    title: 'Daily meeting',
    startTime: '10:30 am',
    endTIme: '11:00 am',
    place: 'US',
    hours: '4 hrs',
  },
  {
    id: 2,
    time: '10:45 Am',
    title: 'Daily meeting 2',
    startTime: '10:30 am',
    endTIme: '11:00 am',
    place: 'US',
    hours: '4 hrs',
  },
];

LocaleConfig.locales['en'] = {
  monthNames: [
    'January',
    'Febuary',
    'March',
    'April',
    'May',
    'June',
    'July',
    'Augest',
    'September',
    'October',
    'November',
    'December',
  ],

  dayNames: [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Friday',
    'Saturday',
    'Suday',
  ],
  dayNamesShort: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
};

LocaleConfig.defaultLocale = 'en';

type calendarSectionType = {
  onDayPress: (date: moment.Moment) => void;
};

const CalendarSection = ({onDayPress}: calendarSectionType) => {
  const [selectedDate, setSelectedDate] = useState(moment());
  const [month, setMonth] = useState(new Date());
  const calRef = useRef<any>();

  const leftArrowPress = () => {
    const momentDate = moment(month).subtract(1, 'months');
    const prevMonth = momentDate.toDate();
    setMonth(prevMonth);
    calRef.current?.scrollToMonth(prevMonth);
  };

  const rightArrowPress = () => {
    const momentDate = moment(month).add(1, 'months');
    const nextMonth = momentDate.toDate();
    setMonth(nextMonth);
    calRef.current?.scrollToMonth(nextMonth);
  };
  const customHeader = () => {
    return (
      <View style={[styles.headerContaner, {width: CALENDAR_WIDTH * 0.9}]}>
        <Text style={styles.currentSelectedDate}>
          {moment(month).format('MMMM YYYY')}
        </Text>
        <View style={styles.row}>
          {/* left icon */}
          <Pressable style={styles.icon} onPress={leftArrowPress}>
            <Icon
              name="chevron-left"
              color={Colors.colors.grey0}
              size={Sizes.iconSize.large}
            />
          </Pressable>
          <View style={styles.iconSpace} />
          {/* right icon */}
          <Pressable style={styles.icon} onPress={rightArrowPress}>
            <Icon
              name="chevron-right"
              color={Colors.colors.grey0}
              size={Sizes.iconSize.large}
            />
          </Pressable>
        </View>
      </View>
    );
  };

  type dateType = {
    date: {
      timestamp: number;
    };
  };

  const renderDate = useCallback(
    ({date: {timestamp}}: dateType) => {
      const isPicked = moment(timestamp).isSame(moment(selectedDate), 'day');
      const todayDate = moment(timestamp).isSame(moment(), 'day');

      return (
        <View style={styles.fakeDayContainer}>
          <TouchableOpacity
            onPress={() => {
              setSelectedDate(moment(timestamp));
              onDayPress(moment(timestamp));
            }}
            style={[
              {
                backgroundColor: isPicked
                  ? Colors.colors.primary
                  : 'transparet',
              },
              styles.dayContainer,
            ]}>
            <Text
              style={[
                styles.day,
                {
                  color: isPicked
                    ? Colors.colors.white
                    : todayDate
                    ? Colors.colors.primary
                    : Colors.colors.grey2,
                },
              ]}>
              {moment(timestamp).format('DD')}
            </Text>
          </TouchableOpacity>
        </View>
      );
    },
    [selectedDate],
  );

  return (
    <CalendarList
      ref={calRef}
      horizontal
      pagingEnabled
      staticHeader
      calendarWidth={CALENDAR_WIDTH}
      renderHeader={customHeader}
      scrollEnabled={false}
      // @ts-ignore
      dayComponent={renderDate}
      hideArrows
      theme={{
        // @ts-ignore
        'stylesheet.calendar.header': {
          dayHeader: {
            width: CALENDAR_WIDTH / 7,
            color: Colors.colors.grey2,
            fontSize: 15,
            textAlign: 'center',
          },
        },
      }}
    />
  );
};

interface AgendaScreenProps {}

interface AgendaEntry {
  name: string;
  height: number;
  day: string;
}

// const CalEventSection = forwardRef((props, ref) => {
//   const [items, setItems] = useState<Record<string, AgendaEntry[]> | undefined>(
//     undefined,
//   );

//   const onDateChange = (date: moment.Moment) => {
//     console.log('onDateChange=>', date);
//   };

//   useImperativeHandle(
//     ref,
//     () => {
//       return {
//         onDateChange(date: moment.Moment) {
//           onDateChange(date);
//         },
//       };
//     },
//     [],
//   );

//   const loadItems = (day: any) => {
//     const existingItems = items || {};

//     setTimeout(() => {
//       for (let i = -15; i < 85; i++) {
//         const time = day.timestamp + i * 24 * 60 * 60 * 1000;
//         const strTime = timeToString(time);

//         if (!existingItems[strTime]) {
//           existingItems[strTime] = [];

//           const numItems = Math.floor(Math.random() * 3 + 1);
//           for (let j = 0; j < numItems; j++) {
//             existingItems[strTime].push({
//               name: 'Item for ' + strTime + ' #' + j,
//               height: Math.max(50, Math.floor(Math.random() * 150)),
//               day: strTime,
//             });
//           }
//         }
//       }

//       const newItems = {...existingItems};
//       setItems(newItems);
//     }, 1000);
//   };

//   const renderItem = (reservation: AgendaEntry, isFirst: boolean) => {
//     const fontSize = isFirst ? 16 : 14;
//     const color = isFirst ? 'black' : '#43515c';

//     return (
//       <TouchableOpacity
//         style={[styles.item, {height: reservation.height}]}
//         onPress={() => Alert.alert(reservation.name)}>
//         <Text style={{fontSize, color}}>{reservation.name}</Text>
//       </TouchableOpacity>
//     );
//   };

//   const renderEmptyDate = () => {
//     return (
//       <View style={styles.emptyDate}>
//         <Text>This is an empty date!</Text>
//       </View>
//     );
//   };

//   const rowHasChanged = (r1: AgendaEntry, r2: AgendaEntry) => {
//     return r1.name !== r2.name;
//   };

//   const timeToString = (time: number) => {
//     const date = new Date(time);
//     return date.toISOString().split('T')[0];
//   };

//   return (
//     <Agenda
//       items={items}
//       loadItemsForMonth={loadItems}
//       selected={'2017-05-16'}
//       renderItem={renderItem}
//       renderEmptyDate={renderEmptyDate}
//       rowHasChanged={rowHasChanged}
//       showClosingKnob={false}
//       theme={{
//         //@ts-ignore
//         'stylesheet.agenda.main': {
//           header: {
//             height: 0,
//             width: 0,
//           },
//           knobContainer: {
//             height: 0,
//             width: 0,
//           },
//           knob: {
//             height: 0,
//             width: 0,
//           },
//           weekdays: {
//             height: 0,
//             width: 0,
//           },
//           weekday: {
//             height: 0,
//             width: 0,
//           },
//           reservations: {
//             flex: 1,
//           },
//         },
//       }}
//     />
//   );
// });

type eventDataType = {
  data: Array<T>;
};
const CalEventSection = ({data}: eventDataType) => {
  const eventSection = (item: eventType) => {
    return (
      <TouchableOpacity key={item.id}>
        <View
          style={[
            styles.row,
            {
              borderColor: Colors.colors.grey0,
              borderTopWidth: 1,
              justifyContent: 'space-between',
              backgroundColor: Colors.colors.blue0,
            },
          ]}>
          <View style={styles.leftSectionContainer}>
            <Text style={[styles.sectionMidText, {textAlign: 'center'}]}>
              {item.time}
            </Text>
          </View>
          <View style={styles.rightSectionContainer}>
            <View style={styles.rightContentContainer}>
              <Text style={styles.sectionText}>{item.title}</Text>
              <View style={[styles.row, {justifyContent: 'flex-start'}]}>
                <View style={[styles.row, {justifyContent: 'flex-start'}]}>
                  <Text style={styles.sectionSmallText}>{item.startTime}</Text>
                  <Text>{' - '}</Text>
                  <Text style={styles.sectionSmallText}>{item.endTIme}</Text>
                </View>
                <View style={styles.divider} />
                <Text style={styles.sectionMidText}>{item.place}</Text>
              </View>
            </View>
            <Text
              style={[
                styles.sectionMidText,
                {paddingHorizontal: Sizes.space.medium},
              ]}>
              {item.hours}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={[styles.container, styles.shadow]}>
      <Text
        style={[
          styles.sectionText,
          {
            paddingBottom: Sizes.space.medium,
            paddingHorizontal: Sizes.space.xlarge,
          },
        ]}>
        Event
      </Text>
      {data.map(eventSection)}
    </View>
  );
};

// create a component
const Home = () => {
  const childRef = useRef<any>();
  const navigation = useNavigation<NavigationProp<nativeStackType>>();

  const onDayPress = (day: moment.Moment) => {};

  return (
    <View style={styles.container}>
      <Header
        right
        onRightPress={() => {
          navigation.navigate('AddEvent');
        }}
      />
      <View style={styles.contentContainer}>
        <View
          style={[{width: CALENDAR_WIDTH, alignSelf: 'center'}, styles.shadow]}>
          <CalendarSection {...{onDayPress}} />
        </View>
        <CalEventSection data={EVENT_DATA} />
      </View>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.colors.white,
  },
  contentContainer: {
    flex: 1,
  },
  currentSelectedDate: {
    color: Colors.colors.primary,
    fontWeight: 'bold',
    fontSize: Sizes.f_Size.medium,
  },
  headerContaner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 10,
    marginVertical: 2 * Sizes.space.large,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    backgroundColor: Colors.colors.grey1,
    borderRadius: 2,
    height: 25,
    width: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  iconSpace: {
    width: Sizes.space.medium,
  },
  day: {
    color: Colors.colors.grey2,
    fontWeight: '700',
  },

  fakeDayContainer: {},
  dayContainer: {
    width: 40,
    height: 40,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30,
  },
  customDay: {
    margin: 10,
    fontSize: 24,
    color: 'green',
  },
  dayItem: {
    marginLeft: 34,
  },
  rightSectionContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.colors.white,
  },
  rightContentContainer: {
    paddingHorizontal: 1.5 * Sizes.space.large,
    paddingVertical: 2 * Sizes.space.large,
    flex: 1,
    borderStartWidth: 1,
    borderColor: Colors.colors.grey0,
  },
  leftSectionContainer: {
    flex: 0.2,

    paddingVertical: 1.5 * Sizes.space.large,
    paddingHorizontal: Sizes.space.medium,
  },
  sectionText: {
    fontSize: Sizes.f_Size.medium,
    lineHeight: Sizes.f_Size.medium * 1.5,
    color: Colors.colors.grey2,
    fontWeight: '500',
  },
  sectionMidText: {
    fontSize: Sizes.f_Size.xs,
    lineHeight: Sizes.f_Size.xs * 1.5,
    color: Colors.colors.grey2,
    fontWeight: '500',
  },

  sectionSmallText: {
    fontSize: Sizes.f_Size.xxs,
    lineHeight: Sizes.f_Size.xxs * 1.5,
    color: Colors.colors.grey2,
    fontWeight: '500',
  },
  divider: {
    width: 1,
    marginHorizontal: Sizes.space.small,
    backgroundColor: Colors.colors.grey2,
    height: '80%',
  },
});

//make this component available to the app
export default Home;
