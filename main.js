/* ========= Helpers ========= */
const $ = (q)=>document.querySelector(q);
const $$ = (q)=>Array.from(document.querySelectorAll(q));
const nowISO = ()=>new Date().toISOString();
const toYMD = (d)=>[d.getFullYear(), String(d.getMonth()+1).padStart(2,'0'), String(d.getDate()).padStart(2,'0')].join('-');
const thisMonday = ()=>{ const d=new Date(); const day=(d.getDay()+6)%7; d.setDate(d.getDate()-day); d.setHours(0,0,0,0); return d; };
const esc = (s)=>String(s||'').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

/* ========= IndexedDB ========= */
const DB_NAME='todo-fp-stuck-other'; const DB_VER=1; let db;
function openDB(){ return new Promise((res,rej)=>{ const r=indexedDB.open(DB_NAME,DB_VER);
  r.onupgradeneeded=e=>{ const d=e.target.result; const st=d.createObjectStore('todos',{keyPath:'id'});
    st.createIndex('status','status'); st.createIndex('bucket','bucket'); st.createIndex('is_fp','is_fp');
  }; r.onsuccess=()=>{db=r.result;res()}; r.onerror=()=>rej(r.error); });}
const putTodo=(t)=>new Promise((res,rej)=>{ const tx=db.transaction('todos','readwrite'); tx.objectStore('todos').put(t); tx.oncomplete=res; tx.onerror=()=>rej(tx.error); });
const delTodo=(id)=>new Promise((res,rej)=>{ const tx=db.transaction('todos','readwrite'); tx.objectStore('todos').delete(id); tx.oncomplete=res; tx.onerror=()=>rej(tx.error); });
const getAll=()=>new Promise((res,rej)=>{ const tx=db.transaction('todos','readonly'); const req=tx.objectStore('todos').getAll(); req.onsuccess=()=>res(req.result||[]); req.onerror=()=>rej(req.error); });

// 格納用配列をあらかじめ宣言
let flavorTexts = []; 

// ====== フレーバーテキスト（ナポレオン名言リスト） ======
const defaultFlavorTexts = [
  { author: "ナポレオン・ボナパルト", quote: "お前がいつの日か出会う禍は、お前がおろそかにしたある時間の報いだ。" },
  { author: "ナポレオン・ボナパルト", quote: "じっくり考えろ。しかし、行動する時が来たなら、考えるのをやめて、進め。" },
  { author: "ナポレオン・ボナパルト", quote: "人生という試合で最も重要なのは、休憩時間の得点である。" },
  { author: "ナポレオン・ボナパルト", quote: "戦術とは、一点に全ての力をふるうことである。" },
  { author: "ナポレオン・ボナパルト", quote: "リーダーとは「希望を配る人」のことだ。" },
  { author: "ナポレオン・ボナパルト", quote: "一頭の狼に率いられた百頭の羊の群れは、一頭の羊に率いられた百頭の狼の群れにまさる。" },
  { author: "ナポレオン・ボナパルト", quote: "会議を重ねすぎると、いつの時代にも起こったことが起こる。すなわち、ついには最悪の策が採られるということである。" },
  { author: "ナポレオン・ボナパルト", quote: "最悪の策とは、ほとんど常に、もっとも臆病な策である。" },
  { author: "ナポレオン・ボナパルト", quote: "勝利は、わが迅速果敢な行動にあり。" },
  { author: "ナポレオン・ボナパルト", quote: "勝利は、もっとも忍耐強い人にもたらされる。" },
  { author: "ナポレオン・ボナパルト", quote: "不可能は、小心者の幻影であり、権力者の無能の証であり、卑怯者の避難所である。" },
  { author: "ナポレオン・ボナパルト", quote: "有能の士は、どんな足枷をはめられていようとも飛躍する。" },
  { author: "ナポレオン・ボナパルト", quote: "重大な状況において、ほんのちょっとしたことが、最も大きな出来事をつねに決定する。" },
  { author: "ナポレオン・ボナパルト", quote: "状況？何が状況だ。俺が状況を作るのだ。" },
  { author: "ナポレオン・ボナパルト", quote: "戦闘の翌日に備えて新鮮な部隊を取っておく将軍はほとんど常に敗れる。" },
  { author: "ナポレオン・ボナパルト", quote: "戦争においては、一つの大きな失敗があると、常に誰かが大きな罪ありとされる。" },
  { author: "ナポレオン・ボナパルト", quote: "指揮の統一は戦争において最も重要なものである。二つの軍隊は決して同じ舞台の上におかれてはならない。" },
  { author: "ナポレオン・ボナパルト", quote: "兵法に複雑な策略などはいらない。最も単純なものが最良なのだ。偉大な将軍達が間違いを犯してしまうのは、難しい戦略を立て、賢く振る舞おうとするからだ。" },
  { author: "ナポレオン・ボナパルト", quote: "決して落胆しないこと。それが将軍としての第一の素質である。" },
  { author: "ナポレオン・ボナパルト", quote: "最も大きな危険は、勝利の瞬間にある。" },
  { author: "ナポレオン・ボナパルト", quote: "私は何事も最悪の事態を想定することから始める。" },
  { author: "ナポレオン・ボナパルト", quote: "我輩の辞書に不可能という文字はない。" },
  { author: "ナポレオン・ボナパルト", quote: "私はつねに、ニ年先のことを考えて生きている。" },
  { author: "ナポレオン・ボナパルト", quote: "欲しいものは何でも私に言うがいい。ただし時間以外だ。" },
  { author: "ナポレオン・ボナパルト", quote: "過ぎたことで心を煩わせるな。" },
  { author: "ナポレオン・ボナパルト", quote: "私は何か問題を考えたい時、心の引き出しを一つ開ける。問題が解決するとその引き出しを閉め、また次には別のを開ける。眠りたい時には全部の引き出しを閉める。" },
  { author: "ナポレオン・ボナパルト", quote: "生きたいと思わねばならない。そして、死ぬことを知らねばならない。" },
  { author: "ナポレオン・ボナパルト", quote: "死ぬよりも苦しむほうが勇気を必要とする。" },
  { author: "ナポレオン・ボナパルト", quote: "勇気は愛のようなものである。育てるには、希望が必要だ。" },
  { author: "ナポレオン・ボナパルト", quote: "真の英雄とは、人生の不幸を乗り越えていく者のことである。" },
  { author: "ナポレオン・ボナパルト", quote: "幸福とは、その人間の希望と才能にかなった仕事のある状態をさす。不幸とは、働くエネルギーがありながら、無為な状態にあることをさす。" },
  { author: "ナポレオン・ボナパルト", quote: "人は彼の妻、彼の家族、それに彼の部下に対する行為で判断される。" },
  { author: "ナポレオン・ボナパルト", quote: "敵が間違いを犯している時は、邪魔するな。" },
  { author: "ナポレオン・ボナパルト", quote: "結婚して幸福になるには、汗の苦労を絶えず分かち合わねばならない。" },
  { author: "ナポレオン・ボナパルト", quote: "女とパリは留守にしてはだめだ。" },
  { author: "ナポレオン・ボナパルト", quote: "世界には二つの力しかない。剣と精神の力である。そして最後は、精神が必ず剣に打ち勝つ。" },
  { author: "ナポレオン・ボナパルト", quote: "人間を動かす二つのてこは、恐怖と利益である。" },
  { author: "ナポレオン・ボナパルト", quote: "人間は、その想像力によって支配される。" },
  { author: "ナポレオン・ボナパルト", quote: "死ぬことは何でもない。しかし征服されて、名誉を失ったまま生き長らえるのは、毎日死ぬようなものだ。" }
];

// flavors.json があれば読み込む（ {author, quote}[] を想定／なければフォールバックへ）
// ==== Flavor (quotes) ====
// 先頭にある loadFlavorTexts をこれに差し替え
async function loadFlavorTexts(){
  // file:// のときは fetch をしないで即フォールバック
  if (!/^https?:$/.test(location.protocol)) {
    flavorTexts = [...defaultFlavorTexts];
    return;
  }
  try{
    const resp = await fetch('./flavors.json', { cache: 'no-store' });
    if(resp.ok){
      const raw = await resp.json();
      if(Array.isArray(raw)){
        flavorTexts = raw
          .filter(x => x && typeof x.quote === 'string' && x.quote.trim())
          .map(x => ({ author: (x.author||'').trim(), quote: x.quote.trim() }));
      }
    }
  }catch(_){}
  if(!flavorTexts.length) flavorTexts = [...defaultFlavorTexts];
}


// ランダムに1件表示（作者があれば "名言 — 作者" で表示）
function setRandomFlavor(){
  if(!flavorTexts.length) flavorTexts = [...defaultFlavorTexts];
  const t = flavorTexts[Math.floor(Math.random()*flavorTexts.length)];
  const el = document.getElementById('flavorText');
  if(el && t) el.textContent = t.author ? `"${t.quote}" — ${t.author}` : t.quote;
}

/* ========= State ========= */
const state = { items:[], fp:null, stuck:[], other:[], done:[] };
function uid(){ return 't_'+Math.random().toString(36).slice(2,10); }
function normalize(t){
  const tags = Array.isArray(t.tags)?t.tags:String(t.tags||'').split(',').map(s=>s.trim()).filter(Boolean);
  return { id:t.id||uid(), title:t.title?.trim()||'', notes:t.notes||'', project:t.project||'', tags,
    due:t.due||'', priority:String(t.priority||'2'), bucket:(t.bucket==='stuck'||t.bucket==='other')?t.bucket:'other',
    is_fp:!!t.is_fp, status:t.status||'open', created_at:t.created_at||nowISO(), updated_at:t.updated_at||nowISO(), done_at:t.done_at||null };
}

/* ========= Render ========= */
const badgePriority=(p)=> p==='1' ? '<span class="pill" style="background:#fee2e2;color:#991b1b;border-color:#fecaca">高</span>'
                     : p==='3' ? '<span class="pill gray">低</span>' : '<span class="pill">中</span>';

function rowDetails(t){
  const tg = t.tags.map(x=>`<span class="tag">#${esc(x)}</span>`).join(' ');
  const kvs = `<div class="kvs">
      <div class="kv">作成: ${esc(t.created_at?.replace('T',' ').slice(0,16) || '')}</div>
      <div class="kv">更新: ${esc(t.updated_at?.replace('T',' ').slice(0,16) || '')}</div>
      <div class="kv">期日: ${esc(t.due||'—')}</div>
      <div class="kv">優先度: ${['','高','中','低'][Number(t.priority)]||'中'}</div>
      <div class="kv">区分: ${t.bucket==='stuck'?'STUCK':'OTHER'}</div></div>`;
  const notes = esc(t.notes||'（詳細なし）').replace(/\n/g,'<br>');
  return `<div class="row-details" id="details-${t.id}">
    <div>${tg}</div>${kvs}<div style="margin-top:6px">${notes}</div></div>`;
}

function row(t){ return `
  <div class="row">
    <div class="rcell"><strong>${esc(t.title)}</strong></div>
    <div class="rcell">${esc(t.due||'—')}</div>
    <div class="rcell">${esc(t.project||'—')}</div>
    <div class="rcell">${badgePriority(t.priority)}</div>
    <div class="rcell actions">
      <button class="btn small" data-act="detail" data-id="${t.id}">詳細</button>
      <button class="btn small" data-act="fp" data-id="${t.id}">FPにする</button>
      <button class="btn small" data-act="edit" data-id="${t.id}">編集</button>
      <button class="btn small danger" data-act="done" data-id="${t.id}">完了</button>
      <button class="btn small ghost" data-act="delete" data-id="${t.id}">削除</button>
    </div>
  </div>${rowDetails(t)}`; }

function renderFP(){
  const box = $('#fpBox'); const fp = state.fp;
  if(!box) return;
  box.innerHTML = fp ? `
    <div class="fp-card">
      <div class="fp-badge">FP</div>
      <div class="fp-content">
        <h3 class="fp-title">${esc(fp.title)}</h3>
        <div style="margin-bottom:6px">${badgePriority(fp.priority)} <span class="tag">${esc(fp.project||'—')}</span> ${fp.tags.map(t=>`<span class="tag">#${esc(t)}</span>`).join(' ')}</div>
        <div class="muted">${esc(fp.notes||'（詳細なし）')}</div>
        <div style="margin-top:8px" class="rcell actions">
          <button class="btn small danger" data-act="done" data-id="${fp.id}">完了</button>
          <button class="btn small" data-act="edit" data-id="${fp.id}">編集</button>
        </div>
      </div>
    </div>` : `<div class="empty">FPが未選択です。STUCK/OTHERから「FPにする」で設定してください。</div>`;
}

function renderTable(list, bodyId){
  const body = document.getElementById(bodyId);
  body.innerHTML = list.length ? list.map(row).join('') : `<div class="empty">タスクはありません</div>`;
}

function splitBuckets(){
  const open = state.items.filter(x=>x.status!=='done');
  state.fp = open.find(x=>x.is_fp) || null;
  state.stuck = open.filter(x=>x.bucket==='stuck' && !x.is_fp);
  state.other = open.filter(x=>x.bucket==='other' && !x.is_fp);
  state.done = state.items.filter(x=>x.status==='done');
}

function renderAll(){
  renderFP(); renderTable(state.stuck,'stuckBody'); renderTable(state.other,'otherBody'); setSectionVisibility(); renderHistory(); setRandomFlavor();
}

/* ========= Fold/List mode ========= */
let collapsed = { stuck:true, other:true }, listMode=false;
function setSectionVisibility(){
  const s = $('#stuckTable'), o = $('#otherTable');
  const bs=$('#toggleStuck'), bo=$('#toggleOther');
  if(s) s.style.display = collapsed.stuck ? 'none':'grid';
  if(o) o.style.display = collapsed.other ? 'none':'grid';
  if(bs) bs.textContent = collapsed.stuck ? '開く':'閉じる';
  if(bo) bo.textContent = collapsed.other ? '開く':'閉じる';
}
document.addEventListener('click', (e)=>{
  if(e.target?.id==='toggleStuck'){ collapsed.stuck=!collapsed.stuck; setSectionVisibility(); }
  if(e.target?.id==='toggleOther'){ collapsed.other=!collapsed.other; setSectionVisibility(); }
});
$('#listModeBtn').addEventListener('click', ()=>{
  listMode=!listMode;
  collapsed.stuck = !listMode; collapsed.other = !listMode; setSectionVisibility();
  $('#listModeBtn').textContent = listMode ? '一覧モード解除' : '一覧モード';
});
window.addEventListener('load', setSectionVisibility);

/* ========= Navigation ========= */
function show(name){ $$('.view').forEach(v=>v.classList.remove('active')); (name==='list'?$('#view-list'):$('#view-form')).classList.add('active'); }
$('#showList').addEventListener('click', ()=>show('list'));
$('#showForm').addEventListener('click', ()=>show('form'));

// ==== 修正: 「完了実績」トグルが効かない問題 ====
// ボタン -> カード開閉。開いたときは最新の内容に再レンダリング。
(() => {
  const btn = document.getElementById('toggleHistory');
  const card = document.getElementById('historyCard');
  if (!btn || !card) return;
  btn.addEventListener('click', () => {
    const isHidden = (card.style.display === 'none' || !card.style.display);
    card.style.display = isHidden ? 'block' : 'none';
    if (isHidden) renderHistory(); // 開いたタイミングで最新化
  });
})();

/* ========= History (group & CSV) ========= */
let histGroup = 'day';
const pad2=(n)=>String(n).padStart(2,'0');
const startOfWeek=(d)=>{const x=new Date(d);const w=(x.getDay()+6)%7;x.setDate(x.getDate()-w);x.setHours(0,0,0,0);return x;};
const endOfWeek=(d)=>{const x=new Date(startOfWeek(d));x.setDate(x.getDate()+6);x.setHours(23,59,59,999);return x;};
const ymd=(d)=>`${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`;
const ym=(d)=>`${d.getFullYear()}-${pad2(d.getMonth()+1)}`;
const fmtHM=(d)=>`${pad2(d.getHours())}:${pad2(d.getMinutes())}`;

function groupDone(by, items){
  const groups=new Map();
  for(const t of items){ if(!t.done_at) continue; const dt=new Date(t.done_at); let key,stamp,label;
    if(by==='day'){ key=ymd(dt); stamp=+new Date(key); label=key; }
    else if(by==='week'){ const s=startOfWeek(dt),e=endOfWeek(dt); key=`W-${ymd(s)}`; stamp=+s; label=`${ymd(s)} 〜 ${ymd(e)}`; }
    else { key=`M-${ym(dt)}`; const base=new Date(dt.getFullYear(),dt.getMonth(),1); stamp=+base; label=ym(dt); }
    if(!groups.has(key)) groups.set(key,{key,stamp,label,tasks:[]});
    groups.get(key).tasks.push(t);
  }
  const arr=[...groups.values()].sort((a,b)=>b.stamp-a.stamp);
  for(const g of arr) g.tasks.sort((a,b)=>(b.done_at||'').localeCompare(a.done_at||'')); return arr;
}

function renderHistory(){
  const cont = $('#doneList'); if(!cont) return;
  // praise + stats
  const today = toYMD(new Date()); const weekStart = thisMonday();
  let doneToday=0, doneWeek=0, doneMonth=0;
  for(const t of state.done){ if(!t.done_at) continue; const d=new Date(t.done_at);
    if(toYMD(d)===today) doneToday++; if(d>=weekStart) doneWeek++; if(d.getMonth()===new Date().getMonth()&&d.getFullYear()===new Date().getFullYear()) doneMonth++;
  }
  $('#statToday').textContent=doneToday; $('#statWeek').textContent=doneWeek; $('#statMonth').textContent=doneMonth; $('#statAll').textContent=state.done.length;
  $('#praise').textContent = doneToday>=5?'神速。今日は最高の成果日。':doneToday>=3?'いい流れ。もう一件いける。':'一歩ずつで十分。';

  const groups=groupDone(histGroup,state.done);
  cont.innerHTML = groups.length? groups.map(gr=>`
    <div class="group">
      <div class="group-title">${gr.label}（${gr.tasks.length}）</div>
      ${gr.tasks.map(t=>`<div class="task-line">✅ <span class="title">${esc(t.title)}</span>
        <span class="time">${ymd(new Date(t.done_at))} ${fmtHM(new Date(t.done_at))}</span></div>`).join('')}
    </div>`).join('') : '<div class="empty">まだ完了タスクはありません</div>';
}
document.body.addEventListener('change',(e)=>{ if(e.target?.name==='histGroup'){ histGroup=e.target.value; renderHistory(); }});
$('#histCsvBtn').addEventListener('click', ()=>{
  const groups=groupDone(histGroup,state.done);
  const rows=[['group_label','id','title','notes','project','tags','due','priority','status','created_at','updated_at','done_at']];
  for(const gr of groups){ for(const t of gr.tasks){ rows.push([gr.label,t.id,t.title,(t.notes||'').replace(/\n/g,'\\n'),t.project,t.tags.join(' '),t.due,t.priority,t.status,t.created_at,t.updated_at,t.done_at||'']); } }
  const csv=rows.map(r=>r.map(v=>`"${String(v??'').replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob=new Blob([csv],{type:'text/csv;charset=utf-8'}); const a=document.createElement('a');
  a.href=URL.createObjectURL(blob); a.download=`todo_done_${histGroup}_${toYMD(new Date())}.csv`; a.click(); URL.revokeObjectURL(a.href);
});

/* ========= Actions ========= */
function stuckCount(){ return state.items.filter(x=>x.status!=='done' && x.bucket==='stuck' && !x.is_fp).length; }
function stuckCountExcluding(id){ return state.items.filter(x=>x.status!=='done' && x.bucket==='stuck' && !x.is_fp && x.id!==id).length; }

async function setFP(id){ // 置換のみ：常に1件に保つ
  for(const it of state.items){ if(it.is_fp && it.id!==id){ it.is_fp=false; it.updated_at=nowISO(); await putTodo(it);} }
  const target=state.items.find(x=>x.id===id); if(!target || target.status==='done'){ alert('完了済はFPにできません'); return; }
  target.is_fp=true; target.updated_at=nowISO(); await putTodo(target); await reload();
}
async function complete(id){ const t=state.items.find(x=>x.id===id); if(!t) return;
  t.status='done'; t.is_fp=false; t.done_at=nowISO(); t.updated_at=nowISO(); await putTodo(t); await reload();
}

/* イベント委譲（詳細/編集/FP/完了/削除） */
document.body.addEventListener('click', async (ev)=>{
  const el = ev.target.closest('[data-act]'); if(!el) return;
  const act = el.getAttribute('data-act'); const id = el.getAttribute('data-id');
  const t = state.items.find(x=>x.id===id);
  if(act==='detail'){ const box=$(`#details-${id}`); if(box) box.style.display=(box.style.display==='none'||!box.style.display)?'block':'none'; return; }
  if(act==='edit'){ show('form'); fillForm(t); return; }
  if(act==='fp'){ await setFP(id); return; }
  if(act==='done'){ await complete(id); return; }
  if(act==='delete'){ if(confirm('削除しますか？')){ await delTodo(t.id); await reload(); } }
});

/* ========= Form ========= */
function fillForm(t){
  $('#todoId').value=t.id; $('#title').value=t.title; $('#notes').value=t.notes; $('#project').value=t.project;
  $('#tags').value=t.tags.join(','); $('#due').value=t.due; $('#priority').value=t.priority; $('#bucket').value=t.bucket;
}
$('#todoForm').addEventListener('submit', async (e)=>{
  e.preventDefault();
  const id=$('#todoId').value||uid(); const editing=!!$('#todoId').value; const bucket=$('#bucket').value;
  const limitOver = editing ? (bucket==='stuck' && stuckCountExcluding(id)>=5) : (bucket==='stuck' && stuckCount()>=5);
  if(limitOver){ alert('STUCKは最大5件です。'); return; }
  const prev = state.items.find(x=>x.id===id) || {};
  const data = normalize({...prev,id,title:$('#title').value,notes:$('#notes').value,project:$('#project').value,
    tags:$('#tags').value,due:$('#due').value,priority:$('#priority').value,bucket});
  if(!data.title){ alert('タイトルは必須です'); return; }
  data.updated_at=nowISO(); await putTodo(data); $('#todoForm').reset(); $('#todoId').value=''; show('list'); await reload();
});

/* ========= Footer: share & legal ========= */
(function initFooter(){
  const y=$('#year'); if(y) y.textContent=new Date().getFullYear();
  const href=location.href, url=encodeURIComponent(href), title=encodeURIComponent(document.title);
  const x=$('#shareX'), fb=$('#shareFB'), ln=$('#shareLINE'), li=$('#shareLI'), cp=$('#shareCopy');
  if(x) x.href=`https://twitter.com/intent/tweet?url=${url}&text=${title}`;
  if(ln) ln.href=`https://line.me/R/msg/text/?${title}%0A${url}`;
  if(li) li.href=`https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
  if(fb){
    if(location.protocol==='file:'){
      fb.addEventListener('click',(e)=>{e.preventDefault(); alert('Facebook共有はHTTP(S)で公開されたURLが必要です。');});
    }else{ fb.href=`https://www.facebook.com/sharer/sharer.php?u=${url}&t=${title}`; }
  }
  if(cp){ cp.addEventListener('click', async (e)=>{ e.preventDefault(); try{ await navigator.clipboard.writeText(href); alert('URLをコピーしました'); }catch{ prompt('コピーできない場合は下記を手動コピー：', href); } }); }

  // Legal modals
  const backdrop=$('#legalBackdrop'), terms=$('#termsModal'), privacy=$('#privacyModal');
  const open=(el)=>{ el?.classList.add('show'); backdrop?.classList.add('show'); el?.setAttribute('aria-hidden','false'); };
  const closeAll=()=>{ [terms,privacy].forEach(el=>{ el?.classList.remove('show'); el?.setAttribute('aria-hidden','true'); }); backdrop?.classList.remove('show'); };
  $('#termsLink')?.addEventListener('click',(e)=>{e.preventDefault();open(terms);});
  $('#privacyLink')?.addEventListener('click',(e)=>{e.preventDefault();open(privacy);});
  backdrop?.addEventListener('click',closeAll);
  document.addEventListener('keydown',(e)=>{ if(e.key==='Escape') closeAll(); });
  document.body.addEventListener('click',(e)=>{
    const el=e.target.closest('[data-legal]'); if(!el) return;
    const act=el.getAttribute('data-legal'); if(act==='close') closeAll(); if(act==='print-terms'||act==='print-privacy') window.print();
  });
})();

/* ========= PWA (SW only) ========= */
if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
  window.addEventListener('load', ()=> navigator.serviceWorker.register('./service-worker.js'));
}


/* ========= Boot ========= */
async function reload(){ state.items = await getAll(); splitBuckets(); renderAll(); }
async function seedIfEmpty(){ const all=await getAll(); if(all.length===0){
  for(const s of [
    normalize({title:'請求自動化スクリプトを直す', project:'製造計画アプリ', priority:'1', bucket:'stuck', tags:'urgent,backend', notes:'ログ確認→例外処理→再実行'}),
    normalize({title:'家賃を振り込む', project:'私事', priority:'2', bucket:'other', tags:'finance', notes:'今月末まで'}),
    normalize({title:'原価レポートのドラフト', project:'ATF', priority:'2', bucket:'stuck', notes:'テンプレの3章構成で'})
  ]) await putTodo(s); }}
(async()=>{ await openDB(); await seedIfEmpty();  await loadFlavorTexts(); await reload(); })();