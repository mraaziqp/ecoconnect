export interface RegistryApp {
  id: string;
  name: string;
  category: "productivity" | "utility" | "community" | "sandbox" | "core";
  logo: string; // Lucide icon name
  shortDesc: string;
  longDesc: string;
  developerOnly: boolean; // Accessible only by developer profile
  status: "active" | "development" | "beta";
  launchCount: number;
}

export interface UserProfile {
  id: string;
  name: string;
  role: "Developer" | "Collaborator" | "Family Member" | "Partner";
  avatar: string; // Tailwind bg color class or emoji
  allowedCategories: string[];
}

export interface VaultKey {
  id: string;
  name: string;
  value: string;
  updatedAt: string;
  appId?: string;
}

export interface EventLog {
  id: string;
  timestamp: string;
  appSource: string;
  eventType: string; // e.g. "auth_success", "budget_update", "habit_completed", "server_reboot"
  message: string;
  payload: any;
}
