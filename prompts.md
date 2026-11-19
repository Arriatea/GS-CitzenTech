# Uso de IA

## No desenvolvimento

Usamos o **Claude Code** (Anthropic) para escrever e organizar o código. Abaixo estão os pedidos principais,
como foram enviados. Em cada um, a IA mostrou o plano antes de executar, e nós revisamos cada commit.

### 14/11/2026 — Organizar o front em commits pequenos

```text
Quero commitar o front em vários commits pequenos, cada um com uma parte lógica do projeto.

Regras:
- Mensagem de commit com no máximo 1 frase, em português, no imperativo (ex.: "Adiciona tela Vender com preço mínimo").
- Não inclua a pasta pacote-video/ nem a pasta video/ nestes commits (ficam para depois).
- Confira o .gitignore antes: node_modules/, dist/ e arquivos .env não podem entrar.
- Não altere código, só organize e commite o que já existe.

Passos:
1. Rode git status e me mostre o plano de commits (lista com a mensagem e os arquivos de cada um) antes de executar.
2. Ordem sugerida, ajuste ao que existir de fato:
   - configuração do projeto (package.json, vite.config, index.html, .gitignore)
   - estilos e identidade visual (index.css)
   - dados simulados (src/data)
   - voz e audiodescrição (src/lib)
   - componentes compartilhados (Topo, BotaoAudio, etc.)
   - uma tela por commit: Início, Minha horta, Aprender, Vender, Painel do parceiro
   - App.jsx com a navegação
   - README
3. Depois que eu aprovar o plano, faça os commits na ordem.
4. No fim, mostre o git log --oneline e faça push para a branch atual no origin.
```

### 14/11/2026 — Criar o backend em FastAPI

```text
Crie o backend do Gota a Gota na pasta backend/ deste repositório, em Python com FastAPI.
Ele será usado por: o front (React), o ESP32 simulado no Wokwi e o agente de IA Gotinha.

Requisitos:
- Nomes de variáveis, funções e rotas em português.
- Dados iniciais iguais aos do front (src/data/mock.js): água, tarefas, canteiros, cursos, preços, compradores, impacto, comunidades. Guarde em memória a partir de um arquivo backend/dados_iniciais.json (sem banco por enquanto). Todos os dados são simulados; deixe isso claro num comentário e no README.
- CORS liberado para o front em desenvolvimento e produção.

Rotas:
- GET  /saude                -> {"ok": true}
- GET  /agua                 -> estado da água no formato que o front usa (boa, caixa: cheia|metade|pouca, diasParaBeber, fonte: poco|caixa, amanha)
- POST /leituras             -> recebe o JSON do ESP32: nivelCaixa, umidadeSolo, temSol, bomba, valvula, irrigando, chuvaAmanha, semaforo, leituraLuz. Atualiza a água: caixa = cheia (>=70%), metade (30–69%) ou pouca (<30%); fonte = poco se temSol, senão caixa; diasParaBeber calculado a partir do nível (caixa de 10.000 L, 60 pessoas, 20 L por pessoa por dia, reserva de 20%). Guarda a última leitura.
- GET  /leituras/ultima      -> a última leitura recebida
- GET  /tarefas, /canteiros, /cursos, /precos, /compradores, /impacto, /comunidades
- GET  /precos/{cultura}     -> preço mínimo de uma cultura (404 se não existir)
- POST /colheitas            -> registra {cultura, quantidade, unidade}; GET /colheitas lista
- Valide os dados com Pydantic e devolva erros claros em português.

Também:
- backend/requirements.txt e um README curto com como rodar (uvicorn) e exemplos de curl de cada rota, incluindo um POST /leituras igual ao JSON do Wokwi.
- Testes simples com pytest para /agua, /leituras e /precos/{cultura}.
- Prepare para deploy no Render (comando de start com uvicorn e porta da variável PORT).

Commits: pequenos, com no máximo 1 frase em português cada (ex.: "Cria rota de leituras do ESP32"). Mostre o plano de commits antes de executar. Não mexa no front nem nas pastas pacote-video/ e video/.

 sem muitos comentarios, use o minimo de comentarios nos codigos
```

### 14/11/2026 — Ligar o front ao backend

```text
Ligue o front ao backend que está em backend/.

Requisitos:
- Crie src/lib/api.js com funções em português para cada rota (buscarAgua, buscarTarefas, buscarCanteiros, buscarCursos, buscarPrecos, buscarCompradores, buscarImpacto, buscarComunidades).
- A URL da API vem de VITE_API_URL (crie .env.example com VITE_API_URL=http://localhost:8000). Não commite o .env.
- Se a API não responder, use os dados de src/data/mock.js como reserva, para o app nunca ficar em branco numa apresentação. Deixe um aviso discreto só no console.
- A água (tela Início) deve atualizar sozinha a cada 5 segundos, para refletir as leituras do ESP32 em tempo real. Quando o estado mudar (ex.: caixa de "cheia" para "metade"), a audiodescrição deve anunciar a mudança.
- Mantenha o visual e a acessibilidade exatamente como estão. Enquanto carrega, mostre um estado simples (sem tela vazia).
- Atualize o README do front explicando como rodar front + backend juntos.

Teste:
- Rode backend e front juntos, envie um POST /leituras com nivelCaixa 45 e confira se a tela Início muda para "A caixa está pela metade" sem recarregar.
- npm run build tem que passar.

Commits: pequenos, no máximo 1 frase em português cada. Mostre o plano de commits antes de executar. Não mexa em backend/, pacote-video/ nem video/.
```

### 17/11/2026 — Camada de preços e organização do agente, da IoT e do README

```text
REGRAS DE COMMIT (valem para tudo abaixo):
- Faça commits separados, um por parte lógica (ex.: JSON de referência, rota de preços locais, custo de produção, cálculo do preço mínimo, testes, README, .gitignore, organização das pastas).
- Mensagem de no máximo 1 frase em português, no imperativo.
- Antes de começar, mostre a lista de commits planejados.
- Depois de CADA commit, pare, me mostre em 2 ou 3 linhas o que mudou e por quê, e espere eu responder "ok" para seguir para o próximo.
- Não altere datas de commit nem reescreva o histórico (nada de --date, rebase ou amend em commits já feitos).
- Não faça push sem eu pedir.

 

Duas tarefas neste repositório: (A) camada de preços no backend e (B) organizar o agente junto com o resto do projeto.

=== A) CAMADA DE PREÇOS (backend/) ===

1. Arquivo backend/dados/precos_referencia.json com o preço de atacado da Ceasa/RN – Natal para alface, tomate, melancia e cebolinha:
   campos: cultura, unidade, preco_atacado, fonte ("Conab/Prohort – Ceasa/RN Natal"), data_consulta.
   Deixe valores de exemplo marcados como "PREENCHER COM A CONSULTA" que eu vou atualizar à mão.

2. Preços informados pelos comerciantes:
   - POST /precos-locais  {comprador, cultura, preco, unidade}
   - GET  /precos-locais?cultura=alface
   Comece com alguns registros simulados (marcados como simulados).

3. Custo de produção por cultura (sementes, adubo, horas de trabalho) num JSON simples.

4. GET /precos/{cultura} passa a devolver:
   preco_minimo, unidade, e um bloco "como_calculamos" com: preco_atacado_ceasa, media_comerciantes_locais, custo_por_unidade e a regra usada.
   Regra: preco_minimo = maior valor entre (custo_por_unidade × 1,3) e a média dos comerciantes locais; se não houver comerciantes, usa o preço de atacado da Ceasa × 1,2.
   Mantenha os campos que o front e a Gotinha já usam (preco, unidade, nome) para não quebrar nada.

5. Organize a busca da referência numa classe/função "FonteDePrecoReferencia", para poder trocar o JSON por uma API real no futuro sem mexer no resto.

6. Testes com pytest para o cálculo do preço mínimo e README do backend explicando a fonte dos dados e que o atacado é usado como piso.

=== B) ORGANIZAR O AGENTE JUNTO COM O RESTO ===

O agente de IA (Gotinha, Google ADK) está na pasta agente/ (agente/gota_agente/ com agent.py, ferramentas.py, __init__.py e .env.exemplo; mais requirements.txt, testar_ferramentas.py e README.md). Se ele estiver em outro lugar, me pergunte antes de mover.

1. Estrutura final do repositório (ajuste ao que existir; não renomeie src/ nem public/ do front):
   GS-CitizenTech/
     src/, public/, index.html, package.json ...   (front)
     backend/                                       (FastAPI)
     agente/                                        (Gotinha, Google ADK)
     iot/                                           (sketch.ino, diagram.json, libraries.txt do Wokwi, se existirem)
     README.md                                      (README principal)

2. Confira se as ferramentas em agente/gota_agente/ferramentas.py chamam rotas que existem no backend (/agua, /canteiros, /precos/{cultura}, /compradores, /cursos, /colheitas). Se algum nome estiver diferente, ajuste SÓ o caminho na ferramenta e me avise. Não mude a instrução nem a lógica do agente.

3. Com a nova camada de preços, a ferramenta preco_de_venda deve continuar funcionando sem mudanças. Confirme isso rodando agente/testar_ferramentas.py com o backend no ar.

4. .gitignore na raiz cobrindo: node_modules/, dist/, .venv/, __pycache__/, .env (de todas as pastas), .pytest_cache/. Garanta que nenhum .env com chave está no repositório (se estiver, me avise antes de qualquer commit).

5. README principal com:
   - a Ficha da CitizenTech no topo (nome, cidade/bairro, cidadão beneficiado, problema em uma frase, como funciona, o que cada parte faz, link do repositório, indicador de impacto, ODS), deixando "PREENCHER" onde faltar informação;
   - um diagrama simples em texto de como as partes conversam (ESP32 → backend ← front; Gotinha → backend);
   - "Como rodar tudo": um terminal para o backend, um para o agente (adk web --port 8080 se o backend usar a 8000) e um para o front, com as variáveis de ambiente de cada um;
   - seção "Dados": tudo simulado, exceto a referência de preço da Conab/Prohort (com a fonte);
   - seção "Uso de IA" apontando para prompts.md (crie o arquivo com um cabeçalho e uma lista vazia que eu vou preencher).

=== REGRAS ===
- Não mexa no visual nem nas telas do front.
- Commits pequenos, no máximo 1 frase em português cada. Faça a parte A primeiro e a parte B depois.
- Mostre o plano de commits antes de executar.
```

### 17/11/2026 — Decisões sobre a regra do preço mínimo

```text
1. Opção (b): Ceasa como piso de verdade. Com comerciantes: max(custo × 1,3, média dos comerciantes, preço de atacado da Ceasa). Sem comerciantes: max(custo × 1,3, atacado × 1,2). Explique isso no bloco "como_calculamos".
2. Sim: a lista GET /precos também usa o preço calculado (valor = preco_minimo), sem mudar nada no visual.
3. Não crie backend/README.md. Coloque a fonte dos preços numa seção "Fonte dos preços" do README principal, que continua sendo o último commit.
Extra: vou criar a pasta iot/ com sketch.ino, diagram.json e libraries.txt. Quando eu avisar, inclua um commit "Adiciona simulação IoT do Wokwi" antes do prompts.md.
Pode começar pelo commit 1.

 a pasta de iot esta no projeto
```

### 17/11/2026 — Colocar a Gotinha dentro do app

```text
Coloque a Gotinha (agente/gota_agente) dentro do app.

BACKEND
- Crie a rota POST /conversar no backend: recebe {sessao, mensagem} e devolve {resposta}.
- Use o agente de agente/gota_agente com o Runner do Google ADK e InMemorySessionService (uma sessão por id de sessão vindo do front, para a Gotinha lembrar o papo).
- Use só a resposta final do agente. Se der erro ou faltar a chave, devolva uma resposta amigável em português ("Não consegui responder agora, tente de novo.").
- A chave do Google vem de variável de ambiente (GOOGLE_API_KEY). Nada de chave no código.
- As ferramentas do agente chamam o próprio backend pelo GOTA_API_URL; documente isso no .env.example.
- Ajuste os requirements do backend (google-adk) sem quebrar o que existe. Não mude a instrução nem a lógica do agente.

FRONT
- Nova tela "Conversar" (#conversar), com a mesma identidade visual: cor verde no Topo, figura 💬, título "Falar com a Gotinha".
- Botão para essa tela no Início, junto com os outros três botões grandes.
- Botão grande de microfone: usa o reconhecimento de voz do navegador (Web Speech API, pt-BR). Se o navegador não suportar, mostra um campo de texto com botão "Enviar".
- Três botões de pergunta pronta, grandes: "A água está boa?", "O que eu colho hoje?", "Quanto cobro na alface?".
- As mensagens aparecem como balões (pessoa à direita, Gotinha à esquerda), e a resposta da Gotinha é LIDA EM VOZ ALTA automaticamente, usando a audiodescrição que já existe.
- Enquanto espera, mostra "A Gotinha está pensando…" e a audiodescrição anuncia isso.
- Inclua a descrição da tela no useDescricao, como nas outras telas.

TESTE
- Com o backend no ar, pergunte "a caixa está cheia?", depois mande POST /leituras com nivelCaixa 25 e pergunte de novo: a resposta tem que mudar.
- npm run build e os testes do backend têm que passar.

REGRAS DE COMMIT: commits separados por parte lógica, no máximo 1 frase em português cada. Mostre o plano antes, pare depois de cada commit com 2 ou 3 linhas explicando o que mudou e espere meu "ok". Não altere datas nem reescreva histórico. Não faça push sem eu pedir.
```

### 18/11/2026 — Deixar o front responsivo para computador

```text
Deixe o front do Gota a Gota responsivo para desktop. Hoje ele só funciona bem no celular (coluna de 480px), e o professor vai avaliar pelo computador.

Regras:
- No celular (até ~640px), NADA muda: mesma aparência e mesmo comportamento.
- Mantenha a identidade (cores, fontes, botões grandes, uma ideia por bloco) e toda a acessibilidade e audiodescrição.
- Use os breakpoints do Tailwind (md, lg). Sem bibliotecas novas.
- No desktop, a largura máxima do conteúdo fica em torno de 1100–1200px, centralizado, com margens confortáveis. Nada de coluna estreita no meio de uma tela vazia.

Layout no desktop (md/lg para cima):
- Início: cartão da água e cartão da tarefa do dia lado a lado; os botões grandes (Minha horta, Aprender, Vender, Falar com a Gotinha) em grade 2x2.
- Topo das seções: a faixa colorida ocupa a largura toda, com o conteúdo alinhado à grade.
- Minha horta: botão da foto e resultado numa coluna; canteiros em grade de 2 a 3 colunas.
- Aprender: cursos em grade de 2 colunas; a aula (um passo por tela) fica centralizada com no máximo ~720px, com figura e texto lado a lado se couber.
- Vender: grade das verduras e cartão do preço lado a lado; compradores em grade de 2 a 3 colunas.
- Falar com a Gotinha: área de conversa centralizada com no máximo ~760px, com as perguntas prontas ao lado ou acima.
- Painel do parceiro: já é largo; só confira se está alinhado com o resto.
- Botões fixos de áudio: no canto inferior direito da janela, sem cobrir conteúdo (ajuste o espaçamento inferior das páginas).

Teste:
- Tire capturas com Playwright de todas as telas em 390x844, 1366x768 e 1920x1080, olhe cada uma e corrija o que ficar estranho (texto esticado demais, espaços vazios, cartões desalinhados).
- npm run build tem que passar.

REGRAS DE COMMIT: commits separados por tela ou parte lógica, no máximo 1 frase em português cada. Mostre o plano antes, pare depois de cada commit com 2 ou 3 linhas explicando o que mudou e espere meu "ok". Não altere datas nem reescreva histórico. Não faça push sem eu pedir.
```

### 19/11/2026 — Fechar o MVP

```text
de um relatorio do q falta para o MVP
pode fazer tudo
```

## Dentro do produto

A **Gotinha** (pasta `agente/`) é um agente do **Google ADK** com o modelo Gemini (`gemini-flash-latest`).
Ela responde em português simples sobre a água, a horta e os preços, e só usa dados que busca no backend
pelas ferramentas de `agente/gota_agente/ferramentas.py`. Se o Gemini estiver sobrecarregado, o backend tenta
o modelo reserva (`gemini-flash-lite-latest`).
