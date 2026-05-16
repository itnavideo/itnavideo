import {
  canWriteSupabaseFromServer,
  deleteUserProjectFromServer as deleteProject,
  insertLeadFromServer as insertLead,
  listUserProjectsFromServer as listProjects,
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

export async function insertLeadFromServer(tableName: 'waitlist' | 'newsletter', data: Record<string, unknown>): Promise<void> {
  await insertLead(tableName, data);
}
