import { useState } from 'react';
import { View, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
// 引入自訂 Hook
import { useTodos, useTodosDispatch, ACTION_TYPES } from '../context/TodoContext';
import { TodoItem } from '../components/TodoItem';
import { commonStyles } from '../styles/commonStyles';
import { SCREEN_NAMES } from '../App'; // 引入常量

export function TodoListScreen({ navigation }) {
  // 從 Context 取得狀態和 dispatch 函式
  const todos = useTodos();
  const dispatch = useTodosDispatch();
  
  const [newTodo, setNewTodo] = useState('');
  const [isInputTodo, setIsInputTodo] = useState(false);

  const handleAddTodo = () => {
    if (isInputTodo === false) {
      return; // 如果輸入框沒有內容，則不執行新增操作
    }
    // 派發一個 'ADD_TODO' 的 action
    dispatch({ type: ACTION_TYPES.ADD_TODO, payload: newTodo });
    handleInputChange('');
  };

  const handleInputChange = (text) => {
    setNewTodo(text);
    setIsInputTodo(text.trim().length > 0);
  };

  const renderItem = ({ item }) => (
    <TodoItem
      item={item}
      // 派發 'TOGGLE_TODO' action
      onToggle={() => dispatch({ type: ACTION_TYPES.TOGGLE_TODO, payload: { id: item.id } })}
      // 派發 'DELETE_TODO' action
      onDelete={() => dispatch({ type: ACTION_TYPES.DELETE_TODO, payload: { id: item.id } })}
      onNavigate={() => navigation.navigate(SCREEN_NAMES.DETAIL, { todoId: item.id })}
    />
  );

  return (
    <View style={commonStyles.pageContainer}>
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
      <FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id} //可以直接使用 nanoid
        contentContainerStyle={{ paddingBottom: 20 }}
      />
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
});