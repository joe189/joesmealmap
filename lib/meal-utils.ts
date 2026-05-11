import { MEALS, Meal, MealType, ProtoType } from './meals';

export type ProtoStates = Record<ProtoType, 'neutral' | 'selected' | 'excluded'>;

export function dietaryOk(m: Meal, excluded: Set<string>): boolean {
  if (excluded.has('vegetarian') && m.tags.includes('meat')) return false;
  if (excluded.has('vegan') && (m.tags.includes('meat') || m.tags.includes('dairy') || m.tags.includes('eggs'))) return false;
  if (excluded.has('dairy') && m.tags.includes('dairy')) return false;
  if (excluded.has('gluten') && m.tags.includes('gluten')) return false;
  if (excluded.has('pork') && m.tags.includes('pork')) return false;
  if (excluded.has('seafood') && m.tags.includes('seafood')) return false;
  if (excluded.has('eggs') && m.tags.includes('eggs')) return false;
  if (excluded.has('nuts') && m.tags.includes('nuts')) return false;
  return true;
}

export function mealOk(m: Meal, protoStates: ProtoStates, excluded: Set<string>): boolean {
  const selP = (Object.keys(protoStates) as ProtoType[]).filter(k => protoStates[k] === 'selected');
  const exclP = (Object.keys(protoStates) as ProtoType[]).filter(k => protoStates[k] === 'excluded');
  if (exclP.includes(m.proto)) return false;
  if (selP.length > 0 && !selP.includes(m.proto)) return false;
  return dietaryOk(m, excluded);
}

export function buildVariedOptions(
  type: MealType,
  count: number,
  excludeNames: Set<string>,
  protoStates: ProtoStates,
  excluded: Set<string>,
): Meal[] {
  const eligible = MEALS.filter(m => {
    if (m.type !== type) return false;
    if (excludeNames.has(m.name)) return false;
    if (type === 'snack') return dietaryOk(m, excluded);
    return mealOk(m, protoStates, excluded);
  });

  if (eligible.length === 0) return [];

  const selectedProtos = (Object.keys(protoStates) as ProtoType[]).filter(k => protoStates[k] === 'selected');
  const result: Meal[] = [];
  const used = new Set<string>();

  if (selectedProtos.length > 0) {
    selectedProtos.forEach(proto => {
      const pool = eligible.filter(m => m.proto === proto && !used.has(m.name));
      if (pool.length > 0) {
        const pick = pool[Math.floor(Math.random() * pool.length)];
        result.push(pick);
        used.add(pick.name);
      }
    });
  }

  const remaining = eligible.filter(m => !used.has(m.name)).sort(() => Math.random() - 0.5);
  for (const m of remaining) {
    if (result.length >= count) break;
    result.push(m);
    used.add(m.name);
  }

  return result.slice(0, count).sort(() => Math.random() - 0.5);
}
