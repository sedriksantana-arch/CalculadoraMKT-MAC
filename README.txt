CALCULADORA MKT+ (Windows e Mac)

CAMINHO MAIS FACIL (Windows): instale o Node.js (nodejs.org, versao LTS) e de dois cliques em
GERAR-EXE-WINDOWS.bat. Ele instala o necessario e gera, na pasta "dist", o instalador (Setup .exe)
e uma versao portatil (.exe que abre direto, sem instalar).

SEM INSTALAR NADA NO PC: envie esta pasta para um repositorio no GitHub (gratuito), abra a aba
Actions > "Gerar instaladores" > Run workflow. Ao terminar, baixe os arquivos .exe (Windows) e .dmg (Mac)
em "Artifacts". O arquivo esta em .github/workflows/build.yml.

AVISO: o programa nao e assinado digitalmente. No Windows pode aparecer "O Windows protegeu seu PC":
clique em "Mais informacoes" e depois "Executar mesmo assim". No Mac: clique com o botao direito > Abrir.

PELO TERMINAL:
1) Instale o Node.js (nodejs.org), versão LTS.
2) Abra o terminal nesta pasta e rode:   npm install
3) Para abrir o programa:                 npm start
4) Para gerar o instalador:
     Windows (.exe):  npm run dist:win     (rode no Windows)
     Mac (.dmg):      npm run dist:mac     (rode no Mac)
   O instalador aparece na pasta "dist".

WIDGET FLUTUANTE
- Cartão sem barra de título, sempre por cima das outras janelas (Always on Top). Arraste por qualquer parte livre dele.
- Por padrão usa o MODO SÓLIDO (mais compatível). No clique direito há a opção 'Fundo transparente (experimental)'.
- Clique direito no widget: Fixar no topo (liga/desliga), Abrir calculadora, Ocultar widget.
- Ícone de lâmpada no campo do valor: ativa o ajuste de transparência do fundo. Role o mouse (para cima = mais sólido, para baixo = mais transparente). Clique de novo na lâmpada ou aperte Esc para sair.
- Os três botões do widget (Entrega própria/iFood, Campanha inteligente, Frete embutido) mostram o que está ativo e podem ser ligados e desligados ali mesmo.
- Botão "Widget" na calculadora mostra/oculta. Atalho global: Ctrl+Shift+M (Mac: Cmd+Shift+M).
- A posição do widget e todas as configurações ficam salvas e voltam ao reabrir.
- Fechar a calculadora principal encerra o programa e o widget.

Obs.: as fontes (Inter/Orbitron) carregam da internet; offline o programa usa fontes do sistema.
