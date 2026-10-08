import { submitIndexingNotifications } from '@/lib/google/indexing';

export type IndexingStatus =
  | 'Published'
  | 'Indexing submission pending'
  | 'Submitted'
  | 'Indexed, when verifiable'
  | 'Submission failed'
  | 'Error'
  | 'Retry required';

export type IndexingRecord = {
  articleUrl: string;
  publishedAt: string;
  submissionTimestamp: string | null;
  status: IndexingStatus;
  errorMessage: string | null;
  retryCount: number;
};

// In-memory or local store for tracking indexing status across API sessions
const INDEXING_REGISTRY = new Map<string, IndexingRecord>();

export function getIndexingRecord(url: string): IndexingRecord {
  if (INDEXING_REGISTRY.has(url)) {
    return INDEXING_REGISTRY.get(url)!;
  }
  return {
    articleUrl: url,
    publishedAt: new Date().toISOString(),
    submissionTimestamp: null,
    status: 'Published',
    errorMessage: null,
    retryCount: 0,
  };
}

export function updateIndexingRecord(record: IndexingRecord): void {
  INDEXING_REGISTRY.set(record.articleUrl, record);
}

export function getAllIndexingRecords(): IndexingRecord[] {
  return Array.from(INDEXING_REGISTRY.values());
}

/** Automatically submits an article URL to Google Indexing API and updates tracking status */
export async function submitArticleForIndexing(articleUrl: string): Promise<IndexingRecord> {
  const publishedAt = new Date().toISOString();
  let record: IndexingRecord = {
    articleUrl,
    publishedAt,
    submissionTimestamp: null,
    status: 'Indexing submission pending',
    errorMessage: null,
    retryCount: 0,
  };

  updateIndexingRecord(record);

  try {
    const result = await submitIndexingNotifications([articleUrl], 'URL_UPDATED');
    const now = new Date().toISOString();

    if (result.ok && result.submittedCount > 0) {
      record = {
        ...record,
        submissionTimestamp: now,
        status: 'Submitted',
        errorMessage: null,
      };
    } else {
      const msg = result.warning || result.results?.[0]?.message || 'Google Indexing submission rejected';
      record = {
        ...record,
        submissionTimestamp: now,
        status: record.retryCount < 3 ? 'Retry required' : 'Submission failed',
        errorMessage: msg,
        retryCount: record.retryCount + 1,
      };
    }
  } catch (err: any) {
    const now = new Date().toISOString();
    record = {
      ...record,
      submissionTimestamp: now,
      status: record.retryCount < 3 ? 'Retry required' : 'Error',
      errorMessage: err.message || 'Network error during Google Indexing API submission',
      retryCount: record.retryCount + 1,
    };
  }

  updateIndexingRecord(record);
  return record;
}

