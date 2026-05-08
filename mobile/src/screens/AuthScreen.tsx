import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { loginRequest, signupRequest } from "../api/client";
import { useAuth } from "../context/AuthContext";

type Mode = "login" | "signup";

export const AuthScreen = () => {
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { setSession } = useAuth();

  const loginMutation = useMutation({
    mutationFn: loginRequest,
    onSuccess: async (data) => {
      await setSession(data.token, data.user);
    },
    onError: (err: Error) => setError(err.message)
  });

  const signupMutation = useMutation({
    mutationFn: signupRequest,
    onSuccess: async (data) => {
      await setSession(data.token, data.user);
    },
    onError: (err: Error) => setError(err.message)
  });

  const onSubmit = () => {
    setError(null);
    if (!email.trim() || !password.trim() || (mode === "signup" && !name.trim())) {
      setError("Please fill all required fields");
      return;
    }

    if (mode === "login") {
      loginMutation.mutate({ email: email.trim(), password });
    } else {
      signupMutation.mutate({ name: name.trim(), email: email.trim(), password });
    }
  };

  const isLoading = loginMutation.isPending || signupMutation.isPending;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Task Tracker</Text>
      <Text style={styles.subHeading}>{mode === "login" ? "Login to continue" : "Create your account"}</Text>

      {mode === "signup" && (
        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
          autoCapitalize="words"
        />
      )}

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <Pressable style={styles.button} onPress={onSubmit} disabled={isLoading}>
        {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{mode === "login" ? "Login" : "Signup"}</Text>}
      </Pressable>

      <Pressable onPress={() => setMode(mode === "login" ? "signup" : "login")}>
        <Text style={styles.switchText}>
          {mode === "login" ? "No account? Signup" : "Already have an account? Login"}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 6
  },
  subHeading: {
    color: "#6b7280",
    marginBottom: 20
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12
  },
  button: {
    backgroundColor: "#2563eb",
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 12,
    marginTop: 4
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600"
  },
  switchText: {
    textAlign: "center",
    marginTop: 16,
    color: "#1d4ed8"
  },
  error: {
    color: "#dc2626",
    marginBottom: 8
  }
});
