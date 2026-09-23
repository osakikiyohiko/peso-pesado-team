# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Sobre o projeto

Site institucional estático da **Peso Pesado Team**, academia fundada em 2000 por Elcio Vicente
Piccolo Jr. ("Bolado"), faixa preta 5º grau, oferecendo Jiu-Jitsu, Muay Thai, Boxe, Karatê
Kyokushin e MMA. Site simples, sem build system, feito em HTML/CSS/JS puro (sem framework, sem
dependências, sem gerenciador de pacotes).

## Executar localmente

Não há build. Basta servir os arquivos estáticos:

```bash
python3 -m http.server 8000
```

Depois acesse `http://localhost:8000`. Também é possível abrir `index.html` diretamente no navegador.

## Estrutura

- `index.html` — única página do site, dividida em seções por `id` (`#sobre`, `#modalidades`,
  `#fundador`, `#professores`, `#horarios`, `#localizacao`, `#contato`) referenciadas pelo menu
  de navegação.
- `en.html` — versão em inglês de `index.html`, com a mesma estrutura e os mesmos `id`s. O
  seletor de idioma (`.lang-switch`, bandeiras `img/flag-br.svg` e `img/flag-us.svg` no
  cabeçalho) alterna entre as duas páginas; a bandeira do idioma atual leva
  `aria-current="page"`. Qualquer mudança de conteúdo em `index.html` (professores, horários
  etc.) deve ser replicada, traduzida, em `en.html`. A política de privacidade segue o
  mesmo esquema: `privacidade.html` (português) e `privacy.html` (inglês).
- `css/style.css` — todo o estilo, usando variáveis CSS em `:root` para cores (tema escuro com
  destaque em amarelo/dourado, cor predominante da equipe). Breakpoint responsivo único em
  `720px` para o menu mobile.
- `js/script.js` — comportamentos da página: ano do rodapé, toggle do menu mobile (`.open` em
  `#navLinks`), e o modal de agendamento (`#modalOverlay`) que monta uma mensagem com os dados do
  formulário e abre o WhatsApp (`wa.me`) com o texto pré-preenchido ao enviar (em inglês quando
  `<html lang>` é `en`).
- `img/` — imagens usadas pelo site (logo, fotos dos professores, foto da turma), referenciadas
  com nomes simples para evitar espaços em URLs.
- `Imagens/` — material-fonte original enviado (logo, foto do professor, foto da turma e a
  imagem do cronograma de aulas 2026 usada como base para a tabela em `#horarios`). Não é
  referenciado pelo site; mantido apenas como referência/backup.

## Conteúdo pendente

O fundador (Elcio "Bolado") aparece em duas seções: `#fundador` (destaque, layout foto+texto) e
também como card em `#professores` — isso é intencional, não duplicação por engano. A ordem dos
cards em `#professores` foi definida pelo usuário (Elcio, Rodrigo, Fernando, Alberto, Iury) e não
é alfabética nem cronológica — preservar essa ordem ao adicionar/reordenar. Novos instrutores
devem ser adicionados como novos `.card` dentro de `.cards`, seguindo o padrão com
`.card-photo`; nem todo card tem parágrafo de descrição além da faixa — só incluir quando houver
informação real sobre o papel do instrutor. Se o cronograma de aulas mudar, atualizar a tabela em
`#horarios` (os dados vieram da imagem em `Imagens/grade de aulas/`).
