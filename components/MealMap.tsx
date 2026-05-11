'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { MEALS, Meal, MealType, ProtoType, ShoppingCategory } from '@/lib/meals';
import { buildVariedOptions, mealOk, ProtoStates } from '@/lib/meal-utils';
import NavBar from '@/components/NavBar';

const PROTO_LIST: ProtoType[] = ['chicken', 'beef', 'pork', 'eggs', 'fish', 'legumes', 'yogurt', 'tofu'];

const PROTO_LABELS: Record<ProtoType, string> = {
  chicken: '🍗 Chicken',
  beef: '🥩 Beef',
  pork: '🐷 Pork',
  eggs: '🥚 Eggs',
  fish: '🐟 Fish & Seafood',
  legumes: '🫘 Legumes',
  yogurt: '🧀 Yogurt & Dairy',
  tofu: '🌱 Tofu & Tempeh',
};

const PROTO_ICONS: Record<ProtoType, string> = {
  chicken: '🍗', beef: '🥩', pork: '🐷', eggs: '🥚',
  fish: '🐟', legumes: '🫘', yogurt: '🧀', tofu: '🌱',
};

const PROTO_NAMES: Record<ProtoType, string> = {
  chicken: 'Chicken', beef: 'Beef', pork: 'Pork', eggs: 'Eggs',
  fish: 'Fish & Seafood', legumes: 'Legumes', yogurt: 'Yogurt & Dairy', tofu: 'Tofu & Tempeh',
};

const TYPE_LABELS: Record<string, string> = {
  breakfast: '🌅 Breakfast',
  lunch: '☀️ Lunch',
  dinner: '🌙 Dinner',
  snack: '⚡ Snack (lighter)',
};

const GOALS: Record<string, { pro_per_lb: number; carb_per_lb: number; fat_per_lb: number; label: string }> = {
  muscle:      { pro_per_lb: 0.8,  carb_per_lb: 1.5,  fat_per_lb: 0.35, label: 'Build muscle' },
  'fat-loss':  { pro_per_lb: 1.0,  carb_per_lb: 0.75, fat_per_lb: 0.30, label: 'Lose fat' },
  'low-carb':  { pro_per_lb: 0.7,  carb_per_lb: 0.2,  fat_per_lb: 0.60, label: 'Low carb' },
  maintenance: { pro_per_lb: 0.7,  carb_per_lb: 1.2,  fat_per_lb: 0.35, label: 'Maintenance' },
  endurance:   { pro_per_lb: 0.6,  carb_per_lb: 2.5,  fat_per_lb: 0.30, label: 'Endurance' },
  recomp:      { pro_per_lb: 1.1,  carb_per_lb: 0.9,  fat_per_lb: 0.30, label: 'Body recomp' },
};

const DAY_COUNTS = [3, 2, 2];

const defaultProtoStates = (): ProtoStates =>
  Object.fromEntries(PROTO_LIST.map(p => [p, 'neutral'])) as ProtoStates;

interface ShoppingItemWithCount {
  name: string;
  qty: string;
  price: number;
  count: number;
  totalPrice: number;
}

export default function MealMap() {
  // ── Macro & target state ─────────────────────────────────
  const [pro, setPro] = useState(160);
  const [carb, setCarb] = useState(220);
  const [fat, setFat] = useState(55);
  const [budget, setBudget] = useState(150);
  const [weight, setWeight] = useState('');
  const [unitMode, setUnitMode] = useState<'g' | '%'>('g');
  const [weightUnit, setWeightUnit] = useState<'lbs' | 'kg'>('lbs');
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [storedCalories, setStoredCalories] = useState(2015);
  const [calcResultText, setCalcResultText] = useState<string | null>(null);

  // ── Protein & dietary state ──────────────────────────────
  const [protoStates, setProtoStates] = useState<ProtoStates>(defaultProtoStates);
  const [excluded, setExcluded] = useState<Set<string>>(new Set());
  const [skipBreakfast, setSkipBreakfast] = useState(false);

  // ── Plan state ───────────────────────────────────────────
  const [picks, setPicks] = useState<Record<MealType, Meal[]>>({
    breakfast: [], lunch: [], dinner: [], snack: [],
  });
  const [options, setOptions] = useState<Record<MealType, Meal[]>>({
    breakfast: [], lunch: [], dinner: [], snack: [],
  });

  // ── UI state ─────────────────────────────────────────────
  const [showPickSection, setShowPickSection] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState<'meals' | 'shopping'>('meals');
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [pantryItems, setPantryItems] = useState<Set<string>>(new Set());
  const [savedFlash, setSavedFlash] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // ── Email modal state ────────────────────────────────────
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailName, setEmailName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const pickSectionRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // ── Derived values ───────────────────────────────────────
  const activeMealTypes = useMemo<MealType[]>(
    () => skipBreakfast ? ['lunch', 'dinner', 'snack'] : ['breakfast', 'lunch', 'dinner'],
    [skipBreakfast]
  );

  const calDisplay = unitMode === 'g'
    ? Math.round(pro * 4 + carb * 4 + fat * 9)
    : storedCalories;

  const proSecondary = useMemo(() => {
    if (unitMode === 'g') {
      const tot = Math.round(pro * 4 + carb * 4 + fat * 9) || 1;
      const cP = Math.round(pro * 4);
      return `${cP} kcal · ${Math.round(cP / tot * 100)}%`;
    }
    return `~${Math.round(pro / 100 * (storedCalories || 2000) / 4)}g`;
  }, [pro, carb, fat, unitMode, storedCalories]);

  const carbSecondary = useMemo(() => {
    if (unitMode === 'g') {
      const tot = Math.round(pro * 4 + carb * 4 + fat * 9) || 1;
      const cC = Math.round(carb * 4);
      return `${cC} kcal · ${Math.round(cC / tot * 100)}%`;
    }
    return `~${Math.round(carb / 100 * (storedCalories || 2000) / 4)}g`;
  }, [pro, carb, fat, unitMode, storedCalories]);

  const fatSecondary = useMemo(() => {
    if (unitMode === 'g') {
      const tot = Math.round(pro * 4 + carb * 4 + fat * 9) || 1;
      const cF = Math.round(fat * 9);
      return `${cF} kcal · ${Math.round(cF / tot * 100)}%`;
    }
    return `~${Math.round(fat / 100 * (storedCalories || 2000) / 9)}g`;
  }, [pro, carb, fat, unitMode, storedCalories]);

  const hasAnyPick = activeMealTypes.some(t => picks[t].length > 0);
  const allPicksDone = activeMealTypes.every(t => picks[t].length === 3);

  const selectedProtoCount = PROTO_LIST.filter(p => protoStates[p] === 'selected').length;

  // Shopping data derived from picks
  const { shoppingData, weeklyStats } = useMemo(() => {
    if (!showResults) return { shoppingData: {} as Record<string, ShoppingItemWithCount[]>, weeklyStats: null };

    const shopping: Record<string, ShoppingItemWithCount[]> = { Meat: [], Produce: [], Dairy: [], Pantry: [] };
    let totalWeeklyCal = 0, totalWeeklyPro = 0, totalWeeklyCarb = 0, totalWeeklyFat = 0, totalWeeklyCost = 0;

    activeMealTypes.forEach(type => {
      picks[type].forEach((m, i) => {
        const days = DAY_COUNTS[i] ?? 2;
        totalWeeklyCal += m.cal * days;
        totalWeeklyPro += m.pro * days;
        totalWeeklyCarb += m.carb * days;
        totalWeeklyFat += m.fat * days;
        totalWeeklyCost += m.cost * days;

        (Object.entries(m.shopping) as [ShoppingCategory, typeof m.shopping[ShoppingCategory]][]).forEach(([cat, items]) => {
          if (!items) return;
          items.forEach(item => {
            const existing = shopping[cat]?.find(x => x.name === item.name);
            if (existing) {
              existing.count += days;
              existing.totalPrice += item.price * days;
            } else {
              shopping[cat].push({ ...item, count: days, totalPrice: item.price * days });
            }
          });
        });
      });
    });

    return {
      shoppingData: shopping,
      weeklyStats: { totalWeeklyCal, totalWeeklyPro, totalWeeklyCarb, totalWeeklyFat, totalWeeklyCost },
    };
  }, [picks, activeMealTypes, showResults]);

  const allItems = useMemo(() => {
    const items: string[] = [];
    (['Meat', 'Produce', 'Dairy', 'Pantry'] as const).forEach(cat => {
      (shoppingData[cat] || []).forEach((_, i) => items.push(`${cat}-${i}`));
    });
    return items;
  }, [shoppingData]);

  const shopProgressText = allItems.length > 0
    ? `${checkedItems.size} of ${allItems.length - pantryItems.size} needed items in cart${pantryItems.size > 0 ? ` · ${pantryItems.size} already at home` : ''}`
    : '';

  // ── LocalStorage load ────────────────────────────────────
  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem('macroPlanner4') || '{}');
      if (p.pro) setPro(Number(p.pro));
      if (p.carb) setCarb(Number(p.carb));
      if (p.fat) setFat(Number(p.fat));
      if (p.budget) setBudget(Number(p.budget));
      if (p.storedCalories) setStoredCalories(p.storedCalories);
      if (p.skipBreakfast) setSkipBreakfast(true);
      if (p.excluded) setExcluded(new Set(p.excluded as string[]));
      if (p.protoStates) setProtoStates(prev => ({ ...prev, ...p.protoStates }));
      if (p.unitMode) setUnitMode(p.unitMode);
    } catch { /* ignore */ }
    setLoaded(true);
  }, []);

  // ── LocalStorage save ────────────────────────────────────
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem('macroPlanner4', JSON.stringify({
        pro, carb, fat, budget,
        excluded: [...excluded],
        unitMode, storedCalories, protoStates, skipBreakfast,
      }));
      setSavedFlash(true);
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => setSavedFlash(false), 1400);
    } catch { /* ignore */ }
  }, [loaded, pro, carb, fat, budget, excluded, unitMode, storedCalories, protoStates, skipBreakfast]);

  // ── Handlers ─────────────────────────────────────────────
  const handleSetUnit = (mode: 'g' | '%') => {
    if (mode === unitMode) return;
    if (mode === '%') {
      const total = (pro * 4 + carb * 4 + fat * 9) || 1;
      setStoredCalories(Math.round(total));
      setPro(Math.round(pro * 4 / total * 100));
      setCarb(Math.round(carb * 4 / total * 100));
      setFat(Math.round(fat * 9 / total * 100));
    } else {
      const cal = storedCalories || 2000;
      setPro(Math.round(pro / 100 * cal / 4));
      setCarb(Math.round(carb / 100 * cal / 4));
      setFat(Math.round(fat / 100 * cal / 9));
    }
    setUnitMode(mode);
  };

  const handleCalculateMacros = () => {
    const wRaw = parseFloat(weight);
    if (!wRaw || wRaw <= 0) { alert('Please enter your body weight.'); return; }
    if (!selectedGoal) { alert('Please select a goal.'); return; }
    const wLbs = weightUnit === 'kg' ? wRaw * 2.205 : wRaw;
    const g = GOALS[selectedGoal];
    const proG = Math.round(wLbs * g.pro_per_lb);
    const carbG = Math.round(wLbs * g.carb_per_lb);
    const fatG = Math.round(wLbs * g.fat_per_lb);
    if (unitMode === '%') setUnitMode('g');
    setPro(proG); setCarb(carbG); setFat(fatG);
    setCalcResultText(
      `${g.label} · ${Math.round(wLbs)} lbs\nProtein: ${proG}g  (${g.pro_per_lb}g per lb)\nCarbs:   ${carbG}g  ·  Fat: ${fatG}g\nCalories: ${Math.round(proG * 4 + carbG * 4 + fatG * 9)} kcal / day`
    );
  };

  const handleCycleProto = (proto: ProtoType) => {
    setProtoStates(prev => {
      const cur = prev[proto];
      const next = cur === 'neutral' ? 'selected' : cur === 'selected' ? 'excluded' : 'neutral';
      return { ...prev, [proto]: next };
    });
  };

  const handleTogglePref = (key: string) => {
    setExcluded(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
        if (key === 'vegetarian' && next.has('vegan')) next.delete('vegan');
      } else {
        next.add(key);
        if (key === 'vegan') next.add('vegetarian');
      }
      return next;
    });
  };

  const handleGenerate = () => {
    const currentPicks = showPickSection ? picks : { breakfast: [], lunch: [], dinner: [], snack: [] } as Record<MealType, Meal[]>;
    const newOptions: Partial<Record<MealType, Meal[]>> = {};

    for (const type of activeMealTypes) {
      const lockedNames = new Set(currentPicks[type].map(m => m.name));
      const built = buildVariedOptions(type, 7, lockedNames, protoStates, excluded);
      const lockedMeals = currentPicks[type].slice();
      const freshSlots = Math.max(0, 7 - lockedMeals.length);
      const fresh = built.filter(m => !lockedNames.has(m.name)).slice(0, freshSlots);
      newOptions[type] = [...lockedMeals, ...fresh];
      if (!newOptions[type]?.length) {
        alert(`No ${type} options match your filters. Try adjusting protein sources or dietary preferences.`);
        return;
      }
    }

    if (!showPickSection) {
      setPicks({ breakfast: [], lunch: [], dinner: [], snack: [] });
    }
    setOptions(prev => ({ ...prev, ...newOptions }));
    setShowPickSection(true);
    setShowResults(false);

    setTimeout(() => pickSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  };

  const handleTogglePick = (type: MealType, idx: number) => {
    const meal = options[type][idx];
    setPicks(prev => {
      const arr = [...prev[type]];
      const existingIdx = arr.findIndex(m => m.name === meal.name);
      if (existingIdx >= 0) {
        arr.splice(existingIdx, 1);
      } else {
        if (arr.length >= 3) return prev;
        arr.push(meal);
      }
      return { ...prev, [type]: arr };
    });
  };

  const handleConfirmPlan = () => {
    setCheckedItems(new Set());
    setPantryItems(new Set());
    setActiveTab('meals');
    setShowResults(true);
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  };

  const handleSwapMeal = (type: MealType, pickIdx: number) => {
    const current = picks[type][pickIdx];
    const currentNames = new Set(activeMealTypes.flatMap(t => picks[t].map(m => m.name)));

    const pool = MEALS.filter(m =>
      m.type === type && mealOk(m, protoStates, excluded) && !currentNames.has(m.name)
    );

    let newMeal: Meal;
    if (pool.length === 0) {
      const fallback = MEALS.filter(m => m.type === type && mealOk(m, protoStates, excluded) && m.name !== current.name);
      if (fallback.length === 0) return;
      newMeal = fallback[Math.floor(Math.random() * fallback.length)];
    } else {
      const sameProto = pool.filter(m => m.proto === current.proto);
      const candidates = sameProto.length > 0 ? sameProto : pool;
      newMeal = candidates[Math.floor(Math.random() * candidates.length)];
    }

    setPicks(prev => {
      const arr = [...prev[type]];
      arr[pickIdx] = newMeal;
      return { ...prev, [type]: arr };
    });
    setCheckedItems(new Set());
    setPantryItems(new Set());
  };

  const handleToggleCart = useCallback((id: string) => {
    setCheckedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const handleTogglePantry = useCallback((id: string) => {
    setPantryItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const handleResetEverything = () => {
    if (!confirm('Start over? This will clear your meal picks, preferences, and saved settings.')) return;
    setPro(160); setCarb(220); setFat(55); setBudget(150);
    setWeight(''); setUnitMode('g'); setStoredCalories(2015);
    setWeightUnit('lbs'); setSelectedGoal(null); setCalcResultText(null);
    setProtoStates(defaultProtoStates());
    setExcluded(new Set()); setSkipBreakfast(false);
    setPicks({ breakfast: [], lunch: [], dinner: [], snack: [] });
    setOptions({ breakfast: [], lunch: [], dinner: [], snack: [] });
    setShowPickSection(false); setShowResults(false);
    setCheckedItems(new Set()); setPantryItems(new Set());
    try { localStorage.removeItem('macroPlanner4'); } catch { /* ignore */ }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrintPlan = () => {
    setActiveTab('shopping');
    setTimeout(() => {
      window.print();
      setTimeout(() => setActiveTab('meals'), 500);
    }, 100);
  };

  const handleSubmitEmail = async () => {
    const emailVal = emailAddress.trim();
    const nameVal = emailName.trim();
    if (!emailVal || !emailVal.includes('@')) {
      setEmailError('invalid');
      return;
    }
    setEmailLoading(true);
    setEmailError('');

    const planData = activeMealTypes.map(type => ({
      type,
      typeLabel: TYPE_LABELS[type],
      meals: picks[type].map((m, i) => ({
        name: m.name, desc: m.desc,
        proto: PROTO_LABELS[m.proto] || m.proto,
        cal: m.cal, pro: m.pro, carb: m.carb, fat: m.fat,
        cost: m.cost, days: DAY_COUNTS[i] ?? 2,
      })),
    }));

    const shoppingForEmail: Record<string, { name: string; qty: string; totalPrice: number }[]> = {};
    (['Meat', 'Produce', 'Dairy', 'Pantry'] as const).forEach(cat => {
      if (shoppingData[cat]?.length) {
        shoppingForEmail[cat] = shoppingData[cat].map(item => ({
          name: item.name, qty: item.qty, totalPrice: Math.round(item.totalPrice),
        }));
      }
    });

    try {
      const res = await fetch('/api/send-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nameVal,
          email: emailVal,
          macros: { pro, carb, fat, cal: calDisplay },
          plan: planData,
          shopping: shoppingForEmail,
          weeklyTotal: weeklyStats?.totalWeeklyCost ?? 0,
          budget,
        }),
      });
      if (!res.ok) throw new Error('Failed');
      setEmailSent(true);
    } catch {
      setEmailError('send-failed');
    } finally {
      setEmailLoading(false);
    }
  };

  // ── Budget calculations ──────────────────────────────────
  const weeklyTotal = weeklyStats?.totalWeeklyCost ?? 0;
  const isOverBudget = weeklyTotal > budget;
  const budgetPct = Math.min(100, budget > 0 ? Math.round(weeklyTotal / budget * 100) : 0);
  const budgetRemainText = isOverBudget
    ? `$${Math.round(weeklyTotal - budget)} over budget`
    : `$${Math.round(budget - weeklyTotal)} under budget`;

  // ── Render ───────────────────────────────────────────────
  return (
    <>
      <NavBar />

      <div className="container">
        {/* ── Macros card ── */}
        <div className="card">
          <div className="card-label">
            Daily targets
            <span className={`saved-flash${savedFlash ? ' show' : ''}`}>saved</span>
            <div className="unit-toggle">
              <button className={`unit-btn${unitMode === 'g' ? ' active' : ''}`} onClick={() => handleSetUnit('g')}>Grams</button>
              <button className={`unit-btn${unitMode === '%' ? ' active' : ''}`} onClick={() => handleSetUnit('%')}>%</button>
            </div>
          </div>
          <div className="cal-display">
            <span className="cal-label">Total calories</span>
            <span className="cal-val">{calDisplay}</span>
            <span className="cal-unit">kcal / day</span>
          </div>
          <div className="macro-grid">
            <div className="macro-input">
              <label>Protein</label>
              <div className="input-row">
                <input type="number" value={pro} onChange={e => setPro(Number(e.target.value) || 0)} />
                <span className="unit">{unitMode}</span>
              </div>
              <div className="secondary">{proSecondary}</div>
            </div>
            <div className="macro-input">
              <label>Carbs</label>
              <div className="input-row">
                <input type="number" value={carb} onChange={e => setCarb(Number(e.target.value) || 0)} />
                <span className="unit">{unitMode}</span>
              </div>
              <div className="secondary">{carbSecondary}</div>
            </div>
            <div className="macro-input">
              <label>Fat</label>
              <div className="input-row">
                <input type="number" value={fat} onChange={e => setFat(Number(e.target.value) || 0)} />
                <span className="unit">{unitMode}</span>
              </div>
              <div className="secondary">{fatSecondary}</div>
            </div>
          </div>

          <div className="calc-section">
            <div className="calc-label">Calculate macros from goal</div>
            <div className="calc-inputs-row">
              <div className="calc-input">
                <label>Body weight</label>
                <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="e.g. 180" />
              </div>
              <div className="wu-group">
                <span className="wu-label">Unit</span>
                <div className="wu-btns">
                  <button className={`wu-btn${weightUnit === 'lbs' ? ' active' : ''}`} onClick={() => setWeightUnit('lbs')}>lbs</button>
                  <button className={`wu-btn${weightUnit === 'kg' ? ' active' : ''}`} onClick={() => setWeightUnit('kg')}>kg</button>
                </div>
              </div>
            </div>
            <div className="goals-grid">
              {Object.entries(GOALS).map(([key, g]) => (
                <button
                  key={key}
                  className={`goal-btn${selectedGoal === key ? ' active' : ''}`}
                  onClick={() => setSelectedGoal(key)}
                >
                  <span className="goal-name">{g.label}</span>
                  <span className="goal-desc">
                    {g.pro_per_lb}g protein/lb · {key === 'low-carb' ? 'very low carbs' : key === 'endurance' ? 'very high carbs' : key === 'fat-loss' ? 'lower carbs · deficit' : key === 'muscle' ? 'high carbs · surplus' : 'balanced'} macros
                  </span>
                </button>
              ))}
            </div>
            <button className="calc-btn" onClick={handleCalculateMacros}>Calculate my macros →</button>
            {calcResultText && (
              <div className="calc-result">{calcResultText}</div>
            )}
          </div>
        </div>

        {/* ── Protein sources ── */}
        <div className="card">
          <div className="card-label">Protein sources</div>
          <div className="protein-grid">
            {PROTO_LIST.map(p => {
              const state = protoStates[p];
              return (
                <button
                  key={p}
                  className={`proto-btn${state === 'selected' ? ' selected' : state === 'excluded' ? ' excluded' : ''}`}
                  onClick={() => handleCycleProto(p)}
                >
                  <span className="proto-icon">{PROTO_ICONS[p]}</span>
                  <span className="proto-name">{PROTO_NAMES[p]}</span>
                  <span className="proto-state">{state === 'selected' ? '✓' : state === 'excluded' ? '✗' : ''}</span>
                </button>
              );
            })}
          </div>
          <div className="proto-hint">Tap once to select ✓ · Tap again to exclude ✗ · Tap again to reset</div>
          {selectedProtoCount === 1 && (
            <div className="proto-warning">⚠ Only 1 protein source selected — you may see repeated meals.</div>
          )}
        </div>

        {/* ── Budget ── */}
        <div className="card">
          <div className="card-label">Weekly budget</div>
          <div className="budget-row">
            <label>Max per week</label>
            <div className="budget-input">
              <span>$</span>
              <input type="number" value={budget} onChange={e => setBudget(Number(e.target.value) || 0)} />
            </div>
          </div>
        </div>

        {/* ── Dietary prefs ── */}
        <div className="card">
          <div className="card-label">Dietary preferences</div>
          <div className="pref-grid">
            <button
              className={`pref-pill skip-bfast${skipBreakfast ? ' active' : ''}`}
              onClick={() => setSkipBreakfast(v => !v)}
            >⏭ Skip breakfast</button>
            <div className="pref-divider" />
            {[
              { key: 'vegetarian', label: 'Vegetarian', cls: 'veg' },
              { key: 'vegan', label: 'Vegan', cls: 'vegan' },
            ].map(({ key, label, cls }) => (
              <button
                key={key}
                className={`pref-pill ${cls}${excluded.has(key) ? ' active' : ''}`}
                onClick={() => handleTogglePref(key)}
              >{label}</button>
            ))}
            <div className="pref-divider" />
            {[
              { key: 'dairy', label: 'No dairy' },
              { key: 'gluten', label: 'No gluten' },
              { key: 'pork', label: 'No pork' },
              { key: 'seafood', label: 'No seafood' },
              { key: 'eggs', label: 'No eggs' },
              { key: 'nuts', label: 'No nuts' },
            ].map(({ key, label }) => (
              <button
                key={key}
                className={`pref-pill${excluded.has(key) ? ' active' : ''}`}
                onClick={() => handleTogglePref(key)}
              >{label}</button>
            ))}
          </div>
        </div>

        <button className="generate-btn" onClick={handleGenerate}>
          {showPickSection && hasAnyPick ? '🔄 Refresh unselected options' : 'Generate my meal options →'}
        </button>

        {showPickSection && (
          <button className="reset-btn" onClick={handleResetEverything}>↺ Reset everything</button>
        )}

        {/* ── Pick section ── */}
        {showPickSection && (
          <div ref={pickSectionRef}>
            <div className="card">
              <div className="card-label">Pick your meals for the week</div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: '1.5' }}>
                Pick <strong>3 from each category</strong> — these rotate across your week. Tap to select, tap again to deselect.
              </p>
              {skipBreakfast && (
                <div className="if-banner">
                  <strong>⏭ Skipping breakfast</strong> — pick a Lunch, Dinner, and Snack (lighter protein hit). Macros are spread across your 3 meals.
                </div>
              )}
              <div id="pick-content">
                {activeMealTypes.map(type => {
                  const freshCount = options[type].filter(m => !picks[type].some(p => p.name === m.name)).length;
                  return (
                    <div key={type} className="meal-type-section">
                      <div className="meal-type-header">
                        <span className="meal-type-title">{TYPE_LABELS[type]}</span>
                        <span className={`pick-counter${picks[type].length >= 3 ? ' done' : ''}`}>
                          {picks[type].length} / 3 picked
                        </span>
                      </div>
                      <div className="option-grid">
                        {options[type].map((m, i) => {
                          const isSelected = picks[type].some(p => p.name === m.name);
                          const isDimmed = picks[type].length >= 3 && !isSelected;
                          return (
                            <div
                              key={m.name}
                              className={`option-card${isSelected ? ' selected' : ''}${isDimmed ? ' dimmed' : ''}`}
                              onClick={() => handleTogglePick(type, i)}
                            >
                              <div className="oc-header">
                                <span className="oc-name">
                                  {m.name}
                                  {isSelected && <span className="lock-badge">✓ Kept</span>}
                                </span>
                                <div className="oc-check">{isSelected ? '✓' : ''}</div>
                              </div>
                              <div className="oc-proto">{PROTO_LABELS[m.proto] || m.proto}</div>
                              <div className="oc-pills">
                                <span className="mpill cal">{m.cal} kcal</span>
                                <span className="mpill pro">{m.pro}g protein</span>
                                <span className="mpill carb">{m.carb}g carbs</span>
                                <span className="mpill fat">{m.fat}g fat</span>
                              </div>
                              <div className="oc-desc">{m.desc} · <strong>~${m.cost}/serving</strong></div>
                            </div>
                          );
                        })}
                      </div>
                      {picks[type].length > 0 && freshCount > 0 && (
                        <div className="refresh-hint">
                          {picks[type].length} kept · {freshCount} new options shown · hit Refresh to swap them out
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <button
                className="confirm-btn"
                disabled={!allPicksDone}
                style={{ opacity: allPicksDone ? 1 : 0.3 }}
                onClick={handleConfirmPlan}
              >
                {allPicksDone ? 'Confirm my plan →' : 'Pick 3 from each category to continue'}
              </button>
            </div>
          </div>
        )}

        {/* ── Results ── */}
        {showResults && (
          <div ref={resultsRef}>
            <div className="card">
              <div className="stats-grid">
                <div className="stat-cell">
                  <div className="stat-val">{weeklyStats ? Math.round(weeklyStats.totalWeeklyCal / 7) : '—'}</div>
                  <div className="stat-lbl">avg kcal/day</div>
                </div>
                <div className="stat-cell">
                  <div className="stat-val">{weeklyStats ? Math.round(weeklyStats.totalWeeklyPro / 7) + 'g' : '—'}</div>
                  <div className="stat-lbl">protein</div>
                </div>
                <div className="stat-cell">
                  <div className="stat-val">{weeklyStats ? Math.round(weeklyStats.totalWeeklyCarb / 7) + 'g' : '—'}</div>
                  <div className="stat-lbl">carbs</div>
                </div>
                <div className="stat-cell">
                  <div className="stat-val">{weeklyStats ? Math.round(weeklyStats.totalWeeklyFat / 7) + 'g' : '—'}</div>
                  <div className="stat-lbl">fat</div>
                </div>
              </div>

              <div className="budget-bar-wrap">
                <div className="budget-bar-info">
                  <span>Est. weekly total: ${Math.round(weeklyTotal)}</span>
                  <span className={`remain ${isOverBudget ? 'over' : 'ok'}`}>{budgetRemainText}</span>
                </div>
                <div className="budget-track">
                  <div className={`budget-fill${isOverBudget ? ' over' : ''}`} style={{ width: `${budgetPct}%` }} />
                </div>
              </div>

              <div className="action-bar">
                <button className="action-btn green" onClick={() => {
                  setEmailSent(false); setEmailName(''); setEmailAddress(''); setEmailError('');
                  setShowEmailModal(true);
                }}>📧 Save my plan</button>
                <button className="action-btn outline" onClick={handlePrintPlan}>🖨 Print list</button>
                <button className="action-btn outline" onClick={() => {
                  setShowResults(false);
                  setTimeout(() => pickSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
                }}>↩ Change meals</button>
                <button className="action-btn outline" style={{ color: 'var(--red)', borderColor: 'var(--red)' }} onClick={handleResetEverything}>↺ Start over</button>
              </div>

              <div className="tabs">
                <button className={`tab${activeTab === 'meals' ? ' active' : ''}`} onClick={() => setActiveTab('meals')}>My week</button>
                <button className={`tab${activeTab === 'shopping' ? ' active' : ''}`} onClick={() => setActiveTab('shopping')}>Shopping list</button>
              </div>

              {/* Meals panel */}
              {activeTab === 'meals' && (
                <div id="meals-panel">
                  {activeMealTypes.map(type => (
                    <div key={type} className="res-section">
                      <div className="res-section-hd">{TYPE_LABELS[type]}</div>
                      {picks[type].map((m, i) => {
                        const days = DAY_COUNTS[i] ?? 2;
                        return (
                          <div key={m.name} className="meal-card">
                            <div className="meal-card-header">
                              <span className="meal-proto">{PROTO_LABELS[m.proto] || m.proto}</span>
                              <button className="swap-btn" onClick={() => handleSwapMeal(type, i)}>↻ Swap</button>
                            </div>
                            <div className="meal-name">{m.name}</div>
                            <div className="meal-pills">
                              <span className="mpill cal">{m.cal} kcal</span>
                              <span className="mpill pro">{m.pro}g protein</span>
                              <span className="mpill carb">{m.carb}g carbs</span>
                              <span className="mpill fat">{m.fat}g fat</span>
                            </div>
                            <div className="meal-desc">{m.desc}</div>
                            <div className="meal-freq">Eaten {days}× this week · ~${(m.cost * days).toFixed(0)} total</div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}

              {/* Shopping panel */}
              {activeTab === 'shopping' && (
                <div id="shopping-panel">
                  <div className="progress-line">{shopProgressText}</div>
                  {(['Meat', 'Produce', 'Dairy', 'Pantry'] as const).map(cat => {
                    const items = shoppingData[cat];
                    if (!items?.length) return null;
                    return (
                      <div key={cat} className="shop-section">
                        <div className="shop-cat">{cat}</div>
                        {items.map((item, i) => {
                          const id = `${cat}-${i}`;
                          const isChecked = checkedItems.has(id);
                          const isHave = pantryItems.has(id);
                          return (
                            <div key={id} className={`shop-item${isChecked ? ' checked' : ''}${isHave ? ' have' : ''}`}>
                              <div className="shop-cbs">
                                <div className="cb-wrap">
                                  <div
                                    className="cb"
                                    onClick={() => handleToggleCart(id)}
                                    style={{ background: isChecked ? 'var(--text)' : undefined, borderColor: isChecked ? 'var(--text)' : undefined }}
                                  >
                                    {isChecked && (
                                      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                                        <polyline points="1.5,5.5 4.5,8.5 9.5,2.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                      </svg>
                                    )}
                                  </div>
                                  <span className="cb-lbl">Cart</span>
                                </div>
                                <div className="cb-wrap">
                                  <div
                                    className="have-cb"
                                    onClick={() => handleTogglePantry(id)}
                                    style={{ background: isHave ? '#e6f1fb' : undefined, borderColor: isHave ? '#3a7fd5' : undefined }}
                                  >
                                    {isHave && (
                                      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                                        <polyline points="1.5,5.5 4.5,8.5 9.5,2.5" stroke="#1a4a8a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                      </svg>
                                    )}
                                  </div>
                                  <span className="cb-lbl">Have</span>
                                </div>
                              </div>
                              <span className="item-name">{item.name}</span>
                              <div className="item-right">
                                <span className="item-price">~${Math.round(item.totalPrice)}</span>
                                <span className="item-qty">{item.qty}</span>
                                <a
                                  className="walmart-link"
                                  href={`https://www.walmart.com/search?q=${encodeURIComponent(item.name)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >🛒</a>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Email modal ── */}
      {showEmailModal && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowEmailModal(false); }}>
          <div className="modal">
            {!emailSent ? (
              <>
                <h3>Save your meal plan 📋</h3>
                <p>Get this week&apos;s plan emailed to you, with your full shopping list.</p>
                <input
                  type="text"
                  placeholder="First name"
                  value={emailName}
                  onChange={e => setEmailName(e.target.value)}
                />
                <input
                  type="email"
                  placeholder="Email address"
                  value={emailAddress}
                  onChange={e => { setEmailAddress(e.target.value); setEmailError(''); }}
                  className={emailError === 'invalid' ? 'error' : ''}
                />
                {emailError === 'invalid' && (
                  <p style={{ color: 'var(--red)', fontSize: '12px', marginTop: '-8px', marginBottom: '10px' }}>
                    Please enter a valid email address.
                  </p>
                )}
                {emailError === 'send-failed' && (
                  <p style={{ color: 'var(--red)', fontSize: '12px', marginTop: '-8px', marginBottom: '10px' }}>
                    Failed to send. Please try again.
                  </p>
                )}
                <div className="modal-btns">
                  <button className="modal-skip" onClick={() => setShowEmailModal(false)}>Maybe later</button>
                  <button className="modal-submit" onClick={handleSubmitEmail} disabled={emailLoading}>
                    {emailLoading ? 'Sending…' : 'Send my plan →'}
                  </button>
                </div>
              </>
            ) : (
              <div className="modal-success">
                <div className="success-icon">🎉</div>
                <h3 style={{ marginBottom: '8px' }}>You&apos;re in!</h3>
                <p style={{ color: 'var(--green)', fontWeight: 500 }}>Check your inbox — your plan is on its way.</p>
                <button
                  className="modal-submit"
                  style={{ width: '100%', marginTop: '16px', padding: '10px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 600 }}
                  onClick={() => setShowEmailModal(false)}
                >Done</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
