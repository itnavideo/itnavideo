import {
  canWriteSupabaseFromServer,
  deleteUserProjectFromServer as deleteProject,
  deleteExpiredProjectRecordsFromServer as deleteExpiredProjectRecords,
  insertJobApplicationFromServer as insertJobApplication,
  insertLeadFromServer as insertLead,
  listExpiredRenderedProjectsFromServer as listExpiredRenderedProjects,
  listUserProjectsFromServer as listProjects,
  getAppSettingFromServer as getAppSetting,
  setAppSettingFromServer as setAppSetting,
  upsertUserProjectFromServer as upsertProject,
} from './projectStore.mjs';

export { canWriteSupabaseFromServer };

export type UserProjectRecord = {
  id: string;
  ownerId: string;
  title?: string;
  status?: string;
  progress?: number;
  style?: string;
  quality?: string;
  voiceUrl?: string;
  voiceoverUrl?: string;
  visualUrl?: string;
  videoUrl?: string;
  renderUrl?: string;
  renderProvider?: string;
  timelineScenes?: number;
  captions?: number;
  durationSeconds?: number;
  userAssets?: unknown;
  timeline?: unknown;
  error?: string;
  createdAt?: string;
  updatedAt?: string;
  completedAt?: string;
  expiresAt?: string;
};

export async function listUserProjectsFromServer(userId: string): Promise<UserProjectRecord[]> {
  return listProjects(userId) as Promise<UserProjectRecord[]>;
}

export async function upsertUserProjectFromServer(
  userId: string,
  projectId: string,
  data: Record<string, unknown>,
): Promise<UserProjectRecord> {
  return upsertProject(userId, projectId, data) as Promise<UserProjectRecord>;
}

export async function deleteUserProjectFromServer(userId: string, projectId: string): Promise<void> {
  await deleteProject(userId, projectId);
}

export async function listExpiredRenderedProjectsFromServer(
  maxAgeMs?: number,
  limit?: number,
): Promise<UserProjectRecord[]> {
  return listExpiredRenderedProjects(maxAgeMs, limit) as Promise<UserProjectRecord[]>;
}

export async function deleteExpiredProjectRecordsFromServer(
  projectIds: string[],
): Promise<{ projectsDeleted: number; jobsDeleted: number }> {
  return deleteExpiredProjectRecords(projectIds) as Promise<{ projectsDeleted: number; jobsDeleted: number }>;
}

export async function insertLeadFromServer(tableName: 'waitlist' | 'newsletter', data: Record<string, unknown>): Promise<void> {
  await insertLead(tableName, data);
}

export async function insertJobApplicationFromServer(data: Record<string, unknown>): Promise<unknown> {
  return insertJobApplication(data);
}

export async function getAppSettingFromServer<T = unknown>(key: string, fallbackValue: T): Promise<T> {
  return (getAppSetting as (settingKey: string, fallback: unknown) => Promise<unknown>)(key, fallbackValue) as Promise<T>;
}

export async function setAppSettingFromServer(
  key: string,
  value: unknown,
  updatedBy = 'system',
): Promise<unknown> {
  return (setAppSetting as (settingKey: string, settingValue: unknown, updatedBy: string) => Promise<unknown>)(key, value, updatedBy);
}
