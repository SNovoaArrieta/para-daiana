const messages = {
  acompanar: [
    "Aquí estoy para ti, bonita. No tienes que explicarme qué tienes ni armar una conversación si no te nace.",
    "Si hoy estás cansada hasta para hablar, todo bien. Me puedes responder después, mañana o cuando tengas ganas.",
    "No puedo estar ahí contigo, pero sí puedo hacerte compañía desde acá. Esa era la idea de esto."
  ],
  molestar: [
    "Bueno, suficiente tristeza por cinco minutos. Proceda a tocar botones como una niña chiquita.",
    "Si el día te trató mal, lo podemos funar entre las dos. para ti siempre tengo tiempo.",
    "No sé qué tan mal esté el día, pero mínimo ya tienes una página con un gato. eso es algo.",
    "Te doy permiso de estar cansada, pero no de decir que este gato está feo porque ahí sí peleamos."
  ],
  nada: [
    "Perfecto. No hagas nada. Quédate viendo la pantalla, acuéstate o duerme. No hay tarea escondida.",
    "Excelente elección. Cero productividad. Cero discurso motivacional. Siguiente.",
    "Puedes cerrar esto y dormir también. No me voy a ofender."
  ],
  bonito: [
    "Solo para que lo tengas presente: aquí estoy para ti.",
    "No tienes que estar bien todo el tiempo conmigo, bonita.",
    "Me importa que estés bien, pero no te voy a fastidiar tratando de arreglarte a la fuerza."
  ],
  sofi: [
    "Aquí estoy. Esa opción venía funcionando desde antes de abrir la página.",
    "Me tienes aquí, bonita. No físicamente, ya sé, pero aquí estoy para ti.",
    "Puedes escribirme cualquier cosa. Incluso un punto. Yo entiendo."
  ]
};

let lastIndex = {};

function showMessage(type){
  const list = messages[type];
  let idx;
  do{
    idx = Math.floor(Math.random()*list.length);
  }while(list.length > 1 && lastIndex[type] === idx);

  lastIndex[type] = idx;
  const el = document.getElementById('message');
  el.classList.add('fade');
  setTimeout(()=>{
    el.textContent = list[idx];
    el.classList.remove('fade');
  },160);
}

const toyWords = ["ya", "respira", "suelta", "duerme", "pausa", "meh", "aquí", "nada", "miau"];
const toyZone = document.getElementById('toyZone');

function createToy(){
  const b = document.createElement('button');
  b.className = 'toy';
  b.textContent = toyWords[Math.floor(Math.random()*toyWords.length)];

  const w = toyZone.clientWidth || 300;
  const h = toyZone.clientHeight || 230;
  b.style.left = Math.max(4, Math.random()*(w-85)) + 'px';
  b.style.top = Math.max(8, Math.random()*(h-52)) + 'px';
  b.style.animationDuration = (2.3 + Math.random()*2.2) + 's';

  b.onclick = ()=>{
    b.classList.add('pop');
    setTimeout(()=>{
      b.remove();
      createToy();
    },190);
  };

  toyZone.appendChild(b);
}

function seedToys(){
  toyZone.innerHTML = '';
  for(let i=0;i<11;i++) createToy();
}

let breathActive = false;
let breathStep = 0;
let breathTimer;
const breathCat = document.getElementById('breathCat');
const breathButton = document.getElementById('breathButton');
const breathWords = ["inhala","aguanta un poco","suelta"];

function runBreathing(){
  clearInterval(breathTimer);
  breathStep = 0;
  breathCat.textContent = breathWords[0];

  breathTimer = setInterval(()=>{
    if(!breathActive) return;
    breathStep = (breathStep + 1) % breathWords.length;
    breathCat.textContent = breathWords[breathStep];
  },4000);
}

function toggleBreathing(){
  breathActive = !breathActive;
  if(breathActive){
    breathCat.classList.add('active');
    breathButton.textContent = 'pausar';
    runBreathing();
  }else{
    breathCat.classList.remove('active');
    breathButton.textContent = 'seguir';
    clearInterval(breathTimer);
    breathCat.textContent = 'pausa';
  }
}

function restartBreathing(){
  breathActive = true;
  breathCat.classList.add('active');
  breathButton.textContent = 'pausar';
  runBreathing();
}

const fortunes = [
  "Toma agua. Sí, esa es la misión. Tampoco iba a mandarte a escalar una montaña.",
  "Pon una canción que te guste y no hagas nada más mientras suena.",
  "Acuéstate cinco minutos y olvida el trabajo y las cosas que tienes por hacer.",
  "Busca un video estúpido de Minions. Terapia de bajo presupuesto.",
  "Juega una partida de algo y prohíbete pensar en el día que tuviste hoy hasta que termine.",
  "Come algo si no has comido. Esto no es negociable, ok?.",
  "Cierra los ojos un rato. La página sigue aquí cuando vuelvas."
];

function newFortune(){
  document.getElementById('fortune').textContent =
    fortunes[Math.floor(Math.random()*fortunes.length)];
}

// --- TETRIS ---
const COLS = 10;
const ROWS = 16;
let board = [];
let current = null;
let currentX = 3;
let currentY = 0;
let tetrisTimer = null;
let lines = 0;
let score = 0;
let level = 1;
let gameOver = false;
let tetrisStarted = false;
let pieceBag = [];

const pieces = [
  [[1,1,1,1]],
  [[1,1],[1,1]],
  [[0,1,0],[1,1,1]],
  [[1,0,0],[1,1,1]],
  [[0,0,1],[1,1,1]],
  [[0,1,1],[1,1,0]],
  [[1,1,0],[0,1,1]]
];

function emptyBoard(){
  return Array.from({length:ROWS},()=>Array(COLS).fill(0));
}

function randomPiece(){
  if(!pieceBag.length){
    pieceBag = pieces.map((_, index)=>index);
    for(let i=pieceBag.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [pieceBag[i],pieceBag[j]] = [pieceBag[j],pieceBag[i]];
    }
  }
  return pieces[pieceBag.pop()].map(r=>[...r]);
}

function canPlace(piece,x,y){
  for(let r=0;r<piece.length;r++){
    for(let c=0;c<piece[r].length;c++){
      if(!piece[r][c]) continue;
      const bx = x+c;
      const by = y+r;
      if(bx<0 || bx>=COLS || by>=ROWS) return false;
      if(by>=0 && board[by][bx]) return false;
    }
  }
  return true;
}

function mergePiece(){
  current.forEach((row,r)=>{
    row.forEach((v,c)=>{
      if(v && currentY+r>=0){
        board[currentY+r][currentX+c]=1;
      }
    });
  });
}

function clearLines(){
  let cleared = 0;
  board = board.filter(row=>{
    if(row.every(Boolean)){
      cleared++;
      return false;
    }
    return true;
  });

  while(board.length < ROWS){
    board.unshift(Array(COLS).fill(0));
  }

  if(cleared){
    score += [0,100,300,500,800][cleared] * level;
  }
  lines += cleared;
  const nextLevel = Math.floor(lines/5)+1;
  if(nextLevel !== level){
    level = nextLevel;
    scheduleTetris();
  }
  document.getElementById('lines').textContent = lines;
  document.getElementById('level').textContent = level;
  document.getElementById('score').textContent = score;
}

function spawnPiece(){
  current = randomPiece();
  currentX = Math.floor((COLS-current[0].length)/2);
  currentY = 0;

  if(!canPlace(current,currentX,currentY)){
    gameOver = true;
    clearInterval(tetrisTimer);
  }
}

function scheduleTetris(){
  clearInterval(tetrisTimer);
  if(tetrisStarted && !gameOver){
    const speed = Math.max(95, 560-(level-1)*55);
    tetrisTimer = setInterval(tick,speed);
  }
}

function tick(){
  if(!tetrisStarted || gameOver) return;
  if(canPlace(current,currentX,currentY+1)){
    currentY++;
  }else{
    mergePiece();
    clearLines();
    spawnPiece();
  }
  renderTetris();
}

function rotatePiece(){
  if(!tetrisStarted || gameOver) return;
  const rotated = current[0].map((_,i)=>current.map(row=>row[i]).reverse());
  for(const offset of [0,-1,1,-2,2]){
    if(canPlace(rotated,currentX+offset,currentY)){
      current = rotated;
      currentX += offset;
      renderTetris();
      return;
    }
  }
}

function movePiece(dx){
  if(!tetrisStarted || gameOver) return;
  if(canPlace(current,currentX+dx,currentY)){
    currentX += dx;
    renderTetris();
  }
}

function dropPiece(){
  if(!tetrisStarted || gameOver) return;
  if(canPlace(current,currentX,currentY+1)){
    currentY++;
    score++;
    document.getElementById('score').textContent = score;
  }else{
    mergePiece();
    clearLines();
    spawnPiece();
  }
  renderTetris();
}

function hardDrop(){
  if(!tetrisStarted || gameOver) return;
  let distance = 0;
  while(canPlace(current,currentX,currentY+1)){
    currentY++;
    distance++;
  }
  score += distance*2;
  mergePiece();
  clearLines();
  spawnPiece();
  renderTetris();
}

function renderTetris(){
  const el = document.getElementById('tetris');
  el.innerHTML = '';

  const display = board.map(row=>[...row]);

  if(current){
    let ghostY = currentY;
    while(canPlace(current,currentX,ghostY+1)) ghostY++;
    current.forEach((row,r)=>{
      row.forEach((v,c)=>{
        if(v && ghostY+r>=0 && display[ghostY+r][currentX+c]===0){
          display[ghostY+r][currentX+c]=3;
        }
      });
    });

    current.forEach((row,r)=>{
      row.forEach((v,c)=>{
        if(v && currentY+r>=0 && currentY+r<ROWS && currentX+c>=0 && currentX+c<COLS){
          display[currentY+r][currentX+c]=2;
        }
      });
    });
  }

  display.forEach(row=>{
    row.forEach(v=>{
      const cell = document.createElement('div');
      cell.className = 'cell' + (v===1?' filled':v===2?' active-piece':v===3?' ghost-piece':'');
      el.appendChild(cell);
    });
  });
  el.classList.toggle('game-over',gameOver);
  const stateLabel = !tetrisStarted
    ? 'Tetris listo para jugar.'
    : gameOver
      ? 'Fin de la partida. Reinicia para volver a jugar.'
      : 'Tetris en curso';
  el.setAttribute('aria-label',stateLabel);
}

function resetTetris(){
  tetrisStarted = true;
  board = emptyBoard();
  lines = 0;
  score = 0;
  level = 1;
  gameOver = false;
  pieceBag = [];
  document.getElementById('lines').textContent = '0';
  document.getElementById('level').textContent = '1';
  document.getElementById('score').textContent = '0';
  document.getElementById('tetrisStartButton').textContent = 'reiniciar';
  spawnPiece();
  scheduleTetris();
  renderTetris();
}

function prepareTetris(){
  clearInterval(tetrisTimer);
  board = emptyBoard();
  current = null;
  tetrisStarted = false;
  renderTetris();
}

let touchStartX = null;
let touchStartY = null;

document.getElementById('tetris').addEventListener('touchstart',e=>{
  const t=e.touches[0];
  touchStartX=t.clientX;
  touchStartY=t.clientY;
},{passive:true});

document.getElementById('tetris').addEventListener('touchend',e=>{
  if(touchStartX===null) return;
  const t=e.changedTouches[0];
  const dx=t.clientX-touchStartX;
  const dy=t.clientY-touchStartY;

  if(Math.abs(dx)>35 && Math.abs(dx)>Math.abs(dy)){
    movePiece(dx>0?1:-1);
  }else if(dy>35){
    dropPiece();
  }else{
    rotatePiece();
  }

  touchStartX=null;
  touchStartY=null;
},{passive:true});

document.addEventListener('keydown',e=>{
  const actions = {
    ArrowLeft: ()=>movePiece(-1),
    ArrowRight: ()=>movePiece(1),
    ArrowUp: rotatePiece,
    ArrowDown: dropPiece,
    ' ': hardDrop
  };
  if(actions[e.key]){
    e.preventDefault();
    actions[e.key]();
  }
});

document.addEventListener('click',e=>{
  if(e.target.closest('button')){
    const s=document.createElement('span');
    s.className='spark';
    s.textContent=Math.random()>.5?'·':'🐾';
    s.style.left=e.clientX+'px';
    s.style.top=e.clientY+'px';
    document.body.appendChild(s);
    setTimeout(()=>s.remove(),700);
  }
});

seedToys();
prepareTetris();
window.addEventListener('resize',seedToys);
