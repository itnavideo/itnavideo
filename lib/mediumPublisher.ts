export type MediumPublishInput = {
  title: string;
  contentMarkdown: string;
  canonicalUrl?: string;
  tags?: string[];
  publishStatus?: 'public' | 'draft' | 'unlisted';
};

export type MediumPublishResponse = {
  ok: boolean;
  url?: string;
  error?: string;
};

export async function publishToMedium(input: MediumPublishInput): Promise<MediumPublishResponse> {
  const token = process.env.MEDIUM_INTEGRATION_TOKEN;
  if (!token) {
    return { ok: false, error: 'MEDIUM_INTEGRATION_TOKEN not configured' };
  }

  try {
    // 1. Fetch user ID
    const userRes = await fetch('https://api.medium.com/v1/me', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (!userRes.ok) {
      return { ok: false, error: `Failed to fetch Medium user: ${userRes.statusText}` };
    }

    const userData = await userRes.json();
    const authorId = userData.data?.id;

    if (!authorId) {
      return { ok: false, error: 'Invalid Medium author profile' };
    }

    // 2. Post article
    const postRes = await fetch(`https://api.medium.com/v1/users/${authorId}/posts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        title: input.title,
        contentFormat: 'markdown',
        content: input.contentMarkdown,
        canonicalUrl: input.canonicalUrl,
        tags: (input.tags || []).slice(0, 5),
        publishStatus: input.publishStatus || 'public',
      }),
    });

    if (!postRes.ok) {
      const errBody = await postRes.text();
      return { ok: false, error: `Failed to publish story to Medium: ${errBody}` };
    }

    const postData = await postRes.json();
    return { ok: true, url: postData.data?.url };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Network error while publishing to Medium' };
  }
}
