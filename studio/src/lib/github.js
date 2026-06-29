function encodeContentPath(path) {
  return path.split('/').map((segment) => encodeURIComponent(segment)).join('/');
}

function bytesToBase64(bytes) {
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

function utf8ToBase64(text) {
  return bytesToBase64(new TextEncoder().encode(text));
}

function githubHeaders(token) {
  return {
    authorization: `Bearer ${token}`,
    accept: 'application/vnd.github+json',
    'content-type': 'application/json',
    'x-github-api-version': '2022-11-28',
    'user-agent': 'cuong-ngo-studio',
  };
}

async function githubRequest(env, path, init = {}) {
  const token = env.GITHUB_TOKEN;
  if (!token) {
    throw new Error('Missing GITHUB_TOKEN secret');
  }

  const response = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      ...githubHeaders(token),
      ...(init.headers || {}),
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub API error ${response.status}: ${text}`);
  }

  return response.json();
}

export function buildTargetPath(env, slug) {
  return `${env.GITHUB_CONTENT_DIR}/${slug}.md`;
}

export async function getRepoFile(env, path) {
  const token = env.GITHUB_TOKEN;
  if (!token) {
    throw new Error('Missing GITHUB_TOKEN secret');
  }

  const response = await fetch(
    `https://api.github.com/repos/${env.GITHUB_REPOSITORY}/contents/${encodeContentPath(path)}?ref=${encodeURIComponent(env.GITHUB_BRANCH)}`,
    {
      headers: githubHeaders(token),
    },
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub API error ${response.status}: ${text}`);
  }

  return response.json();
}

export async function listPublishedSlugs(env) {
  const items = await githubRequest(
    env,
    `/repos/${env.GITHUB_REPOSITORY}/contents/${encodeContentPath(env.GITHUB_CONTENT_DIR)}?ref=${encodeURIComponent(env.GITHUB_BRANCH)}`,
  );

  return items
    .filter((item) => item.type === 'file' && item.name.endsWith('.md'))
    .map((item) => item.name.replace(/\.md$/, ''));
}

export async function publishArtifactToGitHub(env, { slug, artifact, title, actorEmail }) {
  const targetPath = buildTargetPath(env, slug);
  const current = await getRepoFile(env, targetPath);
  const payload = {
    message: `${current ? 'update' : 'publish'}(blog): ${title || slug}`,
    content: utf8ToBase64(artifact),
    branch: env.GITHUB_BRANCH,
    committer: {
      name: 'Cuong Ngo Studio',
      email: actorEmail || 'info@cuong.ngo',
    },
    author: {
      name: 'Cuong Ngo Studio',
      email: actorEmail || 'info@cuong.ngo',
    },
  };

  if (current?.sha) {
    payload.sha = current.sha;
  }

  const result = await githubRequest(
    env,
    `/repos/${env.GITHUB_REPOSITORY}/contents/${encodeContentPath(targetPath)}`,
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    },
  );

  return {
    path: targetPath,
    commitSha: result.commit?.sha || null,
    url: result.content?.html_url || null,
  };
}
