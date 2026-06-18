"use client";

import { useEffect, useState } from "react";

import { api } from "@/lib/api";
import TaskForm from "@/components/TaskForm";
import TaskCard from "@/components/TaskCard";
import FilterBar from "@/components/FilterBar";

import { Task } from "@/types/task";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [priority, setPriority] = useState("All");
  const [status, setStatus] = useState("All");

  const fetchTasks = async () => {
    const res = await api.get("/tasks");
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter((task) => {
    const priorityMatch = priority === "All" || task.priority === priority;
    const statusMatch = status === "All" || task.status === status;
    return priorityMatch && statusMatch;
  });

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  return (
    <main className="min-h-screen p-4 sm:p-6 md:p-8 flex flex-col items-center select-none">
      <div className="w-full max-w-7xl flex flex-col gap-6">
        {/* Floating Navbar */}
        <header className="flex justify-end ">
          <div>
            <button
              onClick={handleCreateTask}
              className="bg-[#2563eb] hover:bg-[#1d4ed8] active:bg-[#1e40af] text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-md shadow-[#2563eb]/20 transition-all duration-200 cursor-pointer flex items-center gap-1.5"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Task
            </button>
          </div>
        </header>

        {/* Filters Panel */}
        <FilterBar
          priority={priority}
          setPriority={setPriority}
          status={status}
          setStatus={setStatus}
        />

        {/* Task Cards Responsive Grid */}
        {filteredTasks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                refreshTasks={fetchTasks}
                onEdit={handleEditTask}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white/40 backdrop-blur-sm rounded-[32px] border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.01)]">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-4">
              <svg
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-700">No tasks found</h3>
            <p className="text-slate-500 text-sm mt-1 max-w-sm">
              Try modifying your filters above or create a new task to get
              started.
            </p>
          </div>
        )}

        {/* Task Form Modal overlay */}
        <TaskForm
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          refreshTasks={fetchTasks}
          editingTask={editingTask}
          setEditingTask={setEditingTask}
        />
      </div>
    </main>
  );
}
