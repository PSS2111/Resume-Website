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
S.list.forEach(norm);
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
 return pages();
}
const touch=()=>{cur().mod=Date.now()};
const commit=()=>{touch();save();paint()};

function form(){
 const r=cur(),d=r.d;
 let h=`<div class="card"><h3>Contact</h3>`+CF.map(([f,l])=>`<label>${l}<input data-f="${f}" value="${esc(d[f])}"></label>`).join('')+`</div>`;
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
$('#doc').onclick=()=>{
 const r=cur(),c=r.s.color;
 const css=`body{font-family:${r.s.font};font-size:${r.s.size}pt;line-height:1.3}h1{font-size:22pt;margin:0;color:${c}}h2{font-size:12pt;color:${c};border-bottom:1px solid ${c};margin:12pt 0 4pt}p,ul,div{margin:2pt 0}.sub{font-style:italic}`;
 const body=html(r).replace(/<\/b><span class="dt">/g,'</b> &nbsp;|&nbsp; <span>');
 const doc=`<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><title>${esc(r.d.name)}</title><style>${css}</style></head><body>${body}</body></html>`;
 const a=document.createElement('a');
 a.href=URL.createObjectURL(new Blob(['\ufeff',doc],{type:'application/msword'}));
 a.download=fname()+'.doc';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
};

$('#one').onclick=()=>{
 const r=cur(),z=r.s.size;
 while(paint()>1&&r.s.size>7)r.s.size=+(r.s.size-.25).toFixed(2);
 settings();save();
 const n=pages();
 toast(n>1?`Still ${n} pages at 7 pt. Hide a section or shorten the content.`:r.s.size<z?`Font size reduced to ${r.s.size} pt to fit one page`:'Already fits on one page');
};
addEventListener('load',()=>paint());

function home(){
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
const toks=t=>(t.toLowerCase().replace(/[\u2019']/g,'').match(/[a-z0-9][a-z0-9+#.\/-]*/g)||[]).map(w=>w.replace(/[.\/-]+$/,'')).filter(Boolean);
const stem=w=>w.length>3?w.replace(/(ing|ed|es|s)$/,''):w;
const stm=t=>' '+t.split(' ').map(stem).join(' ')+' ';
function plain(r){const t=document.createElement('textarea');t.innerHTML=html(r).replace(/<[^>]+>/g,' ');return t.value}
function kws(jd){
 const c={},ok=x=>x.length>1&&!STOP.has(x)&&!/^\d+$/.test(x),add=x=>c[x]=(c[x]||0)+1;
 jd.split(/[\n,;:!?()\u2022|]|\.\s/).forEach(seg=>{const w=toks(seg);w.forEach((x,i)=>{if(ok(x)){add(x);if(i+1<w.length&&ok(w[i+1]))add(x+' '+w[i+1])}})});
 let a=Object.keys(c).filter(t=>c[t]>=2||TECH.has(t));
 if(a.length<8)a=Object.keys(c).filter(t=>!t.includes(' '));
 const bi=a.filter(t=>t.includes(' '));
 a=a.filter(t=>t.includes(' ')||TECH.has(t)||!bi.some(b=>b.split(' ').includes(t)&&c[t]<=c[b]));
 return a.map(t=>({t,w:c[t]+(TECH.has(t)?3:0)})).sort((x,y)=>y.w-x.w).filter((x,i,A)=>A.findIndex(y=>stm(y.t)===stm(x.t))===i).slice(0,30);
}
function run(){
 const r=cur(),jd=r.jd||'',out=$('#atsr');
 if(jd.trim().split(/\s+/).length<15){out.innerHTML='<p class="hint">Paste a longer job description (at least a few lines) to get a useful result.</p>';return}
 const K=kws(jd),txt=plain(r),rs=' '+toks(txt).map(stem).join(' ')+' ';
 const hit=K.filter(k=>rs.includes(stm(k.t))),miss=K.filter(k=>!hit.includes(k));
 const tot=K.reduce((s,k)=>s+k.w,0)||1,score=Math.round(hit.reduce((s,k)=>s+k.w,0)/tot*100);
 const cls=score>=75?'g':score>=50?'o':'r',lab=score>=75?'Strong match':score>=50?'Decent match. Add the missing keywords where they are true.':'Low match. This resume is missing many of the keywords in the job description.';
 const hs=[...html(r).matchAll(/<h2>(.*?)<\/h2>/g)].map(m=>m[1].toLowerCase()),has=w=>hs.some(h=>h.includes(w)),n=pages();
 const chk=[
  [/[\w.+-]+@[\w-]+\.[\w.]+/.test(txt),'Email address is present','Add an email address'],
  [/\+?\d[\d\s()-]{8,}/.test(txt),'Phone number is present','Add a phone number'],
  [has('experience')||has('project'),'Experience or Projects heading found','Show a section called Experience or Projects; ATS looks for these headings'],
  [has('education'),'Education heading found','Show a section called Education'],
  [has('skill'),'Skills section is visible','Show a Skills section; ATS matches keywords from it'],
  [n<=2,`Length is ${n} page${n>1?'s':''}`,`Length is ${n} pages; aim for 1 to 2`]];
 out.innerHTML=`<div class="sc"><b class="${cls}">${score}%</b><span>${lab}</span></div><div class="bar2"><i style="width:${score}%"></i></div>
 <h3>Missing keywords (${miss.length})</h3>${miss.length?`<p class="hint">Click a keyword to add it to your Skills. Add only what you really know. Otherwise work it into a bullet point where it is true.</p><div class="chips">${miss.map(k=>`<button class="chip m" data-kw="${esc(k.t)}">+ ${esc(k.t)}</button>`).join('')}</div>`:'<p class="hint">Nothing important is missing.</p>'}
 <h3>Matched keywords (${hit.length})</h3><div class="chips">${hit.map(k=>`<span class="chip">${esc(k.t)}</span>`).join('')||'<span class="hint">None yet</span>'}</div>
 <h3>ATS format check</h3><ul class="ck">${chk.map(([ok,y,no])=>`<li class="${ok?'y':'n'}">${ok?y:no}</li>`).join('')}</ul>
 <p class="hint">This is a keyword-based estimate that runs in your browser. Real ATS products score differently, so use it as a guide.</p>`;
}
$('#ats').onclick=()=>{const r=cur();$('#jd').value=r.jd||'';$('#atsn').textContent=r.name;$('#atsr').innerHTML='';$('#atsd').showModal();if(r.jd)run()};
$('#atsx').onclick=()=>$('#atsd').close();
$('#atsgo').onclick=()=>{cur().jd=$('#jd').value;save();run()};
$('#jd').oninput=e=>{cur().jd=e.target.value;save()};
$('#atsr').onclick=e=>{
 const k=e.target.dataset.kw;if(!k)return;
 const r=cur();let s=r.d.skills.find(x=>x.a==='Additional Skills');
 if(!s){s={a:'Additional Skills',b:'',c:'',d:''};r.d.skills.push(s)}
 s.b=s.b?s.b+', '+k:k;r.on.skills=true;commit();form();run();
};

show(true);
