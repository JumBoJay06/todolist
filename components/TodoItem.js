import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { commonStyles } from '../styles/commonStyles';

export function TodoItem({ item, onToggle, onDelete, onNavigate }) {
    return (
        // 使用 TouchableOpacity 包裹整個待辦項目，讓它可以被點擊導航
        <TouchableOpacity onPress={onNavigate} style={[styles.todoItemContainer, item.isComplete && styles.completedContainer, commonStyles.card]}>
            {/* 使用 TouchableOpacity 包裹勾選框，讓它可以被點擊切換完成狀態 */}
            <TouchableOpacity onPress={onToggle} style={styles.checkContainer}>
                <MaterialIcons
                    name={item.isComplete ? 'check-box' : 'check-box-outline-blank'}
                    size={24}
                    color={item.isComplete ? 'gray' : '#007cdb'}
                />
            </TouchableOpacity>

            {/* 使用 View 包裹文字內容，讓它可以有更多樣式 */}
            <View style={styles.textContainer}>
                {/* 根據 isComplete 狀態來決定文字樣式 */}
                <Text style={[styles.todoText, item.isComplete && styles.completedText]}>
                    {item.text}
                </Text>
                {item.content ? (
                    <Text style={[styles.todoContent, item.isComplete && styles.completedContent]} numberOfLines={1}>
                        {item.content}
                    </Text>
                ) : null}
            </View>
            {/* 使用 TouchableOpacity 包裹刪除按鈕，讓它可以被點擊刪除待辦項目 */}
            <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
                <MaterialIcons name="delete" size={24} color="#cc0000" />
            </TouchableOpacity>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    todoItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        marginBottom: 12,
    },
    completedContainer: {
        backgroundColor: '#e9e9e9',
    },
    checkContainer: {
        padding: 4,
    },
    textContainer: {
        flex: 1,
        marginLeft: 12,
    },
    todoText: {
        fontSize: 16,
    },
    completedText: {
        textDecorationLine: 'line-through',
        color: 'gray',
    },
    todoContent: {
        fontSize: 12,
        color: 'gray',
        marginTop: 4,
    },
    completedContent: {
        textDecorationLine: 'line-through',
        color: 'gray',
    },
    deleteButton: {
        padding: 4,
    },
});