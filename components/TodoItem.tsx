import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, GestureResponderEvent } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { commonStyles } from '../styles/commonStyles';
import { Todo } from '../context/TodoContext';

type TodoItemProps = {
    item: Todo;
    onToggle: (event: GestureResponderEvent) => void;
    onDelete: (event: GestureResponderEvent) => void;
    onNavigate: (event: GestureResponderEvent) => void;
};

export function TodoItem({ item, onToggle, onDelete, onNavigate }: TodoItemProps) {
    return (
        <TouchableOpacity
            onPress={onNavigate}
            style={[
                styles.todoItemContainer,
                item.isComplete && styles.completedContainer,
                commonStyles.card,
            ]}
        >
            <TouchableOpacity onPress={onToggle} style={styles.checkContainer}>
                <MaterialIcons
                    name={item.isComplete ? 'check-box' : 'check-box-outline-blank'}
                    size={24}
                    color={item.isComplete ? 'gray' : '#007cdb'}
                />
            </TouchableOpacity>

            <View style={styles.textContainer}>
                <Text style={[styles.todoText, item.isComplete && styles.completedText]}>
                    {item.text}
                </Text>
                {item.content ? (
                    <Text
                        style={[styles.todoContent, item.isComplete && styles.completedContent]}
                        numberOfLines={1}
                    >
                        {item.content}
                    </Text>
                ) : null}
            </View>
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