// GitHub 저장소를 가져와 상태에 저장하고, 상태가 바뀔 때마다 화면을 다시 그린다.
(() => {
  const endpoint = 'https://api.github.com/users/ChoiMari/repos?per_page=100&sort=updated';
  const filters = document.querySelector('#project-filters');
  const count = document.querySelector('#project-count');
  const status = document.querySelector('#project-status');
  const grid = document.querySelector('#project-grid');

  if (!filters || !count || !status || !grid) return;

  const projectState = STATE.projects;

  function createFilter(label) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'filter-button';
    button.textContent = label;
    button.setAttribute('aria-pressed', String(projectState.filter === label));
    button.addEventListener('click', () => {
      projectState.filter = label;
      renderProjects();
    });
    return button;
  }

  function createCard(repo) {
    const card = document.createElement('article');
    card.className = 'project-card';

    const heading = document.createElement('h3');
    const link = document.createElement('a');
    const safeUrl = new URL(repo.html_url);
    link.href = safeUrl.protocol === 'https:' && safeUrl.hostname === 'github.com'
      ? safeUrl.href
      : 'https://github.com/ChoiMari';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = repo.name;
    heading.append(link);

    const description = document.createElement('p');
    description.className = 'project-description';
    description.textContent = repo.description || '설명이 등록되지 않은 저장소입니다.';

    const meta = document.createElement('div');
    meta.className = 'project-meta';
    const language = document.createElement('span');
    language.textContent = repo.language || '기타';
    const stars = document.createElement('span');
    stars.textContent = `★ ${repo.stargazers_count}`;
    meta.append(language, stars);

    card.append(heading, description, meta);
    return card;
  }

  function renderProjects() {
    const { status: phase, items, filter, error } = projectState;
    const languages = ['전체', ...new Set(items.map((repo) => repo.language || '기타'))];
    const visible = filter === '전체'
      ? items
      : items.filter((repo) => (repo.language || '기타') === filter);

    filters.replaceChildren(...languages.map(createFilter));
    grid.replaceChildren();
    status.replaceChildren();
    count.textContent = phase === 'success' ? `${visible.length}개 프로젝트` : '';

    if (phase === 'loading') {
      // 개발자가 직접 작성한 고정 마크업에만 innerHTML을 사용한다.
      // GitHub API 값은 createCard()에서 textContent로 출력한다.
      status.innerHTML = '<span class="project-spinner" aria-hidden="true"></span><span>GitHub 프로젝트를 불러오는 중입니다…</span>';
      return;
    }
    if (phase === 'error') {
      const message = document.createElement('p');
      message.textContent = error;
      const retry = document.createElement('button');
      retry.type = 'button';
      retry.className = 'button button-outline';
      retry.textContent = '다시 시도';
      retry.addEventListener('click', loadProjects);
      status.append(message, retry);
      return;
    }
    if (phase === 'empty') {
      status.textContent = '표시할 프로젝트가 없습니다.';
      return;
    }
    if (phase === 'success' && visible.length === 0) {
      status.textContent = '이 언어에 해당하는 프로젝트가 없습니다.';
      return;
    }
    if (phase === 'success') {
      grid.replaceChildren(...visible.map(createCard));
    }
  }

  async function loadProjects() {
    if (projectState.status === 'loading') return;
    projectState.status = 'loading';
    projectState.error = '';
    renderProjects();

    try {
      const response = await fetch(endpoint, {
        headers: { Accept: 'application/vnd.github+json' },
      });
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('프로젝트를 불러올 수 없습니다. GitHub 요청 제한에 도달했습니다. 잠시 후 다시 시도해 주세요.');
        }
        throw new Error(`프로젝트를 불러올 수 없습니다. (HTTP ${response.status})`);
      }
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error('프로젝트를 불러올 수 없습니다. GitHub 응답 형식이 올바르지 않습니다.');

      projectState.items = data;
      projectState.filter = '전체';
      projectState.status = projectState.items.length ? 'success' : 'empty';
    } catch (error) {
      projectState.status = 'error';
      projectState.error = error instanceof Error && error.message.startsWith('프로젝트를 불러올 수 없습니다.')
        ? error.message
        : '프로젝트를 불러올 수 없습니다. 네트워크 상태를 확인한 뒤 다시 시도해 주세요.';
    }
    renderProjects();
  }

  renderProjects();
  loadProjects();
})();
