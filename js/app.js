/* ================================================================
   StreakDayscore · js/app.js
   github.com/Mihai-gitto/streakdayscore
   ================================================================ */

'use strict';

/* ── Zone config ── */
const ZONES = {
  spirituality: { col: 'var(--c-spirit)',  bg: 'var(--c-spirit-bg)',  textCol: 'var(--c-spirit-text)',  label: 'Spirituality' },
  health:       { col: 'var(--c-sport)',   bg: 'var(--c-sport-bg)',   textCol: 'var(--c-sport-text)',   label: 'Health' },
  professional: { col: 'var(--c-pro)',     bg: 'var(--c-pro-bg)',     textCol: 'var(--c-pro-text)',     label: 'Professional' },
  family:       { col: 'var(--c-fam)',     bg: 'var(--c-fam-bg)',     textCol: 'var(--c-fam-text)',     label: 'Family' },
  other:        { col: 'var(--c-other)',   bg: 'var(--c-other-bg)',   textCol: 'var(--c-other-text)',   label: 'Other' },
};

const ZONE_TITLES = {
  all:          'All',
  spirituality: 'Spirituality',
  health:       'Health & Sport',
  professional: 'Professional',
  family:       'Family & Relations',
  other:        'Other',
};

/* ── Default data (first run) ── */
const DEFAULT_STATE = {
  habits: [
    { id: 1, name: 'Read the Bible',              zone: 'spirituality', pts: 10, note: '10–15 min in the morning' },
    { id: 2, name: 'Workout / Exercise',           zone: 'health',       pts: 15, note: 'Follow weekly training plan' },
    { id: 3, name: 'Watch a learning video',       zone: 'professional', pts: 8,  note: 'Any topic, any domain' },
    { id: 4, name: 'Quality time with family',     zone: 'family',       pts: 10, note: 'Present, no phone' },
  ],
  tasks: [
    { id: 100, name: 'Read a book for 20 min', zone: 'professional', pts: 8, deadline: '', note: '' },
    { id: 101, name: 'Evening prayer',         zone: 'spirituality', pts: 7, deadline: '', note: '' },
  ],
  done:    {},  // { "YYYY-MM-DD": { itemId: true } }
  totalXP: 0,
  level:   1,
};

/* ── App state ── */
let state;
let activeZone = 'all';
let modalType  = 'habit';
let editId     = null;

/* ── Storage ── */
const STORAGE_KEY = 'streakdayscore_v1';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    state = raw ? JSON.parse(raw) : structuredClone(DEFAULT_STATE);
  } catch {
    state = structuredClone(DEFAULT_STATE);
  }
}

function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* storage full */ }
}

/* ── Utilities ── */
function today() {
  return new Date().toISOString().split('T')[0];
}

function uid() {
  return Date.now() + Math.floor(Math.random() * 9999);
}

function escHtml(str) {
  return String(str)
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;');
}

function todayDone() {
  return state.done[today()] || {};
}

/* ── XP & Level ── */
const XP_PER_LEVEL = 100;

function computeLevel(xp)     { return Math.floor(xp / XP_PER_LEVEL) + 1; }
function xpInCurrentLevel(xp) { return xp % XP_PER_LEVEL; }
function xpToNextLevel(xp)    { return XP_PER_LEVEL - xpInCurrentLevel(xp); }

/* ── Filtered lists ── */
function filteredHabits() {
  return activeZone === 'all' ? state.habits : state.habits.filter(h => h.zone === activeZone);
}
function filteredTasks() {
  return activeZone === 'all' ? state.tasks : state.tasks.filter(t => t.zone === activeZone);
}

/* ── Build item HTML ── */
function buildItemHTML(item, type) {
  const z         = ZONES[item.zone] || ZONES.other;
  const done      = !!todayDone()[item.id];
  const doneClass = done ? ' done' : '';
  const checkIcon = done ? '<i class="ti ti-check" aria-hidden="true"></i>' : '';

  const deadlineStr = item.deadline ? ` · ${escHtml(item.deadline)}` : '';
  const noteStr     = item.note     ? ` · ${escHtml(item.note)}`     : '';

  return `
    <div class="item-card${doneClass}"
         data-id="${item.id}"
         data-pts="${item.pts}"
         data-type="${type}"
         role="checkbox"
         aria-checked="${done}"
         tabindex="0">
      <div class="check-circle">${checkIcon}</div>
      <div class="zone-pip" style="background:${z.col}" aria-hidden="true"></div>
      <div class="item-info">
        <div class="item-name">${escHtml(item.name)}</div>
        <div class="item-sub">${z.label}${deadlineStr}${noteStr}</div>
      </div>
      <div class="pts-badge" style="background:${z.bg}; color:${z.textCol}">
        ${item.pts} XP
      </div>
      <div class="item-actions">
        <button class="act-btn edit-btn" data-id="${item.id}" data-type="${type}" aria-label="Edit">
          <i class="ti ti-edit" aria-hidden="true"></i>
        </button>
        <button class="act-btn del-btn" data-id="${item.id}" data-type="${type}" aria-label="Delete">
          <i class="ti ti-trash" aria-hidden="true"></i>
        </button>
      </div>
    </div>`;
}

/* ── Render ── */
function renderList(items, containerId, type) {
  const el = document.getElementById(containerId);
  if (!items.length) {
    el.innerHTML = `<div class="empty-state">No ${type === 'habit' ? 'habits' : 'tasks'} yet — add one ↑</div>`;
    return;
  }
  el.innerHTML = items.map(it => buildItemHTML(it, type)).join('');
}

function renderStats() {
  const done  = todayDone();
  const all   = [...state.habits, ...state.tasks];
  const doneN = all.filter(i => done[i.id]).length;
  const ptsN  = all.filter(i => done[i.id]).reduce((s, i) => s + i.pts, 0);
  const pct   = all.length ? Math.round(doneN / all.length * 100) : 0;

  document.getElementById('st-done').textContent = doneN;
  document.getElementById('st-pts').textContent  = ptsN;
  document.getElementById('st-pct').textContent  = pct + '%';

  const xp  = state.totalXP || 0;
  const lvl = computeLevel(xp);
  state.level = lvl;

  document.getElementById('level-n').textContent     = lvl;
  document.getElementById('xp-label').textContent    = `${xp} XP total`;
  document.getElementById('xp-next-lbl').textContent = `next level: ${xpToNextLevel(xp)} XP`;
  document.getElementById('xp-fill').style.width     = xpInCurrentLevel(xp) + '%';
  document.getElementById('streak-lbl').textContent  =
    pct > 0 ? `🔥 ${pct}% completed today` : "Check off your first item today!";
}

function render() {
  renderList(filteredHabits(), 'habits-list', 'habit');
  renderList(filteredTasks(),  'tasks-list',  'task');
  renderStats();
}

/* ── Toggle done ── */
function markDone(id, pts) {
  const d = today();
  if (!state.done[d]) state.done[d] = {};
  state.done[d][id] = true;
  state.totalXP = (state.totalXP || 0) + pts;
  saveState();
  render();
  showToast(`+${pts} XP 🎯`);
}

function unmark(id, pts) {
  const d = today();
  if (state.done[d]) delete state.done[d][id];
  state.totalXP = Math.max(0, (state.totalXP || 0) - pts);
  saveState();
  render();
  showToast('Check removed');
}

/* ── List click handler ── */
function handleListClick(e, arrayKey) {
  const card    = e.target.closest('.item-card');
  const delBtn  = e.target.closest('.del-btn');
  const editBtn = e.target.closest('.edit-btn');

  if (!card) return;
  e.stopPropagation();

  const id   = +card.dataset.id;
  const pts  = +card.dataset.pts;
  const type = card.dataset.type;

  if (delBtn) {
    if (!confirm('Delete this item?')) return;
    state[arrayKey] = state[arrayKey].filter(x => x.id !== id);
    Object.keys(state.done).forEach(day => delete state.done[day][id]);
    saveState();
    render();
    return;
  }

  if (editBtn) {
    openModal(type, id);
    return;
  }

  if (todayDone()[id]) unmark(id, pts);
  else markDone(id, pts);
}

/* ── Zone filter ── */
function setZone(zone) {
  activeZone = zone;
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.z === zone);
  });
  document.getElementById('zone-title').textContent = ZONE_TITLES[zone] || 'All';
  render();
}

/* ── Modal ── */
function openModal(type, id = null) {
  modalType = type;
  editId    = id;

  const isTask = type === 'task';

  document.getElementById('modal-heading').textContent =
    id
      ? (isTask ? 'Edit Task'  : 'Edit Habit')
      : (isTask ? 'New Task'   : 'New Habit');

  document.getElementById('f-deadline-wrap').style.display = isTask ? 'block' : 'none';

  if (id) {
    const arr  = isTask ? state.tasks : state.habits;
    const item = arr.find(x => x.id === id);
    if (item) {
      document.getElementById('f-name').value     = item.name;
      document.getElementById('f-zone').value     = item.zone;
      document.getElementById('f-pts').value      = item.pts;
      document.getElementById('f-note').value     = item.note     || '';
      document.getElementById('f-deadline').value = item.deadline || '';
    }
  } else {
    document.getElementById('f-name').value     = '';
    document.getElementById('f-zone').value     = 'spirituality';
    document.getElementById('f-pts').value      = 5;
    document.getElementById('f-note').value     = '';
    document.getElementById('f-deadline').value = '';
  }

  document.getElementById('modal').style.display = 'flex';
  setTimeout(() => document.getElementById('f-name').focus(), 50);
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
  editId = null;
}

function saveModal() {
  const name = document.getElementById('f-name').value.trim();
  if (!name) { document.getElementById('f-name').focus(); return; }

  const obj = {
    name,
    zone:     document.getElementById('f-zone').value,
    pts:      Math.min(20, Math.max(1, parseInt(document.getElementById('f-pts').value) || 5)),
    note:     document.getElementById('f-note').value.trim(),
    deadline: document.getElementById('f-deadline').value,
  };

  const arrayKey = modalType === 'task' ? 'tasks' : 'habits';

  if (editId) {
    const idx = state[arrayKey].findIndex(x => x.id === editId);
    if (idx > -1) state[arrayKey][idx] = { ...state[arrayKey][idx], ...obj };
  } else {
    obj.id = uid();
    state[arrayKey].push(obj);
  }

  saveState();
  closeModal();
  render();
  showToast(editId ? 'Saved ✓' : 'Added ✓');
}

/* ── Toast ── */
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

/* ── Date header ── */
function setDateHeader() {
  document.getElementById('today-date').textContent = new Date().toLocaleDateString('en-US', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

/* ── Init ── */
function init() {
  loadState();
  setDateHeader();
  render();

  /* Sidebar navigation */
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => setZone(btn.dataset.z));
  });

  /* Add buttons */
  document.getElementById('add-habit-btn').addEventListener('click', () => openModal('habit'));
  document.getElementById('add-task-btn').addEventListener('click',  () => openModal('task'));

  /* Lists */
  document.getElementById('habits-list').addEventListener('click', e => handleListClick(e, 'habits'));
  document.getElementById('tasks-list').addEventListener('click',  e => handleListClick(e, 'tasks'));

  /* Keyboard — space/enter on cards */
  document.addEventListener('keydown', e => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('.item-card')) {
      e.preventDefault();
      e.target.closest('.item-card').click();
    }
  });

  /* Modal controls */
  document.getElementById('modal-cancel').addEventListener('click', closeModal);
  document.getElementById('modal-save').addEventListener('click',   saveModal);
  document.getElementById('modal').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal();
  });
  document.getElementById('f-name').addEventListener('keydown', e => {
    if (e.key === 'Enter') saveModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
}

document.addEventListener('DOMContentLoaded', init);
