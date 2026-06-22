#!/usr/bin/env python3
"""Rewrite all recipe steps in meals-data.ts with specific, casual cooking instructions."""
import re, json, sys

FILE = '/Users/josephjennings/Desktop/JoesMealMap/lib/meals-data.ts'

def q(s):
    return s.replace('"', '\\"')

def ms(*tuples):
    parts = [f'{{step:{i+1},title:"{q(t)}",instruction:"{q(ins)}"}}' for i,(t,ins) in enumerate(tuples)]
    return '[' + ','.join(parts) + ']'

def gi(ings, *keywords):
    for kw in keywords:
        for i in ings:
            if kw.lower() in i['item'].lower():
                return i
    return None

def gq(ings, *keywords):
    i = gi(ings, *keywords)
    return i['quantity'] if i else ''

def gn(ings, *keywords):
    i = gi(ings, *keywords)
    return i['item'] if i else ''

def fmt(quantity, item):
    """Format 'quantity of item' naturally."""
    qty = quantity.strip()
    # strip trailing 'cooked' from quantity field (it belongs in item description)
    qty = re.sub(r'\s+cooked$', '', qty, flags=re.IGNORECASE).strip()
    # plain integer → '2 chicken breasts' not '2 of chicken breast'
    if re.match(r'^\d+$', qty):
        return f'{qty} {item}'
    return f'{qty} of {item}'

# ── archetype generators ────────────────────────────────────────────────────

def rice_bowl(name, ings):
    p = gi(ings,'chicken','beef','steak','turkey','pork','salmon','shrimp','tuna','fish','tofu','tempeh','edamame')
    g = gi(ings,'rice','quinoa','noodle','pasta')
    v = gi(ings,'broccoli','spinach','cucumber','zucchini','beans','corn','cabbage','green beans','peas','lettuce')
    s = gi(ings,'sauce','salsa','soy','teriyaki','buffalo','pesto','ranch','bbq','chili','honey','garlic','chipotle','sesame','sweet chili','garlic butter')
    ch = gi(ings,'cheese','parmesan','feta','mozzarella','cheddar')

    steps = []
    if p:
        pq = p['quantity']; pn = p['item']
        if any(x in pn.lower() for x in ['ground','pulled','cooked']):
            steps.append(("Heat the protein", f"Warm {fmt(pq, pn)} in a skillet over medium heat until hot, about 3 minutes."))
        elif 'salmon' in pn.lower():
            steps.append(("Sear the salmon", f"Pat {fmt(pq, pn)} dry, season with salt and pepper, and cook skin-side down in a hot oiled pan for 4 minutes. Flip and cook 2-3 more minutes until it flakes easily."))
        elif 'shrimp' in pn.lower():
            steps.append(("Cook the shrimp", f"Toss {fmt(pq, pn)} in a hot skillet with a little oil and cook 2 minutes per side until pink and slightly curled."))
        elif 'steak' in pn.lower():
            steps.append(("Sear the steak", f"Season {fmt(pq, pn)} generously with salt and pepper. Sear in a very hot cast iron pan, 3-4 minutes per side for medium. Rest 5 minutes, then slice thin against the grain."))
        elif 'tofu' in pn.lower() or 'tempeh' in pn.lower():
            steps.append(("Cook the protein", f"Press the {pn} dry if you have time, then cube it and cook in a hot oiled skillet until golden on two sides, about 4 minutes total."))
        else:
            steps.append(("Cook the protein", f"Season {fmt(pq, pn)} with salt and pepper. Cook in a skillet over medium-high heat until cooked through and nicely browned, then slice or chop."))
    if g:
        steps.append(("Warm the grain", f"If your {g['item']} is pre-cooked, microwave {fmt(g['quantity'], g['item'])} with a splash of water for 90 seconds. If cooking from scratch, follow the package."))
    if v:
        steps.append(("Cook the veg", f"Steam or microwave {fmt(v['quantity'], v['item'])} until just tender, about 3-4 minutes. You want it bright, not mushy."))
    steps.append(("Build the bowl", f"{'Rice' if g and 'rice' in g['item'].lower() else 'Grain'} goes in first, then the protein on top, then the vegetable alongside."))
    if s:
        steps.append(("Sauce it", f"Drizzle {fmt(s['quantity'], s['item'])} over everything and toss or leave layered — your call."))
    if ch:
        steps.append(("Add the cheese", f"Scatter {fmt(ch['quantity'], ch['item'])} over the top while everything's still warm so it melts slightly."))
    return ms(*steps) if steps else default_steps(name)

def wrap_steps(name, ings):
    p = gi(ings,'chicken','turkey','beef','steak','shrimp','tuna','pork')
    tort = gi(ings,'tortilla','wrap','pita')
    v = gi(ings,'lettuce','cabbage','spinach','tomato','cucumber','peppers','onion')
    s = gi(ings,'sauce','salsa','buffalo','ranch','pesto','dressing','tzatziki','hummus','chipotle','burger sauce')
    ch = gi(ings,'cheese','feta','parmesan','cheddar','mozzarella')

    steps = []
    if p:
        pn = p['item']; pq = p['quantity']
        if 'deli' in pn.lower() or re.match(r'^\d+$', pq.strip()):
            steps.append(("No cook protein", f"Your {pn} is ready to go — lay {fmt(pq, pn)} flat on the counter."))
        elif 'cooked' in pq.lower():
            steps.append(("Warm the protein", f"Heat {fmt(pq, pn)} in a skillet for 2-3 minutes until warmed through."))
        else:
            steps.append(("Cook the protein", f"Season {fmt(pq, pn)} and cook in a skillet over medium-high heat until cooked through, then slice or chop it."))
    if tort:
        steps.append(("Warm the tortilla", f"Heat the {tort['item']} in a dry pan for 30 seconds per side — it should puff slightly and get pliable."))
    if s:
        steps.append(("Sauce first", f"Spread {fmt(s['quantity'], s['item'])} across the center of the tortilla, leaving a 1-inch border so it doesn't squeeze out."))
    if v:
        where = "on top of the sauce" if s else "on the tortilla"
        steps.append(("Add the vegetables", f"Pile {fmt(v['quantity'], v['item'])} {where}."))
    steps.append(("Layer the protein", f"Add the {p['item'] if p else 'protein'} on top of the vegetables."))
    if ch:
        steps.append(("Cheese it", f"Sprinkle {fmt(ch['quantity'], ch['item'])} over the protein."))
    steps.append(("Roll it tight", "Fold in the sides, then roll away from you firmly. Slice in half on a diagonal so it stays together."))
    return ms(*steps) if steps else default_steps(name)

def pasta_steps(name, ings):
    p = gi(ings,'chicken','beef','shrimp','turkey','pork','steak')
    pasta = gi(ings,'pasta','noodle','mac')
    s = gi(ings,'sauce','marinara','pesto','alfredo','buffalo','cream','parmesan','cajun')
    ch = gi(ings,'parmesan','mozzarella','cheese','cheddar')
    sp = gi(ings,'spinach','broccoli','tomato','peppers')

    steps = []
    if pasta:
        steps.append(("Cook the pasta", f"Boil {pasta['item']} in well-salted water until al dente — about 1 minute less than the package says. Drain and save a splash of pasta water."))
    if p:
        pn = p['item']; pq = p['quantity']
        if 'cooked' in pq.lower():
            steps.append(("Heat the protein", f"Warm {pq} of {pn} in a skillet until hot."))
        else:
            steps.append(("Cook the protein", f"Season {pq} of {pn} and cook in a hot pan until done, then slice or chop."))
    if sp:
        steps.append(("Cook the veg", f"If using {sp['item']}, toss it into the hot pan for 1-2 minutes until just wilted."))
    if s:
        steps.append(("Add the sauce", f"Pour {s['quantity']} of {s['item']} into the pan and let it heat through for 1-2 minutes."))
    steps.append(("Combine everything", f"Toss the drained pasta into the sauce and stir to coat. Add a splash of pasta water if it looks tight."))
    if ch:
        steps.append(("Finish with cheese", f"Grate or sprinkle {ch['quantity']} of {ch['item']} on top and serve hot."))
    return ms(*steps) if steps else default_steps(name)

def skillet_steps(name, ings):
    p = gi(ings,'chicken','beef','pork','turkey','sausage','bacon','steak')
    pot = gi(ings,'potato','potatoes')
    veg = gi(ings,'pepper','onion','spinach','broccoli','zucchini','coleslaw','cabbage')
    s = gi(ings,'sauce','salsa','soy','taco','bbq','seasoning','chili','garlic','ranch','buffalo')
    ch = gi(ings,'cheese','cheddar','parmesan','mozzarella','provolone')

    steps = []
    if pot:
        steps.append(("Start the potatoes", f"Heat oil in a large skillet over medium-high. Add {fmt(pot['quantity'], pot['item'])} and cook without stirring for 3-4 minutes until a golden crust forms, then stir and cook 3 more minutes."))
    if p:
        pn = p['item']; pq = p['quantity']
        if 'cooked' in pq.lower() or 'strips' in pq.lower():
            if pot:
                steps.append(("Add the protein", f"Push the potatoes to one side and add {fmt(pq, pn)}. Cook until heated through and slightly caramelized, about 2-3 minutes."))
            else:
                steps.append(("Heat the protein", f"Add {fmt(pq, pn)} to a hot skillet and cook until heated through and caramelized, about 3 minutes."))
        else:
            steps.append(("Cook the protein", f"Add {fmt(pq, pn)} to the skillet and cook until browned, breaking it up as needed, about 4-5 minutes."))
    if veg:
        steps.append(("Add the veg", f"Throw in {veg['quantity']} of {veg['item']} and cook 2 minutes until just softened."))
    if s:
        steps.append(("Season it", f"Add {s['quantity']} of {s['item']} and toss everything together so it gets evenly coated."))
    if ch:
        steps.append(("Melt the cheese", f"Sprinkle {ch['quantity']} of {ch['item']} over the top, cover the pan for 1 minute so it melts, then serve straight from the skillet."))
    else:
        steps.append(("Serve it up", "Serve straight from the skillet while it's still sizzling."))
    return ms(*steps) if steps else default_steps(name)

def oatmeal_steps(name, ings):
    oat = gi(ings,'oat','oats')
    milk = gi(ings,'milk','almond milk','water')
    pp = gi(ings,'protein powder')
    fruit = gi(ings,'banana','berries','blueberries','strawberries','apple','pumpkin')
    pb = gi(ings,'peanut butter','almond butter','nut butter')
    extra = gi(ings,'cinnamon','cocoa','honey','maple','cream cheese')
    yog = gi(ings,'yogurt')

    steps = []
    if milk and oat:
        steps.append(("Cook the oats", f"Bring {milk['quantity']} of {milk['item']} to a simmer in a small pot. Add {oat['quantity']} of {oat['item']} and cook on medium-low, stirring occasionally, until thick and creamy — about 3-5 minutes."))
    elif oat:
        steps.append(("Cook the oats", f"Microwave {oat['quantity']} of {oat['item']} with 1 cup of water for 2 minutes, stir, and microwave 1 more minute."))
    if pp:
        steps.append(("Stir in protein", f"Remove from heat and immediately stir in {pp['quantity']} of {pp['item']}. Do this off the heat so it stays smooth, not grainy."))
    if yog:
        steps.append(("Add yogurt", f"Stir in {yog['quantity']} of {yog['item']} for extra creaminess and protein."))
    if extra:
        steps.append(("Flavor it", f"Stir in {extra['quantity']} of {extra['item']} and mix well."))
    if pb:
        steps.append(("Peanut butter swirl", f"Drop {pb['quantity']} of {pb['item']} on top and swirl it in."))
    if fruit:
        steps.append(("Add the fruit", f"Top with {fruit['quantity']} of {fruit['item']} and serve while hot."))
    else:
        steps.append(("Top and serve", "Pour into a bowl and add your toppings. Eat while it's still warm."))
    return ms(*steps) if steps else default_steps(name)

def yogurt_bowl_steps(name, ings):
    yog = gi(ings,'yogurt','cottage cheese')
    pp = gi(ings,'protein powder')
    fruit = gi(ings,'berries','banana','strawberries','blueberries','pineapple','apple','peach')
    gran = gi(ings,'granola')
    honey = gi(ings,'honey','maple','cinnamon')
    nut = gi(ings,'almond','walnut','peanut butter','almond butter')
    cream = gi(ings,'cream cheese')

    steps = []
    if yog:
        steps.append(("Add the base", f"Spoon {yog['quantity']} of {yog['item']} into a bowl. It should be cold and thick."))
    if pp:
        steps.append(("Mix in protein", f"Stir {pp['quantity']} of {pp['item']} into the yogurt until fully combined and smooth."))
    if cream:
        steps.append(("Add cream cheese", f"Drop in {cream['quantity']} of {cream['item']} and mix it in for that cheesecake flavor."))
    if fruit:
        steps.append(("Add fruit", f"Pile {fruit['quantity']} of {fruit['item']} on top."))
    if gran:
        steps.append(("Granola last", f"Add {gran['quantity']} of {gran['item']} right before eating so it stays crunchy."))
    if honey:
        steps.append(("Finish it", f"Drizzle {honey['quantity']} of {honey['item']} over the top and eat right away."))
    if nut and not gran:
        steps.append(("Add crunch", f"Scatter {nut['quantity']} of {nut['item']} on top."))
    if not steps:
        steps = [("Spoon into bowl", "Add your yogurt to a bowl."),("Top and eat","Add toppings and eat cold.")]
    return ms(*steps)

def toast_steps(name, ings):
    bread = gi(ings,'bread','toast','bagel','muffin','waffle')
    p = gi(ings,'egg','turkey','ham','salmon','tuna','sausage','chicken','bacon')
    spread = gi(ings,'avocado','cream cheese','ricotta','hummus','cottage cheese','peanut butter','almond butter')
    ch = gi(ings,'cheese','cheddar','mozzarella')
    top = gi(ings,'berries','tomato','salsa','honey','maple','jam')
    seas = gi(ings,'seasoning','pepper flakes','everything bagel','salt')

    steps = []
    if bread:
        steps.append(("Toast the bread", f"Toast {bread['quantity']} of {bread['item']} until golden and crisp. If it's a bagel or muffin, split it first."))
    if p:
        pn = p['item']; pq = p['quantity']
        if 'egg' in pn.lower():
            steps.append(("Cook the egg", f"Cook {pq} {pn} however you like them — fried, scrambled, or a quick microwave scramble works."))
        elif 'deli' in pn.lower() or 'slices' in pq.lower():
            steps.append(("Layer the protein", f"Lay {pq} of {pn} on the toast."))
        else:
            steps.append(("Cook the protein", f"Cook {pq} of {pn} in a skillet until done, then slice or place on the toast."))
    if spread:
        steps.append(("Spread it", f"Spread {spread['quantity']} of {spread['item']} across the hot toast — mash the avocado with a fork if using."))
    if ch:
        steps.append(("Add cheese", f"Lay {ch['quantity']} of {ch['item']} on top while the toast is still hot so it gets melty."))
    if top:
        steps.append(("Add toppings", f"Top with {top['quantity']} of {top['item']}."))
    if seas:
        steps.append(("Season it", f"Finish with {seas['quantity']} of {seas['item']} and eat right away before the toast gets soggy."))
    else:
        steps.append(("Eat immediately", "Eat right away while the toast is still crispy."))
    return ms(*steps) if steps else default_steps(name)

def egg_steps(name, ings):
    egg = gi(ings,'egg','egg white')
    fill = gi(ings,'spinach','pepper','mushroom','onion','tomato','broccoli','cabbage','kale')
    ch = gi(ings,'cheese','cheddar','mozzarella','feta')
    p = gi(ings,'turkey','bacon','salmon','shrimp','ham','sausage','chicken','beef','pork')
    s = gi(ings,'salsa','hot sauce','sriracha')

    steps = []
    if egg:
        eq = egg['quantity']; en = egg['item']
        if 'white' in en.lower():
            steps.append(("Pour egg whites", f"Pour {eq} of {en} into a bowl — no whisking needed."))
        else:
            steps.append(("Crack and whisk", f"Crack {eq} eggs into a bowl and whisk until the yolks and whites are fully combined. Season with salt and pepper."))
    steps.append(("Heat the pan", "Get a non-stick skillet over medium heat and add a small spray of oil or pat of butter."))
    if p:
        steps.append(("Cook the protein", f"Add {p['quantity']} of {p['item']} to the pan first and cook until browned, about 2-3 minutes."))
    if fill:
        steps.append(("Add the filling", f"Throw in {fill['quantity']} of {fill['item']} and stir for 1 minute until slightly softened."))
    if egg:
        if 'omelette' in name.lower() or 'omelet' in name.lower():
            steps.append(("Pour in eggs", "Pour the eggs in and let them sit undisturbed for 30 seconds until the edges set."))
            if ch:
                steps.append(("Add cheese and fold", f"Sprinkle {ch['quantity']} of {ch['item']} on one half, then fold the omelette over and slide onto a plate."))
            else:
                steps.append(("Fold it", "Fold the omelette in half and slide onto a plate."))
        else:
            steps.append(("Scramble the eggs", "Pour in the eggs and use a spatula to gently push them from the edges to the center. Pull off heat when still slightly shiny — they'll finish cooking on their own."))
            if ch:
                steps.append(("Add cheese", f"Sprinkle {ch['quantity']} of {ch['item']} on top right when you pull the pan off heat."))
    if s:
        steps.append(("Top and serve", f"Plate it and hit it with {s['quantity']} of {s['item']}."))
    else:
        steps.append(("Serve hot", "Plate it while it's still steaming and eat right away."))
    return ms(*steps) if steps else default_steps(name)

def soup_steps(name, ings):
    p = gi(ings,'chicken','beef','turkey','pork','sausage')
    beans = gi(ings,'beans','lentil','chickpea','kidney')
    veg = gi(ings,'carrot','celery','onion','potato','kale','spinach','tomato','pepper','broccoli')
    broth = gi(ings,'broth','stock','sauce','coconut milk')
    seas = gi(ings,'seasoning','chili','taco','paprika','cumin','curry')
    grain = gi(ings,'rice','pasta','noodle')
    # avoid using the same ingredient as both seasoning and broth
    if seas and broth and seas['item'] == broth['item']:
        broth = None

    steps = []
    if p:
        pn = p['item']; pq = p['quantity']
        if 'cooked' in pq.lower() or 'pulled' in pn.lower():
            steps.append(("Start with protein", f"Add {fmt(pq, pn)} to a pot over medium heat."))
        else:
            steps.append(("Brown the protein", f"Cook {fmt(pq, pn)} in a pot over medium-high heat, breaking it up, until browned — about 4-5 minutes. Drain any extra fat."))
    if veg:
        steps.append(("Add the veg", f"Toss in {fmt(veg['quantity'], veg['item'])} and cook for 2 minutes until slightly softened."))
    if seas:
        steps.append(("Season it", f"Add {fmt(seas['quantity'], seas['item'])} and stir to coat everything."))
    if beans:
        steps.append(("Add beans", f"Pour in {fmt(beans['quantity'], beans['item'])} and stir."))
    if broth:
        steps.append(("Add liquid", f"Pour in {fmt(broth['quantity'], broth['item'])} and bring to a boil, then reduce to a simmer."))
    else:
        steps.append(("Add liquid", "Pour in enough broth to cover everything and bring to a simmer."))
    if grain:
        steps.append(("Add grain", f"Stir in {fmt(grain['quantity'], grain['item'])} and cook until tender."))
    steps.append(("Simmer and taste", "Let it simmer 10-15 minutes until everything is cooked through and the flavors come together. Taste and adjust salt."))
    return ms(*steps) if steps else default_steps(name)

def salad_steps(name, ings):
    p = gi(ings,'chicken','beef','steak','salmon','shrimp','tuna','pork','turkey','egg')
    greens = gi(ings,'lettuce','romaine','spinach','arugula','mixed greens','kale','cabbage')
    veg = gi(ings,'tomato','cucumber','avocado','feta','olives','corn','beet','crouton')
    dressing = gi(ings,'dressing','vinegar','olive oil','lemon','caesar','ranch','balsamic','tahini')
    ch = gi(ings,'cheese','feta','parmesan','mozzarella')

    steps = []
    if p:
        pn = p['item']; pq = p['quantity']
        if 'deli' in pn.lower() or 'canned' in pn.lower() or 'cooked' in pq.lower():
            steps.append(("Prep the protein", f"Your {pn} is ready — drain it if canned, or slice if pre-cooked."))
        elif 'egg' in pn.lower():
            steps.append(("Boil and chop", f"Hard boil {pq} {pn} (10 minutes in boiling water), cool in ice water, peel, and chop them."))
        else:
            steps.append(("Cook the protein", f"Season {pq} of {pn} and cook in a hot pan until done. Let it rest 2 minutes, then slice it thin."))
    if greens:
        steps.append(("Build the base", f"Add {greens['quantity']} of {greens['item']} to a wide bowl or plate and spread them out."))
    if veg:
        steps.append(("Add the veg", f"Scatter {veg['quantity']} of {veg['item']} over the greens."))
    if ch:
        steps.append(("Add cheese", f"Crumble or shave {ch['quantity']} of {ch['item']} over the top."))
    steps.append(("Add protein", f"Place the {p['item'] if p else 'protein'} on top."))
    if dressing:
        steps.append(("Dress it", f"Drizzle {dressing['quantity']} of {dressing['item']} over everything. Toss gently if you want it coated, or leave it layered."))
    return ms(*steps) if steps else default_steps(name)

def smoothie_steps(name, ings):
    pp = gi(ings,'protein powder')
    liquid = gi(ings,'milk','almond milk','water','yogurt')
    fruit = gi(ings,'banana','berries','mango','strawberries','blueberries','pineapple')
    fat = gi(ings,'peanut butter','almond butter','nut butter','avocado')
    grain = gi(ings,'oats','oat')

    steps = [("Add to blender", "Start with the liquid — it helps everything blend smoothly.")]
    if grain:
        steps.append(("Add oats", f"Toss in {grain['quantity']} of {grain['item']} — they add thickness and keep you full."))
    if fruit:
        steps.append(("Add fruit", f"Add {fruit['quantity']} of {fruit['item']}. Frozen works best — it makes it thicker without needing ice."))
    if pp:
        steps.append(("Add protein", f"Scoop in {pp['quantity']} of {pp['item']}."))
    if fat:
        steps.append(("Add fat", f"Spoon in {fat['quantity']} of {fat['item']}."))
    if liquid:
        steps.append(("Blend it", f"You already added the {liquid['item']}, so blend on high for 30-45 seconds until completely smooth. Taste it — add more liquid if too thick."))
    else:
        steps.append(("Blend", "Blend on high for 30-45 seconds until smooth."))
    steps.append(("Pour and drink", "Pour into a glass and drink right away before it settles."))
    return ms(*steps)

def pancake_steps(name, ings):
    batter = gi(ings,'pancake mix','waffle','protein pancake','mix')
    egg = gi(ings,'egg')
    milk = gi(ings,'milk','almond milk')
    pp = gi(ings,'protein powder')
    fruit = gi(ings,'berry','berries','banana','blueberries','strawberries','apple')
    syrup = gi(ings,'maple syrup','honey','syrup')
    pb = gi(ings,'peanut butter','almond butter')

    steps = []
    if batter:
        base = batter['item']
        if egg and milk:
            steps.append(("Mix the batter", f"Combine {batter['quantity']} of {base}, {egg['quantity']} egg, and {milk['quantity']} of {milk['item']} in a bowl. Stir just until combined — lumps are fine."))
        elif egg:
            steps.append(("Mix the batter", f"Combine {batter['quantity']} of {base} and {egg['quantity']} egg in a bowl with a splash of water. Stir to combine."))
        else:
            steps.append(("Mix the batter", f"Mix {batter['quantity']} of {base} according to package directions."))
    if pp:
        steps.append(("Add protein", f"Stir {pp['quantity']} of {pp['item']} into the batter until smooth."))
    steps.append(("Heat the pan", "Heat a non-stick skillet or griddle over medium heat. Add a tiny spray of oil or small pat of butter."))
    steps.append(("Cook the pancakes", "Pour about 1/4 cup of batter per pancake. Cook until bubbles form and pop on the surface and edges look set, about 2 minutes. Flip and cook 1 more minute."))
    if fruit:
        steps.append(("Add fruit", f"Top with {fruit['quantity']} of {fruit['item']}."))
    if pb:
        steps.append(("Nut butter drizzle", f"Add {pb['quantity']} of {pb['item']} on top."))
    if syrup:
        steps.append(("Finish", f"Drizzle {syrup['quantity']} of {syrup['item']} over everything and eat while hot."))
    return ms(*steps) if steps else default_steps(name)

def fajita_steps(name, ings):
    p = gi(ings,'chicken','beef','steak','shrimp','turkey')
    pep = gi(ings,'pepper','peppers')
    onion = gi(ings,'onion','onions')
    tort = gi(ings,'tortilla','wrap')
    seas = gi(ings,'fajita','seasoning','taco')
    ch = gi(ings,'cheese','cheddar','mozzarella')

    steps = []
    if p:
        steps.append(("Slice the protein", f"Slice {p['quantity']} of {p['item']} into thin strips — about 1/4 inch thick so they cook fast."))
    if seas:
        steps.append(("Season everything", f"Toss the protein and vegetables with {seas['quantity']} of {seas['item']} until evenly coated."))
    steps.append(("Get the pan ripping hot", "Heat a cast iron or heavy skillet over high heat until it's smoking slightly."))
    if p:
        steps.append(("Sear the protein", f"Cook the {p['item']} strips in a single layer without moving for 2 minutes to get a char, then stir and cook 2 more minutes."))
    if pep and onion:
        steps.append(("Cook the veg", f"Remove the protein and add {pep['quantity']} of {pep['item']} and {onion['quantity']} of {onion['item']}. Cook 3-4 minutes until they get some char and start to soften."))
    elif pep:
        steps.append(("Cook the peppers", f"Cook {pep['quantity']} of {pep['item']} in the same pan for 3-4 minutes."))
    if tort:
        steps.append(("Warm the tortilla", f"Heat {tort['item']} in a dry pan or over a gas flame for 20-30 seconds per side."))
    steps.append(("Assemble", "Load the protein and veg into the tortilla. Add any toppings and fold."))
    return ms(*steps) if steps else default_steps(name)

def lettuce_cup_steps(name, ings):
    p = gi(ings,'pork','chicken','beef','turkey','shrimp')
    lett = gi(ings,'lettuce')
    s = gi(ings,'hoisin','soy','sauce')
    veg = gi(ings,'water chestnut','carrot','onion','ginger','garlic')

    steps = []
    if p:
        steps.append(("Cook the meat", f"Cook {p['quantity']} of {p['item']} in a hot skillet over medium-high heat, breaking it up with a spoon, until fully cooked through and browned — about 5-6 minutes."))
    if veg:
        steps.append(("Add the veg", f"Stir in {veg['quantity']} of {veg['item']} and cook 2 more minutes until fragrant."))
    if s:
        steps.append(("Sauce it", f"Add {s['quantity']} of {s['item']} and toss to coat. Cook 1 more minute."))
    if lett:
        steps.append(("Prep the cups", f"Separate {lett['item'] if lett else 'lettuce'} into individual cups, rinse, and pat dry."))
    steps.append(("Fill and eat", "Spoon the filling into each lettuce cup. Pick them up like a taco and eat immediately."))
    return ms(*steps) if steps else default_steps(name)

def ramen_steps(name, ings):
    p = gi(ings,'chicken','beef','pork','shrimp','egg')
    noodle = gi(ings,'ramen','noodle')
    s = gi(ings,'sauce','soy','chili','miso','broth')
    veg = gi(ings,'spinach','bok choy','corn','onion','mushroom')
    egg = gi(ings,'egg')

    steps = []
    if noodle:
        steps.append(("Cook the noodles", f"Cook {noodle['quantity']} of {noodle['item']} in boiling water according to package — usually 2-3 minutes. Drain and set aside."))
    if p and 'egg' not in p['item'].lower():
        steps.append(("Cook the protein", f"Cook {p['quantity']} of {p['item']} in a hot pan until done, then slice or shred."))
    if egg:
        steps.append(("Soft boil the egg", f"Bring water to a boil and gently lower in {egg['quantity']} egg. Cook exactly 6.5 minutes for jammy, 7 for fully set. Ice bath for 2 minutes, then peel."))
    if veg:
        steps.append(("Cook the veg", f"Quickly sauté {veg['quantity']} of {veg['item']} in the same pan for 1-2 minutes."))
    if s:
        steps.append(("Make the broth", f"In your bowl, mix {s['quantity']} of {s['item']} with 1.5 cups of hot water. Taste and adjust."))
    else:
        steps.append(("Build the broth", "Mix the ramen seasoning packet with hot water in your bowl."))
    steps.append(("Build the bowl", "Add noodles to the broth, then pile on the protein, egg halved lengthwise, and veg."))
    return ms(*steps) if steps else default_steps(name)

def snack_steps(name, ings):
    n = name.lower()
    if 'shake' in n or 'smoothie' in n:
        return smoothie_steps(name, ings)
    if 'yogurt' in n or 'cottage cheese' in n:
        return yogurt_bowl_steps(name, ings)
    if 'boiled egg' in n or 'hard-boil' in n:
        egg = gi(ings,'egg')
        av = gi(ings,'avocado')
        steps = [("Boil the eggs", f"Place {egg['quantity'] if egg else '2'} eggs in a pot, cover with cold water, bring to a boil, then cook 10 minutes. Transfer to ice water immediately."),
                 ("Peel them", "Gently crack each egg all over and peel under cool running water.")]
        if av:
            steps.append(("Prep avocado", f"Slice {av['quantity']} of avocado and season with salt."))
        steps.append(("Eat", "Slice eggs in half and eat with the avocado. Add hot sauce if you want."))
        return ms(*steps)
    if 'tuna' in n and 'cracker' in n:
        tuna = gi(ings,'tuna')
        crack = gi(ings,'cracker')
        return ms(("Open the tuna", f"Drain {tuna['quantity'] if tuna else '1 can'} of tuna and dump it in a bowl."),
                  ("Season it", "Mix with a squeeze of lemon or a little salt and pepper."),
                  ("Load the crackers", f"Spoon tuna onto each cracker and eat right away."))
    if 'roll-up' in n or 'roll up' in n:
        p = gi(ings,'turkey','chicken','beef')
        ch = gi(ings,'cheese','cream cheese')
        return ms(("Lay out the turkey", f"Lay {p['quantity'] if p else '5 slices'} of deli meat flat on a cutting board."),
                  ("Add the filling", f"Put a thin layer of {ch['item'] if ch else 'cheese'} at one end of each slice."),
                  ("Roll them up", "Roll each slice tightly from the cheese end. Skewer with a toothpick if they won't stay closed."))
    if 'jerky' in n:
        return ms(("Open the bag", "That's it — rip open the beef jerky."),
                  ("Pair with apple", "Slice the apple and eat them together. The sweetness balances the salt perfectly."))
    if 'shrimp cocktail' in n:
        shrimp = gi(ings,'shrimp')
        sauce = gi(ings,'cocktail sauce','sauce')
        return ms(("Chill the shrimp", f"If your {shrimp['item'] if shrimp else 'shrimp'} isn't already cold, rinse under cold water for 1 minute."),
                  ("Set up the plate", f"Arrange shrimp around a small bowl of {sauce['item'] if sauce else 'cocktail sauce'}."),
                  ("Dip and eat", "Dip each shrimp in the sauce, squeeze a little lemon on top if you have it."))
    # generic snack
    steps = [("Prep it", f"Get everything out and portion it — no cooking needed."),
             ("Eat it", "Combine and eat.")]
    return ms(*steps)

def dessert_steps(name, ings):
    n = name.lower()
    yog = gi(ings,'yogurt')
    pp = gi(ings,'protein powder')
    fruit = gi(ings,'fruit','berries','banana','strawberries','blueberries','raspberry','cherry','apple')
    top = gi(ings,'toppings','granola','chocolate','peanut butter','cookie','oreo','caramel','honey','cinnamon')

    # special cases
    if 'frozen' in n and 'bark' in n:
        return ms(("Mix the base", f"Stir {pp['quantity'] if pp else '1 scoop'} of protein powder into {yog['quantity'] if yog else '1 cup'} of Greek yogurt until smooth."),
                  ("Spread thin", "Spread the mixture onto a parchment-lined baking sheet in a thin even layer."),
                  ("Add toppings", f"Scatter {fruit['quantity'] if fruit else 'your fruit'} and any toppings across the surface."),
                  ("Freeze", "Freeze for at least 2 hours until solid."),
                  ("Break and eat", "Break into pieces and eat straight from the freezer. Store leftovers in a zip bag."))
    if 'mug cake' in n:
        return ms(("Mix in the mug", "Add all ingredients to a large mug and stir until a smooth batter forms."),
                  ("Microwave", "Microwave on high for 60-75 seconds. The center should look just set — it will firm up as it cools."),
                  ("Rest briefly", "Let it sit 1 minute before eating — it'll be very hot."),
                  ("Add toppings", f"Top with {top['item'] if top else 'your toppings'} and eat right from the mug."))
    if 'oats' in n or 'overnight' in n:
        return ms(("Cook oats", "Cook 1/2 cup oats in 1 cup milk over medium heat until creamy."),
                  ("Mix in protein", f"Remove from heat and stir in {pp['quantity'] if pp else '1 scoop'} of {pp['item'] if pp else 'protein powder'} until smooth."),
                  ("Add flavor", f"Stir in your {top['item'] if top else 'flavoring'}."),
                  ("Top and eat", f"Pour into a bowl and top with {fruit['item'] if fruit else 'toppings'}."))
    if 'frozen' in n and ('bites' in n or 'yogurt' in n):
        return ms(("Mix", f"Stir {pp['quantity'] if pp else '1 scoop'} of protein powder into {yog['quantity'] if yog else '1 cup'} of yogurt until smooth."),
                  ("Fill a tray", "Spoon the mixture into an ice cube tray or silicone mold."),
                  ("Add toppings", f"Press {top['item'] if top else 'toppings'} into the top of each one."),
                  ("Freeze", "Freeze at least 2 hours until solid. Pop out and eat."))
    # generic dessert bowl
    return ms(("Mix yogurt and protein", f"Add {yog['quantity'] if yog else '1 cup'} of Greek yogurt to a bowl and stir in {pp['quantity'] if pp else '1 scoop'} of {pp['item'] if pp else 'protein powder'} until completely smooth."),
              ("Flavor it", f"Mix in {top['item'] if top else 'any flavoring'} to match the dessert vibe you're going for."),
              ("Add toppings", f"Pile {fruit['quantity'] if fruit else '1/2 cup'} of {fruit['item'] if fruit else 'fruit or toppings'} on top."),
              ("Chill and eat", "Eat right away or refrigerate 30 minutes for a thicker, pudding-like texture."))

def default_steps(name):
    return ms(("Heat it up", "Cook any proteins and vegetables in a skillet over medium-high heat until done."),
              ("Season well", "Season with salt, pepper, and any spices called for."),
              ("Assemble", "Combine all components and eat warm."))

def taco_bowl_steps(name, ings):
    return rice_bowl(name, ings)

def breakfast_bowl_steps(name, ings):
    p = gi(ings,'turkey','chicken','beef','pork','sausage','bacon')
    egg = gi(ings,'egg')
    base = gi(ings,'rice','potato','potatoes','sweet potato')
    s = gi(ings,'salsa','hot sauce','sauce')
    ch = gi(ings,'cheese','cheddar')

    steps = []
    if base:
        steps.append(("Cook the base", f"Heat {base['quantity']} of {base['item']} in a skillet with a little oil over medium-high until golden and crispy on the outside, about 4-5 minutes."))
    if p:
        pn = p['item']; pq = p['quantity']
        if 'cooked' in pq.lower():
            steps.append(("Heat the protein", f"Add {pq} of {pn} to the skillet and stir to combine with the base. Cook until warmed through."))
        else:
            steps.append(("Cook the protein", f"Add {pq} of {pn} and cook, breaking up as needed, until browned and cooked through."))
    if egg:
        eq = egg['quantity']
        steps.append(("Cook the eggs", f"Push everything to the side of the pan. Crack {eq} eggs in the cleared space and cook to your preference — scrambled, fried, whatever you like."))
    if ch:
        steps.append(("Add cheese", f"Scatter {ch['quantity']} of {ch['item']} over the hot mix so it melts."))
    if s:
        steps.append(("Top and serve", f"Spoon into a bowl and hit it with {s['quantity']} of {s['item']}."))
    else:
        steps.append(("Serve it", "Transfer to a bowl and eat right away."))
    return ms(*steps) if steps else default_steps(name)

# ── main dispatcher ─────────────────────────────────────────────────────────

def generate_steps_for_recipe(name, ingredients, meal_type, slug):
    n = name.lower()

    if meal_type == 'dessert':
        return dessert_steps(name, ingredients)
    if meal_type == 'snack':
        return snack_steps(name, ingredients)

    # breakfast-specific
    if meal_type == 'breakfast':
        if 'shake' in n or 'smoothie' in n:
            return smoothie_steps(name, ingredients)
        if 'oat' in n or 'oatmeal' in n:
            return oatmeal_steps(name, ingredients)
        if 'pancake' in n or 'waffle' in n or 'french toast' in n:
            return pancake_steps(name, ingredients)
        if 'yogurt' in n or 'parfait' in n or 'chia' in n or 'ricotta' in n or 'cottage cheese' in n and 'fruit' in n:
            return yogurt_bowl_steps(name, ingredients)
        if 'toast' in n or 'bagel' in n or 'muffin' in n:
            return toast_steps(name, ingredients)
        if 'bowl' in n or 'skillet' in n or 'hash' in n:
            return breakfast_bowl_steps(name, ingredients)
        if 'scramble' in n or 'omelette' in n or 'omelet' in n or 'egg' in n:
            return egg_steps(name, ingredients)
        if 'wrap' in n or 'burrito' in n or 'quesadilla' in n:
            return wrap_steps(name, ingredients)
        # default breakfast
        return egg_steps(name, ingredients)

    # lunch/dinner
    if 'wrap' in n or 'pita' in n:
        return wrap_steps(name, ingredients)
    if 'burrito' in n or 'quesadilla' in n:
        return wrap_steps(name, ingredients)
    if 'pasta' in n or 'noodle' in n or 'mac' in n or 'ramen' in n:
        if 'ramen' in n:
            return ramen_steps(name, ingredients)
        return pasta_steps(name, ingredients)
    if 'soup' in n or 'chili' in n or 'stew' in n or 'curry' in n or 'tikka' in n:
        return soup_steps(name, ingredients)
    if 'salad' in n:
        return salad_steps(name, ingredients)
    if 'skillet' in n or 'hash' in n or 'stir fry' in n or 'stir-fry' in n or 'fried rice' in n or 'egg roll' in n:
        return skillet_steps(name, ingredients)
    if 'fajita' in n:
        return fajita_steps(name, ingredients)
    if 'lettuce cup' in n or 'lettuce wrap' in n:
        return lettuce_cup_steps(name, ingredients)
    if 'taco' in n and 'bowl' in n:
        return rice_bowl(name, ingredients)
    if 'melt' in n or 'sandwich' in n:
        return toast_steps(name, ingredients)
    if 'stuffed pepper' in n:
        p = gi(ingredients,'beef','turkey','chicken','pork')
        rice = gi(ingredients,'rice')
        sauce = gi(ingredients,'sauce','tomato','salsa')
        ch = gi(ingredients,'cheese')
        steps = [("Preheat oven", "Preheat oven to 375°F."),
                 ("Prep the peppers", "Cut the tops off each bell pepper and remove the seeds and ribs.")]
        if p and rice:
            steps.append(("Mix the filling", f"Combine {p['quantity']} of {p['item']}, {rice['quantity']} of {rice['item']}, and {sauce['quantity'] if sauce else '1/2 cup'} of {sauce['item'] if sauce else 'tomato sauce'} in a bowl."))
        steps.append(("Stuff them", "Pack the filling tightly into each pepper."))
        if ch:
            steps.append(("Top with cheese", f"Sprinkle {ch['quantity']} of {ch['item']} on top of each pepper."))
        steps.append(("Bake", "Bake uncovered for 25-30 minutes until the peppers are tender and the filling is cooked through."))
        return ms(*steps)
    if 'bowl' in n:
        return rice_bowl(name, ingredients)
    if 'plate' in n or 'mash' in n or 'roasted veg' in n or 'green bean' in n or 'potatoes' in n.replace('sweet potato',''):
        p = gi(ingredients,'chicken','beef','turkey','pork','steak','fish')
        pot = gi(ingredients,'potato','potatoes','sweet potato')
        veg = gi(ingredients,'green bean','broccoli','asparagus','spinach','vegetable')
        s = gi(ingredients,'sauce','dressing','butter','bbq','lemon herb')
        steps = []
        if p:
            steps.append(("Cook the protein", f"Season {fmt(p['quantity'], p['item'])} and cook in a skillet or oven until done. Rest 3 minutes before cutting."))
        if pot:
            pname = pot['item']
            if 'sweet' in pname.lower():
                steps.append(("Cook the potato", f"Bake or microwave {fmt(pot['quantity'], pname)} until a fork slides in easily, about 5-6 minutes in the microwave. Then mash it with a fork, a pinch of salt, and optionally a pat of butter."))
            else:
                steps.append(("Cook the potato", f"Roast or microwave {fmt(pot['quantity'], pname)} until tender."))
        if veg:
            steps.append(("Cook the veg", f"Steam or sauté {fmt(veg['quantity'], veg['item'])} until just tender — you want a little snap still."))
        if s:
            steps.append(("Add sauce", f"Drizzle {fmt(s['quantity'], s['item'])} over the protein."))
        steps.append(("Plate and eat", "Arrange everything on a plate and eat while hot."))
        return ms(*steps) if steps else default_steps(name)

    # pulled pork / roll in a bowl type
    if 'pulled' in n:
        p = gi(ingredients,'chicken','pork','turkey','beef')
        grain = gi(ingredients,'rice','potato')
        topping = gi(ingredients,'coleslaw','slaw','cabbage','corn')
        sauce = gi(ingredients,'bbq sauce','sauce')
        steps = []
        if p:
            steps.append(("Heat the protein", f"Warm {p['quantity']} of {p['item']} in a skillet over medium heat, adding a splash of water if it looks dry."))
        if grain:
            steps.append(("Warm the grain", f"Heat {grain['quantity']} of {grain['item']} in the microwave for 90 seconds."))
        if topping:
            steps.append(("Prep topping", f"Portion {topping['quantity']} of {topping['item']}."))
        steps.append(("Build the bowl", "Layer grain on the bottom, protein on top, then the topping."))
        if sauce:
            steps.append(("Sauce it", f"Drizzle {sauce['quantity']} of {sauce['item']} over the protein."))
        return ms(*steps) if steps else default_steps(name)

    return rice_bowl(name, ingredients)

# ── file processing ──────────────────────────────────────────────────────────

def parse_ingredients(ing_str):
    """Parse ingredients array from TypeScript."""
    items = []
    pattern = r'\{item:"([^"]+)",quantity:"([^"]+)"\}'
    for m in re.finditer(pattern, ing_str):
        items.append({'item': m.group(1), 'quantity': m.group(2)})
    return items

with open(FILE, 'r') as f:
    content = f.read()

# Find each recipe block by matching from opening { to the steps:[ entry
# Strategy: find all steps:[...] arrays and the context around them
# We'll do a targeted replacement by finding the name + ingredients + steps pattern

# Pattern to find a recipe with its name, meal type, ingredients, and steps
recipe_pattern = re.compile(
    r'(type:"(breakfast|lunch|dinner|snack|dessert)",name:"([^"]+)".*?'
    r'ingredients:(\[[^\]]+\]).*?)'
    r'steps:\[[^\]]*\]',
    re.DOTALL
)

def replace_steps(m):
    full_pre = m.group(1)
    meal_type = m.group(2)
    name = m.group(3)
    ing_str = m.group(4)
    ingredients = parse_ingredients(ing_str)

    # derive slug from name
    slug = name.lower().replace(' ','_').replace("'","")

    new_steps = generate_steps_for_recipe(name, ingredients, meal_type, slug)
    return full_pre + 'steps:' + new_steps

new_content = recipe_pattern.sub(replace_steps, content)

with open(FILE, 'w') as f:
    f.write(new_content)

print(f"Done. Rewrote steps for all recipes.")
