(function(){
  var PHONE = document.body.getAttribute('data-phone') || '';
  var TEL = PHONE.replace(/-/g,'');
  function $(s,r){return (r||document).querySelector(s)}
  function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))}

  // 스크롤에 맞춰 나타나기
  var mo = window.matchMedia('(prefers-reduced-motion: reduce)');
  if ('IntersectionObserver' in window && !mo.matches){
    document.body.classList.add('anim');
    var targets = [];
    $$('.shead, .flow > li, .gal figure, .area, .cost li, .ck__col, .memo > *, .guideline, .faq details, .vows li, .dong, .local > div, .others').forEach(function(el){
      el.classList.add('rv'); targets.push(el);
    });
    $$('.flow').forEach(function(el){ targets.push(el); });
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){
        if (!e.isIntersecting) return;
        var el = e.target;
        var sibs = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
        el.style.transitionDelay = Math.min(sibs, 5) * 70 + 'ms';
        el.classList.add('is-in');
        io.unobserve(el);
      });
    }, {rootMargin: '0px 0px -8% 0px', threshold: 0.08});
    targets.forEach(function(el){ io.observe(el); });
    // 안전장치: 1.2초 안에 나타나지 않은 요소는 무조건 보이게
    setTimeout(function(){
      targets.forEach(function(el){ el.classList.add('in'); });
    }, 1200);
  }

  // 모바일 메뉴
  var burger = $('.burger'), nav = $('.nav');
  if (burger && nav) burger.addEventListener('click', function(){
    var open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  $$('.nav a').forEach(function(a){ a.addEventListener('click', function(){ nav && nav.classList.remove('is-open'); }); });

  // 스크롤 등장 · 헤더 축소 · 트럭 · 히어로 미세 이동
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce && 'IntersectionObserver' in window){
    document.body.classList.add('anim');
    var targets = [];
    $$('.sec .shead, .flow > li, .gal figure, .area, .vows li, .cost li, .cmp, .form, .label, .faq details, .guideline, .end .wrap > *, .dong, .local > div, .mini li')
      .forEach(function(el){ targets.push(el); });
    targets.forEach(function(el, i){
      el.classList.add('rv');
      var k = i % 4; if (k) el.classList.add('rv-d' + k);
    });
    var io = new IntersectionObserver(function(es){
      es.forEach(function(en){ if (en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } });
    }, {rootMargin: '0px 0px -8% 0px', threshold: 0.08});
    targets.forEach(function(el){ io.observe(el); });
    // 안전장치: 1.2초 안에 나타나지 않은 요소는 무조건 보이게
    setTimeout(function(){
      targets.forEach(function(el){ el.classList.add('in'); });
    }, 1200);
  }

  var road = $('.road'), truck = $('.road__truck'), arch = $('.visual .arch'), ticking = false;
  function onScroll(){
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function(){
      var y = window.pageYOffset || document.documentElement.scrollTop;
      document.body.classList.toggle('scrolled', y > 120);
      if (!reduce && road && truck){
        var r = road.getBoundingClientRect();
        var p = Math.min(1, Math.max(0, (window.innerHeight - r.top) / (window.innerHeight + r.height)));
        var w = road.querySelector('.road__in').offsetWidth - truck.getBoundingClientRect().width;
        truck.style.setProperty('--drive', (p * w).toFixed(1) + 'px');
      }
      if (!reduce && arch && window.innerWidth > 1000){
        arch.style.setProperty('--par', Math.max(-40, -y * 0.05).toFixed(1) + 'px');
      }
      ticking = false;
    });
  }
  window.addEventListener('scroll', function(){ document.body.classList.add('js-scroll'); onScroll(); }, {passive:true});
  window.addEventListener('resize', onScroll, {passive:true});
  onScroll();

  // 지역 드롭다운
  var drop = $('.drop'), dbtn = $('.drop__btn');
  if (drop && dbtn){
    dbtn.addEventListener('click', function(ev){
      ev.stopPropagation();
      var open = drop.classList.toggle('is-open');
      dbtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', function(ev){
      if (!drop.contains(ev.target)){ drop.classList.remove('is-open'); dbtn.setAttribute('aria-expanded','false'); }
    });
    document.addEventListener('keydown', function(ev){
      if (ev.key === 'Escape' && drop.classList.contains('is-open')){ drop.classList.remove('is-open'); dbtn.setAttribute('aria-expanded','false'); dbtn.focus(); }
    });
  }

  // 진행 단계 탭
  var tabs = $$('.steps__tab');
  tabs.forEach(function(t, i){
    t.addEventListener('click', function(){ select(i); });
    t.addEventListener('keydown', function(ev){
      var k = ev.key, n = null;
      if (k === 'ArrowDown' || k === 'ArrowRight') n = (i + 1) % tabs.length;
      if (k === 'ArrowUp' || k === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
      if (n !== null){ ev.preventDefault(); select(n); tabs[n].focus(); }
    });
  });
  function select(i){
    tabs.forEach(function(t, j){
      var on = i === j;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      var p = document.getElementById(t.getAttribute('aria-controls'));
      if (p) p.hidden = !on;
    });
  }

  // 사진 필터
  var figs = $$('.gal figure');
  $$('.filter button').forEach(function(b){
    b.addEventListener('click', function(){
      var c = b.getAttribute('data-cat');
      $$('.filter button').forEach(function(x){ x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      figs.forEach(function(f){ f.hidden = !(c === 'all' || f.getAttribute('data-cat') === c); });
    });
  });

  // 사진 크게 보기
  var lb = $('.lb'), idx = 0;
  function visible(){ return figs.filter(function(f){ return !f.hidden; }); }
  function show(i){
    var v = visible(); if (!v.length) return;
    idx = (i + v.length) % v.length;
    var f = v[idx];
    $('img', lb).src = f.getAttribute('data-full');
    $('img', lb).alt = $('img', f).alt;
    $('p', lb).textContent = f.getAttribute('data-cap');
  }
  if (lb){
    var lastFocus = null;
    figs.forEach(function(f){
      f.tabIndex = 0;
      function open(){
        lastFocus = f;
        show(visible().indexOf(f));
        lb.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        $('.x', lb).focus();
      }
      f.addEventListener('click', open);
      f.addEventListener('keydown', function(e){ if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); open(); } });
    });
    function close(){
      lb.classList.remove('is-open');
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    }
    $('.x', lb).addEventListener('click', close);
    // 모바일 좌우 스와이프
    var sx = 0, sy = 0;
    lb.addEventListener('touchstart', function(e){ sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, {passive:true});
    lb.addEventListener('touchend', function(e){
      var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) show(idx + (dx < 0 ? 1 : -1));
    }, {passive:true});
    $('.pv', lb).addEventListener('click', function(){ show(idx - 1); });
    $('.nx', lb).addEventListener('click', function(){ show(idx + 1); });
    lb.addEventListener('click', function(e){ if (e.target === lb) close(); });
    document.addEventListener('keydown', function(e){
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'Tab'){ e.preventDefault(); $('.x', lb).focus(); }
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
  }

  // 견적 메모
  var form = $('#memoForm');
  if (form){
    var out = {};
    $$('[data-out]').forEach(function(d){ out[d.getAttribute('data-out')] = d; });
    function val(n){ var el = form.elements[n]; return el ? (el.value || '').trim() : ''; }
    function checked(n){ return $$('input[name="' + n + '"]:checked', form).map(function(x){ return x.value; }); }
    function gather(){
      var from = [val('from_gu'), val('from_dong')].filter(Boolean).join(' ');
      var to = val('to');
      var fl1 = [val('from_floor') && val('from_floor') + '층', val('from_ev')].filter(Boolean).join(', ');
      var fl2 = [val('to_floor') && val('to_floor') + '층', val('to_ev')].filter(Boolean).join(', ');
      return {
        date: val('date'),
        home: [checked('home').join(''), val('size')].filter(Boolean).join(' / '),
        from: [from, fl1].filter(Boolean).join(' · '),
        to: [to, fl2].filter(Boolean).join(' · '),
        items: checked('items').join(', '),
        note: val('note'),
        name: val('name'),
        phone: val('phone')
      };
    }
    function render(){
      var g = gather();
      Object.keys(out).forEach(function(k){
        var v = g[k];
        out[k].textContent = v || '입력 전';
        out[k].classList.toggle('empty', !v);
      });
    }
    function message(){
      var g = gather();
      var L = ['[로얄익스프레스 포장이사 견적 문의]'];
      if (g.name) L.push('이름: ' + g.name);
      if (g.phone) L.push('연락처: ' + g.phone);
      L.push('이사 날짜: ' + (g.date || '미정'));
      L.push('집 형태: ' + (g.home || '-'));
      L.push('출발지: ' + (g.from || '-'));
      L.push('도착지: ' + (g.to || '-'));
      if (g.items) L.push('따로 알려드릴 짐: ' + g.items);
      if (g.note) L.push('요청사항: ' + g.note);
      return L.join('\n');
    }
    form.addEventListener('input', render);
    form.addEventListener('change', render);
    render();
    var msg = $('.label__msg');
    function ready(){
      var g = gather();
      if (!g.from){ msg.textContent = '출발지 구·군을 선택해 주세요.'; form.elements['from_gu'].focus(); return false; }
      return true;
    }
    var sms = $('#memoSms');
    sms.addEventListener('click', function(e){
      e.preventDefault();
      if (!ready()) return;
      var sep = /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent) ? '&' : '?';
      window.location.href = 'sms:' + TEL + sep + 'body=' + encodeURIComponent(message());
      msg.textContent = '문자 앱이 열리지 않으면 내용 복사를 눌러 ' + PHONE + '로 보내 주세요.';
    });
    $('#memoCopy').addEventListener('click', function(){
      if (!ready()) return;
      var t = message();
      function fallback(){
        var ta = document.createElement('textarea'); ta.value = t; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); msg.textContent = '복사했습니다. 문자나 카톡에 붙여넣어 보내 주세요.'; }
        catch(err){ msg.textContent = '복사하지 못했습니다. 길게 눌러 직접 복사해 주세요.'; }
        document.body.removeChild(ta);
      }
      if (navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(t).then(function(){ msg.textContent = '복사했습니다. 문자나 카톡에 붙여넣어 보내 주세요.'; }, fallback);
      } else fallback();
    });
  }

  // 이사 체크리스트 (이 기기에만 저장)
  var boxes = $$('.ck input[type=checkbox]');
  if (boxes.length){
    var KEY = 'royal-checklist-v1', saved = {};
    try { saved = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch(e){ saved = {}; }
    function meter(){
      var n = boxes.filter(function(b){ return b.checked; }).length;
      $('.ck__meter i').style.width = Math.round(n / boxes.length * 100) + '%';
      $('.ck__count').textContent = n + ' / ' + boxes.length + ' 완료';
    }
    boxes.forEach(function(b){
      if (saved[b.id]) b.checked = true;
      b.addEventListener('change', function(){
        saved[b.id] = b.checked;
        try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch(e){}
        meter();
      });
    });
    $('.ck__reset').addEventListener('click', function(){
      boxes.forEach(function(b){ b.checked = false; }); saved = {};
      try { localStorage.removeItem(KEY); } catch(e){}
      meter();
    });
    meter();
  }
})();
