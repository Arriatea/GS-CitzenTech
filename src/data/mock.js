/*
 * DADOS SIMULADOS.
 *
 * Tudo o que o app mostra vem deste arquivo, para ser trocado depois pela API Java.
 * Nenhum número aqui foi medido de verdade. Comunidades marcadas "(exemplo)" são fictícias.
 */

export const usuaria = {
  nome: 'Dona Socorro',
}

export const comunidade = {
  nome: 'Comunidade Angélica',
  municipio: 'Ipanguaçu (RN)',
}

/*
 * Estado da água.
 *
 * Regra do sistema real: a bomba do poço é só solar.
 * - Com sol, a bomba irriga a horta direto do poço e enche a caixa (fonte: 'poco').
 * - Sem sol, não há energia: a horta usa a água guardada na caixa (fonte: 'caixa').
 * A água da caixa também pode ser bebida e cobre a falta do carro-pipa.
 * `diasParaBeber` é quantos dias a caixa dura só para beber, se o carro-pipa atrasar.
 */
export const agua = {
  boa: true,
  caixa: 'cheia', // 'cheia' | 'metade' | 'pouca'
  diasParaBeber: 4,
  fonte: 'poco', // 'poco' | 'caixa'
  amanha: 'Vai chover amanhã. Não precisa molhar a horta.',
}

/* Tarefas do dia. A tela inicial mostra uma por vez. */
export const tarefas = [
  {
    id: 'colher-alface',
    figura: '🥬',
    texto: 'Colher a alface.',
    dica: 'O mercadinho vai buscar na sexta.',
  },
  {
    id: 'bichinhos-tomate',
    figura: '🍅',
    texto: 'Tirar os bichinhos do tomate.',
    dica: 'Eles ficam embaixo das folhas.',
    aula: 'pulgao',
  },
  {
    id: 'nao-molhar',
    figura: '🌧️',
    texto: 'Amanhã não precisa molhar.',
    dica: 'Vai chover.',
  },
]

/*
 * Canteiros da horta.
 * destino: 'venda' (horta de venda) | 'comunidade' (horta da comunidade, para dar)
 * estado: 'colher' | 'crescendo' | 'cuidado'
 */
export const canteiros = [
  { id: 'alface', figura: '🥬', nome: 'Alface', destino: 'venda', estado: 'colher' },
  { id: 'tomate', figura: '🍅', nome: 'Tomate', destino: 'venda', estado: 'cuidado', aula: 'pulgao', aviso: 'A câmera viu bichinhos.' },
  { id: 'cebolinha', figura: '🌿', nome: 'Cebolinha', destino: 'venda', estado: 'crescendo' },
  { id: 'melancia', figura: '🍉', nome: 'Melancia', destino: 'venda', estado: 'crescendo' },
  // Horta da comunidade: comida que sustenta as famílias, não só tempero.
  { id: 'milho', figura: '🌽', nome: 'Milho', destino: 'comunidade', estado: 'crescendo' },
  { id: 'feijao', figura: '🫘', nome: 'Feijão', destino: 'comunidade', estado: 'colher' },
  { id: 'batata-doce', figura: '🍠', nome: 'Batata-doce', destino: 'comunidade', estado: 'crescendo' },
]

/* Aulas. Cada passo é uma tela. */
export const cursos = [
  {
    id: 'vender-bem',
    figura: '💰',
    titulo: 'Vender bem',
    cor: 'amarelo',
    passos: [
      { figura: '🏪', texto: 'Pergunte ao mercado o que ele quer comprar.' },
      { figura: '🥬', texto: 'Venda só as verduras bonitas e do mesmo tamanho.' },
      { figura: '🤝', texto: 'A horta da comunidade é para dar. A horta de venda é para vender.' },
      { figura: '🚫', texto: 'Não dê de graça a verdura de venda. Ela paga o sustento da casa e a bomba do poço.' },
      { figura: '🌱', texto: 'Guarde um pouco de cada venda para comprar sementes.' },
    ],
  },
  {
    id: 'plantar-alface',
    figura: '🥬',
    titulo: 'Plantar alface',
    cor: 'laranja',
    passos: [
      { figura: '⛅', texto: 'Faça o canteiro onde bate sol de manhã e tem sombra à tarde.' },
      { figura: '✋', texto: 'Plante as mudas com um palmo de distância uma da outra.' },
      { figura: '💧', texto: 'Molhe todo dia, bem cedinho ou no fim da tarde.' },
      { figura: '🔪', texto: 'Depois de um mês e meio, colha o pé inteiro, cortando rente ao chão.' },
    ],
  },
  {
    id: 'plantar-melancia',
    figura: '🍉',
    titulo: 'Plantar melancia',
    cor: 'verde',
    passos: [
      { figura: '☀️', texto: 'Plante a melancia num lugar com muito sol.' },
      { figura: '👣', texto: 'Deixe dois passos largos entre uma cova e outra.' },
      { figura: '🌾', texto: 'Ela está madura quando o cabinho perto dela fica seco.' },
      { figura: '👂', texto: 'Bata na melancia com a mão. Se o som for oco, pode colher.' },
    ],
  },
  {
    id: 'pulgao',
    figura: '🐛',
    titulo: 'Tirar bichinhos',
    cor: 'vermelho',
    passos: [
      { figura: '🧼', texto: 'Rale um pedaço de sabão de coco num litro de água.' },
      { figura: '💦', texto: 'Ponha num borrifador e molhe embaixo das folhas.' },
      { figura: '🌇', texto: 'Faça no fim da tarde, por três dias seguidos.' },
    ],
  },
]

/*
 * Preço mínimo de venda, já calculado pelo sistema a partir do preço do mercado local
 * e do custo da família (sementes, adubo, manutenção da bomba).
 * contagem: como falar 1 e vários, para a conta "quantos vai vender".
 */
export const precos = [
  { id: 'alface', figura: '🥬', nome: 'Alface', unidade: 'cada pé', valor: 2.8, contagem: ['pé', 'pés'] },
  { id: 'cebolinha', figura: '🌿', nome: 'Cebolinha', unidade: 'cada maço', valor: 2.2, contagem: ['maço', 'maços'] },
  { id: 'tomate', figura: '🍅', nome: 'Tomate', unidade: 'o quilo', valor: 9, contagem: ['quilo', 'quilos'] },
  { id: 'melancia', figura: '🍉', nome: 'Melancia', unidade: 'cada uma', valor: 12, contagem: ['melancia', 'melancias'] },
]

export const compradores = [
  { id: 'mercadinho', figura: '🏪', nome: 'Mercadinho São José', quer: 'alface', quando: 'Sexta-feira' },
  { id: 'escola', figura: '🏫', nome: 'Escola (merenda)', quer: 'cebolinha', quando: 'Dia 10' },
  { id: 'feira', figura: '⛺', nome: 'Feira de Assú', quer: 'de tudo', quando: 'Sábado' },
]

/* ---------- Área da ONG que acompanha as comunidades ---------- */

/*
 * Este app atende UMA ONG. Quem entra na área da ONG vê só as comunidades dela;
 * não existe tela para escolher ou trocar de ONG. Outra ONG teria o próprio acesso
 * (no sistema real, o login define a ONG e a API só devolve as comunidades dela).
 *
 * O nome da ONG e as comunidades marcadas "(exemplo)" são fictícios.
 * Só a Comunidade Angélica é real; os dados dela aqui também são simulados, e são os mesmos
 * que a família vê no app (água boa, caixa cheia, bichinhos no tomate).
 */
export const ong = {
  id: 'rede-sertao',
  nome: 'Rede Água no Sertão (exemplo)',
}

/*
 * bomba.estado: 'ligada' (tem sol e está bombeando) | 'sem-sol' (parada por falta de sol, é normal)
 *               | 'falha' (tem sol, mas não bombeia: precisa de visita)
 * bomba.fonteHorta: de onde a horta está tirando água agora: 'poco' | 'caixa'
 * camera.imagem: arquivo em public/cameras/ (fotos reais com licença livre, ver creditosFotos).
 *               No sistema real, é a última foto que a câmera mandou.
 * camera.estado: 'saudavel' | 'alerta' | 'sem-sinal'
 * camera.resumo: o problema em poucas palavras, para a lista de pendências
 * camera.marca: área da foto onde a IA viu o problema (em % da imagem), para desenhar o quadrado
 * caixa.historico: nível em % nos últimos 7 dias (ver diasHistorico)
 */
export const comunidadesOng = [
  {
    id: 'angelica',
    nome: 'Comunidade Angélica',
    municipio: 'Ipanguaçu (RN)',
    familias: 11,
    atualizado: 'há 5 min',
    caixa: { capacidadeL: 5000, nivelPct: 84, diasParaBeber: 4, historico: [62, 58, 71, 80, 77, 82, 84] },
    bomba: { estado: 'ligada', fonteHorta: 'poco' },
    qualidade: { boa: true, ultimoTeste: '5 de nov.', detalhe: 'Cloro e turbidez dentro do esperado.' },
    eventos: [
      { quando: 'Hoje, 7h', texto: 'Sol forte: a bomba começou a encher a caixa.' },
      { quando: 'Ontem', texto: 'O carro-pipa não veio. A caixa cobriu a água de beber.' },
      { quando: '5 de nov.', texto: 'Teste da água: boa para beber.' },
    ],
    cameras: [
      { id: 'c1', canteiro: 'Alface', imagem: 'angelica-alface', estado: 'saudavel', diagnostico: 'Folhas verdes, no ponto de colher.', ultimaFoto: 'há 12 min' },
      {
        id: 'c2',
        canteiro: 'Tomate',
        imagem: 'angelica-tomate',
        estado: 'alerta',
        diagnostico: 'Pintinhas claras nas folhas. Bichinhos sugando a folha (ácaro ou tripes).',
        resumo: 'ácaro ou tripes',
        confianca: 82,
        aula: 'pulgao',
        marca: { x: 56, y: 12, l: 36, a: 44 },
        ultimaFoto: 'há 12 min',
      },
      { id: 'c3', canteiro: 'Melancia', imagem: 'angelica-melancia', estado: 'saudavel', diagnostico: 'Crescendo bem.', ultimaFoto: 'há 12 min' },
      { id: 'c4', canteiro: 'Horta da comunidade', imagem: 'angelica-horta', estado: 'saudavel', diagnostico: 'Canteiros cheios, sem problemas.', ultimaFoto: 'há 13 min' },
    ],
  },
  {
    id: 'carnauba',
    nome: 'Comunidade Carnaúba (exemplo)',
    municipio: '—',
    familias: 4,
    atualizado: 'há 8 min',
    caixa: { capacidadeL: 3000, nivelPct: 22, diasParaBeber: 1, historico: [64, 55, 47, 40, 33, 27, 22] },
    bomba: { estado: 'falha', fonteHorta: 'caixa' },
    qualidade: { boa: true, ultimoTeste: '28 de out.', detalhe: 'Sem problemas no último teste.' },
    eventos: [
      { quando: 'Hoje, 10h', texto: 'Tem sol, mas a bomba não ligou. Verificar o painel solar.' },
      { quando: 'Há 3 dias', texto: 'A caixa começou a baixar todo dia.' },
    ],
    cameras: [
      { id: 'c1', canteiro: 'Couve', imagem: 'carnauba-couve', estado: 'saudavel', diagnostico: 'Sem problemas.', ultimaFoto: 'há 20 min' },
      {
        id: 'c2',
        canteiro: 'Pimentão',
        imagem: 'carnauba-pimentao',
        estado: 'alerta',
        diagnostico: 'Folhas manchadas e enrugadas. Pode ser vira-cabeça (vírus); separar os pés doentes.',
        resumo: 'possível vira-cabeça',
        confianca: 74,
        marca: { x: 6, y: 16, l: 30, a: 34 },
        ultimaFoto: 'há 20 min',
      },
      { id: 'c3', canteiro: 'Horta da comunidade', estado: 'sem-sinal', diagnostico: 'Câmera sem sinal desde 9h40.', ultimaFoto: 'há 3 h' },
    ],
  },
  {
    id: 'umbuzeiro',
    nome: 'Sítio Umbuzeiro (exemplo)',
    municipio: '—',
    familias: 3,
    atualizado: 'há 15 min',
    caixa: { capacidadeL: 3000, nivelPct: 55, diasParaBeber: 3, historico: [70, 72, 68, 64, 61, 58, 55] },
    bomba: { estado: 'sem-sol', fonteHorta: 'caixa' },
    qualidade: { boa: false, ultimoTeste: '9 de nov.', detalhe: 'Turbidez alta. Orientar a ferver a água antes de beber.' },
    eventos: [
      { quando: 'Hoje', texto: 'Dia nublado: a bomba está parada e a horta usa a caixa.' },
      { quando: '9 de nov.', texto: 'Teste da água: turbidez alta.' },
    ],
    cameras: [
      { id: 'c1', canteiro: 'Coentro', imagem: 'umbuzeiro-coentro', estado: 'saudavel', diagnostico: 'Crescendo bem.', ultimaFoto: 'há 15 min' },
      { id: 'c2', canteiro: 'Cebolinha', imagem: 'umbuzeiro-cebolinha', estado: 'saudavel', diagnostico: 'Crescendo bem.', ultimaFoto: 'há 15 min' },
    ],
  },
  {
    id: 'juazeiro',
    nome: 'Sítio Juazeiro (exemplo)',
    municipio: '—',
    familias: 5,
    atualizado: 'há 4 min',
    caixa: { capacidadeL: 5000, nivelPct: 71, diasParaBeber: 3, historico: [60, 63, 66, 64, 68, 70, 71] },
    bomba: { estado: 'ligada', fonteHorta: 'poco' },
    qualidade: { boa: true, ultimoTeste: '7 de nov.', detalhe: 'Sem problemas no último teste.' },
    eventos: [{ quando: 'Hoje, 8h', texto: 'A bomba está enchendo a caixa.' }],
    cameras: [
      { id: 'c1', canteiro: 'Tomate', imagem: 'juazeiro-tomate', estado: 'saudavel', diagnostico: 'Sem problemas.', ultimaFoto: 'há 4 min' },
      { id: 'c2', canteiro: 'Cebolinha', imagem: 'juazeiro-cebolinha', estado: 'saudavel', diagnostico: 'Sem problemas.', ultimaFoto: 'há 4 min' },
    ],
  },
  {
    id: 'mandacaru',
    nome: 'Comunidade Mandacaru (exemplo)',
    municipio: '—',
    familias: 6,
    atualizado: 'há 40 min',
    caixa: { capacidadeL: 5000, nivelPct: 34, diasParaBeber: 2, historico: [52, 49, 45, 43, 40, 37, 34] },
    bomba: { estado: 'sem-sol', fonteHorta: 'caixa' },
    qualidade: { boa: true, ultimoTeste: '1 de nov.', detalhe: 'Sem problemas no último teste.' },
    eventos: [{ quando: 'Hoje', texto: 'Terceiro dia nublado. A caixa está baixando.' }],
    cameras: [
      {
        id: 'c1',
        canteiro: 'Couve',
        imagem: 'mandacaru-couve',
        estado: 'alerta',
        diagnostico: 'Pulgão embaixo das folhas.',
        resumo: 'pulgão',
        confianca: 91,
        aula: 'pulgao',
        marca: { x: 42, y: 28, l: 34, a: 42 },
        ultimaFoto: 'há 40 min',
      },
      { id: 'c2', canteiro: 'Coentro', imagem: 'mandacaru-coentro', estado: 'saudavel', diagnostico: 'Sem problemas.', ultimaFoto: 'há 40 min' },
    ],
  },
]

/*
 * Créditos das fotos das câmeras (Wikimedia Commons, licenças livres).
 * São fotos reais usadas como exemplo; não foram tiradas nas comunidades.
 */
export const creditosFotos = {
  'angelica-alface': { autor: 'Nick Smith', licenca: 'CC BY-SA 2.0', pagina: 'https://commons.wikimedia.org/wiki/File:Rows_of_baby_lettuce_-_geograph.org.uk_-_1003644.jpg' },
  'angelica-tomate': { autor: 'Natalka Ukraine (baby-bear.org)', licenca: 'CC BY 4.0', pagina: 'https://commons.wikimedia.org/wiki/File:Solanum_lycopersicum_leaves_with_spider_mite_or_thrips_damage_in_Dnipro_by_baby-bear.org.jpg' },
  'angelica-melancia': { autor: '-JvL- from Netherlands', licenca: 'CC BY 2.0', pagina: 'https://commons.wikimedia.org/wiki/File:Watermelon_plant_(32714113924).jpg' },
  'angelica-horta': { autor: 'Joe Mabel', licenca: 'CC BY-SA 3.0', pagina: 'https://commons.wikimedia.org/wiki/File:Picardo_Oct_03.jpg' },
  'carnauba-couve': { autor: 'cultivar413', licenca: 'CC BY 2.0', pagina: 'https://commons.wikimedia.org/wiki/File:190908_073_Chicago_Botanic_Gdn_-_Heritage_Garden,_Europe_Bed,_Brassica_oleracea_Acephala_group_Red_Russian-type_Kale,_Lavandula_x_allardii_%27Meerlo%27_Variegated_Lavender_(48860964763).jpg' },
  'carnauba-pimentao': { autor: 'Carlos Gonzalez', licenca: 'CC BY-SA 3.0', pagina: 'https://commons.wikimedia.org/wiki/File:Pepper_infected_with_tomato_spotted_wilt_virus.jpg' },
  'umbuzeiro-coentro': { autor: 'Judgefloro', licenca: 'CC0', pagina: 'https://commons.wikimedia.org/wiki/File:8855Plants_Herbs_of_the_Philippines_17.jpg' },
  'umbuzeiro-cebolinha': { autor: 'Salicyna', licenca: 'CC BY-SA 4.0', pagina: 'https://commons.wikimedia.org/wiki/File:Allium_fistulosum_2020-09-22_2857.jpg' },
  'juazeiro-tomate': { autor: "Mary O'Neill (NPS)", licenca: 'Domínio público', pagina: 'https://commons.wikimedia.org/wiki/File:Vegetable_garden_at_Eisenhower_National_Historic_Site,_tomato_plants._(bd342150-8494-492f-b030-0e9c7e4aba52).jpg' },
  'juazeiro-cebolinha': { autor: 'Kurt Stüber', licenca: 'CC BY-SA 3.0', pagina: 'https://commons.wikimedia.org/wiki/File:Allium_fistulosum_bulbifera0.jpg' },
  'mandacaru-couve': { autor: 'Sanjay Acharya', licenca: 'CC BY-SA 4.0', pagina: 'https://commons.wikimedia.org/wiki/File:Cabbage_Aphids_on_Kale_Leaf.jpg' },
  'mandacaru-coentro': { autor: 'Judgefloro', licenca: 'CC0', pagina: 'https://commons.wikimedia.org/wiki/File:8855Plants_Herbs_of_the_Philippines_18.jpg' },
}

/* Rótulos do gráfico de nível da caixa (do mais antigo para hoje). */
export const diasHistorico = ['qua', 'qui', 'sex', 'sáb', 'dom', 'seg', 'hoje']

/* Abaixo deste nível a caixa entra em alerta no painel da ONG. */
export const nivelAlertaPct = 30
