import { useState, useLayoutEffect } from 'react';
import { View, TextInput, StyleSheet, Alert, Text, TouchableOpacity } from 'react-native';
// 引入自訂 Hook
import { useTodos, useTodosDispatch, ACTION_TYPES } from '../context/TodoContext';
import { commonStyles } from '../styles/commonStyles';

export function DetailScreen({ route, navigation }) {
    const { todoId } = route.params;
    const todos = useTodos();
    const dispatch = useTodosDispatch();

    const todo = todos.find(t => t.id === todoId);

    const [text, setText] = useState(todo ? todo.text : '');
    const [content, setContent] = useState(todo ? todo.content : '');

    useLayoutEffect(() => {
        // 處理找不到 todo 的情況
        if (!todo) return;

        // 動態設定標頭標題和右側按鈕
        navigation.setOptions({
            title: '待辦詳情', // 當標題為空時顯示提示
            headerRight: () => (
                <TouchableOpacity onPress={handleSave} style={styles.saveContainer} >
                    <Text style={styles.saveText}>儲存</Text>
                </TouchableOpacity>
            ),
            headerTintColor: '#fff', // 設定標題顏色
        });
    }, [navigation, text, content, todo]); // 當依賴項改變時重新執行

    const handleSave = () => {
        if (text.trim().length === 0) {
            Alert.alert("錯誤", "標題不能為空！");
            return;
        }
        // 派發 'UPDATE_TODO' action
        dispatch({
            type: ACTION_TYPES.UPDATE_TODO,
            payload: { id: todoId, text, content }
        });
        navigation.goBack();
    };

    // 如果 todo 正在載入或不存在，顯示提示
    if (!todo) {
        return (
            <View style={commonStyles.pageContainer}>
                <Text>找不到該事項，或正在載入中...</Text>
            </View>
        );
    }

    return (
        <View style={commonStyles.pageContainer}>
            <TextInput
                style={[styles.input, styles.titleInput]}
                value={text}
                onChangeText={setText}
                placeholder="標題"
            />
            <TextInput
                style={[styles.input, styles.contentInput]}
                value={content}
                onChangeText={setContent}
                placeholder="詳細內容..."
                multiline
            />
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
        marginBottom: 16,
    },
    titleInput: {
        fontWeight: 'bold',
    },
    contentInput: {
        flex: 1,
        textAlignVertical: 'top',
    },
    saveContainer: {
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveText: {
        color: '#007cdb',
        fontWeight: 'bold',
    },
});