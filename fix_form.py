with open('src/pages/index.astro', 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()
old_form = """        <form class="flex flex-col gap-4" onsubmit="validarFormulario(event)" novalidate>
            <FormField label="Nome" id="nome">
              <Input id="nome" placeholder="Seu nome" />
            </FormField>
            <p id="erro-nome" class="text-error-500 text-sm hidden mt-1">Campo obrigatório.</p>
            <FormField label="WhatsApp" id="whatsapp">
              <Input id="whatsapp" type="tel" placeholder="(11) 99999-9999" oninput="formatarTelefone(this)" />
            </FormField>
            <p id="erro-whatsapp" class="text-error-500 text-sm hidden mt-1">Formato inválido. Use DDD + celular (11 dígitos).</p>
            <FormField label="Email" id="email">
              <Input id="email" type="text" placeholder="seu@email.com" oninput="formatarEmail(this)" />
            </FormField>
            <p id="erro-email" class="text-error-500 text-sm hidden mt-1">Email inválido. Apenas letras, números, @ e . no domínio.</p>
            <FormField label="Mensagem" id="mensagem">
              <Textarea id="mensagem" placeholder="Conte sobre sua fachada" rows={4} />
            </FormField>
            <Button type="submit" variant="primary" size="md" class="w-full md:w-1/2 md:ml-auto font-body"><LucideMail class="inline w-4 h-4 mr-2" />Enviar mensagem</Button>
          </form>"""
new_form = """        <form id="contactForm" class="flex flex-col gap-2" novalidate>
            <input type="hidden" name="honeypot" id="honeypot" tabindex="-1" aria-hidden="true" />
            <FormField label="Nome" id="nome">
              <Input id="nome" name="nome" placeholder="Seu nome" oninput="if(this.value.trim().length>=3) document.getElementById('erro-nome').classList.add('hidden')" />
              <p id="erro-nome" class="text-error-500 text-sm hidden mt-1">Campo obrigatório.</p>
            </FormField>
            <FormField label="WhatsApp" id="whatsapp">
              <Input id="whatsapp" name="telefone" type="tel" placeholder="(11) 99999-9999" oninput="formatarTelefone(this); if(this.value.trim().replace(/\\D/g,'').length===11) document.getElementById('erro-whatsapp').classList.add('hidden')" />
              <p id="erro-whatsapp" class="text-error-500 text-sm hidden mt-1">Formato inválido. Use DDD + celular (11 dígitos).</p>
            </FormField>
            <FormField label="Email" id="email">
              <Input id="email" name="email" type="text" placeholder="seu@email.com" oninput="formatarEmail(this); if(/^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/.test(this.value.trim())) document.getElementById('erro-email').classList.add('hidden')" />
              <p id="erro-email" class="text-error-500 text-sm hidden mt-1">Email inválido. Apenas letras, números, @ e . no domínio.</p>
            </FormField>
            <FormField label="Mensagem" id="mensagem">
              <Textarea id="mensagem" name="mensagem" placeholder="Conte sobre sua fachada" rows={4} oninput="if(this.value.trim().length>=10) document.getElementById('erro-mensagem').classList.add('hidden')" />
              <p id="erro-mensagem" class="text-error-500 text-sm hidden mt-1">Campo obrigatório.</p>
            </FormField>
            <div class="flex items-center gap-3 mt-2">
              <span id="form-feedback" aria-live="polite" class="text-sm font-medium transition-opacity duration-300 opacity-0"></span>
              <Button id="btn-enviar" type="submit" variant="primary" size="md" class="w-full md:w-1/2 md:ml-auto font-body">Enviar mensagem</Button>
            </div>
          </form>"""
content = content.replace(old_form, new_form)
script_block = """  <script is:inline>
    (function () {
      const form = document.getElementById('contactForm');
      if (!form) return;
      const feedback = document.getElementById('form-feedback');
      const btn = document.getElementById('btn-enviar');
      const setFeedback = (msg, type) => {
        feedback.textContent = msg;
        feedback.className = 'text-sm font-medium transition-opacity duration-300 opacity-100 ' + (type === 'success' ? 'text-green-600' : 'text-red-500');
      };
      const clearFeedback = () => { feedback.className = 'text-sm font-medium transition-opacity duration-300 opacity-0'; feedback.textContent = ''; };
      const disableBtn = () => { btn.disabled = true; btn.setAttribute('aria-disabled', 'true'); };
      const enableBtn = () => { btn.disabled = false; btn.removeAttribute('aria-disabled'); };
      const startTimer = (s) => {
        btn.textContent = 'Enviado... (' + s + 's)';
        const t = setInterval(() => {
          s--;
          if (s <= 0) { clearInterval(t); btn.textContent = 'Enviar mensagem'; enableBtn(); }
          else btn.textContent = 'Enviado... (' + s + 's)';
        }, 1000);
      };
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        clearFeedback();
        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const telefone = document.getElementById('whatsapp').value.trim();
        const mensagem = document.getElementById('mensagem').value.trim();
        const honeypot = document.getElementById('honeypot').value.trim();
        if (honeypot !== '') {
          setFeedback('✓ Mensagem enviada!', 'success');
          disableBtn(); startTimer(5); form.reset();
          return;
        }
        if (!nome || !email || !mensagem) {
          setFeedback('✗ Preencha todos os campos obrigatórios.', 'error');
          return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
          setFeedback('✗ E-mail inválido.', 'error');
          return;
        }
        disableBtn(); startTimer(5);
        const fd = new FormData();
        fd.append('nome', nome);
        fd.append('email', email);
        fd.append('telefone', telefone);
        fd.append('mensagem', mensagem);
        fd.append('honeypot', honeypot);
        fetch('/lp-camargo-gallo/envia.php', { method: 'POST', body: fd })
          .then(r => r.json())
          .then(data => {
            if (data.status === 'success') {
              setFeedback('✓ Mensagem enviada!', 'success');
              form.reset();
            } else {
              setFeedback('✗ Erro ao enviar. Tente novamente.', 'error');
            }
          })
          .catch(() => setFeedback('✗ Erro ao enviar. Tente novamente.', 'error'));
      });
    })();
  </script>"""
content = content.replace('  <BackToTop client:load>', script_block + '\n  <BackToTop client:load>')
with open('src/pages/index.astro', 'w', encoding='utf-8', errors='ignore') as f:
    f.write(content)
print('done')
