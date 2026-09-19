import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import api, { Room, roomsApi, HostMetrics } from "../../lib/api";
import { NavTab, ManagementTask, GuestQuery, BookingRecord, NewRoomFormData } from "./types";

import AdminHeader from "./components/AdminHeader";
import AdminSidebar from "./components/AdminSidebar";
import AddRoomModal from "./components/AddRoomModal";

import OverviewTab from "./tabs/OverviewTab";
import SuitesTab from "./tabs/SuitesTab";
import BookingsTab from "./tabs/BookingsTab";
import TasksAndQueriesTab from "./tabs/TasksAndQueriesTab";
import AnalyticsTab from "./tabs/AnalyticsTab";
import GeneralSettingsTab from "./tabs/GeneralSettingsTab";

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<NavTab>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);
  const [showNotificationToast, setShowNotificationToast] = useState(false);

  // Authenticated host profile details
  const currentEmail = user?.email || "";
  const currentName = user?.name || "Host";

  // Data states from PostgreSQL & Redis Cache
  const [rooms, setRooms] = useState<Room[]>([]);
  const [tasks, setTasks] = useState<ManagementTask[]>([]);
  const [queries, setQueries] = useState<GuestQuery[]>([]);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [metrics, setMetrics] = useState<HostMetrics | null>(null);

  // Initial Data Hydration
  useEffect(() => {
    // 1. Fetch Rooms from API / Database
    roomsApi.getAll().then((data) => {
      if (Array.isArray(data)) {
        setRooms(data);
      }
    });

    // 2. Fetch Host Metrics
    roomsApi.getHostMetrics().then((m) => {
      if (m) setMetrics(m);
    });

    // 3. Fetch Operational Tasks
    api
      .get<{ success: boolean; data: any[] }>(`/rooms/host/tasks?hostEmail=${currentEmail}`)
      .then((res) => {
        if (Array.isArray(res.data?.data)) {
          setTasks(
            res.data.data.map((t: any) => ({
              id: t.id,
              title: t.title,
              category: t.suite || "Concierge",
              due: t.due || "Today",
              urgent: t.priority === "urgent",
              completed: t.completed,
            }))
          );
        }
      })
      .catch(() => {});

    // 4. Fetch Guest Inquiries
    api
      .get<{ success: boolean; data: any[] }>(`/rooms/host/queries?hostEmail=${currentEmail}`)
      .then((res) => {
        if (Array.isArray(res.data?.data)) {
          setQueries(
            res.data.data.map((q: any) => ({
              id: q.id,
              guestName: q.guestName,
              roomName: q.roomName,
              avatar: "",
              message: q.message,
              timestamp: q.date,
              status: q.status,
              reply: q.reply,
            }))
          );
        }
      })
      .catch(() => {});

    // 5. Fetch Bookings
    api
      .get<{ success: boolean; data: any[] }>("/rooms/host/bookings")
      .then((res) => {
        if (Array.isArray(res.data?.data)) {
          setBookings(res.data.data);
        }
      })
      .catch(() => {});
  }, [currentEmail]);

  // Filter host's suites based on authenticated user
  const hostRooms = useMemo(() => {
    if (!currentEmail) return rooms;
    if (user?.role === "MANAGER") return rooms;
    return rooms.filter((r) => r.hostEmail === currentEmail);
  }, [rooms, currentEmail, user?.role]);

  // Host Action: Create a New Room
  const handleCreateRoom = async (formData: NewRoomFormData) => {
    const res = await api.post("/rooms/host/new", {
      ...formData,
      hostEmail: currentEmail,
      hostName: currentName,
    });

    if (res.data?.data) {
      setRooms((prev) => [res.data.data, ...prev]);
    }
  };

  // Host Action: Toggle Room Status (Active vs Maintenance)
  const handleToggleStatus = async (id: string, currentStatus?: string) => {
    const nextStatus = currentStatus === "maintenance" ? "active" : "maintenance";
    setRooms((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: nextStatus as any } : r))
    );
    await roomsApi.toggleRoomStatus(id, nextStatus).catch(() => {});
  };

  // Host Action: Toggle Task Completion
  const handleToggleTask = (id: string) => {
    const target = tasks.find((t) => t.id === id);
    const nextVal = target ? !target.completed : false;
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: nextVal } : t))
    );
    api.patch(`/rooms/host/tasks/${id}`, { completed: nextVal }).catch(() => {});
  };

  // Host Action: Add New Operational Task
  const handleAddTask = (title: string, category: string) => {
    const newTask: ManagementTask = {
      id: `task-${Date.now()}`,
      title,
      category,
      due: "Today",
      completed: false,
    };
    setTasks((prev) => [newTask, ...prev]);

    api
      .post("/rooms/host/tasks", {
        title: newTask.title,
        suite: newTask.category,
        due: newTask.due,
        hostEmail: currentEmail,
      })
      .catch(() => {});
  };

  // Host Action: Send Reply to Guest Inquiry
  const handleSendReply = (queryId: string, reply: string) => {
    setQueries((prev) =>
      prev.map((q) => (q.id === queryId ? { ...q, status: "resolved", reply } : q))
    );
    api.post(`/rooms/host/queries/${queryId}/reply`, { reply }).catch(() => {});
  };

  const pendingTasksCount = tasks.filter((t) => !t.completed).length;
  const pendingQueriesCount = queries.filter((q) => q.status === "pending").length;

  return (
    <div className="min-h-screen bg-[#F7F7F8] text-[#222222] font-sans flex flex-col">
      {/* 1. TOP HEADER NAVIGATION */}
      <AdminHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        pendingCount={pendingTasksCount + pendingQueriesCount}
        onToggleNotification={() => setShowNotificationToast(!showNotificationToast)}
        onOpenAddRoomModal={() => setIsAddRoomModalOpen(true)}
        hostName={currentName}
        hostEmail={currentEmail}
      />

      {/* 2. WORKSPACE LAYOUT (SIDEBAR + CONTENT CANVAS) */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        {/* Left Sidebar */}
        <AdminSidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          suitesCount={hostRooms.length}
          bookingsCount={bookings.length || 14}
          pendingTasksCount={pendingTasksCount}
        />

        {/* Right Content Canvas */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {activeTab === "overview" && (
            <OverviewTab
              metrics={metrics}
              rooms={hostRooms}
              tasks={tasks}
              queries={queries}
              onNavigateToTab={setActiveTab}
              onOpenAddRoomModal={() => setIsAddRoomModalOpen(true)}
            />
          )}

          {activeTab === "services" && (
            <SuitesTab
              rooms={hostRooms}
              onToggleStatus={handleToggleStatus}
              onOpenAddRoomModal={() => setIsAddRoomModalOpen(true)}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === "bookings" && (
            <BookingsTab bookings={bookings} searchQuery={searchQuery} />
          )}

          {activeTab === "notifications" && (
            <TasksAndQueriesTab
              tasks={tasks}
              queries={queries}
              onToggleTask={handleToggleTask}
              onAddTask={handleAddTask}
              onSendReply={handleSendReply}
            />
          )}

          {activeTab === "commissions" || activeTab === "payouts" || activeTab === "analytics" ? (
            <AnalyticsTab metrics={metrics} />
          ) : null}

          {(activeTab === "policies" || activeTab === "approvals" || activeTab === "providers" || activeTab === "customers" || activeTab === "disputes") && (
            <GeneralSettingsTab hostEmail={currentEmail} hostName={currentName} />
          )}
        </main>
      </div>

      {/* 3. ADD NEW SANCTUARY MODAL */}
      <AddRoomModal
        isOpen={isAddRoomModalOpen}
        onClose={() => setIsAddRoomModalOpen(false)}
        onSubmit={handleCreateRoom}
        hostEmail={currentEmail}
        hostName={currentName}
      />
    </div>
  );
};

export default AdminDashboard;
