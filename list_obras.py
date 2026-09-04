import re
with open('src/pages/index.astro','r',encoding='utf-8') as f:
    lines = f.read().split('\n')
for i,l in enumerate(lines):
    if i>=378 and i<=395:
        if 'obra-' in l:
            m = re.search(r'obras/(obra-\d+\.\w+)', l)
            if m: print(i+1, m.group(1))
