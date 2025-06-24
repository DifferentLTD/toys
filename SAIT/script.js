// --- Seed генерация для вариативности ---
function randomSeed() {
  return Math.floor(Math.random() * 1e9) + '-' + Date.now();
}
const SEED = randomSeed();

// --- Анимированный психоделический фон ---
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let w = window.innerWidth, h = window.innerHeight;
canvas.width = w; canvas.height = h;
window.addEventListener('resize', () => {
  w = window.innerWidth; h = window.innerHeight;
  canvas.width = w; canvas.height = h;
});

function rand(a, b) { return a + Math.random() * (b - a); }
function lerp(a, b, t) { return a + (b - a) * t; }

let shapes = [];
function genShapes(seed) {
  shapes = [];
  let n = 5 + Math.floor(Math.random() * 4);
  for (let i = 0; i < n; ++i) {
    let points = [];
    let cx = rand(0.2, 0.8) * w, cy = rand(0.2, 0.8) * h;
    let r = rand(80, 220);
    let pCount = 5 + Math.floor(rand(0, 5));
    for (let j = 0; j < pCount; ++j) {
      let ang = (Math.PI * 2) * (j / pCount) + rand(-0.2, 0.2);
      let px = cx + Math.cos(ang) * r * rand(0.7, 1.2);
      let py = cy + Math.sin(ang) * r * rand(0.7, 1.2);
      points.push({x: px, y: py});
    }
    let color = `hsl(${rand(180, 360)},${rand(60,90)}%,${rand(40,60)}%)`;
    shapes.push({points, color, phase: rand(0, 100)});
  }
}
genShapes(SEED);

function drawShape(shape, t) {
  ctx.save();
  ctx.beginPath();
  let pts = shape.points;
  for (let i = 0; i < pts.length; ++i) {
    let p = pts[i];
    let next = pts[(i+1)%pts.length];
    let cpx = lerp(p.x, next.x, 0.5) + Math.sin(t/700 + shape.phase + i) * 20;
    let cpy = lerp(p.y, next.y, 0.5) + Math.cos(t/900 + shape.phase + i) * 20;
    if (i === 0) ctx.moveTo(p.x, p.y);
    ctx.quadraticCurveTo(cpx, cpy, next.x, next.y);
  }
  ctx.closePath();
  ctx.globalAlpha = 0.7;
  ctx.fillStyle = shape.color;
  ctx.filter = `blur(${6 + 8*Math.abs(Math.sin(t/2000 + shape.phase))}px)`;
  ctx.fill();
  ctx.restore();
}

function animateBg(t) {
  ctx.clearRect(0,0,w,h);
  for (let s of shapes) drawShape(s, t);
  requestAnimationFrame(animateBg);
}
requestAnimationFrame(animateBg);

// --- Интересные факты о мире игрушек ---
const toyFacts = [
  'Самая дорогая кукла Барби была продана за $302,500 на аукционе Christie\'s.',
  'Лего — крупнейший производитель шин в мире (маленьких, для своих конструкторов).',
  'Первая плюшевая игрушка появилась благодаря медведю Теодору Рузвельту — отсюда и "Teddy Bear".',
  'В Японии есть музеи, посвящённые только одной игрушке — например, Тамагочи.',
  'В 2020 году продажи настольных игр выросли более чем на 20% по всему миру.',
  'Самая маленькая в мире игрушка — микроскопический поезд длиной 0,0001 мм, созданный IBM.',
  'В СССР выпускали уникальные механические игрушки, которые сейчас ценятся коллекционерами.',
  'В мире существует более 100 000 видов игрушечных машинок Hot Wheels.',
  'Самая большая коллекция игрушечных медведей насчитывает более 20 000 экземпляров.',
  'В 1959 году была выпущена первая кукла Барби — с тех пор продано более миллиарда кукол.',
  'Самый популярный конструктор в мире — LEGO, ежегодно продаётся более 75 миллиардов деталей.',
  'В 1980-х годах в СССР выпускались уникальные трансформеры — "Роботы Перестройки".',
  'Коллекционные карточки Pokémon — одни из самых ценных игрушечных коллекций в мире.',
  'В Японии существует профессия — "мастер по ремонту плюшевых игрушек".',
  'Самая большая в мире настольная игра — Monopoly, размером с футбольное поле.',
  'В 2021 году фигурка Hot Wheels была отправлена в космос на борту ракеты SpaceX.',
  'В некоторых странах существуют музеи, посвящённые исключительно игрушечным поездам.',
  'В 2014 году был установлен мировой рекорд по количеству одновременно запущенных волчков — 2 472 штуки.'
];
function fadeFact(newFact) {
  const factBox = document.getElementById('fact-box');
  let opacity = 0.93;
  function fadeOut() {
    opacity -= 0.07;
    if (opacity <= 0) {
      factBox.textContent = newFact;
      fadeIn();
    } else {
      factBox.style.opacity = opacity;
      requestAnimationFrame(fadeOut);
    }
  }
  function fadeIn() {
    opacity += 0.07;
    if (opacity >= 0.93) {
      factBox.style.opacity = 0.93;
    } else {
      factBox.style.opacity = opacity;
      requestAnimationFrame(fadeIn);
    }
  }
  fadeOut();
}
function showRandomFact() {
  const fact = toyFacts[Math.floor(Math.random()*toyFacts.length)];
  fadeFact(fact);
}
showRandomFact();
setInterval(showRandomFact, 7000);

// --- Аудиоэффекты ---
const hoverSound = document.getElementById('hover-sound');
let quiet = false;
function playHoverSound() {
  if (quiet) return;
  hoverSound.currentTime = 0;
  hoverSound.volume = 0.18;
  hoverSound.play();
}

// --- Easter egg ---
let egg = document.getElementById('easter-egg');
document.addEventListener('keydown', e => {
  if (e.key === 'e' && e.ctrlKey) {
    egg.style.display = 'block';
    egg.innerHTML = '<h2>🌈 Скрытый сюрреалистичный опыт!</h2><p>Вы нашли пасхалку. Seed: '+SEED+'</p>';
    setTimeout(()=>{egg.style.display='none';}, 6000);
  }
});

// --- Переключение темы ---
document.addEventListener('DOMContentLoaded', function() {
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle.querySelector('.theme-icon');
  let isDarkTheme = false;

  function toggleTheme() {
    isDarkTheme = !isDarkTheme;
    document.body.classList.toggle('dark-theme', isDarkTheme);
    
    if (isDarkTheme) {
      themeIcon.textContent = '☀️';
      themeToggle.title = 'Переключить на светлую тему';
    } else {
      themeIcon.textContent = '🌙';
      themeToggle.title = 'Переключить на тёмную тему';
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  // --- Плавная прокрутка для навигации ---
  const navLinks = document.querySelectorAll('.header-nav a[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      
      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // --- Функционал скачивания приложений ---
  const downloadMobile = document.getElementById('download-mobile');
  const downloadPC = document.getElementById('download-pc');
  const downloadApp = document.getElementById('download-app');
  const downloadExcel = document.querySelector('a[href="downloads/excel.xlsx"]');
  const downloadScreenshot = document.getElementById('download-screenshot');

  if (downloadApp) {
    downloadApp.addEventListener('click', function(e) {
      // Добавляем визуальную обратную связь
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = 'scale(1)';
      }, 150);
      
      // Показываем уведомление о начале скачивания
      showDownloadNotification('Начинается скачивание приложения...');
    });
  }

  if (downloadScreenshot) {
    downloadScreenshot.addEventListener('click', function(e) {
      // Добавляем визуальную обратную связь
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = 'scale(1)';
      }, 150);
      
      // Показываем уведомление о начале скачивания
      showDownloadNotification('Начинается скачивание скриншота...');
    });
  }

  if (downloadExcel) {
    downloadExcel.addEventListener('click', function(e) {
      // Добавляем визуальную обратную связь
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = 'scale(1)';
      }, 150);
      
      // Показываем уведомление о начале скачивания
      showDownloadNotification('Начинается скачивание Excel шаблона...');
    });
  }

  if (downloadMobile) {
    downloadMobile.addEventListener('click', function(e) {
      // Добавляем визуальную обратную связь
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = 'scale(1)';
      }, 150);
      
      // Показываем уведомление о начале скачивания
      showDownloadNotification('Начинается скачивание APK файла...');
    });
  }

  if (downloadPC) {
    downloadPC.addEventListener('click', function(e) {
      // Добавляем визуальную обратную связь
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = 'scale(1)';
      }, 150);
      
      // Показываем уведомление о начале скачивания
      showDownloadNotification('Начинается скачивание EXE файла...');
    });
  }

  function showDownloadNotification(message) {
    // Создаем временное уведомление
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #7b3fe4 0%, #9c6fe8 100%);
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 15px rgba(123, 63, 228, 0.3);
      z-index: 1000;
      font-family: 'Montserrat', sans-serif;
      font-size: 14px;
      animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Удаляем уведомление через 3 секунды
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }
});

// Добавляем CSS анимации для уведомлений
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(style); 