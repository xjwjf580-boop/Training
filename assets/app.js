(function(){
  "use strict";

  /* ---------- геометрия схем упражнений ---------- */

  function P(x, y, a, l){
    var r = a * Math.PI / 180;
    return [x + l * Math.cos(r), y + l * Math.sin(r)];
  }
  function nm(v){ return Math.round(v * 10) / 10; }
  function ln(a, b, w, cls){
    return '<line x1="' + nm(a[0]) + '" y1="' + nm(a[1]) + '" x2="' + nm(b[0]) + '" y2="' + nm(b[1]) +
      '" stroke-width="' + w + '" stroke-linecap="round"' + (cls ? ' class="' + cls + '"' : '') + '/>';
  }
  function cir(p, r, cls){
    return '<circle cx="' + nm(p[0]) + '" cy="' + nm(p[1]) + '" r="' + r + '"' + (cls ? ' class="' + cls + '"' : '') + '/>';
  }
  function pad(p, w, h, cls){
    return '<rect x="' + nm(p[0] - w / 2) + '" y="' + nm(p[1] - h / 2) + '" width="' + w + '" height="' + h +
      '" rx="3"' + (cls ? ' class="' + cls + '"' : '') + '/>';
  }

  var RIG = {
    seat: function(){
      return ln([52, 96], [96, 96], 4, 'rig') + ln([52, 96], [50, 62], 4, 'rig') + ln([70, 96], [70, 112], 3, 'rig');
    },
    seatBack: function(){
      return ln([52, 96], [96, 96], 4, 'rig') + ln([52, 96], [46, 44], 5, 'rig') + ln([70, 96], [70, 112], 3, 'rig');
    },
    stand: function(){
      return ln([16, 112], [110, 112], 3, 'rig');
    },
    cable: function(){
      return ln([16, 112], [110, 112], 3, 'rig') + ln([104, 112], [104, 16], 4, 'rig') + cir([104, 16], 4, 'rig-f');
    },
    cableLow: function(){
      return ln([16, 112], [110, 112], 3, 'rig') + ln([104, 112], [104, 40], 4, 'rig') + cir([104, 104], 4, 'rig-f');
    },
    bars: function(){
      return ln([40, 74], [104, 74], 4, 'rig') + ln([44, 74], [44, 112], 3, 'rig') + ln([16, 112], [110, 112], 3, 'rig');
    },
    sled: function(){
      return ln([30, 108], [104, 44], 4, 'rig') + ln([22, 100], [96, 36], 3, 'rig');
    },
    chair: function(){
      return ln([44, 20], [44, 112], 4, 'rig') + ln([44, 44], [78, 44], 4, 'rig') + ln([16, 112], [110, 112], 3, 'rig');
    }
  };

  var DEF = { torso:-95, tlen:34, sh:88, el:88, hip:6, kn:84, arm:20, fore:20, thigh:24, shin:24, load:'hand' };

  function drawFig(pose, phase){
    var o = {}, keys = ['torso','tlen','sh','el','hip','kn','hip2','kn2','load','ank'], i;
    for (i = 0; i < keys.length; i++){
      var k = keys[i];
      o[k] = (phase[k] !== undefined) ? phase[k] : (pose[k] !== undefined ? pose[k] : DEF[k]);
    }
    var hx = pose.hx !== undefined ? pose.hx : 66;
    var hy = pose.hy !== undefined ? pose.hy : 84;
    var hip = [hx, hy];
    var sh = P(hx, hy, o.torso, o.tlen);
    var head = P(sh[0], sh[1], o.torso, 11);
    var el = P(sh[0], sh[1], o.sh, DEF.arm);
    var hand = P(el[0], el[1], o.el, DEF.fore);
    var kn = P(hx, hy, o.hip, DEF.thigh);
    var ft = P(kn[0], kn[1], o.kn, DEF.shin);
    var s = '';
    if (o.hip2 !== undefined){
      var kn2 = P(hx, hy, o.hip2, DEF.thigh);
      var ft2 = P(kn2[0], kn2[1], o.kn2 !== undefined ? o.kn2 : o.kn, DEF.shin);
      s += ln(hip, kn2, 5, 'lb') + ln(kn2, ft2, 5, 'lb');
      if (o.load === 'foot'){ s += pad(ft2, 16, 7, 'ld'); }
    }
    s += ln(hip, kn, 5, 'bd') + ln(kn, ft, 5, 'bd');
    if (o.ank !== undefined){ s += ln(ft, P(ft[0], ft[1], o.ank, 10), 4, 'bd'); }
    s += ln(hip, sh, 6, 'bd') + cir(head, 7, 'hd');
    s += ln(sh, el, 5, 'bd') + ln(el, hand, 5, 'bd');
    if (o.load === 'hand'){ s += pad(hand, 8, 18, 'ld'); }
    else if (o.load === 'foot'){ s += pad(ft, 16, 7, 'ld'); }
    else if (o.load === 'shoulder'){ s += pad(sh, 20, 8, 'ld'); }
    return s;
  }

  function figure(pose, which){
    var rig = RIG[pose.rig] ? RIG[pose.rig]() : '';
    return '<svg viewBox="0 0 120 120" role="img" aria-hidden="true">' +
      '<g fill="none" stroke="currentColor" stroke-linejoin="round">' + rig +
      drawFig(pose, which === 'f' ? pose.f : pose.s) + '</g></svg>';
  }

  var POSE = {
    chestPress:   { rig:'seatBack', hx:64, hy:84, torso:-100, s:{ sh:170, el:14 }, f:{ sh:6, el:2 } },
    inclinePress: { rig:'seatBack', hx:64, hy:84, torso:-112, s:{ sh:150, el:-8 }, f:{ sh:-42, el:-46 } },
    pecDeck:      { rig:'seatBack', hx:64, hy:84, torso:-98,  s:{ sh:40, el:-30 }, f:{ sh:2, el:0 } },
    crossover:    { rig:'cable', hx:56, hy:80, torso:-84, s:{ sh:-58, el:-44, hip:78, kn:86 }, f:{ sh:34, el:22, hip:78, kn:86 } },
    shoulderPress:{ rig:'seatBack', hx:64, hy:84, torso:-97, s:{ sh:-128, el:-72 }, f:{ sh:-90, el:-92 } },
    dip:          { rig:'bars', hx:60, hy:78, torso:-92, s:{ sh:132, el:44, hip:70, kn:60 }, f:{ sh:92, el:88, hip:74, kn:64 } },
    pushdown:     { rig:'cable', hx:58, hy:82, torso:-90, s:{ sh:96, el:-34, hip:82, kn:88 }, f:{ sh:94, el:80, hip:82, kn:88 } },
    overheadExt:  { rig:'cableLow', hx:58, hy:82, torso:-90, s:{ sh:-78, el:172, hip:82, kn:88 }, f:{ sh:-84, el:-88, hip:82, kn:88 } },
    pulldown:     { rig:'seat', hx:64, hy:84, torso:-96, s:{ sh:-92, el:-94 }, f:{ sh:134, el:-24 } },
    straightArm:  { rig:'cable', hx:58, hy:82, torso:-74, s:{ sh:-64, el:-62, hip:80, kn:86 }, f:{ sh:26, el:24, hip:80, kn:86 } },
    row:          { rig:'seat', hx:64, hy:84, torso:-92, s:{ sh:-6, el:-4 }, f:{ sh:152, el:-14 } },
    rearDelt:     { rig:'seat', hx:64, hy:84, torso:-92, s:{ sh:-10, el:-8 }, f:{ sh:178, el:176 } },
    curlMachine:  { rig:'seat', hx:64, hy:84, torso:-95, s:{ sh:34, el:26 }, f:{ sh:30, el:-66 } },
    cableCurl:    { rig:'cableLow', hx:58, hy:82, torso:-90, s:{ sh:88, el:84, hip:82, kn:88 }, f:{ sh:92, el:-58, hip:82, kn:88 } },
    legPress:     { rig:'sled', hx:52, hy:88, torso:-148, load:'foot', s:{ sh:-160, el:-150, hip:-34, kn:-74 }, f:{ sh:-160, el:-150, hip:-40, kn:-36 } },
    hackSquat:    { rig:'sled', hx:60, hy:78, torso:-104, load:'shoulder', s:{ sh:120, el:104, hip:24, kn:96 }, f:{ sh:110, el:96, hip:64, kn:90 } },
    legExt:       { rig:'seat', hx:64, hy:84, torso:-95, load:'foot', s:{ sh:20, el:16, hip:6, kn:86 }, f:{ sh:20, el:16, hip:6, kn:2 } },
    legCurl:      { rig:'seat', hx:64, hy:84, torso:-95, load:'foot', s:{ sh:20, el:16, hip:8, kn:4 }, f:{ sh:20, el:16, hip:8, kn:84 } },
    abduct:       { rig:'seat', hx:64, hy:84, torso:-92, load:'foot', s:{ sh:60, el:70, hip:74, hip2:96, kn:80, kn2:92 }, f:{ sh:60, el:70, hip:52, hip2:120, kn:58, kn2:116 } },
    adduct:       { rig:'seat', hx:64, hy:84, torso:-92, load:'foot', s:{ sh:60, el:70, hip:52, hip2:120, kn:58, kn2:116 }, f:{ sh:60, el:70, hip:74, hip2:96, kn:80, kn2:92 } },
    calf:         { rig:'stand', hx:60, hy:70, torso:-90, load:'shoulder', s:{ sh:86, el:88, hip:86, kn:90, ank:4 }, f:{ sh:86, el:88, hip:86, kn:90, ank:-40 } },
    crunch:       { rig:'seat', hx:64, hy:84, s:{ torso:-98, sh:-40, el:-30 }, f:{ torso:-58, sh:-6, el:0 } },
    kneeRaise:    { rig:'chair', hx:66, hy:74, torso:-90, s:{ sh:150, el:150, hip:86, kn:90 }, f:{ sh:150, el:150, hip:2, kn:62 } },
    lateralRaise: { rig:'seat', hx:64, hy:84, torso:-94, s:{ sh:86, el:84 }, f:{ sh:4, el:-6 } },
    shrug:        { rig:'stand', hx:60, hy:72, torso:-90, s:{ tlen:32, sh:88, el:88, hip:86, kn:90 }, f:{ tlen:26, sh:88, el:88, hip:86, kn:90 } },
    tricepsSeat:  { rig:'seatBack', hx:64, hy:84, torso:-98, s:{ sh:-70, el:168 }, f:{ sh:-72, el:-74 } },
    wristCurl:    { rig:'seat', hx:64, hy:84, torso:-95, s:{ sh:24, el:6 }, f:{ sh:24, el:-18 } }
  };

  /* ---------- план тренировок Никиты ---------- */

  var PLAN = [
    {
      id:'d1', tab:'День 1 · Грудь + трицепс',
      title:'Жимы: грудь, передние дельты, трицепс',
      meta:'8 упражнений · 25 подходов · разминка 5–7 минут на велотренажёре',
      blocks:[
        { label:'База — грудь', items:[
          { id:'d1a', n:'Жим от груди в тренажёре', en:'Chest Press, сидя', pose:'chestPress', sets:4, reps:'8–10', rest:'120 с',
            steps:['Спина и затылок прижаты к спинке, лопатки сведены','Ручки на уровне середины груди, локти под 45 градусов','Выжимай плавно, в конце локти не выключай в замок','Опускай 2–3 секунды до лёгкого растяжения груди'],
            vid:'жим от груди в тренажёре техника' },
          { id:'d1b', n:'Жим в наклонном рычажном тренажёре', en:'Incline Hammer Press', pose:'inclinePress', sets:3, reps:'10–12', rest:'90 с',
            steps:['Сядь плотно, поясница без сильного прогиба','Локти чуть ниже линии плеч','Жми вверх-вперёд по дуге, без замка'],
            vid:'жим в наклонном тренажёре техника' },
          { id:'d1c', n:'Сведение рук «бабочка»', en:'Pec Deck', pose:'pecDeck', sets:3, reps:'12–15', rest:'60 с',
            steps:['Настрой сиденье: локти на уровне груди','Локти чуть согнуты и зафиксированы','Своди до касания предплечий, пауза 1 секунда','Разводи медленно, грудь остаётся раскрытой'],
            vid:'бабочка pec deck техника' },
          { id:'d1d', n:'Сведение в кроссовере сверху вниз', en:'Cable Crossover', pose:'crossover', sets:3, reps:'12–15', rest:'60 с',
            steps:['Шаг вперёд, корпус слегка наклонён','Руки идут по дуге вниз-внутрь','В конце скрести кисти на 5–10 см'],
            vid:'сведение рук в кроссовере техника' }
        ]},
        { label:'Плечи и трицепс', items:[
          { id:'d1e', n:'Жим над головой в тренажёре', en:'Shoulder Press Machine', pose:'shoulderPress', sets:3, reps:'10', rest:'90 с',
            steps:['В старте ручки на уровне ушей','Поясница прижата, живот подтянут','Жми вверх, голову не выводи вперёд'],
            vid:'жим над головой в тренажёре техника' },
          { id:'d1f', n:'Отжимания в гравитроне', en:'Assisted Dip Machine — записывай вес противовеса', pose:'dip', sets:3, reps:'8–10', rest:'90 с',
            steps:['Противовес такой, чтобы делать 8–10 чисто','Корпус вертикально — акцент на трицепс','Опускайся до прямого угла в локте'],
            vid:'отжимания в гравитроне техника' },
          { id:'d1g', n:'Разгибание рук на верхнем блоке с канатом', en:'Rope Pushdown', pose:'pushdown', sets:3, reps:'12', rest:'60 с',
            steps:['Локти прижаты к бокам и не двигаются','Внизу разведи канат в стороны','Возврат до прямого угла, не выше'],
            vid:'разгибание рук на блоке канат техника' },
          { id:'d1h', n:'Разгибание из-за головы на нижнем блоке', en:'Overhead Cable Extension', pose:'overheadExt', sets:3, reps:'12–15', rest:'60 с',
            steps:['Встань спиной к блоку, канат за головой','Локти смотрят вперёд и стоят на месте','Разгибай полностью, опускай медленно'],
            vid:'разгибание рук из-за головы на блоке' }
        ]}
      ]
    },
    {
      id:'d2', tab:'День 2 · Спина + бицепс',
      title:'Тяги: спина, задние дельты, бицепс',
      meta:'9 упражнений · 28 подходов · разминка 5–7 минут на гребном тренажёре',
      blocks:[
        { label:'Ширина спины', items:[
          { id:'d2a', n:'Тяга верхнего блока широким хватом', en:'Lat Pulldown', pose:'pulldown', sets:4, reps:'8–10', rest:'120 с',
            steps:['Хват чуть шире плеч, грудь вперёд','Тяни локтями вниз к бокам','Гриф до верха груди, пауза 1 секунда','Вверх — контролируемо, до растяжения'],
            vid:'тяга верхнего блока техника' },
          { id:'d2b', n:'Тяга верхнего блока обратным хватом', en:'Reverse-grip Pulldown', pose:'pulldown', sets:3, reps:'10–12', rest:'90 с',
            steps:['Ладони к себе, хват по ширине плеч','Корпус отклонён на 10–15 градусов','Тяни к низу груди, локти вдоль тела'],
            vid:'тяга верхнего блока обратным хватом' },
          { id:'d2c', n:'Тяга прямыми руками на блоке', en:'Straight-arm Pulldown', pose:'straightArm', sets:3, reps:'12–15', rest:'60 с',
            steps:['Наклон корпуса 30 градусов, руки почти прямые','Тяни широчайшими, а не трицепсом','Доводи до бёдер, пауза 1 секунда'],
            vid:'тяга прямыми руками в блоке' }
        ]},
        { label:'Толщина спины', items:[
          { id:'d2d', n:'Тяга к животу на нижнем блоке', en:'Seated Cable Row', pose:'row', sets:4, reps:'10', rest:'120 с',
            steps:['Спина прямая, колени слегка согнуты','Тяни к низу живота, локти вдоль тела','Сведи лопатки, корпус не раскачивай'],
            vid:'тяга нижнего блока к животу техника' },
          { id:'d2e', n:'Тяга в рычажном тренажёре с упором', en:'Chest-supported Row', pose:'row', sets:3, reps:'10–12', rest:'90 с',
            steps:['Грудь плотно в упор, плечи расслаблены','Тяни локтями назад-вниз','Отпускай вес на 3 счёта'],
            vid:'тяга в рычажном тренажёре техника' },
          { id:'d2f', n:'Обратная «бабочка»', en:'Reverse Pec Deck', pose:'rearDelt', sets:3, reps:'15', rest:'60 с',
            steps:['Ручки на уровне плеч, руки почти прямые','Разводи назад по широкой дуге','Работай задней дельтой, не трапецией'],
            vid:'обратная бабочка задняя дельта' }
        ]},
        { label:'Бицепс и предплечье', items:[
          { id:'d2g', n:'Сгибание рук в тренажёре', en:'Biceps Curl Machine', pose:'curlMachine', sets:3, reps:'10–12', rest:'60 с',
            steps:['Плечи в подушку, локти зафиксированы','Сгибай до полного сокращения','Разгибай почти до прямой руки'],
            vid:'сгибание рук в тренажёре бицепс' },
          { id:'d2h', n:'Сгибание рук на нижнем блоке', en:'Cable Curl', pose:'cableCurl', sets:3, reps:'12', rest:'60 с',
            steps:['Локти у корпуса, спина неподвижна','Вверху сожми бицепс','Опускай 2–3 секунды'],
            vid:'сгибание рук на нижнем блоке' },
          { id:'d2i', n:'«Молот» с канатом на блоке', en:'Rope Hammer Curl', pose:'cableCurl', sets:2, reps:'15', rest:'45 с',
            steps:['Ладони друг к другу, канат по бокам','Сгибай без разведения кистей','Плечи неподвижны, работает только локоть'],
            vid:'молотковые сгибания на блоке канат' }
        ]}
      ]
    },
    {
      id:'d3', tab:'День 3 · Ноги + пресс',
      title:'Ноги и пресс: поддержка сильной зоны',
      meta:'10 упражнений · 32 подхода · ноги уже сильные, держим форму без перегруза',
      blocks:[
        { label:'Квадрицепс и ягодицы', items:[
          { id:'d3a', n:'Жим ногами в тренажёре', en:'Leg Press 45', pose:'legPress', sets:4, reps:'10–12', rest:'120 с',
            steps:['Стопы на ширине плеч, пятки прижаты','Опускай до прямого угла, таз не отрывай','Выжимай без замка в коленях'],
            vid:'жим ногами в тренажёре техника' },
          { id:'d3b', n:'Гакк-приседания', en:'Hack Squat', pose:'hackSquat', sets:3, reps:'10', rest:'120 с',
            steps:['Плечи в упоры, спина прижата','Колени идут по линии стоп','Вниз до параллели, вверх без рывка'],
            vid:'гакк приседания техника' },
          { id:'d3c', n:'Разгибание ног сидя', en:'Leg Extension', pose:'legExt', sets:3, reps:'12–15', rest:'60 с',
            steps:['Валик над стопой, колено на оси тренажёра','Разгибай до прямой, пауза 1 секунда','Опускай медленно, вес не бросай'],
            vid:'разгибание ног сидя техника' },
          { id:'d3d', n:'Сгибание ног в тренажёре', en:'Leg Curl', pose:'legCurl', sets:3, reps:'12', rest:'60 с',
            steps:['Таз прижат, не отрывай от сиденья','Сгибай до упора, пауза 1 секунда','Возврат под контролем'],
            vid:'сгибание ног в тренажёре техника' },
          { id:'d3e', n:'Жим ногами с высокой постановкой стоп', en:'Glute Press', pose:'legPress', sets:3, reps:'12', rest:'90 с',
            steps:['Стопы выше центра платформы','Акцент на ягодицы и заднюю поверхность','Амплитуда без округления поясницы'],
            vid:'жим ногами высокая постановка ягодицы' }
        ]},
        { label:'Добивка и пресс', items:[
          { id:'d3f', n:'Отведение бедра', en:'Abductor', pose:'abduct', sets:3, reps:'15', rest:'45 с',
            steps:['Спина прижата к спинке','Разводи колени плавно до упора','Пауза 1 секунда и медленно назад'],
            vid:'отведение бедра в тренажёре' },
          { id:'d3g', n:'Сведение бедра', en:'Adductor', pose:'adduct', sets:3, reps:'15', rest:'45 с',
            steps:['Колени на подушках, спина прижата','Своди колени без рывка','В конце сжатие 1 секунда, назад медленно'],
            vid:'сведение бедра в тренажёре' },
          { id:'d3h', n:'Подъёмы на носки в тренажёре', en:'Calf Raise', pose:'calf', sets:4, reps:'15', rest:'45 с',
            steps:['Плечи в упоры, колени слегка согнуты','Пятки вниз до растяжения','Вверх максимально высоко, пауза 1 секунда'],
            vid:'подъём на носки в тренажёре техника' },
          { id:'d3i', n:'Скручивания в тренажёре', en:'Ab Crunch Machine', pose:'crunch', sets:3, reps:'15', rest:'45 с',
            steps:['Работай прессом, а не руками','Скругляй спину, тяни грудь к тазу','Возврат медленно, без расслабления'],
            vid:'скручивания в тренажёре пресс' },
          { id:'d3j', n:'Подъём ног в упоре', en:'Captain Chair', pose:'kneeRaise', sets:3, reps:'12', rest:'45 с',
            steps:['Локти в упорах, плечи не поднимай','Поднимай колени к груди, таз скручивай','Опускай медленно, не раскачивайся'],
            vid:'подъём ног в упоре пресс' }
        ]}
      ]
    },
    {
      id:'d4', tab:'День 4 · Плечи + руки',
      title:'Плечи и руки: работа над формой верха',
      meta:'9 упражнений · 28 подходов · руки и плечи — самая отстающая зона по InBody',
      blocks:[
        { label:'Дельты', items:[
          { id:'d4a', n:'Жим над головой в тренажёре', en:'Shoulder Press Machine', pose:'shoulderPress', sets:4, reps:'8–10', rest:'120 с',
            steps:['Ручки на уровне ушей, спина прижата','Жми вверх без прогиба поясницы','Опускай до прямого угла в локте'],
            vid:'жим над головой в тренажёре плечи' },
          { id:'d4b', n:'Разведения в тренажёре', en:'Lateral Raise Machine', pose:'lateralRaise', sets:4, reps:'12–15', rest:'60 с',
            steps:['Упоры под предплечья, локти чуть согнуты','Разводи до уровня плеч, не выше','Плечи вниз, трапеции не подключай'],
            vid:'разведения в тренажёре средняя дельта' },
          { id:'d4c', n:'Отведение руки в кроссовере', en:'Cable Lateral Raise, по одной руке', pose:'lateralRaise', sets:3, reps:'15', rest:'45 с',
            steps:['Ручка в дальней кисти, корпус ровно','Веди руку по дуге до уровня плеча','Темп ровный, без раскачивания'],
            vid:'отведение руки в кроссовере дельта' },
          { id:'d4d', n:'Обратная «бабочка»', en:'Reverse Pec Deck', pose:'rearDelt', sets:3, reps:'15', rest:'45 с',
            steps:['Руки почти прямые, на уровне плеч','Разводи назад, лопатки сводятся','Шея расслаблена, возврат медленно'],
            vid:'обратная бабочка техника' },
          { id:'d4e', n:'Шраги в тренажёре', en:'Shrug Machine', pose:'shrug', sets:3, reps:'12–15', rest:'60 с',
            steps:['Руки прямые, вес держат плечи','Поднимай плечи строго вверх, пауза 1 секунда','Не вращай плечами по кругу'],
            vid:'шраги в тренажёре техника' }
        ]},
        { label:'Руки — суперсет A1 + A2', items:[
          { id:'d4f', n:'Сгибание рук в тренажёре (A1)', en:'Biceps Machine', pose:'curlMachine', sets:3, reps:'10–12', rest:'без паузы',
            steps:['Сразу после подхода переходи к A2','Локти на подушке зафиксированы','Полная амплитуда: до прямой руки и до сжатия'],
            vid:'сгибание рук в тренажёре техника' },
          { id:'d4g', n:'Разгибание рук сидя в тренажёре (A2)', en:'Triceps Machine', pose:'tricepsSeat', sets:3, reps:'10–12', rest:'90 с',
            steps:['Локти прижаты, плечи не поднимаются','Разгибай полностью, пауза 1 секунда','После подхода отдых 90 секунд'],
            vid:'разгибание рук в тренажёре трицепс' },
          { id:'d4h', n:'Разгибание на блоке прямой рукоятью', en:'Straight-bar Pushdown', pose:'pushdown', sets:3, reps:'12', rest:'60 с',
            steps:['Хват на ширине плеч, локти у корпуса','Разгибай до прямой руки','Возврат до прямого угла под контролем'],
            vid:'разгибание рук на блоке рукоять' },
          { id:'d4i', n:'Сгибание кистей на блоке', en:'Cable Wrist Curl', pose:'wristCurl', sets:2, reps:'15–20', rest:'45 с',
            steps:['Предплечья лежат на бёдрах или подушке','Сгибай только кисть, амплитуда небольшая','Вес малый, работай до жжения'],
            vid:'сгибание кистей на блоке предплечья' }
        ]}
      ]
    }
  ];

  /* ---------- хранилище ---------- */

  var KEY = 'nikita-gym-site-v1';
  var store = {};
  var canStore = true;
  try {
    var raw = window.localStorage.getItem(KEY);
    if (raw) { store = JSON.parse(raw) || {}; }
  } catch (e) { canStore = false; }

  function noteStorage(){
    var n = document.getElementById('storageNote');
    if (n) { n.textContent = 'В этом окне автосохранение недоступно. Открой файл прямо в браузере — тогда записи будут сохраняться.'; }
  }
  if (!canStore) { noteStorage(); }

  function persist(){
    if (!canStore) { return; }
    try { window.localStorage.setItem(KEY, JSON.stringify(store)); }
    catch (e) { canStore = false; noteStorage(); }
  }

  /* ---------- утилиты ---------- */

  function el(tag, cls, text){
    var n = document.createElement(tag);
    if (cls) { n.className = cls; }
    if (text !== undefined && text !== null) { n.textContent = text; }
    return n;
  }
  function pad2(v){ return v < 10 ? '0' + v : '' + v; }
  function todayISO(){
    var d = new Date();
    return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
  }
  function humanDate(iso){
    if (!iso) { return '—'; }
    var p = String(iso).split('-');
    if (p.length !== 3) { return iso; }
    return p[2] + '.' + p[1] + '.' + p[0].slice(2);
  }
  function num(v){
    if (v === undefined || v === null || v === '') { return 0; }
    var x = parseFloat(String(v).replace(',', '.'));
    return isNaN(x) ? 0 : x;
  }
  function itemsOf(day){
    var out = [];
    day.blocks.forEach(function(b){ b.items.forEach(function(i){ out.push(i); }); });
    return out;
  }
  function totalSets(day){
    var t = 0;
    itemsOf(day).forEach(function(i){ t += i.sets; });
    return t;
  }
  function session(dayId, date, create){
    if (!store[dayId]) {
      if (!create) { return null; }
      store[dayId] = {};
    }
    if (!store[dayId][date]) {
      if (!create) { return null; }
      store[dayId][date] = { v: {} };
    }
    if (!store[dayId][date].v) { store[dayId][date].v = {}; }
    return store[dayId][date];
  }
  function statsOf(dayId, date){
    var s = session(dayId, date, false), done = 0, ton = 0;
    if (s && s.v) {
      Object.keys(s.v).forEach(function(k){
        var r = s.v[k];
        if (!r) { return; }
        if (r.w || r.r) { done += 1; }
        ton += num(r.w) * num(r.r);
      });
    }
    return { done: done, ton: Math.round(ton) };
  }
  function hasData(dayId, date){
    var s = store[dayId] ? store[dayId][date] : null;
    if (!s) { return false; }
    if (statsOf(dayId, date).done > 0) { return true; }
    return !!(s.bw || s.cardio || s.bpm || s.steps || s.notes);
  }
  function prevEntry(dayId, date, item){
    var days = store[dayId];
    if (!days) { return null; }
    var dates = Object.keys(days).filter(function(d){ return d < date; }).sort();
    for (var i = dates.length - 1; i >= 0; i--) {
      var s = days[dates[i]];
      var parts = [];
      for (var k = 1; k <= item.sets; k++) {
        var r = (s && s.v) ? s.v[item.id + '|' + k] : null;
        if (r && (r.w || r.r)) {
          parts.push((r.w ? r.w + ' кг' : '—') + ' × ' + (r.r ? r.r : '—'));
        }
      }
      if (parts.length) { return { date: dates[i], text: parts.join(', ') }; }
    }
    return null;
  }

  function downloadAll(){
    var rows = [['день', 'дата', 'упражнение', 'подход', 'вес, кг', 'повторы']];
    PLAN.forEach(function(day){
      var days = store[day.id] || {};
      Object.keys(days).sort().forEach(function(d){
        var s = days[d];
        itemsOf(day).forEach(function(item){
          for (var i = 1; i <= item.sets; i++) {
            var r = s.v ? s.v[item.id + '|' + i] : null;
            if (r && (r.w || r.r)) {
              rows.push([day.tab, d, item.n, i, r.w || '', r.r || '']);
            }
          }
        });
        var extra = [];
        if (s.bw) { extra.push('вес тела ' + s.bw + ' кг'); }
        if (s.cardio) { extra.push('кардио ' + s.cardio + ' мин'); }
        if (s.bpm) { extra.push('пульс ' + s.bpm); }
        if (s.steps) { extra.push('шаги ' + s.steps); }
        if (s.notes) { extra.push('заметки: ' + s.notes); }
        if (extra.length) { rows.push([day.tab, d, extra.join(' · '), '', '', '']); }
      });
    });
    if (rows.length === 1) {
      window.alert('История пока пустая — заполни хотя бы одну тренировку.');
      return;
    }
    var csv = rows.map(function(r){
      return r.map(function(c){ return '"' + String(c).replace(/"/g, '""') + '"'; }).join(';');
    }).join('\\r\\n');
    var blob = new Blob(['\\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'nikita-dnevnik-trenirovok.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.setTimeout(function(){ URL.revokeObjectURL(url); }, 2000);
  }

  /* ---------- сборка дня ---------- */

  var refreshers = [];

  function buildDay(day, panel){
    var total = totalSets(day);
    var nodes = {};

    panel.appendChild(el('h2', null, day.title));
    panel.appendChild(el('p', 'meta', day.meta));

    var sess = el('div', 'sess');

    var fDate = el('label', 'field');
    fDate.appendChild(el('span', null, 'Дата'));
    var dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.value = todayISO();
    fDate.appendChild(dateInput);
    sess.appendChild(fDate);

    var fBw = el('label', 'field');
    fBw.appendChild(el('span', null, 'Вес тела, кг'));
    var bwInput = document.createElement('input');
    bwInput.type = 'text';
    bwInput.inputMode = 'decimal';
    bwInput.placeholder = '63,7';
    fBw.appendChild(bwInput);
    sess.appendChild(fBw);

    var stat = el('div', 'stat');
    var statBig = el('b', null, '0 / ' + total);
    var statSub = el('span', null, 'подходов · тоннаж 0 кг');
    stat.appendChild(statBig);
    stat.appendChild(statSub);
    sess.appendChild(stat);

    panel.appendChild(sess);
    panel.appendChild(el('p', 'hint', 'Вес подбирай так, чтобы последние 1–2 повтора были тяжёлыми, но техника не ломалась. Заполненные поля подсвечиваются зелёным.'));

    day.blocks.forEach(function(block){
      panel.appendChild(el('p', 'grp', block.label));
      block.items.forEach(function(item){
        var card = el('article', 'ex');

        var head = el('div', 'ex-head');
        var titleBox = el('div');
        titleBox.appendChild(el('h3', 'ex-name', item.n));
        titleBox.appendChild(el('p', 'ex-en', item.en));
        head.appendChild(titleBox);
        head.appendChild(el('span', 'ex-target', item.sets + ' × ' + item.reps + ' · отдых ' + item.rest));
        card.appendChild(head);

        var body = el('div', 'ex-body');
        var left = el('div');
        var pose = POSE[item.pose];
        var figs = el('div', 'figs');
        var ph1 = el('div', 'ph');
        ph1.innerHTML = figure(pose, 's');
        ph1.appendChild(el('em', null, 'старт'));
        var ph2 = el('div', 'ph');
        ph2.innerHTML = figure(pose, 'f');
        ph2.appendChild(el('em', null, 'финиш'));
        figs.appendChild(ph1);
        figs.appendChild(el('div', 'arw', '→'));
        figs.appendChild(ph2);
        left.appendChild(figs);

        var ol = el('ol', 'steps');
        item.steps.forEach(function(s){ ol.appendChild(el('li', null, s)); });
        left.appendChild(ol);

        var vid = el('a', 'vid', '▶ Видео техники');
        vid.href = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(item.vid);
        vid.target = '_blank';
        vid.rel = 'noopener noreferrer';
        left.appendChild(vid);
        body.appendChild(left);

        var right = el('div');
        var lastLine = el('p', 'last');
        lastLine.hidden = true;
        right.appendChild(lastLine);

        var sets = el('div', 'sets');
        var inputs = [];
        for (var i = 1; i <= item.sets; i++) {
          var row = el('div', 'set');
          row.appendChild(el('span', 'set-n', String(i)));

          var wBox = el('div', 'fld');
          var wIn = document.createElement('input');
          wIn.type = 'text';
          wIn.inputMode = 'decimal';
          wIn.placeholder = 'вес';
          wIn.setAttribute('data-key', item.id + '|' + i);
          wIn.setAttribute('data-f', 'w');
          wIn.setAttribute('aria-label', item.n + ', подход ' + i + ', вес в кг');
          wBox.appendChild(wIn);
          wBox.appendChild(el('u', null, 'кг'));

          var rBox = el('div', 'fld');
          var rIn = document.createElement('input');
          rIn.type = 'text';
          rIn.inputMode = 'numeric';
          rIn.placeholder = item.reps;
          rIn.setAttribute('data-key', item.id + '|' + i);
          rIn.setAttribute('data-f', 'r');
          rIn.setAttribute('aria-label', item.n + ', подход ' + i + ', повторы');
          rBox.appendChild(rIn);
          rBox.appendChild(el('u', null, 'повт'));

          row.appendChild(wBox);
          row.appendChild(rBox);
          sets.appendChild(row);
          inputs.push(wIn);
          inputs.push(rIn);
        }
        right.appendChild(sets);
        body.appendChild(right);
        card.appendChild(body);
        panel.appendChild(card);
        nodes[item.id] = { last: lastLine, inputs: inputs };
      });
    });

    var cardio = el('div', 'cardio');
    cardio.appendChild(el('h3', null, 'Кардио и заметки'));
    var cRow = el('div', 'row');
    var cFields = {};
    [['cardio', 'Кардио, мин', '15'], ['bpm', 'Пульс, BPM', '120'], ['steps', 'Шаги за день', '8000']].forEach(function(f){
      var lab = el('label', 'field');
      lab.appendChild(el('span', null, f[1]));
      var inp = document.createElement('input');
      inp.type = 'text';
      inp.inputMode = 'numeric';
      inp.placeholder = f[2];
      lab.appendChild(inp);
      cRow.appendChild(lab);
      cFields[f[0]] = inp;
    });
    cardio.appendChild(cRow);

    var notesBox = el('label', 'notes');
    notesBox.appendChild(el('span', null, 'Как прошло: самочувствие, что было тяжело'));
    var notes = document.createElement('textarea');
    notes.placeholder = 'Например: жим шёл легко, в следующий раз +2,5 кг. Спал 8 часов.';
    notesBox.appendChild(notes);
    cardio.appendChild(notesBox);
    panel.appendChild(cardio);

    var acts = el('div', 'acts');
    var bCopy = el('button', 'btn pr', 'Скопировать отчёт');
    var bDown = el('button', 'btn', 'Скачать всю историю');
    var bPrint = el('button', 'btn', 'Распечатать бланк');
    var bClear = el('button', 'btn dg', 'Очистить эту дату');
    [bCopy, bDown, bPrint, bClear].forEach(function(b){ b.type = 'button'; acts.appendChild(b); });
    panel.appendChild(acts);

    var out = el('div', 'out');
    out.hidden = true;
    var outArea = document.createElement('textarea');
    outArea.readOnly = true;
    outArea.setAttribute('aria-label', 'Отчёт о тренировке');
    out.appendChild(outArea);
    out.appendChild(el('p', null, 'Отчёт скопирован в буфер. Если не вставился — выдели текст и скопируй вручную.'));
    panel.appendChild(out);

    var hist = el('details', 'hist');
    var histSum = el('summary', null, 'История тренировок (0)');
    hist.appendChild(histSum);
    var histBody = el('div');
    hist.appendChild(histBody);
    var histActs = el('div', 'acts');
    var bWipe = el('button', 'btn dg', 'Очистить всю историю');
    bWipe.type = 'button';
    histActs.appendChild(bWipe);
    hist.appendChild(histActs);
    panel.appendChild(hist);

    function refreshStats(){
      var st = statsOf(day.id, dateInput.value);
      statBig.textContent = st.done + ' / ' + total;
      statSub.textContent = 'подходов · тоннаж ' + st.ton + ' кг';
    }

    function refreshHints(){
      itemsOf(day).forEach(function(item){
        var box = nodes[item.id].last;
        var prev = prevEntry(day.id, dateInput.value, item);
        if (!prev) {
          box.hidden = true;
          box.textContent = '';
          return;
        }
        box.hidden = false;
        box.textContent = '';
        box.appendChild(document.createTextNode('Прошлый раз ' + humanDate(prev.date) + ': '));
        box.appendChild(el('b', null, prev.text));
      });
    }

    function refreshHistory(){
      var days = store[day.id] || {};
      var dates = Object.keys(days).filter(function(d){ return hasData(day.id, d); }).sort().reverse();
      histSum.textContent = 'История тренировок (' + dates.length + ')';
      histBody.textContent = '';
      if (!dates.length) {
        histBody.appendChild(el('p', 'empty', 'Пока пусто. Заполни первую тренировку — она появится здесь.'));
        return;
      }
      dates.forEach(function(d){
        var st = statsOf(day.id, d);
        var rec = days[d];
        var line = el('div', 'hrow');
        line.appendChild(el('b', null, humanDate(d)));
        var info = st.done + ' подходов · тоннаж ' + st.ton + ' кг';
        if (rec.bw) { info += ' · вес ' + rec.bw + ' кг'; }
        if (rec.cardio) { info += ' · кардио ' + rec.cardio + ' мин'; }
        line.appendChild(el('span', null, info));
        var sp = el('div', 'sp');
        var bOpen = el('button', 'btn', 'Открыть');
        bOpen.type = 'button';
        bOpen.addEventListener('click', function(){
          dateInput.value = d;
          loadSession();
        });
        var bDel = el('button', 'btn dg', 'Удалить');
        bDel.type = 'button';
        bDel.addEventListener('click', function(){
          if (!window.confirm('Удалить запись за ' + humanDate(d) + '?')) { return; }
          if (store[day.id]) { delete store[day.id][d]; }
          persist();
          loadSession();
        });
        sp.appendChild(bOpen);
        sp.appendChild(bDel);
        line.appendChild(sp);
        histBody.appendChild(line);
      });
    }

    function loadSession(){
      var s = session(day.id, dateInput.value, false);
      bwInput.value = (s && s.bw) ? s.bw : '';
      cFields.cardio.value = (s && s.cardio) ? s.cardio : '';
      cFields.bpm.value = (s && s.bpm) ? s.bpm : '';
      cFields.steps.value = (s && s.steps) ? s.steps : '';
      notes.value = (s && s.notes) ? s.notes : '';
      itemsOf(day).forEach(function(item){
        nodes[item.id].inputs.forEach(function(inp){
          var rec = (s && s.v) ? s.v[inp.getAttribute('data-key')] : null;
          inp.value = rec ? (rec[inp.getAttribute('data-f')] || '') : '';
          if (inp.value) { inp.classList.add('done'); } else { inp.classList.remove('done'); }
        });
      });
      refreshStats();
      refreshHints();
      refreshHistory();
    }

    function report(){
      var st = statsOf(day.id, dateInput.value);
      var s = session(day.id, dateInput.value, false);
      var lines = [];
      lines.push(day.tab + ' — ' + humanDate(dateInput.value));
      lines.push('Подходов: ' + st.done + ' из ' + total + ' · тоннаж: ' + st.ton + ' кг');
      if (s && s.bw) { lines.push('Собственный вес: ' + s.bw + ' кг'); }
      lines.push('');
      itemsOf(day).forEach(function(item){
        var parts = [];
        for (var i = 1; i <= item.sets; i++) {
          var r = (s && s.v) ? s.v[item.id + '|' + i] : null;
          if (r && (r.w || r.r)) { parts.push((r.w || '—') + ' кг × ' + (r.r || '—')); }
        }
        lines.push(item.n + ': ' + (parts.length ? parts.join(', ') : '—'));
      });
      if (s && (s.cardio || s.bpm || s.steps)) {
        var c = [];
        if (s.cardio) { c.push('кардио ' + s.cardio + ' мин'); }
        if (s.bpm) { c.push('пульс ' + s.bpm + ' BPM'); }
        if (s.steps) { c.push('шаги ' + s.steps); }
        lines.push('');
        lines.push('Кардио: ' + c.join(' · '));
      }
      if (s && s.notes) { lines.push('Заметки: ' + s.notes); }
      return lines.join('\\n');
    }

    panel.addEventListener('input', function(ev){
      var t = ev.target;
      var key = t.getAttribute ? t.getAttribute('data-key') : null;
      if (t !== bwInput && t !== notes && t !== cFields.cardio && t !== cFields.bpm && t !== cFields.steps && !key) { return; }
      var s = session(day.id, dateInput.value, true);
      if (t === bwInput) { s.bw = t.value; }
      else if (t === notes) { s.notes = t.value; }
      else if (t === cFields.cardio) { s.cardio = t.value; }
      else if (t === cFields.bpm) { s.bpm = t.value; }
      else if (t === cFields.steps) { s.steps = t.value; }
      else {
        if (!s.v[key]) { s.v[key] = { w: '', r: '' }; }
        s.v[key][t.getAttribute('data-f')] = t.value;
        if (t.value) { t.classList.add('done'); } else { t.classList.remove('done'); }
      }
      persist();
      refreshStats();
      refreshHistory();
    });

    dateInput.addEventListener('change', loadSession);

    bCopy.addEventListener('click', function(){
      var text = report();
      outArea.value = text;
      out.hidden = false;
      outArea.focus();
      outArea.select();
      outArea.scrollTop = 0;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).catch(function(){});
      }
    });

    bDown.addEventListener('click', downloadAll);
    bPrint.addEventListener('click', function(){ window.print(); });

    bClear.addEventListener('click', function(){
      if (!window.confirm('Очистить все записи за ' + humanDate(dateInput.value) + '?')) { return; }
      if (store[day.id]) { delete store[day.id][dateInput.value]; }
      persist();
      out.hidden = true;
      loadSession();
    });

    bWipe.addEventListener('click', function(){
      if (!window.confirm('Удалить всю историю по всем дням? Отменить будет нельзя.')) { return; }
      store = {};
      persist();
      refreshers.forEach(function(fn){ fn(); });
    });

    refreshers.push(loadSession);
    loadSession();
  }

  /* ---------- вкладки ---------- */

  var tabsBox = document.getElementById('tabs');
  var panelsBox = document.getElementById('panels');
  var tabNodes = [];
  var panelNodes = [];

  function selectTab(idx){
    for (var i = 0; i < tabNodes.length; i++) {
      tabNodes[i].setAttribute('aria-selected', i === idx ? 'true' : 'false');
      panelNodes[i].hidden = (i !== idx);
    }
  }

  PLAN.forEach(function(day, idx){
    var tab = el('button', 'tab', day.tab);
    tab.type = 'button';
    tab.id = 'tab-' + day.id;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', 'panel-' + day.id);
    tab.setAttribute('aria-selected', idx === 0 ? 'true' : 'false');
    tabsBox.appendChild(tab);
    tabNodes.push(tab);

    var panel = el('section', 'panel');
    panel.id = 'panel-' + day.id;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', 'tab-' + day.id);
    if (idx !== 0) { panel.hidden = true; }
    panelsBox.appendChild(panel);
    panelNodes.push(panel);

    buildDay(day, panel);
  });

  tabNodes.forEach(function(tab, idx){
    tab.addEventListener('click', function(){ selectTab(idx); });
    tab.addEventListener('keydown', function(ev){
      var step = (ev.key === 'ArrowRight') ? 1 : ((ev.key === 'ArrowLeft') ? -1 : 0);
      if (!step) { return; }
      ev.preventDefault();
      var next = (idx + step + tabNodes.length) % tabNodes.length;
      selectTab(next);
      tabNodes[next].focus();
    });
  });
})();
