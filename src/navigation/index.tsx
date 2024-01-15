import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../main/home';
import AddEvent from '../main/addEvent';

export type nativeStackType = {
  Home: undefined;
  AddEvent: undefined;
};

const NativeStack = createNativeStackNavigator<nativeStackType>();

const HomeStack = () => (
  <NativeStack.Navigator
    screenOptions={{headerShown: false}}
    initialRouteName="Home">
    <NativeStack.Screen component={Home} name="Home" />
    <NativeStack.Screen component={AddEvent} name="AddEvent" />
  </NativeStack.Navigator>
);

export {HomeStack};
