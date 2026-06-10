import {
  canWriteSupabaseFromServer,
  insertJobApplicationFromServer as insertJobApplication,
  insertLeadFromServer as insertLead,
  listRecentRenderHistoryFromServer as listRecentRenderHistory,
  countRenderHistoryInWindowFromServer as countRenderHistoryInWindow,
  deleteRenderHistoryFromServer as deleteRenderHistory,
  getAppSettingFromServer as getAppSetting,
  setAppSettingFromServer as setAppSetting,
  upsertRenderHistoryFromServer as upsertRenderHistory,
} from './siteStore.mjs';

export { canWriteSupabaseFromServer };

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

export async function listRecentRenderHistoryFromServer(userId: string, limit = 12): Promise<unknown[]> {
  return (listRecentRenderHistory as (userId: string, limit?: number) => Promise<unknown[]>)(userId, limit);
}

export async function countRenderHistoryInWindowFromServer(
  userId: string,
  startAt: string,
  endAt: string,
): Promise<number> {
  return (countRenderHistoryInWindow as (
    userId: string,
    startAt: string,
    endAt: string,
  ) => Promise<number>)(userId, startAt, endAt);
}

export async function upsertRenderHistoryFromServer(data: Record<string, unknown>): Promise<unknown> {
  return (upsertRenderHistory as (data: Record<string, unknown>) => Promise<unknown>)(data);
}

export async function deleteRenderHistoryFromServer(data: Record<string, unknown>): Promise<unknown> {
  return (deleteRenderHistory as (data: Record<string, unknown>) => Promise<unknown>)(data);
}
