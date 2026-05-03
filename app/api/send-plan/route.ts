import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface PlanMeal {
  name: string;
  desc: string;
  proto: string;
  cal: number;
  pro: number;
  carb: number;
  fat: number;
  cost: number;
  days: number;
}

interface PlanSection {
  type: string;
  typeLabel: string;
  meals: PlanMeal[];
}

interface ShoppingEntry {
  name: string;
  qty: string;
  totalPrice: number;
}

interface SendPlanRequest {
  name: string;
  email: string;
  macros: { pro: number; carb: number; fat: number; cal: number };
  plan: PlanSection[];
  shopping: Record<string, ShoppingEntry[]>;
  weeklyTotal: number;
  budget: number;
}

function buildEmailHtml(req: SendPlanRequest): string {
  const { name, macros, plan, shopping, weeklyTotal, budget } = req;
  const isOver = weeklyTotal > budget;

  const mealPlanHtml = plan.map(section => {
    const mealRows = section.meals.map(m => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;vertical-align:top">
          <div style="font-size:13px;font-weight:600;color:#1a1a1a;margin-bottom:2px">${m.name}</div>
          <div style="font-size:11px;color:#888;margin-bottom:4px">${m.proto}</div>
          <div style="font-size:12px;color:#555;margin-bottom:4px;line-height:1.4">${m.desc}</div>
          <div style="font-size:11px;font-family:monospace;color:#666">
            ${m.cal} kcal &nbsp;·&nbsp; ${m.pro}g protein &nbsp;·&nbsp; ${m.carb}g carbs &nbsp;·&nbsp; ${m.fat}g fat
          </div>
        </td>
        <td style="padding:10px 0 10px 16px;border-bottom:1px solid #f0f0f0;vertical-align:top;white-space:nowrap;text-align:right">
          <div style="font-size:12px;color:#888;font-family:monospace">×${m.days}/wk</div>
          <div style="font-size:12px;color:#888;font-family:monospace">~$${(m.cost * m.days).toFixed(0)}</div>
        </td>
      </tr>
    `).join('');
    return `
      <div style="margin-bottom:24px">
        <div style="font-size:13px;font-weight:700;color:#2d7a3a;margin-bottom:8px;padding-bottom:6px;border-bottom:2px solid #e0f2e5">
          ${section.typeLabel}
        </div>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
          <tbody>${mealRows}</tbody>
        </table>
      </div>
    `;
  }).join('');

  const shopCats = ['Meat', 'Produce', 'Dairy', 'Pantry'];
  const shoppingHtml = shopCats.map(cat => {
    const items = shopping[cat];
    if (!items?.length) return '';
    const rows = items.map(item => `
      <tr>
        <td style="padding:7px 0;border-bottom:1px solid #f5f5f5;font-size:14px;color:#1a1a1a">${item.name}</td>
        <td style="padding:7px 0;border-bottom:1px solid #f5f5f5;font-size:12px;color:#888;font-family:monospace;text-align:right;white-space:nowrap">${item.qty}</td>
        <td style="padding:7px 0 7px 12px;border-bottom:1px solid #f5f5f5;font-size:12px;color:#888;font-family:monospace;text-align:right;white-space:nowrap">~$${item.totalPrice}</td>
      </tr>
    `).join('');
    return `
      <div style="margin-bottom:16px">
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#aaa;margin-bottom:6px;padding-bottom:4px;border-bottom:1px solid #e5e7eb">${cat}</div>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Your Meal Plan</title>
</head>
<body style="margin:0;padding:0;background:#f7f6f2;font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f6f2;padding:24px 0">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden">

          <!-- Header -->
          <tr>
            <td style="background:#1a1a1a;padding:24px 32px">
              <div style="font-size:20px;font-weight:600;color:#ffffff;letter-spacing:-0.3px">Joe&apos;s MealMap</div>
              <div style="font-size:13px;color:#888;margin-top:4px">plan · shop · eat</div>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:24px 32px 0">
              <p style="font-size:15px;line-height:1.6;color:#555;margin:0">
                Hi ${name ? name.split(' ')[0] : 'there'}! Here&apos;s your personalized meal plan for the week.
              </p>
            </td>
          </tr>

          <!-- Macro targets -->
          <tr>
            <td style="padding:20px 32px 0">
              <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#888;margin-bottom:12px">Daily Macro Targets</div>
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate;border-spacing:6px">
                <tr>
                  <td style="background:#f7f6f2;border-radius:8px;padding:12px;text-align:center">
                    <div style="font-size:22px;font-weight:600;font-family:monospace;color:#1a1a1a">${macros.cal}</div>
                    <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.06em;color:#888;margin-top:3px">kcal</div>
                  </td>
                  <td style="background:#edf7f0;border-radius:8px;padding:12px;text-align:center">
                    <div style="font-size:22px;font-weight:600;font-family:monospace;color:#1a6b35">${macros.pro}g</div>
                    <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.06em;color:#1a6b35;margin-top:3px">protein</div>
                  </td>
                  <td style="background:#edf3ff;border-radius:8px;padding:12px;text-align:center">
                    <div style="font-size:22px;font-weight:600;font-family:monospace;color:#2040a0">${macros.carb}g</div>
                    <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.06em;color:#2040a0;margin-top:3px">carbs</div>
                  </td>
                  <td style="background:#f5eeff;border-radius:8px;padding:12px;text-align:center">
                    <div style="font-size:22px;font-weight:600;font-family:monospace;color:#6020a0">${macros.fat}g</div>
                    <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.06em;color:#6020a0;margin-top:3px">fat</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Meal plan -->
          <tr>
            <td style="padding:20px 32px 0">
              <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#888;margin-bottom:16px">Your Week</div>
              ${mealPlanHtml}
            </td>
          </tr>

          <!-- Shopping list -->
          <tr>
            <td style="padding:8px 32px 0">
              <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#888;margin-bottom:16px">Shopping List</div>
              ${shoppingHtml}
            </td>
          </tr>

          <!-- Budget summary -->
          <tr>
            <td style="padding:0 32px 24px">
              <div style="background:#f7f6f2;border-radius:8px;padding:14px 16px;font-size:13px;color:#555">
                Est. weekly grocery total: <strong style="color:#1a1a1a">$${Math.round(weeklyTotal)}</strong>
                &nbsp;·&nbsp;
                <span style="color:${isOver ? '#c0392b' : '#2d7a3a'};font-weight:500">
                  ${isOver ? `$${Math.round(weeklyTotal - budget)} over` : `$${Math.round(budget - weeklyTotal)} under`} your $${budget} budget
                </span>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;background:#f7f6f2;text-align:center">
              <p style="font-size:12px;color:#aaa;margin:0">
                Generated with Joe&apos;s MealMap
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function POST(request: Request) {
  try {
    const body: SendPlanRequest = await request.json();
    const { email, name } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    const html = buildEmailHtml(body);
    const firstName = name ? name.split(' ')[0] : 'there';

    const from = process.env.RESEND_FROM_EMAIL || "Joe's MealMap <plan@joesmealmap.com>";

    const { error } = await resend.emails.send({
      from,
      to: email,
      subject: `Your meal plan for the week 🍽️`,
      html,
      text: `Hi ${firstName}! Your meal plan is ready. Open this email in a browser to view your full plan and shopping list.`,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Send plan error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
