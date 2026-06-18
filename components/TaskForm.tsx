"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Task } from "@/types/task";
import toast from "react-hot-toast";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  refreshTasks: () => void;
  editingTask: Task | null;
  setEditingTask: (task: Task | null) => void;
}

export default function TaskForm({
  isOpen,
  onClose,
  refreshTasks,
  editingTask,
  setEditingTask,
}: Props) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "Medium",
    dueDate: "",
  });

  const [errors, setErrors] = useState({
    title: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      title: "",
      description: "",
    };

    if (!form.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!form.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (newErrors.title || newErrors.description) {
      setErrors(newErrors);
      return;
    }

    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask._id}`, form);
        toast.success("Task updated successfully");
        setEditingTask(null);
      } else {
        await api.post("/tasks", form);
        toast.success("Task created successfully");
      }

      setForm({
        title: "",
        description: "",
        priority: "Medium",
        dueDate: "",
      });

      refreshTasks();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  const handleDelete = async () => {
    if (!editingTask) return;
    try {
      await api.delete(`/tasks/${editingTask._id}`);
      toast.success("Task deleted successfully");
      setEditingTask(null);
      refreshTasks();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete task");
    }
  };

  useEffect(() => {
    if (editingTask) {
      setForm({
        title: editingTask.title,
        description: editingTask.description,
        priority: editingTask.priority,
        dueDate: editingTask.dueDate?.split("T")[0] || "",
      });
    } else {
      setForm({
        title: "",
        description: "",
        priority: "Medium",
        dueDate: "",
      });
    }
    setErrors({ title: "", description: "" });
  }, [editingTask, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-all duration-300">
      {/* Backdrop tap to close */}
      <div className="absolute inset-0 cursor-default" onClick={onClose} />

      <div className="bg-white rounded-[32px] w-full max-w-lg p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.15)] relative transform transition-all duration-300 scale-100 flex flex-col gap-6 border border-slate-100 z-10">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-800">
            {editingTask ? "Edit Task" : "Create New Task"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Title</label>
            <input
              type="text"
              placeholder="Task Title (e.g. Content Optimizer)"
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400 text-sm font-semibold text-slate-700 bg-slate-50/50"
              value={form.title}
              onChange={(e) =>
                setForm({
                  ...form,
                  title: e.target.value,
                })
              }
            />
            {errors.title && <p className="text-red-500 text-xs mt-1.5 font-medium pl-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</label>
            <textarea
              placeholder="Provide detail on what needs to be done..."
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400 text-sm font-medium text-slate-700 bg-slate-50/50 h-28 resize-none"
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1.5 font-medium pl-1">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Priority</label>
              <select
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm font-semibold text-slate-700 bg-slate-50/50 cursor-pointer"
                value={form.priority}
                onChange={(e) =>
                  setForm({
                    ...form,
                    priority: e.target.value,
                  })
                }
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Due Date</label>
              <input
                type="date"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm font-semibold text-slate-700 bg-slate-50/50 cursor-pointer"
                value={form.dueDate}
                onChange={(e) =>
                  setForm({
                    ...form,
                    dueDate: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-4 border-t border-slate-100">
            {editingTask ? (
              <button
                type="button"
                onClick={handleDelete}
                className="px-5 py-3 bg-red-50 hover:bg-red-100 active:bg-red-200 text-red-600 rounded-full text-xs font-bold transition-all cursor-pointer border border-red-100 flex items-center justify-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Task
              </button>
            ) : (
              <div />
            )}

            <div className="flex gap-2 sm:self-end w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="w-1/2 sm:w-auto px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full text-xs font-bold transition-all cursor-pointer text-center"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-1/2 sm:w-auto px-6 py-3 bg-[#2563eb] hover:bg-[#1d4ed8] active:bg-[#1e40af] text-white rounded-full text-xs font-bold shadow-md shadow-[#2563eb]/20 transition-all cursor-pointer text-center"
              >
                {editingTask ? "Save Changes" : "Create Task"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

