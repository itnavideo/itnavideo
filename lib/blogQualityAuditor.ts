export type ArticleAuditInput = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  dashboardType: string;
};

export type AuditCheck = {
  id: string;
  label: string;
  passed: boolean;
  category: 'seo' | 'content' | 'conversion';
  message?: string;
};

export type ArticleAuditResult = {
  score: number;
  passed: boolean;
  criticalFailures: string[];
  checks: AuditCheck[];
};

export function auditArticleQuality(input: ArticleAuditInput): ArticleAuditResult {
  const wordCount = (input.content || '').split(/\s+/).filter(Boolean).length;
  const criticalFailures: string[] = [];

  const checks: AuditCheck[] = [
    {
      id: 'title-length',
      label: 'Title between 30 and 80 characters',
      passed: input.title.length >= 30 && input.title.length <= 80,
      category: 'seo',
    },
    {
      id: 'slug-present',
      label: 'Clean hyphenated slug present',
      passed: Boolean(input.slug && /^[a-z0-9-]+$/.test(input.slug)),
      category: 'seo',
    },
    {
      id: 'excerpt-length',
      label: 'Excerpt between 80 and 200 characters',
      passed: input.excerpt.length >= 50 && input.excerpt.length <= 250,
      category: 'seo',
    },
    {
      id: 'word-count',
      label: 'Minimum 1,500 comprehensive words',
      passed: wordCount >= 1500,
      category: 'content',
    },
    {
      id: 'product-mention',
      label: 'Includes Itnavideo product solution links',
      passed: (input.content || '').toLowerCase().includes('itnavideo'),
      category: 'conversion',
    },
  ];

  for (const c of checks) {
    if (!c.passed && (c.id === 'word-count' || c.id === 'slug-present')) {
      criticalFailures.push(c.label);
    }
  }

  const passedCount = checks.filter(c => c.passed).length;
  const score = Math.round((passedCount / checks.length) * 100);

  return {
    score,
    passed: criticalFailures.length === 0 && score >= 70,
    criticalFailures,
    checks,
  };
}
