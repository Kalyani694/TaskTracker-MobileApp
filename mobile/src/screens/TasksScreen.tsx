import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { createTaskRequest, deleteTaskRequest, fetchTasksRequest, updateTaskRequest } from "../api/client";
import { TaskItem } from "../components/TaskItem";
import { useAuth } from "../context/AuthContext";
import type { Task, TaskFilter } from "../types";

const TASKS_QUERY_KEY = ["tasks"];

export const TasksScreen = () => {
  const { token, user, clearSession } = useAuth();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [localError, setLocalError] = useState<string | null>(null);

  const tasksQuery = useQuery({
    queryKey: TASKS_QUERY_KEY,
    queryFn: () => fetchTasksRequest(token || ""),
    enabled: Boolean(token)
  });

  const createMutation = useMutation({
    mutationFn: (payload: { title: string; description?: string }) => createTaskRequest(token || "", payload),
    onSuccess: () => {
      setTitle("");
      setDescription("");
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
    },
    onError: (error: Error) => setLocalError(error.message)
  });

  const updateMutation = useMutation({
    mutationFn: (params: { id: string; payload: { title?: string; description?: string; completed?: boolean } }) =>
      updateTaskRequest(token || "", params.id, params.payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY }),
    onError: (error: Error) => setLocalError(error.message)
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTaskRequest(token || "", id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY }),
    onError: (error: Error) => setLocalError(error.message)
  });

  const filteredTasks = useMemo(() => {
    const allTasks = tasksQuery.data || [];
    if (filter === "completed") return allTasks.filter((t) => t.completed);
    if (filter === "pending") return allTasks.filter((t) => !t.completed);
    return allTasks;
  }, [tasksQuery.data, filter]);

  const onCreate = () => {
    setLocalError(null);
    if (!title.trim()) {
      setLocalError("Task title is required");
      return;
    }
    createMutation.mutate({ title: title.trim(), description: description.trim() });
  };

  if (tasksQuery.isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (tasksQuery.isError) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Failed to load tasks</Text>
        <Pressable style={styles.retryBtn} onPress={() => tasksQuery.refetch()}>
          <Text style={styles.retryTxt}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Hi, {user?.name}</Text>
        <Pressable onPress={clearSession}>
          <Text style={styles.logout}>Logout</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <TextInput placeholder="Task title" value={title} onChangeText={setTitle} style={styles.input} />
        <TextInput
          placeholder="Description (optional)"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
        />
        <Pressable style={styles.createBtn} onPress={onCreate} disabled={createMutation.isPending}>
          <Text style={styles.createTxt}>{createMutation.isPending ? "Creating..." : "Create Task"}</Text>
        </Pressable>
      </View>

      <View style={styles.filters}>
        {(["all", "pending", "completed"] as TaskFilter[]).map((item) => (
          <Pressable
            key={item}
            style={[styles.filterBtn, filter === item && styles.filterBtnActive]}
            onPress={() => setFilter(item)}
          >
            <Text style={[styles.filterTxt, filter === item && styles.filterTxtActive]}>{item}</Text>
          </Pressable>
        ))}
      </View>

      {localError && <Text style={styles.error}>{localError}</Text>}

      <FlatList
        data={filteredTasks}
        keyExtractor={(item: Task) => item._id}
        contentContainerStyle={filteredTasks.length === 0 ? styles.emptyContainer : undefined}
        refreshControl={
          <RefreshControl refreshing={tasksQuery.isRefetching} onRefresh={() => tasksQuery.refetch()} />
        }
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onToggleComplete={(task) =>
              updateMutation.mutate({ id: task._id, payload: { completed: !task.completed } })
            }
            onDelete={(id) => deleteMutation.mutate(id)}
            onUpdate={(id, payload) => updateMutation.mutate({ id, payload })}
          />
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No tasks yet. Add your first task.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight || 0) + 14 : 18
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  heading: {
    fontSize: 22,
    fontWeight: "700"
  },
  logout: {
    color: "#dc2626",
    fontWeight: "600"
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 2
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 8
  },
  createBtn: {
    backgroundColor: "#2563eb",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center"
  },
  createTxt: {
    color: "#fff",
    fontWeight: "600"
  },
  filters: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10
  },
  filterBtn: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  filterBtnActive: {
    backgroundColor: "#1d4ed8",
    borderColor: "#1d4ed8"
  },
  filterTxt: {
    textTransform: "capitalize",
    color: "#374151"
  },
  filterTxtActive: {
    color: "#fff"
  },
  error: {
    color: "#dc2626",
    marginBottom: 8
  },
  retryBtn: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 8
  },
  retryTxt: {
    color: "#fff"
  },
  emptyContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  emptyText: {
    color: "#6b7280"
  }
});
