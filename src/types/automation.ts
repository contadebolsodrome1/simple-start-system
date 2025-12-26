export type AutomationTriggerType = "webhook" | "schedule" | "event" | "manual";

export type AutomationStatus = "active" | "inactive";

export type AutomationActionType = "send_whatsapp" | "create_client" | "update_process" | "notify_team";

export interface AutomationAction {
  id: string;
  type: AutomationActionType;
  name?: string;
  whatsappTemplate?: string;
  whatsappRecipientId?: string;
  createClientPayload?: string;
  notifyType?: string;
}

export interface Automation {
  id: string;
  name: string;
  description?: string;
  triggerType: AutomationTriggerType;
  triggerConfig?: string;
  actions: AutomationAction[];
  status: AutomationStatus;
  createdAt: string; // ISO string
}
