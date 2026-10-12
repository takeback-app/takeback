# Plano de desenvolvimento — Desapega / Leilão

## Base da análise

- Fonte do pedido: `Transcricao_Audios_Desapega_Leilao.txt` (quatro áudios transcritos). Os arquivos `.ogg` estão na mesma pasta; este plano usa o texto fornecido como registro dos requisitos.
- Backend e painel: `takeback/packages/api` e `takeback/packages/admin`.
- App atual: `takeback-mobile`. O projeto `takeback/packages/mobile` foi desconsiderado.
- `integration`: aplicativo desktop Tauri que observa uma pasta de XML e envia NFC-e à API. Não há função de leilão nem dependência funcional dele para este pedido.

## Situação atual e direção técnica

- A API Express usa PostgreSQL com Prisma em recursos recentes e também contém código TypeORM legado. Já possui autenticação de consumidor, notificações, upload de imagens para fluxos administrativos, Pix/Efi para **depósitos de saldo** e webhook Efi. Não há entidade, rota ou regra de leilão/lance. Criar modelos específicos no Prisma, sem adaptar sorteios ou ofertas da loja como se fossem leilões.
- O app Expo já tem navegação autenticada, home, perfil, sorteios, ofertas, notificações e consumo de API por Axios/SWR. Adicionar o Desapega à navegação do app atual.
- O painel `admin` já opera sorteios, ofertas e upload de imagens. Usá-lo para moderação e acompanhamento dos leilões.
- O preço do produto deve ficar **fora** do fluxo financeiro Take Back. Apenas uma eventual taxa de publicação será cobrada pela plataforma. Não criar depósito, carteira, repasse ou cashback para o valor do lance vencedor.
- Persistir valores monetários em centavos ou `Decimal`, nunca em `float`; guardar datas em UTC e apresentar no fuso do usuário. Usar o servidor como fonte do prazo, do status e do maior lance.

## Fases incrementais

Cada fase abaixo entrega uma função ou tela demonstrável ao final. As fases 1–13 compõem a primeira versão para piloto; as fases 14–16 ativam regras comerciais mencionadas como possibilidades nos áudios.

| Fase | Entrega testável | Implementação principal | Critério de aceite |
| --- | --- | --- | --- |
| **1** | **Configuração do Desapega** | API e painel admin: parâmetros de prazo padrão (inicialmente 48 h), taxa de anúncio (inicialmente R$ 0), lance mínimo permitido, incremento mínimo padrão e chave de ativação. Registrar regras e estados `rascunho → ativo → encerrado com vencedor/sem lances → negociação → entregue`, além de `cancelado` e `suspenso`. | Admin altera os parâmetros em homologação; leitura autenticada retorna os valores e não altera leilões já publicados. |
| **2** | **Vitrine de leilões** | API: listagem paginada de anúncios ativos, ordenação por encerramento e filtro simples. Mobile: entrada “Desapega” na home e tela de listagem com imagem, título, maior lance/preço inicial e tempo restante. | Um usuário autenticado vê só anúncios públicos ativos; rascunhos, suspensos e dados pessoais do vendedor não aparecem na resposta. |
| **3** | **Detalhe do leilão** | API e mobile: tela com imagens, descrição, pontos de atenção, preço inicial, incremento mínimo, maior lance, prazo e regras resumidas. Usar resposta pública própria, sem dados privados do vendedor ou dos participantes. | Abrir um item mostra os dados atualizados; antes do encerramento é impossível obter nome, telefone, e-mail ou identificador pessoal do vendedor pela API pública. |
| **4** | **Cadastro de anúncio** | API: rascunho vinculado ao consumidor, validação de título, descrição, observações, imagens, lance inicial e incremento. Mobile: formulário de criação com seleção de fotos e prévia. Criar rota de upload de imagem autenticada, com limites de tipo, tamanho e quantidade. | Usuário salva e edita seu rascunho; outro usuário não consegue ler ou alterar esse rascunho. Formulário inválido ou imagem fora das regras é rejeitado. |
| **5** | **Publicação gratuita e aceite** | API: publicação idempotente do rascunho com `endsAt` calculado no servidor e registro da versão dos termos aceita. Mobile: revisão final e aceite separado das condições de negociação e da ausência de intermediação do pagamento da venda. Com taxa configurada como zero, publicar sem checkout. | Anúncio aprovado para publicação passa a ativo uma vez; o mesmo comando repetido não duplica o anúncio. Sem aceite, não publica. O texto dos termos deve ser revisado pelo responsável jurídico antes de produção. |
| **6** | **Envio de lance** | API: lance autenticado com validação transacional de prazo, estado, usuário diferente do vendedor, valor acima do maior lance pelo incremento exigido e proteção contra concorrência. Mobile: entrada de valor, confirmação e histórico público de valores/horários sem identificação dos autores. | Dois lances simultâneos não geram dois vencedores nem aceitam valor ultrapassado; lance após o prazo, do próprio vendedor ou abaixo do mínimo falha com motivo claro. |
| **7** | **Encerramento e apuração** | API: rotina reexecutável que encerra anúncios vencidos e fixa o maior lance válido como vencedor. Prever fechamento sem lances; consultar também por prazo ao receber requisições, para que atraso da rotina não aceite lance fora da janela. | Ao avançar o relógio de teste, um anúncio encerra exatamente uma vez. Com lances, registra um vencedor; sem lances, registra “sem arrematante”. |
| **8** | **Meus anúncios e meus lances** | Mobile e API: tela de acompanhamento do vendedor e do participante com status, prazo, maior lance e resultado. Permissões diferentes conforme papel e estágio. | Vendedor vê somente seus anúncios; participante vê seus lances e se venceu. Outros usuários não acessam estas visões privadas. |
| **9** | **Resultado e contato mútuo** | API: venda interna com código/identificador único e resposta privada para vencedor e vendedor; liberar contato confirmado de ambos somente após o encerramento com vencedor. Mobile: tela de resultado com contatos, orientação para combinar pagamento/entrega diretamente e acesso às condições aceitas. | Vencedor e vendedor veem apenas os contatos um do outro após o resultado; perdedores e usuários não participantes não recebem esses dados. Nenhuma cobrança do preço da venda ocorre na plataforma. |
| **10** | **Confirmação de entrega por código** | API: comprador solicita código de quatro dígitos após o resultado; armazenar código com expiração, tentativas limitadas e proteção contra repetição. Vendedor informa o código; transição atômica para entregue. Mobile: tela “Recebi o produto” para comprador e tela de digitação para vendedor. | Código correto confirma a entrega uma vez; código errado, expirado ou enviado por outra conta não confirma. Histórico registra quem confirmou e quando. |
| **11** | **Retirada antes do prazo** | API e mobile: vendedor solicita retirada, informa motivo e recebe o estado previsto pela política. Mostrar claramente a consequência antes de confirmar. Guardar motivo e lances existentes para auditoria. | Retirada com motivo cria registro auditável; anúncio sai da vitrine e novos lances são recusados. A política para anúncios com lances deve estar definida antes de habilitar a ação em produção. |
| **12** | **Moderação administrativa** | Painel `takeback/packages/admin`: lista/detalhe de anúncios, imagens, lances, motivo de retirada, status e ações de suspender, restaurar quando cabível ou registrar resolução. API com autorização administrativa e log de ações. | Admin suspende um anúncio de teste; ele desaparece da vitrine e não recebe lance. O histórico preserva ator, data e motivo. |
| **13** | **Avisos de eventos** | Reaproveitar infraestrutura de notificação da API e tela de notificações do app para publicação, lance superado, encerramento, resultado, retirada e entrega. Evitar conteúdo pessoal em push antes do resultado. | Cada evento relevante aparece uma vez para os destinatários corretos; perda de push não afeta o estado real do leilão. |
| **14** | **Taxa de publicação via Pix** | Quando a taxa deixar de ser zero: criar cobrança Pix Efi **específica do anúncio**, tela de QR/copia e cola, status pendente e ativação somente após webhook confirmado. Tratar webhook repetido de forma idempotente. Não reutilizar a rota de depósito de saldo como pagamento da taxa. | Com taxa R$ 2,99 em homologação, anúncio permanece pendente até pagamento; um webhook válido publica uma vez; expiração ou pagamento duplicado não geram publicação duplicada. |
| **15** | **Aceite antecipado do maior lance** | Se aprovado como regra de produto: vendedor aceita apenas o maior lance vigente; API fecha a disputa atomicamente e fixa vencedor, com confirmação explícita no app. | Aceite antes do prazo encerra o anúncio e rejeita novos lances; em corrida com lance novo, a transação escolhe de forma consistente qual valor era o maior no momento do aceite. |
| **16** | **Pendência e restrição por desistência** | Se a política de penalidade for aprovada: registrar taxa/motivo/status da pendência e um bloqueio específico no backend; tela no app mostra razão e caminho de regularização. Cobrança Pix da penalidade, caso adotada, separada da taxa de publicação. | Conta inadimplente recebe restrição apenas nas ações definidas pela política; ao resolver a pendência, as permissões voltam sem intervenção manual. Regras não podem depender só de esconder botões no app. |

### Andamento da fase 1

Implementada em código no `takeback` (10/10/2026): tabela `auction_settings` na migração Prisma `20261010120000_cria_tabelas_do_desapega`, rotas autenticadas `GET/PUT /manager/auction-settings`, leitura `GET /costumer/auction-settings`, validação dos parâmetros, estados e transições do ciclo do leilão (`useCases/auction/AuctionStatusTransitions.ts`) e tela em **Configurações → Desapega** no painel. Valores iniciais: desativado, 48 horas, taxa R$ 0, lance inicial mínimo R$ 1 e incremento padrão R$ 1. Como ainda não existem anúncios, a garantia de preservar as regras de um anúncio publicado depende de salvar uma cópia dos parâmetros no anúncio durante a fase de publicação.

Verificado: migração aplicada no banco local de desenvolvimento, testes da API passando e rotas validadas por chamada HTTP (autenticação, validação e gravação). Pendente: testar a tela do painel no navegador e aplicar a migração em homologação.

### Andamento da fase 2

Implementada em código no `takeback` e `takeback-mobile`: modelo de anúncio com vínculo privado ao vendedor, consulta autenticada e paginada de leilões ativos (`GET /costumer/auctions`), filtro por título, ordenação pelo fim do prazo e resposta pública sem dados do vendedor. A home mostra a entrada **Desapega** quando a funcionalidade estiver ativa; a tela exibe imagem, título, maior lance ou lance inicial e tempo restante, com busca, paginação, atualização e estados vazio/erro. Há testes de consulta em `packages/api/tests/useCases/Auction` e um SQL de demonstração em `packages/api/tests/fixtures/auction-listing-demo.sql` para homologação. Como ainda não há formulário de anúncio, a massa de demonstração permite visualizar um item antes da fase 4.

Verificado: 18 testes da API passando (`yarn test --files=auction-settings.spec,list-active-auctions.spec`), massa de demonstração validada e listagem conferida por chamada HTTP. As telas do app passam na checagem de tipos. Pendente: abrir o app no dispositivo ou emulador e aplicar a migração em homologação.

### Andamento da fase 3

Concluída e testada no emulador. `GET /costumer/auctions/:id` devolve só campos públicos; rascunho, suspenso, cancelado ou ID inexistente respondem 404. Anúncios encerrados continuam abrindo, com "Encerrado" e o valor final. No app, o card da vitrine abre a tela de detalhe (galeria, prazo, maior lance, próximo lance mínimo, descrição, pontos de atenção e "Como funciona" expansível). O botão de lance fica desabilitado até a fase 6. Testes em `auction-detail.spec.ts`.

### Andamento da fase 4

API concluída e testada: `POST /costumer/auction-images` (até 5 MB, JPG/PNG/WEBP; a imagem é validada, reduzida para no máximo 1600 px e regravada sem metadados EXIF/GPS) e `GET/POST /costumer/my-auctions`, `GET/PUT/DELETE /costumer/my-auctions/:id` (rascunhos com até 6 fotos, limite de 10 rascunhos por vendedor, mínimos da configuração, só URLs de imagens enviadas pela própria API). Outro consumidor recebe 404 ao ler, editar ou excluir. Testes em `auction-drafts.spec.ts` e `auction-images.spec.ts`.

App: telas de formulário (fotos pela câmera ou galeria, prévia do card na vitrine), "Meus rascunhos" e botão "Anunciar" na vitrine, com `expo-image-picker` (permissão de microfone bloqueada no `app.json`). O código passa na checagem de tipos, mas **ainda não foi testado no emulador**: exige recompilar o app nativo.

Assumido nesta fase: o incremento informado pelo vendedor não pode ser menor que o incremento padrão da configuração.

## Decisões de produto a fechar antes de ativar cada regra

1. **Duração e prorrogação:** 48 h foi exemplo. Definir duração fixa/configurável e se lance nos minutos finais prorroga o prazo. O plano inicial assume 48 h sem prorrogação.
2. **Lances:** definir se o incremento é escolhido pelo vendedor ou limitado pelo sistema, se o histórico mostra somente valores/horários e se lances podem ser cancelados. A primeira versão assume maior lance válido, sem cancelamento pelo participante.
3. **Publicação e moderação:** publicação imediata ou aprovação prévia; categorias, itens proibidos, região de retirada e imagens obrigatórias. A primeira versão pode usar publicação imediata com chave de ativação e suspensão administrativa.
4. **Contato e negociação:** confirmar quais dados serão compartilhados (telefone, e-mail etc.), exigência de contato verificado e prazo para combinar a entrega. A liberação deve ocorrer apenas para as duas partes depois do resultado.
5. **Desistência e disputa:** se é permitido retirar anúncio com lance, qual taxa se aplica, quem decide uma contestação e quais funções serão bloqueadas. Os áudios apresentam essas medidas como possibilidades; não ativar cobrança ou bloqueio sem valores, procedimento de contestação e texto aprovado.
6. **Aceite antecipado:** confirmar se faz parte do lançamento. Está isolado na fase 15 para não atrasar o fluxo básico.
7. **Termos e suporte:** aprovar texto dos avisos e termos com assessoria jurídica, além de canal de denúncia e processo de resposta. Avisos de ausência de intermediação não substituem revisão das responsabilidades da plataforma.

## Marcos de validação

- **Após fase 5:** usuário cria e publica um anúncio gratuito; outro usuário o visualiza, sem dados do vendedor.
- **Após fase 9:** fluxo principal completo, da publicação ao resultado e à liberação mútua dos contatos, sem movimentar o valor da venda.
- **Após fase 13:** entrega, retirada, moderação e comunicação cobertas para piloto controlado.
- **Fases 14–16:** ativar somente conforme aprovação das respectivas regras comerciais e operacionais.
