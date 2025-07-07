import { createContext, useContext, useReducer, useEffect, Dispatch, ReactNode} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { nanoid } from 'nanoid/non-secure';

// 型別定義
export interface Todo {
  id: string;
  text: string;
  isComplete: boolean;
  content: string;
}

export type TodoAction =
  | { type: typeof ACTION_TYPES.SET_TODOS; payload: Todo[] }
  | { type: typeof ACTION_TYPES.ADD_TODO; payload: string }
  | { type: typeof ACTION_TYPES.UPDATE_TODO; payload: { id: string; text: string; content: string } }
  | { type: typeof ACTION_TYPES.DELETE_TODO; payload: { id: string } }
  | { type: typeof ACTION_TYPES.TOGGLE_TODO; payload: { id: string } };

export const ACTION_TYPES = Object.freeze({
  SET_TODOS: 'SET_TODOS',
  ADD_TODO: 'ADD_TODO',
  UPDATE_TODO: 'UPDATE_TODO',
  DELETE_TODO: 'DELETE_TODO',
  TOGGLE_TODO: 'TOGGLE_TODO',
} as const);

const TodoContext = createContext<Todo[]>([]);
const TodoDispatchContext = createContext<Dispatch<TodoAction> | null>(null);

const TODOS_STORAGE_KEY = 'todos_storage_key';

function todosReducer(todos: Todo[], action: TodoAction): Todo[] {
  switch (action.type) {
    case ACTION_TYPES.SET_TODOS: {
      return action.payload;
    }
    case ACTION_TYPES.ADD_TODO: {
      if (action.payload.trim().length === 0) return todos;
      const newTodo: Todo = {
        id: nanoid(),
        text: action.payload,
        isComplete: false,
        content: '',
      };
      return [...todos, newTodo];
    }
    case ACTION_TYPES.UPDATE_TODO: {
      const { id, text, content } = action.payload;
      return todos.map((t) =>
        t.id === id ? { ...t, text, content } : t
      );
    }
    case ACTION_TYPES.DELETE_TODO: {
      return todos.filter((t) => t.id !== action.payload.id);
    }
    case ACTION_TYPES.TOGGLE_TODO: {
      return todos.map((t) =>
        t.id === action.payload.id ? { ...t, isComplete: !t.isComplete } : t
      );
    }
    default: {
      throw Error('未知的 action: ' + (action as any).type);
    }
  }
}

interface TodoProviderProps {
  children: ReactNode;
}

export function TodoProvider({ children }: TodoProviderProps) {
  const [todos, dispatch] = useReducer(todosReducer, []);

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
  }, []);

  useEffect(() => {
    async function saveTodos() {
      try {
        await AsyncStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos));
      } catch (e) {
        console.error('儲存待辦事項失敗', e);
      }
    }
    saveTodos();
  }, [todos]);

  return (
    <TodoContext.Provider value={todos}>
      <TodoDispatchContext.Provider value={dispatch}>
        {children}
      </TodoDispatchContext.Provider>
    </TodoContext.Provider>
  );
}

export function useTodos(): Todo[] {
  return useContext(TodoContext);
}

export function useTodosDispatch(): Dispatch<TodoAction> {
  const context = useContext(TodoDispatchContext);
  if (context === undefined) {
    throw new Error('useTodosDispatch 必須在 TodoProvider 內使用');
  }
  return context;
}