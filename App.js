import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Keyboard, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Task from './components/Task';

export default function App() {
  const [task, setTask] = useState('');
  const [taskItems, setTaskItems] = useState([]);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const savedTasks = await AsyncStorage.getItem('tasks');
        if (savedTasks) {
          setTaskItems(JSON.parse(savedTasks));
        }
      } catch (error) {
        console.error('Failed to load tasks from AsyncStorage', error);
      }
    };

    loadTasks();
  }, []);

  useEffect(() => {
    const saveTasks = async () => {
      try {
        await AsyncStorage.setItem('tasks', JSON.stringify(taskItems));
      } catch (error) {
        console.error('Failed to save tasks to AsyncStorage', error);
      }
    };

    if (taskItems.length) {
      saveTasks();
    }
  }, [taskItems]);

  // Add a new task
  const handleAddTask = () => {
    if (task.trim()) {
      Keyboard.dismiss();
      const newTask = { text: task, completed: false };
      setTaskItems([...taskItems, newTask]);
      setTask('');
    }
  };

  // Mark a task as completed
  const completeTask = (index) => {
    let updatedTasks = [...taskItems];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTaskItems(updatedTasks);
  };

  // Delete a task
  const deleteTask = (index) => {
    let updatedTasks = [...taskItems];
    updatedTasks.splice(index, 1);
    setTaskItems(updatedTasks);
  };

  // Clear completed tasks
  const clearCompleted = () => {
    const activeTasks = taskItems.filter(task => !task.completed);
    const completedTasks = taskItems.length - activeTasks.length;
  
    if (completedTasks === 0) {
      alert('There are no completed tasks to clear.');
    } else {
      setTaskItems(activeTasks);
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>My Todo App</Text>
      </View>

      <View style={styles.taskWrapper}>
        <View style={styles.inputContainer}>
          <Text style={styles.taskLabel}>Task:</Text>
          <TextInput
            style={styles.input}
            placeholder="Write a task"
            value={task}
            onChangeText={(text) => setTask(text)}
          />
          <TouchableOpacity onPress={handleAddTask}>
            <View style={styles.addWrapper}>
              <Text style={styles.addText}>+</Text>
            </View>
          </TouchableOpacity>
        </View>

        <FlatList
          data={taskItems}
          renderItem={({ item, index }) => (
            <TouchableOpacity key={index} onPress={() => completeTask(index)}>
              <Task
                text={item.text}
                completed={item.completed}
                onDelete={() => deleteTask(index)}
              />
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />

        {/* Clear Completed Button */}
        <TouchableOpacity onPress={clearCompleted} style={styles.clearButton}>
          <Text style={styles.clearText}>Clear Completed</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EAED',
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  taskWrapper: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  taskLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    borderRadius: 60,
    borderColor: '#C0C0C0',
    borderWidth: 1,
  },
  addWrapper: {
    width: 60,
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#C0C0C0',
    borderWidth: 1,
    marginLeft: 10,
  },
  addText: {
    fontSize: 30,
    color: '#55BCF6',
  },
  clearButton: {
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#55BCF6',
    borderRadius: 30,
    marginTop: 20,
  },
  clearText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
  },
});
