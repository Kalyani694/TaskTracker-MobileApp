import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import type { Task } from "../types";

type Props = {
  task: Task;
  onToggleComplete: (task: Task) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, payload: { title?: string; description?: string; completed?: boolean }) => void;
};

export const TaskItem = ({ task, onToggleComplete, onDelete, onUpdate }: Props) => {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [completed, setCompleted] = useState(task.completed);

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description || "");
    setCompleted(task.completed);
  }, [task.title, task.description, task.completed]);

  const saveEdit = () => {
    if (!title.trim()) {
      return;
    }
    onUpdate(task._id, { title: title.trim(), description: description.trim(), completed });
    setEditing(false);
  };

  return (
    <View style={styles.card}>
      {editing ? (
        <>
          <TextInput value={title} onChangeText={setTitle} style={styles.input} placeholder="Title" />
          <TextInput
            value={description}
            onChangeText={setDescription}
            style={styles.input}
            placeholder="Description (optional)"
          />
          <View style={styles.statusRow}>
            <Pressable
              style={[styles.statusBtn, !completed && styles.statusBtnActive]}
              onPress={() => setCompleted(false)}
            >
              <Text style={[styles.statusTxt, !completed && styles.statusTxtActive]}>Pending</Text>
            </Pressable>
            <Pressable
              style={[styles.statusBtn, completed && styles.statusBtnActive]}
              onPress={() => setCompleted(true)}
            >
              <Text style={[styles.statusTxt, completed && styles.statusTxtActive]}>Completed</Text>
            </Pressable>
          </View>
          <View style={styles.row}>
            <Pressable style={styles.secondaryBtn} onPress={() => setEditing(false)}>
              <Text>Cancel</Text>
            </Pressable>
            <Pressable style={styles.primaryBtn} onPress={saveEdit}>
              <Text style={styles.primaryTxt}>Save</Text>
            </Pressable>
          </View>
        </>
      ) : (
        <>
          <Pressable onPress={() => onToggleComplete(task)}>
            <Text style={[styles.title, task.completed && styles.completed]}>{task.title}</Text>
          </Pressable>
          {!!task.description && <Text style={styles.desc}>{task.description}</Text>}
          <Text style={styles.meta}>{new Date(task.createdAt).toLocaleString()}</Text>
          <View style={styles.row}>
            <Pressable style={styles.secondaryBtn} onPress={() => setEditing(true)}>
              <Text>Edit</Text>
            </Pressable>
            <Pressable style={styles.dangerBtn} onPress={() => onDelete(task._id)}>
              <Text style={styles.primaryTxt}>Delete</Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10
  },
  title: {
    fontSize: 16,
    fontWeight: "600"
  },
  completed: {
    textDecorationLine: "line-through",
    color: "#6b7280"
  },
  desc: {
    color: "#4b5563",
    marginTop: 4
  },
  meta: {
    marginTop: 8,
    color: "#9ca3af",
    fontSize: 12
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 10
  },
  primaryBtn: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8
  },
  dangerBtn: {
    backgroundColor: "#dc2626",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8
  },
  secondaryBtn: {
    backgroundColor: "#e5e7eb",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8
  },
  primaryTxt: {
    color: "#fff",
    fontWeight: "600"
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 8
  },
  statusRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8
  },
  statusBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: "center"
  },
  statusBtnActive: {
    backgroundColor: "#1d4ed8",
    borderColor: "#1d4ed8"
  },
  statusTxt: {
    color: "#374151",
    fontWeight: "500"
  },
  statusTxtActive: {
    color: "#fff"
  }
});
