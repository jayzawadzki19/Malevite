import { Injectable, signal, computed } from '@angular/core';

type CheckupMetric = { name: string; value: number };
type CheckupEntry = { date: string; morningErectionDown: boolean; metrics: CheckupMetric[] };

type DailyTask = { id: string; description: string; color: string };
type DailyTaskState = { id: string; done: boolean };

type WeeklyGoal = { id: string; label: string; target: number; xp: number; progress: number; completed: boolean; xpAwarded: boolean };

@Injectable({ providedIn: 'root' })
export class ScoringService {
  private readonly STORAGE_KEYS = {
    checkups: 'malevite.checkups',
    totalXp: 'malevite.totalXp',
    dailyTasksPrefix: 'malevite.dailyTasks.',
    weeklyGoalsPrefix: 'malevite.weeklyGoals.',
    areaScores: 'malevite.areaScores'
  } as const;

  // Signals
  readonly checkups = signal<CheckupEntry[]>(this.readJson(this.STORAGE_KEYS.checkups, []));
  readonly totalXp = signal<number>(this.readNumber(this.STORAGE_KEYS.totalXp, 0));
  readonly areaScores = signal<Record<string, number>>(this.readJson(this.STORAGE_KEYS.areaScores, {}));

  // Derived
  readonly streak = computed(() => this.computeStreak(this.checkups()));
  readonly weeklyGoals = signal<WeeklyGoal[]>([]);

  // Daily tasks definitions aligned to goals
  readonly dailyTasksCatalog: DailyTask[] = [
    { id: 'sunlight', description: '10-minute sunlight exposure after wake-up', color: '#6ec6ff' },
    { id: 'protein', description: 'Protein-rich breakfast (30g+)', color: '#00d2ff' },
    { id: 'water', description: '3L water throughout the day', color: '#bf5af2' },
    { id: 'strength', description: '45-minute strength training', color: '#ff8a00' },
    { id: 'noscreens', description: 'No screens 60 minutes before sleep', color: '#ff005d' }
  ];

  // Goals mapping to daily tasks
  private readonly goalsDef = [
    { id: 'sleep', label: 'Get 7.5h Sleep', target: 7, xp: 50, taskId: 'noscreens' },
    { id: 'strength', label: '3x Strength Training', target: 3, xp: 50, taskId: 'strength' },
    { id: 'hydration', label: 'Hydration 5 days', target: 5, xp: 75, taskId: 'water' }
  ];

  // Public computed for dashboard goals view
  readonly dashboardGoals = computed(() => {
    const goals = this.weeklyGoals();
    return goals.map(g => ({ id: g.id, goal: this.findGoalLabel(g.id), progress: `${g.progress}/${this.findGoalTarget(g.id)} days`, xp: g.xp }));
  });

  constructor() {
    this.weeklyGoals.set(this.readWeeklyGoalsForCurrentWeek());
  }

  // Checkup submit with 4h tolerance streak and areas update
  submitCheckup(entry: { morningErectionDown: boolean; metrics: CheckupMetric[] }): void {
    const now = new Date();
    const iso = now.toISOString();
    const next = [...this.checkups(), { date: iso, morningErectionDown: entry.morningErectionDown, metrics: entry.metrics }];
    this.checkups.set(next);
    this.persist(this.STORAGE_KEYS.checkups, next);

    // Update area scores derived from metrics (simple mapping and smoothing)
    const areas = { ...this.areaScores() };
    for (const m of entry.metrics) {
      const key = this.mapMetricToAreaKey(m.name);
      if (!key) continue;
      const previous = areas[key] ?? 50;
      const newValue = Math.round(previous * 0.6 + m.value * 0.4);
      areas[key] = Math.max(0, Math.min(100, newValue));
    }
    this.areaScores.set(areas);
    this.persist(this.STORAGE_KEYS.areaScores, areas);
  }

  // Daily tasks per day
  loadTodayTasks(): { task: DailyTask; state: DailyTaskState }[] {
    const todayKey = this.getDayKey(new Date());
    const states = this.readJson<DailyTaskState[]>(this.STORAGE_KEYS.dailyTasksPrefix + todayKey, [])
      .reduce<Record<string, DailyTaskState>>((acc, s) => (acc[s.id] = s, acc), {});
    return this.dailyTasksCatalog.map(task => ({ task, state: { id: task.id, done: states[task.id]?.done ?? false } }));
  }

  toggleTask(taskId: string, done: boolean): void {
    const todayKey = this.getDayKey(new Date());
    const existing = this.readJson<DailyTaskState[]>(this.STORAGE_KEYS.dailyTasksPrefix + todayKey, []);
    const updated = this.upsertTaskState(existing, { id: taskId, done });
    this.persist(this.STORAGE_KEYS.dailyTasksPrefix + todayKey, updated);

    // Update weekly goals progress based on mapped goals
    const goals = [...this.weeklyGoals()];
    const mapping = this.goalsDef.find(g => g.taskId === taskId);
    if (mapping) {
      const g = goals.find(x => x.id === mapping.id);
      if (g) {
        // Adjust progress idempotently per day per task
        const dayMarkKey = this.weekKey(new Date()) + ':' + mapping.id + ':' + todayKey;
        const dayMarks = this.readJson<string[]>(this.STORAGE_KEYS.weeklyGoalsPrefix + 'marks', []);
        const alreadyMarked = dayMarks.includes(dayMarkKey);
        if (done && !alreadyMarked) {
          g.progress = Math.min(this.findGoalTarget(g.id), g.progress + 1);
          this.persist(this.STORAGE_KEYS.weeklyGoalsPrefix + 'marks', [...dayMarks, dayMarkKey]);
        }
        if (!done && alreadyMarked) {
          g.progress = Math.max(0, g.progress - 1);
          this.persist(this.STORAGE_KEYS.weeklyGoalsPrefix + 'marks', dayMarks.filter(k => k !== dayMarkKey));
        }
        // Award XP once when completed
        const target = this.findGoalTarget(g.id);
        if (g.progress >= target && !g.completed) {
          g.completed = true;
        }
        if (g.completed && !g.xpAwarded) {
          this.totalXp.set(this.totalXp() + g.xp);
          this.persistNumber(this.STORAGE_KEYS.totalXp, this.totalXp());
          g.xpAwarded = true;
        }
      }
    }
    this.weeklyGoals.set(goals);
    this.persistWeeklyGoalsForCurrentWeek(goals);
  }

  // Dashboard history emojis (last 7 days)
  recentCheckupEmoji(): { day: string; emoji: string }[] {
    const byDay = new Map<string, CheckupEntry[]>();
    for (const c of this.checkups()) {
      const key = this.getDayKey(new Date(c.date));
      const arr = byDay.get(key) ?? [];
      arr.push(c);
      byDay.set(key, arr);
    }
    const days: { day: string; emoji: string }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = this.getDayKey(d);
      const entries = byDay.get(key) ?? [];
      const emoji = entries.length ? (entries[entries.length - 1].morningErectionDown ? '↘️' : '↗️') : '—';
      days.push({ day: key.slice(5), emoji });
    }
    return days;
  }

  // Optimize overall score
  overallScore(): number {
    const areas = this.areaScores();
    const keys = Object.keys(areas);
    if (!keys.length) return 50;
    const avg = keys.reduce((s, k) => s + (areas[k] ?? 0), 0) / keys.length;
    return Math.round(avg);
  }

  // Utilities
  private computeStreak(entries: CheckupEntry[]): number {
    if (!entries.length) return 0;
    // Group by day and use 4h tolerance: a day counts if any checkup exists between (local day start - 4h) and (next day start + 4h)
    const days = new Set<string>();
    for (const e of entries) days.add(this.getDayKey(new Date(e.date)));
    let streak = 0;
    for (let i = 0; ; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const withinTolerance = this.dayHasCheckup(entries, d);
      if (withinTolerance) streak += 1; else break;
    }
    return streak;
  }

  private dayHasCheckup(entries: CheckupEntry[], day: Date): boolean {
    const start = new Date(day);
    start.setHours(0, 0, 0, 0);
    start.setHours(start.getHours() - 4);
    const end = new Date(day);
    end.setHours(24, 0, 0, 0);
    end.setHours(end.getHours() + 4);
    return entries.some(e => {
      const t = new Date(e.date).getTime();
      return t >= start.getTime() && t < end.getTime();
    });
  }

  private getDayKey(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dd}`;
  }

  private weekKey(d: Date): string {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(),0,1));
    const weekNo = Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    return `${date.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
  }

  private readWeeklyGoalsForCurrentWeek(): WeeklyGoal[] {
    const wk = this.weekKey(new Date());
    const raw = this.readJson<WeeklyGoal[]>(this.STORAGE_KEYS.weeklyGoalsPrefix + wk, []);
    if (raw.length) return raw;
    // initialize
    const init = this.goalsDef.map(g => ({ id: g.id, label: g.label, target: g.target, xp: g.xp, progress: 0, completed: false, xpAwarded: false }));
    this.persistWeeklyGoalsForCurrentWeek(init);
    return init;
  }

  private persistWeeklyGoalsForCurrentWeek(goals: WeeklyGoal[]): void {
    const wk = this.weekKey(new Date());
    this.persist(this.STORAGE_KEYS.weeklyGoalsPrefix + wk, goals);
  }

  private upsertTaskState(list: DailyTaskState[], state: DailyTaskState): DailyTaskState[] {
    const idx = list.findIndex(x => x.id === state.id);
    if (idx === -1) return [...list, state];
    const next = [...list];
    next[idx] = state;
    return next;
  }

  private mapMetricToAreaKey(metricName: string): string | undefined {
    const t = metricName.toLowerCase();
    if (t.includes('energy')) return 'Energy Levels';
    if (t.includes('mood')) return 'Mental State';
    if (t.includes('sleep')) return 'Sleep Quality';
    if (t.includes('sex')) return 'Sex Drive';
    return undefined;
  }

  private findGoalLabel(id: string): string {
    return this.goalsDef.find(g => g.id === id)?.label ?? id;
  }
  private findGoalTarget(id: string): number {
    return this.goalsDef.find(g => g.id === id)?.target ?? 0;
  }

  private readJson<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) as T : fallback;
    } catch {
      return fallback;
    }
  }
  private readNumber(key: string, fallback: number): number {
    try {
      const raw = localStorage.getItem(key);
      const n = raw ? Number(raw) : NaN;
      return Number.isFinite(n) ? n : fallback;
    } catch {
      return fallback;
    }
  }
  private persist(key: string, value: unknown): void {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }
  private persistNumber(key: string, value: number): void {
    try { localStorage.setItem(key, String(value)); } catch {}
  }
}


