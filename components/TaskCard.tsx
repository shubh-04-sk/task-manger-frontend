"use client";

import { api } from "@/lib/api";
import { Task } from "@/types/task";
import toast from "react-hot-toast";

interface Props {
  task: Task;
  refreshTasks: () => void;
  onEdit: (task: Task) => void;
}

export default function TaskCard({ task, refreshTasks, onEdit }: Props) {
  const toggleComplete = async () => {
    if (task.status === "Completed") {
      try {
        await api.put(`/tasks/${task._id}`, {
          title: task.title,
          description: task.description,
          priority: task.priority,
          dueDate: task.dueDate,
          status: "Pending",
        });
        toast.success("Task reopened");
        refreshTasks();
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to update task");
      }
    } else {
      try {
        await api.patch(`/tasks/${task._id}/complete`);
        toast.success("Task completed!");
        refreshTasks();
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to complete task");
      }
    }
  };

  // Select icon styling based on priority
  const getPriorityStyle = () => {
    switch (task.priority) {
      case "High":
        return {
          bg: "bg-rose-50 border border-rose-100",
          text: "text-rose-500",
          icon: (
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          ),
        };
      case "Medium":
        return {
          bg: "bg-amber-50 border border-amber-100",
          text: "text-amber-600",
          icon: (
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          ),
        };
      default: // Low
        return {
          bg: "bg-emerald-50 border border-emerald-100",
          text: "text-emerald-500",
          icon: (
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 13l-7 7-7-7m14-6l-7 7-7-7"
              />
            </svg>
          ),
        };
    }
  };

  const priorityStyle = getPriorityStyle();

  return (
    <div className="bg-white rounded-[32px] p-6 sm:p-7 shadow-[0_10px_35px_rgba(15,23,42,0.02)] border border-slate-100 flex flex-col justify-between hover:shadow-[0_15px_40px_rgba(15,23,42,0.06)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
      {/* Top Header Card Info */}
      <div>
        <div className="flex justify-between items-center">
          {/* Pastel Priority Icon */}
          <div
            className={`w-10 h-10 rounded-[14px] flex items-center justify-center ${priorityStyle.bg} ${priorityStyle.text}`}
          >
            {priorityStyle.icon}
          </div>

          {/* Edit/Pencil Button */}
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-full transition-all duration-200 cursor-pointer"
            aria-label="Edit task"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </button>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold tracking-tight text-slate-800 mt-5 leading-snug group-hover:text-blue-600 transition-colors duration-200">
          {task.title}
        </h3>

        {/* Description */}
        <p className="text-slate-500 text-xs sm:text-sm font-medium mt-2 leading-relaxed line-clamp-3">
          {task.description}
        </p>
      </div>

      {/* Due Date & Bottom Completion Toggle */}
      <div className="mt-5 pt-4 border-t border-slate-50">
        {task.dueDate && (
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>
              Due{" "}
              {new Date(task.dueDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        )}

        {/* Completion Pill Button */}
        <button
          onClick={toggleComplete}
          className={`w-full py-3 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
            task.status === "Completed"
              ? "bg-emerald-50 hover:bg-emerald-100/80 text-emerald-600 border border-emerald-100/50"
              : "bg-slate-100/80 hover:bg-slate-200/80 text-slate-600 hover:text-slate-700"
          }`}
        >
          {task.status === "Completed" ? (
            <>
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Completed
            </>
          ) : (
            "Complete Task"
          )}
        </button>
      </div>
    </div>
  );
}
