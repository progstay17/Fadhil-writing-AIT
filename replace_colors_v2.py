import re

mappings = [
    (r'#0a0a0a', 'var(--color-bg)'),
    (r'#111111', 'var(--color-surface)'),
    (r'#1a1a1a', 'var(--color-surface-2)'),
    (r'#2a2a2a', 'var(--color-border)'),
    (r'#3a3a3a', 'var(--color-border-2)'),
    (r'#f0f0f0', 'var(--color-text)'),
    (r'#888888', 'var(--color-text-muted)'),
    (r'#555555', 'var(--color-text-dim)'),
]

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    for hex_val, var_val in mappings:
        # Match [#0a0a0a] but also [#0a0a0a]/50
        content = content.replace(f'[{hex_val}]', f'[var({var_val})]')

    # Correct any var(var(...)) if I double replaced
    content = content.replace('var(var(', 'var(').replace('))', ')')

    with open(filepath, 'w') as f:
        f.write(content)

process_file('src/app/page.tsx')
process_file('src/app/login/page.tsx')
