const express = require("express");
const Task = require("../models/Task");
const { authMiddleware } = require("../middleware/auth");

const router = express.Router();

router.use(authMiddleware);

router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.json(tasks);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch tasks" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ message: "title is required" });
    }

    const task = await Task.create({
      user: req.user.id,
      title: title.trim(),
      description: description?.trim() || "",
      completed: false
    });

    return res.status(201).json(task);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create task" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const payload = {};

    if (typeof req.body.title === "string") {
      if (!req.body.title.trim()) {
        return res.status(400).json({ message: "title cannot be empty" });
      }
      payload.title = req.body.title.trim();
    }

    if (typeof req.body.description === "string") {
      payload.description = req.body.description.trim();
    }

    if (typeof req.body.completed === "boolean") {
      payload.completed = req.body.completed;
    }

    const updated = await Task.findOneAndUpdate({ _id: id, user: req.user.id }, payload, {
      new: true,
      runValidators: true
    });

    if (!updated) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update task" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Task.findOneAndDelete({ _id: id, user: req.user.id });

    if (!deleted) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete task" });
  }
});

module.exports = router;
