import MealMap from '@/components/MealMap';

export const metadata = {
  title: 'Free Meal Planner & Macro Calculator',
  description:
    'Set your macro goals, choose meals for the week, and get an automatic grocery list. A free meal planning tool with high protein recipes.',
  alternates: {
    canonical: '/planner',
  },
};

export default function PlannerPage() {
  return <MealMap />;
}
