import { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
// nanoid/non-secure 在 React Native 環境中更輕量且適用
import { nanoid } from 'nanoid/non-secure';

// 定義 Context 物件
const TodoContext = createContext();
const TodoDispatchContext = createContext();

// AsyncStorage 的儲存鍵
const TODOS_STORAGE_KEY = 'todos_storage_key';

/**
 * 狀態管理的 Reducer 函式
 * @param {Array} todos - 目前的 todos 狀態
 * @param {Object} action - 描述如何更新狀態的動作物件
 * @returns {Array} 新的 todos 狀態
 */
function todosReducer(todos, action) {
  switch (action.type) {
    // 設定從 AsyncStorage 載入的待辦事項
    case ACTION_TYPES.SET_TODOS: {
      return action.payload;
    }
    // 新增待辦事項
    case ACTION_TYPES.ADD_TODO: {
      if (action.payload.trim().length === 0) return todos;
      const newTodo = {
        id: nanoid(), // 使用 nanoid 生成唯一 ID
        text: action.payload,
        isComplete: false,
        content: '',
      };
      return [...todos, newTodo];
    }
    // 更新待辦事項
    case ACTION_TYPES.UPDATE_TODO: {
      const { id, text, content } = action.payload;
      return todos.map((t) =>
        t.id === id ? { ...t, text, content } : t
      );
    }
    // 刪除待辦事項
    case ACTION_TYPES.DELETE_TODO: {
      return todos.filter((t) => t.id !== action.payload.id);
    }
    // 切換完成狀態
    case ACTION_TYPES.TOGGLE_TODO: {
      return todos.map((t) =>
        t.id === action.payload.id ? { ...t, isComplete: !t.isComplete } : t
      );
    }
    // 如果沒有匹配的 action type，則拋出錯誤
    default: {
      throw Error('未知的 action: ' + action.type);
    }
  }
}

// Context Provider 元件
export function TodoProvider({ children }) {
  // 使用 useReducer 來管理狀態，初始狀態為一個空陣列
  const [todos, dispatch] = useReducer(todosReducer, []);

  // Effect Hook：用於在元件首次渲染時從 AsyncStorage 載入資料
  useEffect(() => {
    async function loadTodos() {
      try {
        const storedTodos = await AsyncStorage.getItem(TODOS_STORAGE_KEY);
        if (storedTodos !== null) {
          dispatch({ type: ACTION_TYPES.SET_TODOS, payload: JSON.parse(storedTodos) });
        }
      } catch (e) {
        console.error('讀取待辦事項失敗', e);
      }
    }
    loadTodos();
  }, []); // 空依賴陣列表示這個 effect 只會在 mount 時執行一次

  // Effect Hook：當 todos 狀態改變時，將其儲存到 AsyncStorage
  useEffect(() => {
    async function saveTodos() {
      try {
        await AsyncStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos));
      } catch (e) {
        console.error('儲存待辦事項失敗', e);
      }
    }
    saveTodos();
  }, [todos]); // 依賴於 todos 狀態

  return (
    <TodoContext.Provider value={todos}>
      <TodoDispatchContext.Provider value={dispatch}>
        {children}
      </TodoDispatchContext.Provider>
    </TodoContext.Provider>
  );
}

// 自訂 Hook，方便元件取得 todos 狀態
export function useTodos() {
  return useContext(TodoContext);
}

// 自訂 Hook，方便元件取得 dispatch 函式
export function useTodosDispatch() {
  return useContext(TodoDispatchContext);
}

export const ACTION_TYPES = Object.freeze({
  SET_TODOS: 'SET_TODOS',
  ADD_TODO: 'ADD_TODO',
  UPDATE_TODO: 'UPDATE_TODO',
  DELETE_TODO: 'DELETE_TODO',
  TOGGLE_TODO: 'TOGGLE_TODO',
});