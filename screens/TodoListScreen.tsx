import { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
// 引入自訂 Hook
import { useTodos, useTodosDispatch, ACTION_TYPES, Todo } from '../context/TodoContext';
import { TodoItem } from '../components/TodoItem';
import { commonStyles } from '../styles/commonStyles';
import { SCREEN_NAMES, RootStackParamList } from '../App'; // 引入常量
import { Keyboard } from 'react-native';

type Props = NativeStackScreenProps<RootStackParamList, typeof SCREEN_NAMES.TODO_LIST>;

export function TodoListScreen({ navigation }: Props) {
  // 從 Context 取得狀態和 dispatch 函式
  const todos = useTodos();
  const dispatch = useTodosDispatch();
  
  // 狀態：用於儲存新增待辦事項的文字和輸入框狀態
  const [newTodo, setNewTodo] = useState('');
  const [isInputTodo, setIsInputTodo] = useState(false);

  const handleAddTodo = () => {
    if (isInputTodo === false) {
      return; // 如果輸入框沒有內容，則不執行新增操作
    }

    // 關閉鍵盤
    Keyboard.dismiss();

    // 派發一個 'ADD_TODO' 的 action
    dispatch({ type: ACTION_TYPES.ADD_TODO, payload: newTodo });
    handleInputChange('');
  };

  // 更新輸入框的狀態
  const handleInputChange = (text: string) => {
    setNewTodo(text);
    setIsInputTodo(text.trim().length > 0);
  };

  // 渲染每個待辦事項的項目
  const renderItem = ({ item }: { item: Todo }) => (
    <TodoItem
      item={item}
      // 派發 'TOGGLE_TODO' action
      onToggle={() => dispatch({ type: ACTION_TYPES.TOGGLE_TODO, payload: { id: item.id } })}
      // 派發 'DELETE_TODO' action
      onDelete={() => dispatch && dispatch({ type: ACTION_TYPES.DELETE_TODO, payload: { id: item.id } })}
      // 導航到詳細頁面
      onNavigate={() => navigation.navigate(SCREEN_NAMES.DETAIL, { todoId: item.id })}
    />
  );

  return (
    // 使用 View 包裹整個頁面，並套用通用樣式
    <View style={commonStyles.pageContainer}>
      {/* 使用 View 包裹輸入框和新增按鈕 */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="新增待辦事項..."
          value={newTodo}
          onChangeText={handleInputChange}
        />
        <TouchableOpacity onPress={handleAddTodo} style={styles.addContainer} >
            <MaterialIcons name="add-circle" size={36} color={isInputTodo === true ? '#007cdb' : 'gray'} />
        </TouchableOpacity>
      </View>
      {todos.length > 0 ? 
      // 使用 FlatList 渲染待辦事項列表 
      <FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
      /> :
      // 如果沒有待辦事項，顯示提示文字
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>沒有待辦事項</Text>
      </View>
      }
      
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  textInput: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    marginRight: 8,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  addContainer: {
    padding: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: 'gray',
  },
});