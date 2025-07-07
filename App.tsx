import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Todo, TodoProvider } from './context/TodoContext';
import { TodoListScreen } from './screens/TodoListScreen';
import { DetailScreen } from './screens/DetailScreen';
import { Platform } from 'react-native';

export type RootStackParamList = {
  TodoList: Todo[];
  Detail: { todoId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const SCREEN_NAMES = Object.freeze({
  TODO_LIST: 'TodoList',
  DETAIL: 'Detail',
});

export default function App() {
  return (
    <TodoProvider>
      <NavigationContainer>
        <Stack.Navigator
          id={undefined}
          screenOptions={{
            headerStyle: { backgroundColor: '#007cdb' },
            headerTintColor: '#000',
            headerTitleStyle: { fontWeight: 'bold', color: '#fff' },
            ...Platform.select({
                  ios: {
                    headerTitleAlign: 'center',
                  },
                  android: {
                    headerTitleAlign: 'left',
                  },
                }),
        
          }}
        >
          <Stack.Screen 
            name={SCREEN_NAMES.TODO_LIST}
            component={TodoListScreen} 
            options={{ title: '我的待辦清單' }}
          />
          <Stack.Screen 
            name={SCREEN_NAMES.DETAIL}
            component={DetailScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </TodoProvider>
  );
}