const $tabs=document.querySelector('#idea-tabs'), $detail=document.querySelector('#idea-detail');
const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const selected={};
const compact=window.matchMedia('(max-width: 720px)');
const back=document.querySelector('#idea-back');
const heading=document.querySelector('#idea-list-heading');
function setCompactDetail(on){
  document.body.classList.toggle('idea-focused',on);
  if(back)back.hidden=!on;
  if(heading)heading.hidden=on;
  if(back)back.onclick=()=>{setCompactDetail(false);history.replaceState(null,'',location.pathname+'#ideas');document.querySelector('#ideas').scrollIntoView({behavior:'smooth'});};
}

const visual=(type)=>{
 if(['darkpins','hex','darkdots','colorskind','colorstime','colorsscale'].includes(type)){
  const kinds=['colorskind','colorstime','colorsscale'].includes(type);
  return `<div class="concept-map darkmock ${type}" aria-label="ダークMAPの未実装構想イメージ"><span class="street s1"></span><span class="street s2"></span><span class="street s3"></span><i class="map-pin pin1"></i><i class="map-pin pin2"></i><i class="map-pin pin3"></i><span class="map-dot">${kinds?'色分けの意味を比較':'アイコン形状を比較'} / 模式図</span></div>`;
 }
 if(['noshare','shareone','sharemulti'].includes(type))return `<div class="concept-area ${type}"><div class="area-row">地点メモ 01 <span>任意</span></div><div class="area-row">地点メモ 02 <span>任意</span></div><div class="area-row">地点メモ 03 <span>任意</span></div><div class="area-foot">${type==='noshare'?'自分だけで使う':type==='shareone'?'1件を選んで共有 →':'選んだ地点を共有 →'}</div></div>`;
 if(['venues','morevenues','sites','area','hypothesis'].includes(type))return `<div class="concept-area info-concept ${type}"><div class="area-row">${type==='sites'?'便利な情報源':'気になる情報'} <span>↗</span></div><div class="area-row">${type==='area'?'エリアの傾向':type==='hypothesis'?'もしこうなら…':'会場・公開サイト'} <span>↗</span></div><div class="area-row">話題を追加 <span>＋</span></div><div class="area-foot">交流のイメージ / 仮案</div></div>`;
 if(type==='bars')return `<div class="concept-graph bars"><div style="height:35%"></div><div style="height:67%"></div><div style="height:53%"></div><div style="height:87%"></div><div style="height:71%"></div><div style="height:95%"></div></div>`;
 if(type==='line')return `<div class="concept-graph line"><svg viewBox="0 0 240 104" aria-label="推移グラフ構想図"><polyline points="6,80 48,58 90,69 132,27 174,42 228,12" fill="none" stroke="#3f9169" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg></div>`;
 return `<div class="concept-stats"><div><small>時間あたり（例）</small><b>¥ 4,100</b></div><div><small>平均営収（例）</small><b>¥ 62,000</b></div></div>`;
};
const render=(ideas,i)=>{const a=ideas[i];$tabs.innerHTML=ideas.map((v,n)=>`<button type="button" role="tab" aria-selected="${n===i}" class="idea-tab ${n===i?'active':''}" data-i="${n}"><span class="idea-index">${safe(v.id.replace('IDEA-',''))}</span><span class="idea-tab-text">${safe(v.title)}<small>${safe(v.status)}</small></span><span class="idea-chevron" aria-hidden="true">›</span></button>`).join('');$tabs.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{const idx=Number(b.dataset.i);render(ideas,idx);history.replaceState(null,'',location.pathname+'?idea='+encodeURIComponent(ideas[idx].id)+'#ideas');if(compact.matches){setCompactDetail(true);document.querySelector('#ideas').scrollIntoView({behavior:'smooth'});}}));
$detail.innerHTML=`<div class="idea-title"><div><span class="kicker">${safe(a.id)} / OPEN QUESTION</span><h3>${safe(a.title)}</h3><p>${safe(a.lead)}</p></div><span class="pill">${safe(a.status)}</span></div><div class="idea-context"><strong>今はここまで</strong><p>${safe(a.current)}</p><strong>聞いてみたいこと</strong><p>${safe(a.question)}</p></div><div class="concept-head"><strong>A・B・Cのたたき台</strong><span>すべて構想イメージ・未実装</span></div><div class="concept-grid">${a.options.map(o=>`<button type="button" class="concept-option ${selected[a.id]===o.key?'chosen':''}" data-choice="${o.key}"><div class="concept-top"><span class="letter">${o.key}</span><strong>${safe(o.name)}</strong></div>${visual(o.type)}<div class="concept-caption"><b>${safe(o.short)}</b><p>${safe(o.desc)}</p></div></button>`).join('')}</div><div class="idea-bottom"><div><strong>「それ以外」も歓迎</strong><p>${a.ask.map(safe).join(' ／ ')}</p><p class="muted small">ここでは投票を集計していません。気になる案を選んでコピーし、LINEで自由に話してください。</p></div><button type="button" class="btn primary" id="copy-opinion">${selected[a.id]?'選んだ案をコピー':'この話題をコピー'} ↗</button></div><div class="copy-state" id="copy-state" role="status"></div>`;
$detail.querySelectorAll('.concept-option').forEach(b=>b.addEventListener('click',()=>{selected[a.id]=b.dataset.choice;render(ideas,i)}));
$detail.querySelector('#copy-opinion').addEventListener('click',async()=>{const o=a.options.find(x=>x.key===selected[a.id]);const value=`【NextGuess アイデア】${a.title}\n${o?`${o.key}案：${o.name}\n`:''}意見：`;try{await navigator.clipboard.writeText(value);$detail.querySelector('#copy-state').textContent='コピーしました。LINEなどに貼り付けて意見を書けます。'}catch{$detail.querySelector('#copy-state').textContent=value}});
};
fetch('data/ideas.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error();return r.json()}).then(d=>{const id=new URLSearchParams(location.search).get('idea');const i=Math.max(0,d.findIndex(x=>x.id===id));render(d,i);if(id&&compact.matches)setCompactDetail(true);}).catch(()=>{$detail.textContent='議題の読み込みに失敗しました。ローカルサーバーから表示してください。'});
