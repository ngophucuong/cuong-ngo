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


function base64ToUtf8(content = '') {
  const clean = content.replace(/\s/g, '');
  const binary = atob(clean);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return new TextDecoder().decode(bytes);
}

function assertSafeSlug(slug) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error('Invalid published post slug');
  }
}

function extractFrontmatter(markdown = '') {
  const match = markdown.match(/^---\n([\s\S]*?)\n---/);
  return match ? match[1] : '';
}

function readFrontmatterValue(frontmatter, key) {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
  if (!match) {
    return '';
  }

  const value = match[1].trim();
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    try {
      return JSON.parse(value);
    } catch {
      return value.slice(1, -1);
    }
  }

  return value;
}

function summarizeMarkdown(slug, markdown) {
  const frontmatter = extractFrontmatter(markdown);
  return {
    slug,
    title: readFrontmatterValue(frontmatter, 'title') || slug,
    date: readFrontmatterValue(frontmatter, 'date'),
    description: readFrontmatterValue(frontmatter, 'description'),
  };
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

async function createGitBlob(env, content, encoding = 'utf-8') {
  return githubRequest(env, `/repos/${env.GITHUB_REPOSITORY}/git/blobs`, {
    method: 'POST',
    body: JSON.stringify({ content, encoding }),
  });
}

function githubIdentity(actorEmail) {
  return {
    name: 'Cuong Ngo Studio',
    email: actorEmail || 'info@cuong.ngo',
  };
}

function normalizeRepoPath(path) {
  return String(path || '').replace(/^\/+/, '');
}

async function commitFilesToGitHub(env, { message, files, actorEmail }) {
  const branch = env.GITHUB_BRANCH;
  const identity = githubIdentity(actorEmail);
  const headRef = await githubRequest(
    env,
    `/repos/${env.GITHUB_REPOSITORY}/git/ref/heads/${encodeURIComponent(branch)}`,
  );
  const headSha = headRef.object?.sha;
  if (!headSha) {
    throw new Error('GitHub branch head not found');
  }

  const headCommit = await githubRequest(
    env,
    `/repos/${env.GITHUB_REPOSITORY}/git/commits/${headSha}`,
  );
  const treeEntries = [];

  for (const file of files) {
    const repoPath = normalizeRepoPath(file.path);
    if (!repoPath) {
      throw new Error('Missing GitHub file path');
    }

    const blob = file.encoding === 'base64'
      ? await createGitBlob(env, file.content, 'base64')
      : await createGitBlob(env, String(file.content || ''), 'utf-8');

    treeEntries.push({
      path: repoPath,
      mode: '100644',
      type: 'blob',
      sha: blob.sha,
    });
  }

  const tree = await githubRequest(env, `/repos/${env.GITHUB_REPOSITORY}/git/trees`, {
    method: 'POST',
    body: JSON.stringify({
      base_tree: headCommit.tree?.sha,
      tree: treeEntries,
    }),
  });

  const commit = await githubRequest(env, `/repos/${env.GITHUB_REPOSITORY}/git/commits`, {
    method: 'POST',
    body: JSON.stringify({
      message,
      tree: tree.sha,
      parents: [headSha],
      author: identity,
      committer: identity,
    }),
  });

  await githubRequest(env, `/repos/${env.GITHUB_REPOSITORY}/git/refs/heads/${encodeURIComponent(branch)}`, {
    method: 'PATCH',
    body: JSON.stringify({ sha: commit.sha }),
  });

  return commit;
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

export async function publishArtifactToGitHub(env, { slug, artifact, title, actorEmail, assets = [] }) {
  const targetPath = buildTargetPath(env, slug);
  const current = await getRepoFile(env, targetPath);
  const message = `${current ? 'update' : 'publish'}(blog): ${title || slug}`;

  if (!assets.length) {
    const identity = githubIdentity(actorEmail);
    const payload = {
      message,
      content: utf8ToBase64(artifact),
      branch: env.GITHUB_BRANCH,
      committer: identity,
      author: identity,
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
      assetPaths: [],
    };
  }

  const files = [
    { path: targetPath, content: artifact, encoding: 'utf-8' },
    ...assets.map((asset) => ({
      path: asset.path,
      content: bytesToBase64(asset.content || new Uint8Array()),
      encoding: 'base64',
    })),
  ];
  const commit = await commitFilesToGitHub(env, { message, files, actorEmail });

  return {
    path: targetPath,
    commitSha: commit.sha || null,
    url: `https://github.com/${env.GITHUB_REPOSITORY}/blob/${env.GITHUB_BRANCH}/${targetPath}`,
    assetPaths: assets.map((asset) => normalizeRepoPath(asset.path)),
  };
}


export async function listPublishedPosts(env) {
  const items = await githubRequest(
    env,
    `/repos/${env.GITHUB_REPOSITORY}/contents/${encodeContentPath(env.GITHUB_CONTENT_DIR)}?ref=${encodeURIComponent(env.GITHUB_BRANCH)}`,
  );

  const files = items.filter((item) => item.type === 'file' && item.name.endsWith('.md'));
  const posts = await Promise.all(files.map(async (item) => {
    const file = await getRepoFile(env, `${env.GITHUB_CONTENT_DIR}/${item.name}`);
    const markdown = file?.content ? base64ToUtf8(file.content) : '';
    const slug = item.name.replace(/\.md$/, '');
    const summary = summarizeMarkdown(slug, markdown);

    return {
      ...summary,
      path: `${env.GITHUB_CONTENT_DIR}/${item.name}`,
      sha: file?.sha || item.sha || '',
      htmlUrl: file?.html_url || item.html_url || '',
    };
  }));

  return posts.sort((a, b) => {
    const dateOrder = String(b.date || '').localeCompare(String(a.date || ''));
    return dateOrder || String(a.title || a.slug).localeCompare(String(b.title || b.slug));
  });
}

export async function recallPublishedPostFromGitHub(env, { slug, actorEmail }) {
  assertSafeSlug(slug);
  const targetPath = buildTargetPath(env, slug);
  const current = await getRepoFile(env, targetPath);
  if (!current?.sha) {
    throw new Error('Published post not found');
  }

  const result = await githubRequest(
    env,
    `/repos/${env.GITHUB_REPOSITORY}/contents/${encodeContentPath(targetPath)}`,
    {
      method: 'DELETE',
      body: JSON.stringify({
        message: `recall(blog): ${slug}`,
        sha: current.sha,
        branch: env.GITHUB_BRANCH,
        committer: {
          name: 'Cuong Ngo Studio',
          email: actorEmail || 'info@cuong.ngo',
        },
        author: {
          name: 'Cuong Ngo Studio',
          email: actorEmail || 'info@cuong.ngo',
        },
      }),
    },
  );

  return {
    path: targetPath,
    commitSha: result.commit?.sha || null,
  };
}
