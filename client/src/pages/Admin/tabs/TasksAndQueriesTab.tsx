import React, { useState } from "react";
import {
  CheckCircle2,
  AlertCircle,
  Plus,
  Send,
  MessageSquare,
  Clock,
  Check,
  Sparkles,
} from "lucide-react";
import { ManagementTask, GuestQuery } from "../types";

interface TasksAndQueriesTabProps {
  tasks: ManagementTask[];
  queries: GuestQuery[];
  onToggleTask: (id: string) => void;
  onAddTask: (title: string, category: string) => void;
  onSendReply: (queryId: string, reply: string) => void;
}

export const TasksAndQueriesTab: React.FC<TasksAndQueriesTabProps> = ({
  tasks,
  queries,
  onToggleTask,
  onAddTask,
  onSendReply,
}) => {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState("Concierge");
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    onAddTask(newTaskTitle.trim(), newTaskCategory);
    setNewTaskTitle("");
  };

  const handleReplyChange = (queryId: string, text: string) => {
    setReplyInputs((prev) => ({ ...prev, [queryId]: text }));
  };

  const handleReplySubmit = (queryId: string) => {
    const text = replyInputs[queryId];
    if (!text || !text.trim()) return;
    onSendReply(queryId, text.trim());
    setReplyInputs((prev) => ({ ...prev, [queryId]: "" }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* COLUMN 1: OPERATIONS & CONCIERGE TASKS */}
      <div className="bg-white rounded-3xl border border-[#EBEBEB] p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#F2F2F2]">
          <div>
            <h3 className="text-base font-bold font-syne text-[#222222]">
              Operations & Housekeeping Checklist
            </h3>
            <p className="text-xs text-[#717171]">
              Daily suite preparations, cedar spa maintenance, and VIP concierge tasks
            </p>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-[#F7F7F8] text-[#222222] text-xs font-bold">
            {tasks.filter((t) => !t.completed).length} pending
          </span>
        </div>

        {/* Add Task Input Form */}
        <form onSubmit={handleTaskSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="Add a new operational task..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="flex-1 px-3.5 py-2 rounded-xl border border-[#E5E5E5] text-xs focus:outline-none focus:border-[#222222]"
          />
          <select
            value={newTaskCategory}
            onChange={(e) => setNewTaskCategory(e.target.value)}
            className="px-2.5 py-2 rounded-xl border border-[#E5E5E5] bg-white text-xs text-[#4A4A4A] focus:outline-none"
          >
            <option value="Concierge">Concierge</option>
            <option value="Housekeeping">Housekeeping</option>
            <option value="Maintenance">Maintenance</option>
          </select>
          <button
            type="submit"
            className="px-3.5 py-2 rounded-xl bg-[#222222] hover:bg-black text-white text-xs font-bold flex items-center gap-1 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </form>

        {/* Tasks List */}
        <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => onToggleTask(task.id)}
              className={`p-3.5 rounded-2xl border transition flex items-start justify-between gap-3 cursor-pointer ${
                task.completed
                  ? "bg-[#FAFAFA] border-[#F0F0F0] opacity-60"
                  : "bg-white border-[#EBEBEB] hover:border-[#D4D4D4] shadow-xs"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-5 h-5 rounded-md border flex items-center justify-center mt-0.5 transition ${
                    task.completed
                      ? "bg-[#1E7E34] border-[#1E7E34] text-white"
                      : "border-[#D4D4D4] bg-white"
                  }`}
                >
                  {task.completed && <Check className="w-3.5 h-3.5" />}
                </div>
                <div>
                  <span
                    className={`block text-xs font-semibold text-[#222222] leading-snug ${
                      task.completed ? "line-through text-[#999999]" : ""
                    }`}
                  >
                    {task.title}
                  </span>
                  <span className="text-[10px] text-[#717171] mt-0.5 block">
                    {task.category} • Due: {task.due}
                  </span>
                </div>
              </div>

              {task.urgent && !task.completed && (
                <span className="px-2 py-0.5 rounded-full bg-[#FFEBEF] text-[#FF385C] text-[9px] uppercase font-bold tracking-wider shrink-0">
                  Urgent
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* COLUMN 2: GUEST INQUIRIES & MESSAGING */}
      <div className="bg-white rounded-3xl border border-[#EBEBEB] p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#F2F2F2]">
          <div>
            <h3 className="text-base font-bold font-syne text-[#222222]">
              Guest Inquiries & Direct Requests
            </h3>
            <p className="text-xs text-[#717171]">
              Private messages from upcoming visitors regarding reservations & experiences
            </p>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-[#FFEBEF] text-[#FF385C] text-xs font-bold">
            {queries.filter((q) => q.status === "pending").length} awaiting reply
          </span>
        </div>

        {/* Inquiries Feed */}
        <div className="space-y-4 max-h-[560px] overflow-y-auto pr-1">
          {queries.map((q) => {
            const isResolved = q.status === "resolved";
            return (
              <div
                key={q.id}
                className="p-4 rounded-2xl border border-[#EBEBEB] bg-[#FAFAFA] space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={q.avatar}
                      alt={q.guestName}
                      className="w-8 h-8 rounded-full object-cover border border-[#EBEBEB]"
                    />
                    <div>
                      <span className="font-bold text-xs text-[#222222] block leading-none">
                        {q.guestName}
                      </span>
                      <span className="text-[10px] text-[#717171] mt-0.5 block">
                        Interested in: <strong>{q.roomName}</strong>
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isResolved ? "bg-[#EAF8ED] text-[#1E7E34]" : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {isResolved ? "Resolved" : "Pending"}
                  </span>
                </div>

                <p className="text-xs text-[#4A4A4A] bg-white p-3 rounded-xl border border-[#EBEBEB] leading-relaxed">
                  "{q.message}"
                </p>

                {q.reply && (
                  <div className="pl-3 border-l-2 border-[#FF385C] py-1">
                    <span className="text-[10px] font-bold text-[#FF385C] block">Host Reply:</span>
                    <p className="text-xs text-[#222222] italic">"{q.reply}"</p>
                  </div>
                )}

                {/* Reply Composer if pending */}
                {!isResolved && (
                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Type personal response to guest..."
                      value={replyInputs[q.id] || ""}
                      onChange={(e) => handleReplyChange(q.id, e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-xl border border-[#E5E5E5] bg-white text-xs focus:outline-none focus:border-[#222222]"
                    />
                    <button
                      type="button"
                      onClick={() => handleReplySubmit(q.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#FF385C] hover:bg-[#E00B41] text-white text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                    >
                      <Send className="w-3 h-3" />
                      <span>Reply</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TasksAndQueriesTab;
