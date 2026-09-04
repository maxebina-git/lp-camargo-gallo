import re
with open('src/pages/index.astro','r', encoding='utf-8') as f:
    content = f.read()
content = re.sub(r'<img src="(/lp-camargo-gallo/assets/obras/obra-\d+\.(jpg|png))" alt="(Obra \d+)" class="w-full max-w-\[300px\] h-auto rounded-lg object-cover" />', r'<div class="obra-wrapper flex-shrink-0"><img src="\1" alt="\3" class="w-full max-w-[300px] h-auto rounded-lg object-cover" /></div>', content)
with open('src/pages/index.astro','w', encoding='utf-8') as f:
    f.write(content)
