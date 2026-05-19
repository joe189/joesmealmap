import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function isRecipeSaved(slug: string): Promise<boolean> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from('saved_recipes')
    .select('slug')
    .eq('user_id', user.id)
    .eq('slug', slug)
    .maybeSingle();

  return !!data;
}

export async function saveRecipe(slug: string): Promise<{ error: Error | null }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: new Error('Not authenticated') };

  const { error } = await supabase
    .from('saved_recipes')
    .insert({ user_id: user.id, slug });

  return { error: error as Error | null };
}

export async function savePlan(planData: Record<string, unknown>): Promise<{ error: Error | null }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: new Error('Not authenticated') };

  const { error } = await supabase
    .from('saved_plans')
    .insert({ user_id: user.id, plan_data: planData });

  return { error: error as Error | null };
}

export async function unsaveRecipe(slug: string): Promise<{ error: Error | null }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: new Error('Not authenticated') };

  const { error } = await supabase
    .from('saved_recipes')
    .delete()
    .eq('user_id', user.id)
    .eq('slug', slug);

  return { error: error as Error | null };
}
