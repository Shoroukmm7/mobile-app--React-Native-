import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Keyboard,
} from 'react-native';

export default function App() {
  const [enteredGoal, setEnteredGoal] = useState('');
  const [goals, setGoals] = useState([]);
  const [editId, setEditId] = useState(null);

  const addOrEditGoalHandler = () => {
    if (enteredGoal.trim().length === 0) {
      Alert.alert('Empty Task', 'Write something to achieve!');
      return;
    }

    if (editId) {
      setGoals((currentGoals) =>
        currentGoals.map((g) => (g.id === editId ? { ...g, text: enteredGoal } : g))
      );
      setEditId(null);
    } else {
      setGoals((currentGoals) => [
        { id: Math.random().toString(), text: enteredGoal, completed: false },
        ...currentGoals,
      ]);
    }
    setEnteredGoal('');
    Keyboard.dismiss();
  };

  const deleteGoalHandler = (id) => {
    setGoals((currentGoals) => currentGoals.filter((goal) => goal.id !== id));
  };

  const toggleComplete = (id) => {
    setGoals(currentGoals => 
      currentGoals.map(g => g.id === id ? {...g, completed: !g.completed} : g)
    );
  };

  // المكون أصبح View عادي بدون أنيمايشن "تغيير الحجم"
  const GoalItem = ({ item }) => {
    return (
      <View style={styles.goalCard}>
        <TouchableOpacity 
          style={styles.goalContent} 
          onPress={() => toggleComplete(item.id)}
          activeOpacity={0.7}
        >
          <View style={[styles.checkCircle, item.completed && styles.checkedCircle]}>
            {item.completed && <Text style={styles.checkIcon}>✓</Text>}
          </View>
          <Text style={[styles.goalText, item.completed && styles.completedText]}>
            {item.text}
          </Text>
        </TouchableOpacity>
        
        <View style={styles.actionRow}>
          <TouchableOpacity 
            onPress={() => { setEnteredGoal(item.text); setEditId(item.id); }} 
            style={styles.editBtn}
          >
            <Text style={styles.editBtnText}>✎</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => deleteGoalHandler(item.id)} 
            style={styles.deleteBtn}
          >
            <Text style={styles.deleteBtnText}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerSubtitle}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' })}
        </Text>
        <Text style={styles.headerTitle}>My Daily <Text style={{color: '#6366f1'}}>Goals</Text></Text>
      </View>

      <FlatList
        data={goals}
        renderItem={({ item }) => <GoalItem item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🎯</Text>
            <Text style={styles.emptyText}>Your list is empty. Start crushing goals!</Text>
          </View>
        }
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputWrapper}
      >
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="I want to..."
            placeholderTextColor="#94a3b8"
            style={styles.textInput}
            onChangeText={setEnteredGoal}
            value={enteredGoal}
            blurOnSubmit={false} 
          />
          <TouchableOpacity 
            style={[styles.mainActionBtn, editId ? styles.updateBtn : styles.addBtn]} 
            onPress={addOrEditGoalHandler}
          >
            <Text style={styles.mainActionBtnText}>{editId ? '✓' : '+'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#0f172a' },
  headerContainer: { paddingTop: 60, paddingHorizontal: 25, marginBottom: 20 },
  headerSubtitle: { color: '#64748b', fontSize: 14, fontWeight: '600', textTransform: 'uppercase' },
  headerTitle: { color: '#f8fafc', fontSize: 32, fontWeight: '800', marginTop: 5 },
  
  listContainer: { paddingHorizontal: 20, paddingBottom: 120 },
  
  goalCard: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    // ظل ثابت ورصين
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  goalContent: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  checkCircle: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#6366f1', marginRight: 12, justifyContent: 'center', alignItems: 'center' },
  checkedCircle: { backgroundColor: '#6366f1', borderColor: '#6366f1' },
  checkIcon: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  goalText: { color: '#f1f5f9', fontSize: 16, fontWeight: '500' },
  completedText: { textDecorationLine: 'line-through', color: '#64748b' },

  actionRow: { flexDirection: 'row', gap: 10 },
  editBtn: { padding: 8 },
  editBtnText: { color: '#6366f1', fontSize: 18 },
  deleteBtn: { padding: 8 },
  deleteBtnText: { color: '#ef4444', fontSize: 18 },

  inputWrapper: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    padding: 20, 
    backgroundColor: 'rgba(15, 23, 42, 0.95)' // خلفية أغمق قليلاً للتركيز
  },
  inputContainer: { 
    flexDirection: 'row', 
    backgroundColor: '#1e293b', 
    borderRadius: 25, 
    padding: 8, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4f46e5' 
  },
  textInput: { flex: 1, color: '#f8fafc', paddingHorizontal: 20, fontSize: 16, height: 45 },
  mainActionBtn: { width: 45, height: 45, borderRadius: 22.5, justifyContent: 'center', alignItems: 'center' },
  addBtn: { backgroundColor: '#6366f1' },
  updateBtn: { backgroundColor: '#10b981' },
  mainActionBtnText: { color: '#fff', fontSize: 24, fontWeight: '300' },

  emptyState: { alignItems: 'center', marginTop: 100 },
  emptyEmoji: { fontSize: 60, marginBottom: 10 },
  emptyText: { color: '#64748b', fontSize: 16, textAlign: 'center' }
});