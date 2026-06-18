export interface Task {
  _id: string;
  title: string;
  description: string;
  priority: "High" | "Medium" | "Low";
  dueDate?: string;
  status: "Pending" | "Completed";
}
