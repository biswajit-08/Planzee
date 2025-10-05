import ToDo from "../models/todoModel.js";

export const createToDo = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const userId = req.userId;

    if (!title) return res.status(400).json({ message: "Title is required!" });

    const newToDo = await new ToDo({ title, description, status, userId }).save();

    return res.status(201).json({ success: true, todo: newToDo });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getToDos = async (req, res) => {
  try {
    const todos = await ToDo.find({ userId: req.userId });
    return res.status(200).json({ success: true, count: todos.length, todos });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateToDo = async (req, res) => {
  try {
    const updatedTodo = await ToDo.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedTodo) return res.status(404).json({ message: "To-Do not found or not yours" });

    return res.status(200).json({ success: true, todo: updatedTodo });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteToDo = async (req, res) => {
  try {
    const todo = await ToDo.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!todo) return res.status(404).json({ message: "To-Do not found or not yours" });

    return res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
