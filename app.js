const $=(s,r=document)=>r.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const KEY='resumeBuilder.v1';

const CF=[['name','Full name'],['title','Headline (e.g. SDET | Java, Selenium)'],['email','Email'],['phone','Phone'],['location','City, Country'],['links','LinkedIn / GitHub / Portfolio']];
const SEC=[
 {k:'summary',t:'Summary'},
 {k:'experience',t:'Experience',list:1},
 {k:'education',t:'Education',list:1},
 {k:'projects',t:'Projects',list:1},
 {k:'skills',t:'Skills'},
 {k:'certs',t:'Certifications',list:1},
 {k:'extra',t:'Achievements'}];
const LAB={experience:['Job title','Company','Dates (e.g. Jan 2024 - Present)'],education:['Degree','Institute','Years / CGPA'],projects:['Project name','Tech stack','Link or date'],certs:['Certificate','Issuer','Year']};
const PH={summary:'2-3 lines about who you are and what you want',skills:'Comma separated: Java, Python, SQL, Selenium',extra:'One achievement per line'};
const ORD={
 fresher:['summary','education','projects','skills','experience','certs','extra'],
 pro:['summary','experience','skills','projects','education','certs','extra']};

const TPL=[['classic','Classic'],['modern','Modern'],['compact','Compact'],['minimal','Minimal'],['executive','Executive'],['banner','Banner'],['bold','Bold bars'],['underline','Underline'],['boxed','Boxed'],['elegant','Elegant'],['timeline','Timeline'],['split','Split header'],['soft','Soft'],['ruled','Ruled'],['literary','Literary'],['accent','Accent']];
$('#tpl').innerHTML=TPL.map(([v,n])=>`<option value="${v}">${n}</option>`).join('');
const blank=()=>({name:'',title:'',email:'',phone:'',location:'',links:'',summary:'',skills:[],extra:'',experience:[],education:[],projects:[],certs:[]});
const mk=(name,type='fresher')=>norm({id:Date.now().toString(36)+Math.random().toString(36).slice(2,5),name,type,tpl:'classic',s:{color:'#1f4e79',font:'Arial,Helvetica,sans-serif',size:10.5},on:{},cs:[],names:{},d:blank()});
const sample=()=>{const r=mk('My first resume');Object.assign(r.d,{name:'Alex Morgan',title:'Software Engineer',email:'alex@example.com',phone:'+91 90000 00000',location:'Chandigarh, India',links:'linkedin.com/in/alexmorgan | github.com/alexmorgan',summary:'Computer science graduate with hands-on experience in test automation and web development, looking for an SDE or SDET role.',skills:[{a:'Languages',b:'Java, Python, JavaScript, SQL',c:'',d:''},{a:'Testing',b:'Selenium, REST APIs, JUnit',c:'',d:''},{a:'Tools',b:'Git, Jenkins',c:'',d:''}],extra:'Solved 300+ problems on coding platforms'});
 r.d.education.push({a:'M.Tech, Computer Science',b:'Your University',c:'2025 - 2027',d:'CGPA: 8.5/10'});
 r.d.projects.push({a:'Price Predictor',b:'Python, scikit-learn',c:'2024',d:'Built a regression model with 92% accuracy\nPublished the results as a research paper'});
 r.d.experience.push({a:'SDET Intern',b:'Company Name',c:'Jan 2023 - Jun 2023',d:'Wrote automated API and UI tests\nCut regression time by 40%'});return r};

let S;try{S=JSON.parse(localStorage.getItem(KEY))}catch(e){}
if(!S||!S.list||!S.list.length){const r=sample();S={cur:r.id,list:[r]}}
S.apps=S.apps||[];S.list.forEach(norm);
function norm(r){if(typeof r.d.skills==='string')r.d.skills=r.d.skills.trim()?[{a:'',b:r.d.skills,c:'',d:''}]:[];r.cs=r.cs||[];r.names=r.names||{};const all=[...SEC,...r.cs].map(s=>s.k);r.ord=(r.ord||ORD[r.type]).filter(k=>all.includes(k));all.forEach(k=>{if(!r.ord.includes(k))r.ord.push(k)});return r}
const secs=r=>{const a=[...SEC,...r.cs];return r.ord.map(k=>a.find(s=>s.k===k))},ttl=(r,s)=>r.names[s.k]||s.t;
const cur=()=>S.list.find(r=>r.id===S.cur)||S.list[0];
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){toast('Could not save: browser storage is full or blocked')}};
let tm;const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(tm);tm=setTimeout(()=>t.classList.remove('show'),2200)};

const lines=v=>String(v||'').split('\n').map(x=>x.trim()).filter(Boolean);
function sec(k,r){
 const d=r.d,s=secs(r).find(s=>s.k===k),t=esc(ttl(r,s));let b='';
 if(s.list)b=d[k].filter(i=>i.a||i.b||i.c||i.d).map(i=>{const l=lines(i.d);
  return `<div class="it"><div class="row"><b>${esc(i.a)}</b><span class="dt">${esc(i.c)}</span></div>${i.b?`<div class="sub">${esc(i.b)}</div>`:''}${l.length?`<ul>${l.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}</div>`}).join('');
 else if(k==='skills')b=d.skills.map(i=>{const v=String(i.b||'').split(/[,\n]/).map(x=>x.trim()).filter(Boolean).join(', ');return v?`<p>${i.a?`<b>${esc(i.a)}:</b> `:''}${esc(v)}</p>`:''}).join('');
 else if(k==='summary')b=d.summary.trim()?`<p>${esc(d.summary)}</p>`:'';
 else{const l=lines(d[k]);b=l.length?`<ul>${l.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}
 return b?`<section><h2>${t}</h2>${b}</section>`:'';
}
function html(r){
 const d=r.d,ct=[d.email,d.phone,d.location,d.links].filter(Boolean).map(esc).join(' | ');
 return `<header><h1>${esc(d.name)||'Your Name'}</h1>${d.title?`<div>${esc(d.title)}</div>`:''}${ct?`<div class="ct">${ct}</div>`:''}</header>`+
  r.ord.filter(k=>r.on[k]!==false).map(k=>sec(k,r)).join('');
}
function pages(){
 const p=$('#paper'),c=getComputedStyle(p),pad=parseFloat(c.paddingTop)+parseFloat(c.paddingBottom),mm=96/25.4;
 const n=Math.max(1,Math.ceil((p.scrollHeight-pad-2)/(297*mm-pad)));
 const e=$('#pages');e.textContent=n+(n>1?' pages':' page');e.classList.toggle('warn',n>1);
 return n;
}
function paint(){
 const r=cur(),p=$('#paper');
 p.className='t-'+r.tpl;
 p.style.cssText=`--c:${r.s.color};--f:${r.s.font};--z:${r.s.size}pt`;
 p.innerHTML=html(r);
 if(r.hl)hilite(r);
 return pages();
}
const touch=()=>{cur().mod=Date.now()};
const commit=()=>{touch();save();paint()};

function form(){
 const r=cur(),d=r.d;
 let h=`<div class="card"><h3>Contact</h3>`+CF.map(([f,l])=>`<label>${l}<input data-f="${f}" value="${esc(d[f])}"></label>`).join('')+`<p class="hint">Tip: leave out your photo, date of birth and marital status.</p></div>`;
 secs(r).forEach(s=>{
  const k=s.k,on=r.on[k]!==false;
  h+=`<div class="card${on?'':' off'}"><h3 class="hd"><label class="sw"><input type="checkbox" data-on="${k}" ${on?'checked':''}> ${esc(ttl(r,s))}</label><span><button class="add" data-mv="${k}" data-d="-1" title="Move up">&uarr;</button><button class="add" data-mv="${k}" data-d="1" title="Move down">&darr;</button><button class="add" data-rn="${k}">Rename</button>${s.custom?`<button class="lnk" data-dc="${k}">Delete</button>`:''}</span></h3>`;
  if(s.list){
   const lab=LAB[k]||['Title','Organization or publisher','Date'];
   d[k].forEach((it,i)=>{
    const at=g=>`data-l="${k}" data-i="${i}" data-g="${g}"`;
    h+=`<div class="item">`+['a','b','c'].map((g,j)=>`<input ${at(g)} placeholder="${lab[j]}" value="${esc(it[g])}">`).join('')+
     `<textarea ${at('d')} placeholder="Details: one bullet per line">${esc(it.d)}</textarea><button class="lnk" data-rm="${k}" data-i="${i}">Remove</button></div>`});
   h+=`<button class="add" data-add="${k}">+ Add entry</button>`;
  }else if(k==='skills'){
   d.skills.forEach((it,i)=>{const at=g=>`data-l="skills" data-i="${i}" data-g="${g}"`;
    h+=`<div class="item"><input ${at('a')} placeholder="Category (e.g. Languages, Tools)" value="${esc(it.a)}"><textarea ${at('b')} placeholder="Skills, comma separated: Java, Python, SQL">${esc(it.b)}</textarea><button class="lnk" data-rm="skills" data-i="${i}">Remove</button></div>`});
   h+=`<button class="add" data-add="skills">+ Add skill list</button>`;
  }else h+=`<textarea data-f="${k}" placeholder="${PH[k]||'One item per line'}">${esc(d[k])}</textarea>`;
  h+=`</div>`;
 });
 h+=`<div class="card"><h3>Add your own section</h3><label>Section name<input id="csn" placeholder="e.g. Publications, Volunteering, Languages"></label><label>Format<select id="cst"><option value="list">Entries with title, details and date</option><option value="text">Simple bullet list</option></select></label><button class="add" data-addcs="1">+ Add section</button></div>`;
 $('#details').innerHTML=h;
}
function settings(){
 const r=cur();
 $('#type').value=r.type;$('#tpl').value=r.tpl;$('#color').value=r.s.color;$('#font').value=r.s.font;$('#size').value=r.s.size;$('#sizeV').textContent=r.s.size+' pt';
}
function profiles(){
 $('#profile').innerHTML=S.list.map(r=>`<option value="${r.id}" ${r.id===S.cur?'selected':''}>${esc(r.name)}</option>`).join('');
}
const load=()=>{profiles();settings();form();paint()};

$('#details').addEventListener('input',e=>{
 const t=e.target,r=cur(),x=t.dataset;
 if(x.f)r.d[x.f]=t.value;
 else if(x.l)r.d[x.l][x.i][x.g]=t.value;
 else if(x.on){r.on[x.on]=t.checked;t.closest('.card').classList.toggle('off',!t.checked)}
 else return;
 commit();
});
$('#details').addEventListener('click',e=>{
 const x=e.target.dataset,r=cur();
 if(x.add)r.d[x.add].push({a:'',b:'',c:'',d:''});
 else if(x.rm)r.d[x.rm].splice(+x.i,1);
 else if(x.mv){const i=r.ord.indexOf(x.mv),j=i+ +x.d;if(j<0||j>=r.ord.length)return;[r.ord[i],r.ord[j]]=[r.ord[j],r.ord[i]]}
 else if(x.rn){const s=secs(r).find(s=>s.k===x.rn),n=prompt('Rename section',ttl(r,s));if(!n||!n.trim())return;r.names[s.k]=n.trim()}
 else if(x.dc){if(!confirm('Delete this section and everything in it?'))return;r.cs=r.cs.filter(s=>s.k!==x.dc);delete r.d[x.dc];norm(r)}
 else if(x.addcs){const n=$('#csn').value.trim();if(!n)return toast('Enter a section name first');const list=$('#cst').value==='list',k='x_'+Date.now().toString(36);r.cs.push({k,t:n,list,custom:1});r.d[k]=list?[]:'';norm(r)}
 else return;
 touch();save();form();paint();
 if(x.mv)document.querySelector(`[data-mv="${x.mv}"]`)?.scrollIntoView({block:'nearest'});
});
$('#type').onchange=e=>{const r=cur();r.type=e.target.value;r.ord=null;norm(r);touch();save();form();paint()};
$('#tpl').onchange=e=>{cur().tpl=e.target.value;commit()};
$('#color').oninput=e=>{cur().s.color=e.target.value;commit()};
$('#font').onchange=e=>{cur().s.font=e.target.value;commit()};
$('#size').oninput=e=>{const v=+e.target.value;cur().s.size=v;$('#sizeV').textContent=v+' pt';commit()};

$('#profile').onchange=e=>{S.cur=e.target.value;save();load()};
$('#new').onclick=()=>{const n=prompt('Name this resume (e.g. SDET resume, Data analyst resume)');if(!n)return;const r=mk(n.trim());S.list.push(r);S.cur=r.id;save();load()};
$('#dup').onclick=()=>{const n=prompt('Name for the copy',cur().name+' copy');if(!n)return;const r=JSON.parse(JSON.stringify(cur()));r.id=Date.now().toString(36);r.name=n.trim();S.list.push(r);S.cur=r.id;save();load()};
$('#ren').onclick=()=>{const n=prompt('New name',cur().name);if(!n)return;cur().name=n.trim();save();profiles()};
$('#del').onclick=()=>{
 if(!confirm(`Delete "${cur().name}"? This cannot be undone.`))return;
 S.list=S.list.filter(r=>r.id!==S.cur);
 if(!S.list.length)S.list.push(mk('My resume'));
 S.cur=S.list[0].id;save();load();
};

const fname=()=>(cur().d.name||'resume').trim().replace(/\s+/g,'_')+'_'+cur().name.trim().replace(/\s+/g,'_');
$('#pdf').onclick=()=>{const t=document.title;document.title=fname();toast('Choose "Save as PDF" as the destination');setTimeout(()=>{print();document.title=t},400)};

$('#one').onclick=()=>{
 const r=cur(),z=r.s.size;
 while(paint()>1&&r.s.size>7)r.s.size=+(r.s.size-.25).toFixed(2);
 settings();save();
 const n=pages();
 toast(n>1?`Still ${n} pages at 7 pt. Hide a section or shorten the content.`:r.s.size<z?`Font size reduced to ${r.s.size} pt to fit one page`:'Already fits on one page');
};
addEventListener('load',()=>paint());

function home(){apps();
 const fmt=t=>t?'Edited '+new Date(t).toLocaleDateString(undefined,{day:'numeric',month:'short',year:'numeric'}):'';
 $('#grid').innerHTML=S.list.map(r=>{
  const tn=(TPL.find(t=>t[0]===r.tpl)||[0,'Classic'])[1];
  return `<article class="rc" tabindex="0" data-act="open" data-id="${r.id}" aria-label="Open ${esc(r.name)}"><div class="thumb"><div class="th t-${r.tpl}" style="--c:${esc(r.s.color)};--f:${esc(r.s.font)};--z:${r.s.size}pt">${html(r)}</div></div>
  <div class="meta"><b>${esc(r.name)}</b><span>${r.type==='pro'?'Professional':'Fresher'} &middot; ${tn}</span><span>${fmt(r.mod)}</span></div>
  <div class="acts"><button class="add" data-act="open" data-id="${r.id}">Edit</button><button class="add" data-act="dup" data-id="${r.id}">Duplicate</button><button class="lnk" data-act="del" data-id="${r.id}">Delete</button></div></article>`}).join('')+
  `<article class="rc nw" tabindex="0" data-act="new">+ New resume</article>`;
}
function show(h){document.body.classList.toggle('home',h);if(h){home();scrollTo(0,0)}else{load();scrollTo(0,0)}}
$('#grid').addEventListener('click',e=>{
 const b=e.target.closest('[data-act]');if(!b)return;
 const a=b.dataset.act,p=S.cur;
 if(b.dataset.id)S.cur=b.dataset.id;
 if(a==='open'){save();show(false)}
 else if(a==='new'){$('#new').onclick();if(S.cur!==p)show(false);else S.cur=p}
 else if(a==='dup'){$('#dup').onclick();home()}
 else if(a==='del'){const n=S.list.length;$('#del').onclick();if(S.list.length===n)S.cur=p;home()}
});
$('#grid').addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.classList.contains('rc'))e.target.click()});
$('#homeBtn').onclick=()=>show(true);
$('.brand').onclick=()=>show(true);
/* ATS match checker */
const STOP=new Set(`a an the and or of to in for with on at by from as is are was were be been being this that these those it its we you your our their they will would can could should may might must shall do does did have has had not no if than then so such into over under about across per via etc also other more most any all each both either who whom whose which what when where how why while within without including include includes able ability strong strongly good great excellent proven demonstrated experience experiences work working works worked job role position candidate candidates team teams year years plus preferred required requirements requirement responsibilities responsibility qualifications qualification skills skill knowledge understanding familiarity looking seeking join company opportunity opportunities benefits salary location remote hybrid onsite full time part new use using used help support ensure make making well like need needs want day days us one two three first related relevant various multiple highly environment e.g i.e`.split(/\s+/));
const TECH=new Set(`java python javascript typescript c++ c# go golang ruby php swift kotlin sql mysql postgresql mongodb oracle nosql redis react angular vue node nodejs node.js express django flask spring springboot aws azure gcp docker kubernetes jenkins git github gitlab ci/cd cicd selenium cypress playwright junit testng pytest appium postman jmeter api apis graphql microservices agile scrum jira devops linux html css tensorflow pytorch pandas numpy scikit-learn ml ai bdd tdd automation testing sdet qa dsa oop`.split(/[\s,]+/).filter(Boolean).concat(['machine learning','rest api','spring boot','unit testing','test automation','data structures','regression testing','api testing','manual testing','performance testing','deep learning','data analysis']));
const SYN={js:'javascript',nodejs:'node.js','node js':'node.js',reactjs:'react','react.js':'react',vuejs:'vue','vue.js':'vue',ml:'machine learning',k8s:'kubernetes',cicd:'ci/cd',postgres:'postgresql',golang:'go',ts:'typescript','c sharp':'c#',dotnet:'.net'};
const SYNRE=new RegExp('(?<![\\w.])('+Object.keys(SYN).sort((a,b)=>b.length-a.length).map(k=>k.replace(/[.*+?^${}()|[\]\\\/]/g,'\\$&')).join('|')+')(?![\\w])','g');
const toks=t=>(t.toLowerCase().replace(SYNRE,m=>SYN[m]).replace(/[\u2019']/g,'').match(/[a-z0-9][a-z0-9+#.\/-]*/g)||[]).map(w=>w.replace(/[.\/-]+$/,'')).filter(Boolean);
const stem=w=>w.length>3?w.replace(/(ing|ed|es|s)$/,''):w;
const stm=t=>' '+t.split(' ').map(stem).join(' ')+' ';
function plain(r){const t=document.createElement('textarea');t.innerHTML=html(r).replace(/<[^>]+>/g,' ');return t.value}
function kws(jd){
 const c={},ok=x=>x.length>1&&!STOP.has(x)&&!/^\d+$/.test(x),add=(x,w)=>c[x]=(c[x]||0)+w;
 jd.split('\n').forEach(line=>{const wt=/preferred|nice to have|bonus|good to have|a plus|desirable/i.test(line)?.5:1;line.split(/[,;:!?()\u2022|]|\.\s/).forEach(seg=>{const w=toks(seg);w.forEach((x,i)=>{if(ok(x)){add(x,wt);if(i+1<w.length&&ok(w[i+1]))add(x+' '+w[i+1],wt)}})})});
 let a=Object.keys(c).filter(t=>c[t]>=2||TECH.has(t));
 if(a.length<8)a=Object.keys(c).filter(t=>!t.includes(' '));
 const bi=a.filter(t=>t.includes(' '));
 a=a.filter(t=>t.includes(' ')||TECH.has(t)||!bi.some(b=>b.split(' ').includes(t)&&c[t]<=c[b]));
 return a.map(t=>({t,w:c[t]+(TECH.has(t)?3:0)})).sort((x,y)=>y.w-x.w).filter((x,i,A)=>A.findIndex(y=>stm(y.t)===stm(x.t))===i).slice(0,30);
}
function dl(b,n){const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=n;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}

/* Shared content model (used by the text view and the Word export) */
function model(r){
 const d=r.d;
 return r.ord.filter(k=>r.on[k]!==false).map(k=>{
  const s=secs(r).find(x=>x.k===k);let it=[];
  if(s.list)it=d[k].filter(i=>i.a||i.b||i.c||i.d).map(i=>({h:i.a,dt:i.c,s:i.b,b:lines(i.d)}));
  else if(k==='skills')it=d.skills.map(i=>({lab:i.a,p:String(i.b||'').split(/[,\n]/).map(x=>x.trim()).filter(Boolean).join(', ')})).filter(i=>i.p);
  else if(k==='summary')it=d.summary.trim()?[{p:d.summary.trim()}]:[];
  else if(lines(d[k]).length)it=[{b:lines(d[k])}];
  return{t:ttl(r,s),it};
 }).filter(s=>s.it.length);
}
function txt(r){
 const d=r.d,ct=[d.email,d.phone,d.location,d.links].filter(Boolean).join(' | ');
 const L=[d.name||'Your Name',d.title,ct].filter(Boolean);
 model(r).forEach(s=>{
  L.push('','',s.t.toUpperCase());
  L.push(s.it.map(i=>i.lab!==undefined?(i.lab?i.lab+': ':'')+i.p:i.p?i.p:[[i.h,i.dt].filter(Boolean).join(' | '),i.s,...(i.b||[]).map(x=>'- '+x)].filter(Boolean).join('\n')).join(s.it[0].b&&s.it[0].h!==undefined?'\n\n':'\n'));
 });
 return L.join('\n');
}

/* True .docx export (small zip writer, no libraries) */
function crc(b){let t=crc.t;if(!t){t=crc.t=[];for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t.push(c>>>0)}}let x=-1;for(const v of b)x=t[(x^v)&255]^(x>>>8);return(x^-1)>>>0}
function zip(files){
 const e=new TextEncoder(),parts=[],cd=[];let off=0;
 for(const [n,s] of files){
  const nb=e.encode(n),d=e.encode(s),c=crc(d),h=new DataView(new ArrayBuffer(30)),q=new DataView(new ArrayBuffer(46));
  h.setUint32(0,0x04034b50,true);h.setUint16(4,20,true);h.setUint16(6,0x0800,true);h.setUint16(12,0x21,true);h.setUint32(14,c,true);h.setUint32(18,d.length,true);h.setUint32(22,d.length,true);h.setUint16(26,nb.length,true);
  parts.push(new Uint8Array(h.buffer),nb,d);
  q.setUint32(0,0x02014b50,true);q.setUint16(4,20,true);q.setUint16(6,20,true);q.setUint16(8,0x0800,true);q.setUint16(14,0x21,true);q.setUint32(16,c,true);q.setUint32(20,d.length,true);q.setUint32(24,d.length,true);q.setUint16(28,nb.length,true);q.setUint32(42,off,true);
  cd.push(new Uint8Array(q.buffer),nb);off+=30+nb.length+d.length;
 }
 const cl=cd.reduce((s,a)=>s+a.length,0),z=new DataView(new ArrayBuffer(22));
 z.setUint32(0,0x06054b50,true);z.setUint16(8,files.length,true);z.setUint16(10,files.length,true);z.setUint32(12,cl,true);z.setUint32(16,off,true);
 return new Blob([...parts,...cd,new Uint8Array(z.buffer)],{type:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});
}
function docxBlob(r){
 const d=r.d,c=r.s.color.slice(1),f=r.s.font.split(',')[0].replace(/['"]/g,''),z=Math.round(r.s.size*2);
 const R=(t,o={})=>`<w:r><w:rPr><w:rFonts w:ascii="${f}" w:hAnsi="${f}" w:cs="${f}"/>${o.b?'<w:b/>':''}${o.i?'<w:i/>':''}${o.c?`<w:color w:val="${c}"/>`:''}<w:sz w:val="${o.z||z}"/></w:rPr><w:t xml:space="preserve">${esc(t)}</w:t></w:r>`;
 const P=(x,o={})=>`<w:p><w:pPr>${o.bd||''}${o.tb||''}<w:spacing w:before="${o.bf||0}" w:after="${o.af??40}"/>${o.ind||''}</w:pPr>${x}</w:p>`;
 const TAB='<w:r><w:tab/></w:r>',tb='<w:tabs><w:tab w:val="right" w:pos="9900"/></w:tabs>';
 const ct=[d.email,d.phone,d.location,d.links].filter(Boolean).join(' | ');
 let b=P(R(d.name||'Your Name',{b:1,c:1,z:44}),{af:20});
 if(d.title)b+=P(R(d.title));
 if(ct)b+=P(R(ct));
 model(r).forEach(s=>{
  b+=P(R(s.t,{b:1,c:1,z:z+2}),{bf:200,af:80,bd:`<w:pBdr><w:bottom w:val="single" w:sz="6" w:space="1" w:color="${c}"/></w:pBdr>`});
  s.it.forEach(i=>{
   if(i.lab!==undefined)b+=P((i.lab?R(i.lab+': ',{b:1}):'')+R(i.p));
   else if(i.p)b+=P(R(i.p));
   else{
    if(i.h||i.dt)b+=P(R(i.h||'',{b:1})+(i.dt?TAB+R(i.dt):''),{tb,af:0});
    if(i.s)b+=P(R(i.s,{i:1}),{af:0});
    (i.b||[]).forEach(x=>{b+=P(R('\u2022  '+x),{ind:'<w:ind w:left="360" w:hanging="240"/>',af:20})});
   }
  });
 });
 const X='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',W='http://schemas.openxmlformats.org/';
 return zip([
  ['[Content_Types].xml',`${X}<Types xmlns="${W}package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`],
  ['_rels/.rels',`${X}<Relationships xmlns="${W}package/2006/relationships"><Relationship Id="rId1" Type="${W}officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`],
  ['word/document.xml',`${X}<w:document xmlns:w="${W}wordprocessingml/2006/main"><w:body>${b}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="850" w:right="1000" w:bottom="850" w:left="1000" w:header="708" w:footer="708" w:gutter="0"/></w:sectPr></w:body></w:document>`]]);
}
$('#doc').onclick=()=>dl(docxBlob(cur()),fname()+'.docx');

/* Job match, role keywords, quality check, ATS text view */
const ROLES={
 'SDET / QA':'java,python,selenium,cypress,playwright,appium,testng,junit,pytest,rest assured,postman,api testing,test automation,regression testing,jenkins,ci/cd,git,sql,jira,agile,bdd,tdd,jmeter,sdlc',
 'Software Engineer (SDE)':'data structures,algorithms,java,python,c++,oop,system design,sql,rest api,microservices,git,docker,aws,agile,unit testing,debugging',
 'Frontend Developer':'html,css,javascript,typescript,react,redux,responsive design,rest api,git,webpack,testing,accessibility,figma',
 'Backend Developer':'node.js,java,python,spring boot,rest api,sql,postgresql,mongodb,redis,docker,microservices,authentication,git,aws',
 'Data Analyst':'sql,excel,python,pandas,tableau,power bi,data visualization,statistics,etl,dashboards,data cleaning,reporting',
 'Data Scientist / ML':'python,machine learning,deep learning,tensorflow,pytorch,scikit-learn,pandas,numpy,statistics,nlp,sql,model deployment',
 'DevOps Engineer':'linux,docker,kubernetes,terraform,jenkins,ci/cd,aws,azure,ansible,monitoring,git,bash,networking'};
const VERBS='Built,Developed,Designed,Implemented,Automated,Optimized,Reduced,Improved,Led,Delivered,Created,Analyzed,Tested,Migrated,Integrated,Deployed,Debugged,Collaborated,Streamlined,Launched,Resolved,Maintained,Mentored,Refactored'.split(',');
const WEAK=/^(responsible for|worked on|helped|assisted|involved in|duties included|tasked with|participated in)/i;
$('#role').innerHTML=Object.keys(ROLES).map(k=>`<option>${k}</option>`).join('');
const chips=(a,cls,kw)=>a.map(t=>kw?`<button class="chip m" data-kw="${esc(t)}">+ ${esc(t)}</button>`:`<span class="chip">${esc(t)}</span>`).join('');

function hits(r){
 const jd=r.jd||'';if(jd.trim().split(/\s+/).length<15)return[];
 const rs=' '+toks(plain(r)).map(stem).join(' ')+' ';
 return kws(jd).filter(k=>rs.includes(stm(k.t)));
}
function hilite(r){
 const h=hits(r).map(k=>k.t).sort((a,b)=>b.length-a.length);if(!h.length)return;
 const re=new RegExp('(?<![\\w])('+h.map(t=>t.replace(/[.*+?^${}()|[\]\\\/]/g,'\\$&')).join('|')+')(?![\\w])','gi');
 const w=document.createTreeWalker($('#paper'),NodeFilter.SHOW_TEXT),ns=[];while(w.nextNode())ns.push(w.currentNode);
 ns.forEach(n=>{
  re.lastIndex=0;if(!re.test(n.nodeValue))return;re.lastIndex=0;
  const f=document.createDocumentFragment();let i=0,m;
  while((m=re.exec(n.nodeValue))){f.append(n.nodeValue.slice(i,m.index));const e=document.createElement('mark');e.textContent=m[0];f.append(e);i=m.index+m[0].length}
  f.append(n.nodeValue.slice(i));n.replaceWith(f);
 });
}
function run(){
 const r=cur(),jd=r.jd||'',out=$('#atsr');
 if(jd.trim().split(/\s+/).length<15){out.innerHTML='<p class="hint">Paste a longer job description (at least a few lines) to get a useful result.</p>';return}
 const K=kws(jd),txt=plain(r),rs=' '+toks(txt).map(stem).join(' ')+' ';
 const hit=K.filter(k=>rs.includes(stm(k.t))),miss=K.filter(k=>!hit.includes(k));
 const tot=K.reduce((s,k)=>s+k.w,0)||1,score=Math.round(hit.reduce((s,k)=>s+k.w,0)/tot*100);
 const bt=' '+toks(['experience','projects'].flatMap(k=>r.on[k]===false?[]:r.d[k].map(i=>i.a+' '+i.d)).join(' ')).map(stem).join(' ')+' ';
 const only=hit.filter(k=>!bt.includes(stm(k.t))).slice(0,8);
 const jt=jd.split('\n').map(x=>x.trim()).find(Boolean)||'',jw=jt.length<=90?toks(jt).filter(x=>!STOP.has(x)).map(stem):[];
 const hw=' '+toks(r.d.title).map(stem).join(' ')+' ';
 const cls=score>=75?'g':score>=50?'o':'r',lab=score>=75?'Strong match':score>=50?'Decent match. Add the missing keywords where they are true.':'Low match. This resume is missing many of the keywords in the job description.';
 const hs=[...html(r).matchAll(/<h2>(.*?)<\/h2>/g)].map(m=>m[1].toLowerCase()),has=w=>hs.some(h=>h.includes(w)),n=pages();
 const chk=[
  [/[\w.+-]+@[\w-]+\.[\w.]+/.test(txt),'Email address is present','Add an email address'],
  [/\+?\d[\d\s()-]{8,}/.test(txt),'Phone number is present','Add a phone number'],
  [has('experience')||has('project'),'Experience or Projects heading found','Show a section called Experience or Projects; ATS looks for these headings'],
  [has('education'),'Education heading found','Show a section called Education'],
  [has('skill'),'Skills section is visible','Show a Skills section; ATS matches keywords from it'],
  [n<=2,`Length is ${n} page${n>1?'s':''}`,`Length is ${n} pages; aim for 1 to 2`]];
 if(jw.length)chk.push([jw.some(w=>hw.includes(' '+w+' ')),'Your headline shares words with the job title',`Your headline does not share words with the job title ("${jt}"). Use the title in your headline if it truly fits you`]);
 out.innerHTML=`<div class="sc"><b class="${cls}">${score}%</b><span>${lab}</span></div><div class="bar2"><i style="width:${score}%"></i></div>
 <h3>Missing keywords (${miss.length})</h3>${miss.length?`<p class="hint">Click a keyword to add it to your Skills. Add only what you really know. Otherwise work it into a bullet point where it is true. Words in "preferred" or "nice to have" lines count less.</p><div class="chips">${chips(miss.map(k=>k.t),'',1)}</div>`:'<p class="hint">Nothing important is missing.</p>'}
 ${only.length?`<h3>Found only in Skills or Summary (${only.length})</h3><p class="hint">Recruiters trust a keyword more when it also appears in an Experience or Project bullet.</p><div class="chips">${chips(only.map(k=>k.t))}</div>`:''}
 <h3>Matched keywords (${hit.length})</h3><div class="chips">${chips(hit.map(k=>k.t))||'<span class="hint">None yet</span>'}</div>
 <h3>ATS format check</h3><ul class="ck">${chk.map(([ok,y,no])=>`<li class="${ok?'y':'n'}">${ok?y:no}</li>`).join('')}</ul>
 <p class="hint">This is a keyword-based estimate that runs in your browser. Real ATS products score differently, so use it as a guide. Common short forms (JS, ML, K8s) count as matches.</p>`;
}
function roles(){
 const r=cur(),rs=' '+toks(plain(r)).map(stem).join(' ')+' ',K=ROLES[$('#role').value].split(','),hit=K.filter(k=>rs.includes(stm(k))),miss=K.filter(k=>!hit.includes(k));
 $('#rolr').innerHTML=`<p class="hint">${hit.length} of ${K.length} common keywords for this role are on your resume. Add only the ones you really know.</p><h3>Missing</h3><div class="chips">${chips(miss,'',1)||'<span class="hint">None</span>'}</div><h3>Found</h3><div class="chips">${chips(hit)||'<span class="hint">None yet</span>'}</div>`;
}
function qual(){
 const r=cur(),d=r.d,B=[],out=[],all=plain(r);
 ['experience','projects'].forEach(k=>{if(r.on[k]!==false)d[k].forEach(i=>lines(i.d).forEach(l=>B.push(l)))});
 const t=(ok,y,n)=>out.push([ok,ok?y:n]);
 const weak=B.filter(l=>WEAK.test(l)),nn=B.filter(l=>!/\d/.test(l)),lg=B.filter(l=>l.split(/\s+/).length>30);
 t(!weak.length,'No weak bullet openers',`${weak.length} bullet(s) start with a weak opener like "responsible for" or "worked on". Start with a strong verb. Example: "${(weak[0]||'').slice(0,60)}"`);
 t(!B.length||nn.length<=B.length/2,'Most bullets include numbers',`${nn.length} of ${B.length} bullets have no number. Add a count, percentage, time or size where it is true.`);
 t(!lg.length,'Bullet lengths are fine',`${lg.length} bullet(s) are longer than 30 words. Split or shorten them.`);
 t(!/\b(i|my|me|myself)\b/i.test(all),'No first-person words','First-person words (I, my, me) found. Resumes leave them out.');
 const f={};B.forEach(l=>{const w=l.split(/\s+/)[0].toLowerCase();f[w]=(f[w]||0)+1});
 const rep=Object.entries(f).filter(([w,n])=>n>=3);
 t(!rep.length,'Bullet openers are varied',`Overused opening words: ${rep.map(([w,n])=>`${w} (${n}x)`).join(', ')}. Vary your verbs.`);
 const MR=/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\b/i;
 const sty=new Set([...d.experience,...d.education,...d.projects].map(i=>String(i.c||'')).filter(Boolean).map(s=>MR.test(s)?'month and year':/\d{1,2}\/\d{4}/.test(s)?'MM/YYYY':/\d{4}/.test(s)?'year only':''  ).filter(Boolean));
 t(sty.size<2,'Date formats are consistent',`Date formats are mixed (${[...sty].join(', ')}). Use one style throughout.`);
 const MO='janfebmaraprmayjunjulaugsepoctnovdec',now=new Date(),ym=(m,y)=>+y*12+(m?Math.max(0,MO.indexOf(m.slice(0,3).toLowerCase())/3):0);
 const rg=d.experience.map(i=>{const m=String(i.c).match(/(?:([A-Za-z]{3,9})\.?\s+)?(\d{4})\s*(?:-|\u2013|to)\s*(?:(?:([A-Za-z]{3,9})\.?\s+)?(\d{4})|present|current|now)/i);return m?[ym(m[1],m[2]),m[4]?ym(m[3],m[4]):now.getFullYear()*12+now.getMonth()]:null}).filter(Boolean).sort((a,b)=>a[0]-b[0]);
 let gap=0,ov=0;for(let i=1;i<rg.length;i++){const g=rg[i][0]-rg[i-1][1];if(g>3)gap++;if(g<-1)ov++}
 t(!gap,'No long gaps between roles','There is a gap of more than 3 months between roles. Be ready to explain it, or add what you did (courses, projects).');
 t(!ov,'No overlapping roles','Some roles overlap by more than a month. Check the dates.');
 t(!/(date of birth|\bdob\b|marital|married|nationality|religion|father'?s name|passport)/i.test(all),'No unnecessary personal details','Personal details such as date of birth, marital status or nationality are best left off.');
 $('#qr').innerHTML=`<ul class="ck">${out.map(([ok,m])=>`<li class="${ok?'y':'n'}">${esc(m)}</li>`).join('')}</ul>
 <h3>Strong action verbs</h3><p class="hint">Click a verb to copy it.</p><div class="chips">${VERBS.map(v=>`<button class="chip" data-copy="${v}">${v}</button>`).join('')}</div>
 <h3>Bullet formula</h3><p class="hint">Action verb + what you did + tools used + result with a number.<br>Example: Automated 120 regression tests using Selenium and Java, cutting test time by 40%.</p>`;
}
const textv=()=>{$('#tx').value=txt(cur())};
let TAB='match';
function tab(n){
 TAB=n||TAB;
 document.querySelectorAll('#atsd [data-tab]').forEach(b=>b.classList.toggle('on',b.dataset.tab===TAB));
 document.querySelectorAll('#atsd .pn').forEach(p=>{p.hidden=p.id!=='p-'+TAB});
 ({match:()=>{if(cur().jd)run()},role:roles,quality:qual,text:textv})[TAB]();
}
$('#ats').onclick=()=>{const r=cur();$('#jd').value=r.jd||'';$('#hl').checked=!!r.hl;$('#atsr').innerHTML='';$('#atsd').showModal();tab('match')};
$('#atsx').onclick=()=>$('#atsd').close();
$('#atsgo').onclick=()=>{cur().jd=$('#jd').value;save();run();paint()};
$('#jd').oninput=e=>{cur().jd=e.target.value;save()};
$('#hl').onchange=e=>{cur().hl=e.target.checked;save();paint()};
$('#role').onchange=roles;
$('#txc').onclick=()=>navigator.clipboard.writeText($('#tx').value).then(()=>toast('Copied'));
$('#txd').onclick=()=>dl(new Blob([$('#tx').value],{type:'text/plain'}),fname()+'.txt');
$('#atsd').onclick=e=>{
 const x=e.target.dataset;
 if(x.tab)return tab(x.tab);
 if(x.copy){navigator.clipboard.writeText(x.copy).then(()=>toast('Copied: '+x.copy));return}
 if(x.kw){
  const r=cur();let s=r.d.skills.find(v=>v.a==='Additional Skills');
  if(!s){s={a:'Additional Skills',b:'',c:'',d:''};r.d.skills.push(s)}
  s.b=s.b?s.b+', '+x.kw:x.kw;r.on.skills=true;commit();form();tab();
 }
};
$('#details').spellcheck=true;

/* Backup and import */
$('#bk').onclick=()=>dl(new Blob([JSON.stringify(S,null,1)],{type:'application/json'}),'resume-builder-backup-'+new Date().toISOString().slice(0,10)+'.json');
$('#imp').onclick=()=>$('#impf').click();
$('#impf').onchange=async e=>{
 const f=e.target.files[0];e.target.value='';if(!f)return;
 try{
  const o=JSON.parse(await f.text());if(!Array.isArray(o.list))throw 0;
  const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6),ids=new Set([...S.list,...S.apps].map(x=>x.id));let n=0;
  o.list.forEach(r=>{if(!r||!r.d||!r.s)return;if(ids.has(r.id))r.id=uid();ids.add(r.id);S.list.push(norm(r));n++});
  (o.apps||[]).forEach(a=>{if(!a||!a.co)return;if(ids.has(a.id))a.id=uid();ids.add(a.id);S.apps.push(a)});
  save();home();toast(`Imported ${n} resume${n===1?'':'s'}`);
 }catch(err){toast('That file is not a valid backup')}
};

/* Application tracker */
const ST=['Saved','Applied','Interview','Offer','Rejected'];
function tpl(a,kind){
 const r=S.list.find(x=>x.id===a.rs)||S.list[0],n=r.d.name||'Your Name',ct=[r.d.phone,r.d.email].filter(Boolean).join(' | '),f=(n+'_'+a.ro).trim().replace(/[^\w]+/g,'_');
 return kind==='em'?`Subject: Application for ${a.ro}${a.jid?' (Job ID: '+a.jid+')':''} - ${n}\n\nDear Hiring Team,\n\nI am writing to apply for the ${a.ro} position at ${a.co}. My resume is attached as ${f}.pdf. [One line on why you are a strong fit, using words from the job description.]\n\nThank you for your time. I look forward to hearing from you.\n\nRegards,\n${n}\n${ct}`
 :`Dear Hiring Team,\n\nI am excited to apply for the ${a.ro} position at ${a.co}. [One or two sentences on why this role or company interests you.]\n\nI bring [your degree or years of experience] and hands-on experience with [top 3 skills from the job description]. In [project or job], I [achievement with a number]. [Another relevant result.]\n\nI would welcome the chance to discuss how I can contribute to your team. Thank you for considering my application.\n\nSincerely,\n${n}\n${ct}`;
}
function apps(){
 const t=new Date().toISOString().slice(0,10),opt=(a,v)=>a.map(x=>`<option value="${esc(x[0])}"${x[0]===v?' selected':''}>${esc(x[1])}</option>`).join('');
 const ss=ST.map(x=>[x,x]),late=a=>a.fu&&a.fu<=t&&(a.st==='Applied'||a.st==='Interview');
 $('#apps').innerHTML=`<h2>Application tracker</h2><p class="hint">Record where you applied and which resume you sent. Overdue follow-ups show in red. Tip: save the PDF as Name_Role.pdf.</p>
 <div class="af"><input id="a_co" placeholder="Company"><input id="a_ro" placeholder="Role"><input id="a_id" placeholder="Job ID (optional)"><input id="a_ln" placeholder="Job link (optional)">
 <label>Applied<input id="a_dt" type="date" value="${t}"></label><label>Follow up<input id="a_fu" type="date"></label>
 <label>Resume<select id="a_rs">${opt(S.list.map(r=>[r.id,r.name]),S.cur)}</select></label><label>Status<select id="a_st">${opt(ss,'Applied')}</select></label>
 <button class="go" data-ac="add">Add application</button></div>
 <div class="tw"><table class="at"><thead><tr><th>Company</th><th>Role</th><th>Resume</th><th>Applied</th><th>Follow up</th><th>Status</th><th></th></tr></thead><tbody>${S.apps.map((a,i)=>`<tr><td>${esc(a.co)}${a.ln?` <a href="${esc(a.ln)}" target="_blank" rel="noopener">link</a>`:''}</td><td>${esc(a.ro)}${a.jid?`<br><small>ID ${esc(a.jid)}</small>`:''}</td><td>${esc((S.list.find(r=>r.id===a.rs)||{}).name||'')}</td><td>${esc(a.dt)}</td><td class="${late(a)?'late':''}">${esc(a.fu)}</td><td><select data-ac="st" data-i="${i}">${opt(ss,a.st)}</select></td><td class="acts"><button class="add" data-ac="em" data-i="${i}">Email</button><button class="add" data-ac="cl" data-i="${i}">Cover letter</button><button class="lnk" data-ac="rm" data-i="${i}">Delete</button></td></tr>`).join('')||'<tr><td colspan="7">No applications yet.</td></tr>'}</tbody></table></div>`;
}
$('#apps').addEventListener('click',e=>{
 const x=e.target.dataset;if(!x.ac)return;
 if(x.ac==='add'){
  const g=i=>$('#'+i).value.trim(),co=g('a_co'),ro=g('a_ro');
  if(!co||!ro)return toast('Enter the company and the role');
  let ln=g('a_ln');if(ln&&!/^https?:\/\//i.test(ln))ln='https://'+ln;
  S.apps.unshift({id:Date.now().toString(36)+Math.random().toString(36).slice(2,6),co,ro,jid:g('a_id'),ln,dt:g('a_dt'),fu:g('a_fu'),rs:g('a_rs'),st:g('a_st')});
  save();apps();
 }else if(x.ac==='rm'){if(confirm('Delete this application?')){S.apps.splice(+x.i,1);save();apps()}}
 else if(x.ac==='em'||x.ac==='cl')navigator.clipboard.writeText(tpl(S.apps[+x.i],x.ac)).then(()=>toast('Copied. Replace the [bracketed] parts before sending.'));
});
$('#apps').addEventListener('change',e=>{const x=e.target.dataset;if(x.ac==='st'){S.apps[+x.i].st=e.target.value;save();apps()}});

show(true);
