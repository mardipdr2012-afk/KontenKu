/* KontenKu — klien SPA (GitHub Pages) */
/* KontenKu — klien SPA: navigasi 0 ms, optimistic UI + localStorage, sinkron latar belakang (antrean berurutan) */
const $=s=>document.querySelector(s);
const TH=['Riset','Penulisan Skrip','Storyboard','Rekaman','Editing','Finalisasi'],ST=['Ide','Dikerjakan','Siap Tayang','Sudah Tayang'];
const PC={TikTok:'#111827',Instagram:'#E1306C',YouTube:'#EF4444',Lainnya:'#64748B'};
const TK={Ide:'ide',Konten:'konten',Analitik:'analitik'},IK={Ide:'ide_id',Konten:'konten_id',Analitik:'analitik_id'};
const BD={'Ide':'bd-g','Dikerjakan':'bd-y','Siap Tayang':'bd-b','Sudah Tayang':'bd-s'};
let T=sessionStorage.getItem('kk_t'),D=null,AD=null,pg='dashboard',Q=Promise.resolve(),CH=[],AF=[],vw='papan',per='bulan',pa='30',qa='',iq='',ip='',aq='',cal={m:new Date().getMonth(),y:new Date().getFullYear()};
const R={};
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num=n=>Number(n)||0,fm=n=>num(n).toLocaleString('id-ID'),rp=n=>'Rp '+fm(n),pct=n=>(num(n)*100).toFixed(2).replace('.',',')+'%';
const iso=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const td=()=>iso(new Date()),ago=n=>{const d=new Date();d.setDate(d.getDate()-n);return iso(d)};
const fd=s=>s?new Date(s+'T00:00').toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'}):'-';
const uid=()=>crypto.randomUUID(),FD=f=>Object.fromEntries(new FormData(f));
let NET=0;const net=d=>{NET+=d;const b=document.getElementById('net');if(b)b.hidden=NET<=0};
const rpc=(fn,...a)=>{
  if(!/^https:\/\/script\.google\.com\/macros\/s\/.+\/exec$/.test(GAS_URL))return Promise.reject('URL backend belum diisi. Edit js/config.js lalu isi GAS_URL.');
  /* text/plain = "simple request": tidak memicu preflight CORS pada GAS */
  net(1);
  return fetch(GAS_URL,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({fn,args:a})})
    .then(r=>r.json()).catch(()=>{throw 'Tidak dapat terhubung ke server. Periksa koneksi internet.'})
    .then(r=>{if(r&&r.ok)return r.data;throw (r&&r.pesan)||'Gagal'}).finally(()=>net(-1));
};
const toast=(m,er)=>{const t=document.createElement('div');t.className='toast'+(er?' er':'');t.textContent=m;$('#toasts').append(t);setTimeout(()=>t.remove(),4000)};
const mdl=h=>{$('#mdl').innerHTML='<div class="md" role="dialog" aria-modal="true">'+h+'</div>';$('#mdl').hidden=false};
const tutup=()=>{$('#mdl').hidden=true;$('#mdl').innerHTML=''};
$('#mdl').onclick=e=>{if(e.target.id==='mdl')tutup()};document.addEventListener('keydown',e=>{if(e.key==='Escape')tutup()});
const fld=(l,i)=>`<label class="f">${l}${i}</label>`;
const sel=(n,o,v,e)=>`<select name="${n}">${e?'<option value=""></option>':''}${(v&&!o.includes(v)?[v,...o]:o).map(x=>`<option${x===v?' selected':''}>${esc(x)}</option>`).join('')}</select>`;
const pc=p=>`<span class="chip pl" style="background:${PC[p]||PC.Lainnya}">${esc(p||'—')}</span>`;
const head=(t,s,a='')=>`<div class="hd"><div><h1>${t}</h1><p>${s}</p></div><div class="ac">${a}</div></div>`;
const kpi=(l,v,s,g,ic)=>`<div class="kpi" style="background:var(--g${g})"><i class="bi bi-${ic} ki"></i><small>${l}</small><b>${v}</b><span>${s}</span></div>`;
const pla=()=>(D.pengaturan.platform_aktif||'TikTok,Instagram,YouTube').split(',').filter(Boolean);
const cat=()=>(D.pengaturan.kategori_konten||'#EdukasiKreator,#ReviewAlat,#TipsAlgoritma,#VlogProduktivitas').split(',').filter(Boolean);
const late=k=>k.status!=='Sudah Tayang'&&k.deadline&&k.deadline<td();
const sj=k=>k.status==='Sudah Tayang'?'Selesai':late(k)?'Terlambat':'Terjadwal';
const kd=k=>k.tgl_tayang||k.deadline||k.tgl_mulai||String(k.dibuat_pada||'').slice(0,10);
const inter=a=>num(a.likes)+num(a.komentar)+num(a.shares)+num(a.saves);
const ws=s=>{const d=new Date(s+'T00:00');d.setDate(d.getDate()-(d.getDay()+6)%7);return iso(d)};
function inP(k){const d=kd(k);if(!d||per==='semua')return true;const n=new Date();return d>=({minggu:ago(7),bulan:iso(new Date(n.getFullYear(),n.getMonth(),1)),'3bulan':ago(90)}[per])}
function lat(A){const m={};(A||D.analitik).forEach(a=>{const q=x=>x.tgl_catat+(x.dibuat_pada||'');if(!m[a.konten_id]||q(a)>=q(m[a.konten_id]))m[a.konten_id]=a});return m}
const ch=(id,cfg)=>AF.push(()=>{const c=document.getElementById(id);if(c&&window.Chart)CH.push(new Chart(c,Object.assign({options:{}},cfg,{options:Object.assign({responsive:true,maintainAspectRatio:false},cfg.options)})))});

/* ── data: cache lokal, sinkron server, tulis optimistik ── */
const keep=()=>{try{localStorage.setItem('kk_D',JSON.stringify(D))}catch(e){}};
function muat(){return rpc('muat',T).then(d=>{D=d;keep();draw()}).catch(e=>{if(/Sesi|tidak aktif/.test(e))keluarLokal();else toast(e,1)})}
function sv(ops){
  ops.forEach(({t,o})=>{const a=D[TK[t]],k=IK[t];if(!o[k])o[k]=uid();const i=a.findIndex(x=>x[k]===o[k]);
    if(i<0)a.unshift(o);else Object.assign(a[i],o);
    if(t==='Analitik'){const x=a.find(r=>r[k]===o[k]);x.engagement_rate=num(x.views)?inter(x)/num(x.views):0}});
  keep();draw();Q=Q.then(()=>rpc('simpan',T,ops).catch(e=>{toast(e,1);return muat()}));
}
function hp(t,id){const a=D[TK[t]],i=a.findIndex(x=>x[IK[t]]===id);if(i>=0)a.splice(i,1);if(t==='Konten')D.analitik=D.analitik.filter(x=>x.konten_id!==id);keep();draw();Q=Q.then(()=>rpc('hapus',T,t,id).catch(e=>{toast(e,1);return muat()}))}

/* ── autentikasi ── */
function auth(m,em){
  $('#app').hidden=true;const a=$('#auth');a.hidden=false;
  const btn=t=>`<button class="btn btn-p" style="width:100%;justify-content:center">${t}</button>`;
  const F={
    masuk:`<h2>Masuk</h2><p>Kelola ide, produksi, jadwal, dan performa konten dalam satu tempat.</p><form onsubmit="return aksi(event,'login')" style="margin-top:14px">${fld('Email','<input name="e" type="email" required autocomplete="email">')}${fld('Kata sandi','<input name="p" type="password" required autocomplete="current-password">')}${btn('Masuk')}</form><p style="margin-top:14px">Belum punya akun? <a onclick="auth('daftar')">Daftar gratis</a></p>`,
    daftar:`<h2>Buat Akun</h2><form onsubmit="return aksi(event,'daftar')" style="margin-top:14px">${fld('Nama','<input name="n" required maxlength="60" autocomplete="name">')}${fld('Email','<input name="e" type="email" required autocomplete="email">')}${fld('Kata sandi (min. 8 karakter)','<input name="p" type="password" required minlength="8" autocomplete="new-password">')}${btn('Daftar & Kirim Kode')}</form><p style="margin-top:14px">Sudah punya akun? <a onclick="auth('masuk')">Masuk</a></p>`,
    verif:`<h2>Verifikasi Email</h2><p>Masukkan kode 6 digit yang dikirim ke <b>${esc(em)}</b> (berlaku 15 menit).</p><form onsubmit="return aksi(event,'verif')" style="margin-top:14px"><input type="hidden" name="e" value="${esc(em)}">${fld('Kode verifikasi','<input name="k" inputmode="numeric" maxlength="6" required>')}${btn('Verifikasi')}</form>`};
  a.innerHTML=`<div class="card ab"><div class="logo"><i class="bi bi-layout-text-window-reverse"></i><b>KontenKu</b><small>v1.0</small></div>${F[m]}<p style="margin-top:16px"><small><a href="privacy.html" target="_blank" rel="noopener">Kebijakan Privasi</a> · <a href="terms.html" target="_blank" rel="noopener">Syarat Layanan</a></small></p></div>`;
}
function aksi(e,fn){
  e.preventDefault();const f=e.target,b=f.querySelector('button'),v=n=>f[n]?f[n].value:'',done=x=>{toast(x,1);b.disabled=false};b.disabled=true;
  if(fn==='login')rpc('login',v('e'),v('p')).then(r=>{T=r.token;sessionStorage.setItem('kk_t',T);localStorage.removeItem('kk_D');D=null;showApp();return muat()}).catch(done);
  if(fn==='daftar')rpc('daftar',v('n'),v('e'),v('p')).then(m=>{toast(m);auth('verif',v('e'))}).catch(done);
  if(fn==='verif')rpc('verifikasi',v('e'),v('k')).then(()=>{toast('Akun aktif! Silakan masuk.');auth('masuk')}).catch(done);
  return false;
}
function showApp(){$('#auth').hidden=true;$('#app').hidden=false;draw()}
function keluarLokal(){sessionStorage.removeItem('kk_t');localStorage.removeItem('kk_D');T=null;D=null;AD=null;auth('masuk')}
function keluar(){rpc('logout',T).catch(()=>{});keluarLokal()}

/* ── navigasi & render ── */
function go(p){if(p==='admin'&&(!D||D.profil.role!=='admin'))return;pg=p;document.body.classList.remove('nav');draw();scrollTo(0,0);if(p==='admin')loadAdmin()}
function draw(){
  CH.forEach(c=>c.destroy());CH=[];AF=[];
  $('#navA').hidden=$('#secA').hidden=!(D&&D.profil.role==='admin');
  document.querySelectorAll('nav a[data-p]').forEach(a=>a.classList.toggle('on',a.dataset.p===pg));
  if(!D){$('#view').innerHTML='<div class="skel"></div>'.repeat(3);return}
  $('#nm').textContent=D.profil.nama;$('#av').textContent=(D.profil.nama||'K')[0].toUpperCase();
  $('#view').innerHTML=R[pg]();AF.forEach(f=>f());
}

/* ── Dashboard ── */
R.dashboard=()=>{
  const h=head('Dashboard Ringkasan','Pantau siklus kreasi, jadwal publikasi, dan performa konten Anda secara terpusat.',
    `<select aria-label="Periode" style="width:auto" onchange="per=this.value;draw()">${[['minggu','Minggu ini'],['bulan','Bulan ini'],['3bulan','3 bulan'],['semua','Semua']].map(x=>`<option value="${x[0]}"${per===x[0]?' selected':''}>${x[1]}</option>`).join('')}</select>`);
  if(!D.konten.length&&!D.ide.length)return h+`<div class="card empty"><i class="bi bi-lightbulb"></i><h3>Belum ada konten, yuk tambah ide pertama!</h3><p>Simpan ide, lacak produksi, dan pantau hasilnya di sini.</p><button class="btn btn-p" onclick="fIde()">+ Tambah Ide</button></div>`;
  const K=D.konten.filter(inP),L=lat(),c=s=>K.filter(k=>k.status===s).length,n=new Date(),w=(n.getDay()+6)%7,a=new Date(n);a.setDate(n.getDate()-w);const w0=iso(a);a.setDate(a.getDate()+6);const w1=iso(a);
  const mg=D.konten.filter(k=>k.status==='Sudah Tayang'&&k.tgl_tayang>=w0&&k.tgl_tayang<=w1).length,tg=num(D.profil.target_mingguan)||5;
  const sc=[c('Ide'),c('Dikerjakan'),c('Siap Tayang'),c('Sudah Tayang')],pv={};
  K.forEach(k=>{const x=L[k.konten_id];if(x)pv[k.platform]=(pv[k.platform]||0)+num(x.views)});
  ch('cDon',{type:'doughnut',data:{labels:ST,datasets:[{data:sc,backgroundColor:['#94A3B8','#F97316','#7C3AED','#16A34A'],borderWidth:0}]},options:{cutout:'68%',plugins:{legend:{position:'right'}}}});
  ch('cBar',{type:'bar',data:{labels:Object.keys(pv),datasets:[{data:Object.values(pv),backgroundColor:Object.keys(pv).map(p=>PC[p]||PC.Lainnya),borderRadius:8}]},options:{plugins:{legend:{display:false}}}});
  const top=K.filter(k=>L[k.konten_id]).sort((x,y)=>num(L[y.konten_id].views)-num(L[x.konten_id].views)).slice(0,5);
  const nx=D.konten.filter(k=>k.tgl_tayang>=td()&&k.status!=='Sudah Tayang').sort((x,y)=>(x.tgl_tayang+(x.jam_tayang||'')).localeCompare(y.tgl_tayang+(y.jam_tayang||''))).slice(0,5);
  return h+`<div class="grid k5">${kpi('Total Konten',K.length,'Periode terpilih',1,'folder2-open')}${kpi('Sedang Dikerjakan',c('Dikerjakan'),'Tahap aktif produksi',2,'clock')}${kpi('Siap Dipublikasikan',c('Siap Tayang'),'Draf siap rilis',3,'check-circle')}${kpi('Sudah Tayang',c('Sudah Tayang'),'Konten dipublikasikan',4,'rocket-takeoff')}${kpi('Target Mingguan',mg+'/'+tg,'Tayang minggu ini',5,'flag')}</div>
  <div class="grid c3"><div class="card"><h3>Status Konten</h3><div style="height:240px"><canvas id="cDon"></canvas></div></div>
  <div class="card"><h3>Performa per Platform</h3>${Object.keys(pv).length?'<div style="height:240px"><canvas id="cBar"></canvas></div>':'<p class="empty"><small>Catat performa konten yang sudah tayang di Analitik.</small></p>'}</div>
  <div class="card"><h3>Konten Terbaik</h3>${top.map((k,i)=>`<div class="top5"><span class="rk">${i+1}</span><div><b>${esc(k.judul)}</b><small>${esc(k.platform)} · ER ${pct(L[k.konten_id].engagement_rate)}</small></div><b style="color:#16A34A;flex:none">${fm(L[k.konten_id].views)}</b></div>`).join('')||'<small>Belum ada data performa.</small>'}<p style="margin-top:12px"><a style="color:var(--pr);font-weight:600" onclick="go('analitik')">Lihat Semua Statistik →</a></p></div></div>
  <div class="card" style="margin-bottom:24px"><div class="row sb"><h3>Jadwal Terdekat</h3><a style="color:var(--pr);font-weight:600" onclick="go('kalender')">Lihat Kalender →</a></div><div class="tw"><table><tr><th>Tanggal</th><th>Judul Konten</th><th>Saluran</th><th>Status</th></tr>${nx.map(k=>`<tr style="cursor:pointer" onclick="fKonten('${k.konten_id}')"><td>${fd(k.tgl_tayang)} ${esc(k.jam_tayang||'')}</td><td><b>${esc(k.judul)}</b></td><td>${pc(k.platform)}</td><td><span class="chip ${BD[k.status]}">${esc(k.status)}</span></td></tr>`).join('')||'<tr><td colspan="4"><small>Belum ada jadwal tayang.</small></td></tr>'}</table></div></div>
  <div class="cta"><div><h3>Ingin mulai produksi baru? Tambah ide konten segar hari ini!</h3><p>Dokumentasikan konsep kilat, skrip video, atau rencana kolaborasi sebelum ide menguap.</p></div><div class="row"><button class="btn btn-s" onclick="go('ide')">Lihat Bank Ide</button><button class="btn btn-p" onclick="fIde()">+ Tambah Ide Cepat</button></div></div>`;
};

/* ── Ide Konten ── */
R.ide=()=>{
  const I=D.ide.filter(i=>i.status_ide!=='Diarsipkan'&&(!ip||String(i.platform_tujuan).includes(ip))&&(!iq||(i.judul+i.topik+i.hook).toLowerCase().includes(iq))).sort((a,b)=>String(b.dibuat_pada).localeCompare(a.dibuat_pada));
  return head('Ide Konten','Simpan ide ke bank ide atau langsung jadikan draf produksi.',`<input placeholder="Cari ide…" value="${esc(iq)}" style="width:200px" onchange="iq=this.value.toLowerCase();draw()"><select style="width:auto" onchange="ip=this.value;draw()"><option value="">Semua platform</option>${pla().map(p=>`<option${p===ip?' selected':''}>${p}</option>`).join('')}</select><button class="btn btn-s" onclick="fAiIde()"><i class="bi bi-stars"></i> Ide dengan AI</button><button class="btn btn-p" onclick="fIde()">+ Tambah Ide Baru</button>`)
  +(I.length?`<div class="ideg">${I.map(i=>`<div class="card ide"><div class="row"><span class="chip ${i.prioritas==='Tinggi'?'bd-r':i.prioritas==='Rendah'?'bd-g':'bd-y'}">${esc(i.prioritas||'Sedang')}</span><span class="chip bd-b">${esc(i.kategori||i.topik||'Umum')}</span>${i.status_ide==='Dipilih'?'<span class="chip bd-s">Dijadikan konten</span>':''}</div><h3>${esc(i.judul)}</h3>${i.hook?`<div class="hook">“${esc(i.hook)}”</div>`:''}<div class="row">${String(i.platform_tujuan||'').split(',').filter(Boolean).map(pc).join('')}</div><div class="row sb" style="margin-top:auto"><span><button class="ib" title="Ubah" onclick="fIde('${i.ide_id}')"><i class="bi bi-pencil"></i></button><button class="ib" title="Arsipkan" onclick="sv([{t:'Ide',o:{ide_id:'${i.ide_id}',status_ide:'Diarsipkan'}}]);toast('Ide diarsipkan')"><i class="bi bi-archive"></i></button><button class="ib" title="Hapus" onclick="confirm('Hapus ide ini?')&&hp('Ide','${i.ide_id}')"><i class="bi bi-trash"></i></button></span>${i.status_ide==='Dipilih'?'':`<button class="btn btn-s btn-sm" onclick="jadikan('${i.ide_id}')">Jadikan Konten →</button>`}</div></div>`).join('')}</div>`
  :`<div class="card empty"><i class="bi bi-lightbulb"></i><h3>Belum ada ide</h3><p>Yuk tambah ide pertama!</p><button class="btn btn-p" onclick="fIde()">+ Tambah Ide Baru</button></div>`);
};
function fIde(id){
  const i=D.ide.find(x=>x.ide_id===id)||{platform_tujuan:pla()[0],prioritas:'Sedang'},pt=String(i.platform_tujuan||'').split(',');
  mdl(`<h2>${id?'Ubah Ide':'Tambah Ide Baru'}</h2><p>Simpan ide ke bank ide atau langsung jadikan draf produksi.</p><form onsubmit="return svIde(event,'${id||''}')" style="margin-top:14px">
  ${fld('Judul Ide *',`<input name="judul" required maxlength="120" value="${esc(i.judul)}">`)}
  <div class="g2">${fld('Topik / Pilar',`<input name="topik" maxlength="80" value="${esc(i.topik)}">`)}${fld('Kategori',sel('kategori',cat(),i.kategori,1))}</div>
  ${fld('Hook Pembuka (3 detik pertama)',`<textarea name="hook" rows="2" maxlength="300">${esc(i.hook)}</textarea><button type="button" class="btn btn-s btn-sm" onclick="aiHook(this)"><i class="bi bi-stars"></i> Perbaiki hook dengan AI</button>`)}
  ${fld('Konsep Video',`<textarea name="konsep_video" rows="2" maxlength="600">${esc(i.konsep_video)}</textarea>`)}
  <div class="f">Platform Tujuan</div><div class="seg" style="margin-bottom:14px">${[...new Set([...pla(),'Lainnya'])].map(p=>`<label><input type="checkbox" name="pt" value="${esc(p)}"${pt.includes(p)?' checked':''}>${esc(p)}</label>`).join('')}</div>
  <div class="f">Tingkat Prioritas</div><div class="seg" style="margin-bottom:18px">${['Tinggi','Sedang','Rendah'].map(p=>`<label><input type="radio" name="prioritas" value="${p}"${i.prioritas===p?' checked':''}>${p}</label>`).join('')}</div>
  <div class="ft"><button type="button" class="btn btn-s" onclick="tutup()">Batal</button><button class="btn btn-s" value="s">Simpan Ide</button><button class="btn btn-p" value="j">Simpan & Jadikan Konten →</button></div></form>`);
}
function svIde(e,id){
  e.preventDefault();const f=e.target,o=FD(f);delete o.pt;o.platform_tujuan=[...f.querySelectorAll('[name=pt]:checked')].map(x=>x.value).join(',');
  if(id)o.ide_id=id;else{o.ide_id=uid();o.status_ide='Baru';o.dibuat_pada=new Date().toISOString()}
  const j=e.submitter&&e.submitter.value==='j',ops=[{t:'Ide',o}];if(j){o.status_ide='Dipilih';ops.push({t:'Konten',o:mk(o)})}
  sv(ops);tutup();toast(j?'Ide dijadikan konten':'Ide disimpan');if(j)go('produksi');return false;
}
const mk=i=>({konten_id:uid(),ide_id:i.ide_id,judul:i.judul,platform:String(i.platform_tujuan||'').split(',')[0]||pla()[0],kategori:i.kategori||'',tahap:'Riset',status:'Dikerjakan',tgl_mulai:td(),status_jadwal:'Terjadwal',catatan:i.hook||'',dibuat_pada:new Date().toISOString()});
function jadikan(id){const i=D.ide.find(x=>x.ide_id===id);if(!i)return;sv([{t:'Ide',o:{ide_id:id,status_ide:'Dipilih'}},{t:'Konten',o:mk(i)}]);toast('Ide dipindahkan ke Progres Produksi');go('produksi')}

/* ── Progres Produksi ── */
const ti=k=>Math.max(0,TH.indexOf(k.tahap));
R.produksi=()=>{
  const K=D.konten,h=head('Progres Produksi','Kelola siklus produksi dari riset hingga finalisasi. Seret kartu atau tekan panah untuk pindah tahap.',
    `<div class="seg"><label><input type="radio" name="v"${vw==='papan'?' checked':''} onchange="vw='papan';draw()"><i class="bi bi-kanban"></i> Papan</label><label><input type="radio" name="v"${vw==='tabel'?' checked':''} onchange="vw='tabel';draw()"><i class="bi bi-table"></i> Tabel</label></div><button class="btn btn-p" onclick="fKonten()">+ Buat Konten Baru</button>`);
  const info=`<div class="card" style="margin-bottom:20px"><b>Total Aktif: ${K.filter(k=>k.status!=='Sudah Tayang').length} Konten</b> <small>· ${TH.map((t,i)=>t+': '+K.filter(k=>ti(k)===i).length).join(' · ')}</small>${K.some(late)?` <span class="chip bd-r">${K.filter(late).length} Terlambat Deadline</span>`:''}</div>`;
  if(!K.length)return h+`<div class="card empty"><i class="bi bi-kanban"></i><h3>Belum ada konten dalam produksi</h3><p>Jadikan ide sebagai konten, atau buat konten baru.</p><button class="btn btn-p" onclick="fKonten()">+ Buat Konten Baru</button></div>`;
  if(vw==='tabel')return h+info+`<div class="card"><div class="tw"><table><tr><th>Judul Konten</th><th>Platform</th><th>Tahap</th><th>Status</th><th>Deadline</th><th>Tayang</th></tr>${K.map(k=>`<tr style="cursor:pointer" onclick="fKonten('${k.konten_id}')"><td><b>${esc(k.judul)}</b></td><td>${pc(k.platform)}</td><td>${esc(k.tahap)}</td><td><span class="chip ${BD[k.status]}">${esc(k.status)}</span></td><td class="${late(k)?'red':''}">${fd(k.deadline)}</td><td>${fd(k.tgl_tayang)}</td></tr>`).join('')}</table></div></div>`;
  const card=(k,i)=>`<div class="kc" draggable="true" ondragstart="event.dataTransfer.setData('text','${k.konten_id}')" onclick="fKonten('${k.konten_id}')"><div class="row sb">${pc(k.platform)}${late(k)?'<span class="chip bd-r">TERLAMBAT</span>':k.status==='Siap Tayang'?'<span class="chip bd-b">SIAP TAYANG</span>':k.status==='Sudah Tayang'?'<span class="chip bd-s">TAYANG</span>':''}</div><b>${esc(k.judul)}</b><div class="bar"><i style="width:${(i+1)/6*100}%"></i></div><div class="row sb"><small class="${late(k)?'red':''}"><i class="bi bi-calendar-event"></i> ${fd(k.deadline||k.tgl_tayang)}</small>${i<5?`<button class="ib" title="Pindah ke ${TH[i+1]}" onclick="event.stopPropagation();pindah('${k.konten_id}','${TH[i+1]}')"><i class="bi bi-arrow-right-circle"></i></button>`:''}</div></div>`;
  return h+info+`<div class="kan">${TH.map((t,i)=>{const L=K.filter(k=>ti(k)===i);return `<div class="col" ondragover="event.preventDefault()" ondrop="event.preventDefault();pindah(event.dataTransfer.getData('text'),'${t}')"><h4>${t}<span class="chip">${L.length}</span></h4>${L.map(k=>card(k,i)).join('')||'<small>Kosong</small>'}</div>`}).join('')}</div>`;
};
function pindah(id,t){const k=D.konten.find(x=>x.konten_id===id);if(!k||k.tahap===t)return;sv([{t:'Konten',o:{konten_id:id,tahap:t,status:k.status==='Ide'?'Dikerjakan':k.status}}])}
function fKonten(id,pre){
  const k=D.konten.find(x=>x.konten_id===id)||Object.assign({tahap:'Riset',status:'Dikerjakan',platform:pla()[0],tgl_mulai:td()},pre||{}),dt=(n,l,t)=>fld(l,`<input type="${t||'date'}" name="${n}" value="${esc(k[n])}">`);
  mdl(`<h2>${id?'Detail & Edit Konten':'Buat Konten Baru'}</h2><form onsubmit="return svK(event,'${id||''}')" style="margin-top:14px">
  ${fld('Judul Konten *',`<input name="judul" required maxlength="100" value="${esc(k.judul)}">`)}
  <div class="g2">${fld('Platform',sel('platform',pla(),k.platform))}${fld('Kategori',sel('kategori',cat(),k.kategori,1))}${fld('Tahap',sel('tahap',TH,k.tahap))}${fld('Status',sel('status',ST,k.status))}${dt('tgl_mulai','Tanggal Mulai')}${dt('deadline','Deadline')}${dt('tgl_tayang','Rencana Tayang')}${dt('jam_tayang','Jam Tayang (WIB)','time')}</div>
  ${fld('Tautan Publikasi (URL)',`<input name="link_konten" type="url" placeholder="https://" value="${esc(k.link_konten)}">`)}
  ${fld('Catatan / Naskah',`<textarea name="catatan" rows="4" maxlength="2000">${esc(k.catatan)}</textarea>`)}<div class="row" style="margin:-4px 0 14px"><button type="button" class="btn btn-s btn-sm" onclick="aiTulis('naskah',this)"><i class="bi bi-stars"></i> Buat Naskah</button><button type="button" class="btn btn-s btn-sm" onclick="aiTulis('caption',this)"><i class="bi bi-stars"></i> Caption & Hashtag</button></div>
  <div class="ft">${id?`<button type="button" class="btn btn-d" onclick="confirm('Hapus konten beserta data analitiknya?')&&(hp('Konten','${id}'),tutup())">Hapus</button>`:''}<button type="button" class="btn btn-s" onclick="tutup()">Batal</button><button class="btn btn-p">Simpan</button></div></form>`);
}
function svK(e,id){
  e.preventDefault();const o=FD(e.target);if(o.status==='Sudah Tayang'&&!o.tgl_tayang)o.tgl_tayang=td();
  o.status_jadwal=sj(o);if(id)o.konten_id=id;else{o.konten_id=uid();o.dibuat_pada=new Date().toISOString()}
  sv([{t:'Konten',o}]);tutup();toast('Konten disimpan');return false;
}

/* ── Kalender (bulanan) ── */
R.kalender=()=>{
  const y=cal.y,m=cal.m,off=(new Date(y,m,1).getDay()+6)%7,ev={},add=(d,c,t,id)=>{if(d)(ev[d]=ev[d]||[]).push([c,t,id])};
  D.konten.forEach(k=>{add(k.tgl_mulai,'e1','Mulai • '+k.judul,k.konten_id);add(k.deadline,late(k)?'e5':'e2','Deadline • '+k.judul,k.konten_id);add(k.tgl_tayang,k.status==='Sudah Tayang'?'e4':'e3',(k.jam_tayang?k.jam_tayang+' • ':'')+k.judul,k.konten_id)});
  let c=['Sen','Sel','Rab','Kam','Jum','Sab','Min'].map(x=>`<div class="h">${x}</div>`).join('');
  for(let i=0;i<42;i++){const d=new Date(y,m,1-off+i),s=iso(d),L=ev[s]||[];c+=`<div class="d${d.getMonth()!==m?' o':''}${s===td()?' t':''}" onclick="fKonten('',{tgl_tayang:'${s}'})"><b>${d.getDate()}</b>${L.slice(0,3).map(x=>`<a class="ev ${x[0]}" title="${esc(x[1])}" onclick="event.stopPropagation();fKonten('${x[2]}')">${esc(x[1])}</a>`).join('')}${L.length>3?`<small>+${L.length-3} lagi</small>`:''}</div>`}
  const nm=(n)=>{cal.m+=n;if(cal.m<0){cal.m=11;cal.y--}if(cal.m>11){cal.m=0;cal.y++}};window.calNav=n=>{nm(n);draw()};
  return head('Kalender Konten','Atur jadwal produksi, deadline syuting, dan waktu tayang konten terbaik.',`<button class="btn btn-s" onclick="calNav(-1)" aria-label="Bulan sebelumnya"><i class="bi bi-chevron-left"></i></button><b style="min-width:140px;text-align:center;font-size:18px">${new Date(y,m,1).toLocaleDateString('id-ID',{month:'long',year:'numeric'})}</b><button class="btn btn-s" onclick="calNav(1)" aria-label="Bulan berikutnya"><i class="bi bi-chevron-right"></i></button><button class="btn btn-p" onclick="fKonten('',{tgl_tayang:td()})">+ Buat Jadwal Baru</button>`)
  +`<div class="card" style="margin-bottom:20px"><div class="row"><b>Terjadwal: ${D.konten.filter(k=>k.tgl_tayang&&k.status!=='Sudah Tayang').length} konten</b><span class="chip bd-b">Agenda hari ini: ${(ev[td()]||[]).length}</span>${D.konten.some(late)?`<span class="chip bd-r">${D.konten.filter(late).length} terlambat deadline</span>`:''}<span class="sp"></span><span class="ev e1">Pengerjaan</span><span class="ev e2">Deadline</span><span class="ev e3">Siap tayang</span><span class="ev e4">Sudah tayang</span><span class="ev e5">Terlambat</span></div></div><div class="card"><div class="cal">${c}</div></div>`;
};

/* ── Analitik ── */
R.analitik=()=>{
  const since=pa==='semua'?'':ago(Number(pa)),A=D.analitik.filter(a=>!since||a.tgl_catat>=since),L=lat(A);
  const rows=Object.values(L).map(a=>({a,k:D.konten.find(k=>k.konten_id===a.konten_id)})).filter(r=>r.k&&(!qa||(r.k.judul+r.k.platform+r.k.kategori).toLowerCase().includes(qa))).sort((x,y)=>num(y.a.views)-num(x.a.views));
  const sum=f=>rows.reduce((s,r)=>s+f(r.a),0),V=sum(a=>num(a.views)),I=sum(inter);
  const h=head('Analitik Konten','Evaluasi performa engagement, pertumbuhan jangkauan, dan konversi multi-platform.',`<select aria-label="Periode" style="width:auto" onchange="pa=this.value;draw()">${[['7','7 hari'],['30','30 hari'],['90','90 hari'],['semua','Semua']].map(x=>`<option value="${x[0]}"${pa===x[0]?' selected':''}>${x[1]}</option>`).join('')}</select><button class="btn btn-s" onclick="sinkronTT(this)"><i class="bi bi-arrow-repeat"></i> Sinkron dari TikTok</button><button class="btn btn-s" onclick="fInsight(this)"><i class="bi bi-stars"></i> Insight AI</button><button class="btn btn-p" onclick="fCatat()">+ Catat Performa</button>`);
  if(!rows.length&&!qa)return h+`<div class="card empty"><i class="bi bi-bar-chart-line"></i><h3>Belum ada data performa</h3><p>Isi “Tautan Publikasi” TikTok di detail konten, lalu ambil angkanya otomatis. Atau catat manual.</p><div class="row" style="justify-content:center"><button class="btn btn-p" onclick="sinkronTT(this)"><i class="bi bi-arrow-repeat"></i> Sinkron dari TikTok</button><button class="btn btn-s" onclick="fCatat()">+ Catat Manual</button></div></div>`;
  const wk={};A.forEach(a=>{const w=ws(a.tgl_catat);wk[w]=wk[w]||[0,0];wk[w][0]+=num(a.views);wk[w][1]+=inter(a)});const wl=Object.keys(wk).sort().slice(-8);
  const pv={},cv={};rows.forEach(r=>{pv[r.k.platform]=(pv[r.k.platform]||0)+num(r.a.views);const c=r.k.kategori||'Lainnya';cv[c]=(cv[c]||0)+num(r.a.views)});
  ch('aTr',{type:'line',data:{labels:wl.map(fd),datasets:[{label:'Views',data:wl.map(w=>wk[w][0]),borderColor:'#2563EB',backgroundColor:'rgba(37,99,235,.1)',fill:true,tension:.3},{label:'Interaksi',data:wl.map(w=>wk[w][1]),borderColor:'#7C3AED',borderDash:[5,4],tension:.3}]}});
  ch('aPl',{type:'bar',data:{labels:Object.keys(pv),datasets:[{data:Object.values(pv),backgroundColor:Object.keys(pv).map(p=>PC[p]||PC.Lainnya),borderRadius:8}]},options:{plugins:{legend:{display:false}}}});
  ch('aCt',{type:'doughnut',data:{labels:Object.keys(cv),datasets:[{data:Object.values(cv),backgroundColor:['#2563EB','#7C3AED','#F97316','#16A34A','#0891B2','#94A3B8'],borderWidth:0}]},options:{cutout:'65%',plugins:{legend:{position:'right'}}}});
  return h+`<div class="grid k5">${kpi('Total Tayangan',fm(V),rows.length+' konten',1,'eye')}${kpi('Total Interaksi',fm(I),'Likes + komentar + shares + saves',3,'hand-thumbs-up')}${kpi('Shares & Saves',fm(sum(a=>num(a.shares)+num(a.saves))),'Retensi audiens',5,'bookmark')}${kpi('Rata-rata Engagement',V?pct(I/V):'0%','(L+K+S+Sv)/Views',2,'percent')}${kpi('Estimasi Komisi',rp(sum(a=>num(a.komisi))),fm(sum(a=>num(a.klik)))+' klik affiliate',4,'cash-coin')}</div>
  <div class="grid c2"><div class="card"><h3>Tren Views & Interaksi Mingguan</h3><div style="height:260px"><canvas id="aTr"></canvas></div></div><div class="card"><h3>Perbandingan Platform</h3><div style="height:260px"><canvas id="aPl"></canvas></div></div></div>
  <div class="grid c2"><div class="card"><h3>Sebaran Kategori</h3><div style="height:240px"><canvas id="aCt"></canvas></div></div><div class="card"><h3>Peringkat 5 Konten Terbaik</h3>${rows.slice(0,5).map((r,i)=>`<div class="top5"><span class="rk">${i+1}</span><div><b>${esc(r.k.judul)}</b><small>${esc(r.k.platform)} · ${fd(r.k.tgl_tayang)}</small></div><b style="flex:none">${fm(r.a.views)}</b></div>`).join('')}</div></div>
  <div class="card"><div class="row sb"><h3>Data Performa Terperinci</h3><input placeholder="Cari judul, platform, kategori…" value="${esc(qa)}" style="width:260px" onchange="qa=this.value.toLowerCase();draw()"></div><div class="tw" style="margin-top:12px"><table><tr><th>Judul Konten</th><th>Platform</th><th>Dicatat</th><th class="r">Views</th><th class="r">Likes</th><th class="r">Komen</th><th class="r">Shares</th><th class="r">Saves</th><th class="r">ER</th><th></th></tr>${rows.map(r=>`<tr><td><b>${esc(r.k.judul)}</b><br><small>${esc(r.k.kategori)}</small></td><td>${pc(r.k.platform)}</td><td>${fd(r.a.tgl_catat)}</td><td class="r"><b>${fm(r.a.views)}</b></td><td class="r">${fm(r.a.likes)}</td><td class="r">${fm(r.a.komentar)}</td><td class="r">${fm(r.a.shares)}</td><td class="r">${fm(r.a.saves)}</td><td class="r"><span class="chip ${num(r.a.engagement_rate)>=.08?'bd-s':'bd-y'}">${pct(r.a.engagement_rate)}</span></td><td><button class="btn btn-s btn-sm" onclick="fCatat('${r.k.konten_id}')">Catat lagi</button></td></tr>`).join('')}</table></div></div>`;
};
function fCatat(kid){
  const K=D.konten.filter(k=>k.status==='Sudah Tayang'||k.link_konten);if(!K.length)return toast('Isi Tautan Publikasi atau tandai konten “Sudah Tayang” dulu.',1);
  const n=(x,l)=>fld(l,`<input type="number" min="0" step="any" name="${x}" value="0">`);
  mdl(`<h2>Catat Performa</h2><p>Angka performa diinput manual; engagement rate dihitung otomatis.</p><form onsubmit="return svA(event)" style="margin-top:14px"><button type="button" class="btn btn-s btn-sm" style="margin-bottom:14px" onclick="sinkronTT(this,[this.form.konten_id.value])"><i class="bi bi-arrow-repeat"></i> Ambil otomatis dari link TikTok</button>${fld('Konten',`<select name="konten_id">${K.map(k=>`<option value="${k.konten_id}"${k.konten_id===kid?' selected':''}>${esc(k.judul)}</option>`).join('')}</select>`)}${fld('Tanggal Catat',`<input type="date" name="tgl_catat" value="${td()}" required>`)}<div class="g2">${n('views','Views')}${n('likes','Likes')}${n('komentar','Komentar')}${n('shares','Shares')}${n('saves','Saves')}${n('klik','Klik affiliate')}${n('komisi','Komisi (Rp)')}</div><div class="ft"><button type="button" class="btn btn-s" onclick="tutup()">Batal</button><button class="btn btn-p">Simpan</button></div></form>`);
}
function svA(e){e.preventDefault();const o=FD(e.target),ex=D.analitik.find(x=>x.konten_id===o.konten_id&&x.tgl_catat===o.tgl_catat);o.analitik_id=ex?ex.analitik_id:uid();if(!ex)o.dibuat_pada=new Date().toISOString();sv([{t:'Analitik',o}]);tutup();toast('Performa dicatat');return false}

/* ── Pengaturan ── */
R.pengaturan=()=>{
  const p=D.pengaturan,jam=String(p.pengingat_jam_sebelum||'24,3').split(','),pl=pla();
  return head('Pengaturan & Preferensi','Kelola profil, saluran aktif, target ritme mingguan, dan pengingat email.','')
  +`<form onsubmit="return svP(event)"><div class="card" style="margin-bottom:24px"><h3>Profil & Kredensial</h3><div class="g2" style="margin-top:14px">${fld('Nama Tampilan',`<input name="nama" required maxlength="60" value="${esc(D.profil.nama)}">`)}${fld('Email (tetap)',`<input value="${esc(D.profil.email)}" disabled>`)}</div></div>
  <div class="card" style="margin-bottom:24px"><h3>Saluran & Kategori</h3><div class="seg" style="margin:14px 0">${['TikTok','Instagram','YouTube','Facebook','Threads'].map(x=>`<label><input type="checkbox" name="pl" value="${x}"${pl.includes(x)?' checked':''}>${x}</label>`).join('')}</div>${fld('Kategori konten (pisahkan dengan koma)',`<input name="kat" value="${esc(cat().join(', '))}">`)}</div>
  <div class="card" style="margin-bottom:24px"><h3>Target Produksi</h3>${fld('Konten tayang per minggu',`<input type="number" name="target" min="1" max="50" value="${num(D.profil.target_mingguan)||5}" style="max-width:160px">`)}</div>
  <div class="card" style="margin-bottom:24px"><h3>Pengingat Email</h3><label class="seg" style="margin:14px 0"><span style="display:flex;gap:8px;align-items:center"><input type="checkbox" name="pa"${String(p.pengingat_aktif)==='true'?' checked':''}> Kirim pengingat jadwal tayang ke email saya</span></label><div class="seg">${[['24','H-1 sebelum tayang'],['3','3 jam sebelum'],['0.5','30 menit sebelum']].map(x=>`<label><input type="checkbox" name="jam" value="${x[0]}"${jam.includes(x[0])?' checked':''}>${x[1]}</label>`).join('')}</div><p><small>Pengingat dikirim satu kali per jadwal dan berbagi kuota email harian aplikasi.</small></p></div>
  <div class="card" style="margin-bottom:24px"><h3>Integrasi TikTok</h3><p>Hubungkan akun TikTok Anda agar views, likes, komentar, dan shares terisi otomatis dari tautan konten. Izin hanya membaca data video (tanpa posting).</p><div class="row" style="margin-top:10px">${D.profil.tiktok?'<span class="chip bd-s">TERHUBUNG</span><button type="button" class="btn btn-d btn-sm" onclick="putusTT()">Putuskan</button>':'<button type="button" class="btn btn-p" onclick="hubungkanTT(this)">Hubungkan TikTok</button>'}</div></div>
  <div class="ft" style="margin-bottom:24px"><button class="btn btn-p">Simpan Perubahan</button></div></form>
  ${D.profil.role==='admin'?'':`<div class="card" style="border-color:#FCA5A5"><h3 style="color:#991B1B">Zona Berbahaya</h3><p>Menghapus akun akan menghapus seluruh ide, konten, dan data analitik secara permanen.</p><button class="btn btn-d" onclick="hapusAkun()">Hapus Akun Saya…</button></div>`}`;
};
function svP(e){
  e.preventDefault();const f=e.target,o={nama:f.nama.value.trim(),target_mingguan:num(f.target.value)||5,platform_aktif:[...f.querySelectorAll('[name=pl]:checked')].map(x=>x.value).join(','),kategori_konten:f.kat.value.split(',').map(s=>s.trim()).filter(Boolean).join(','),pengingat_aktif:String(f.pa.checked),pengingat_jam_sebelum:[...f.querySelectorAll('[name=jam]:checked')].map(x=>x.value).join(',')};
  Object.assign(D.pengaturan,o);D.profil.nama=o.nama;D.profil.target_mingguan=o.target_mingguan;keep();draw();toast('Pengaturan disimpan');
  Q=Q.then(()=>rpc('simpanPengaturan',T,o).catch(x=>toast(x,1)));return false;
}
function hapusAkun(){const pw=prompt('Masukkan kata sandi untuk menghapus akun secara permanen:');if(pw)rpc('hapusAkun',T,pw).then(()=>{toast('Akun dihapus');keluarLokal()}).catch(x=>toast(x,1))}

/* ── Admin ── */
function loadAdmin(){Promise.all([rpc('adminGetUsers',T),rpc('adminGetStatistik',T)]).then(r=>{AD={u:r[0],s:r[1]};if(pg==='admin')draw()}).catch(x=>toast(x,1))}
R.admin=()=>{
  const h=head('Admin Panel: Manajemen Pengguna','Moderasi akun, pantau statistik, dan kuota email harian.','');if(!AD)return h+'<div class="skel"></div>'.repeat(2);
  const s=AD.s,U=AD.u.filter(u=>!aq||(u.nama+u.email).toLowerCase().includes(aq)),bs={aktif:'bd-s',pending:'bd-y',nonaktif:'bd-g'};
  return h+`<div class="grid k5">${kpi('Total Pengguna',s.total,'Akun terdaftar',1,'people')}${kpi('Aktif 7 Hari',s.aktif7,'Login terakhir',4,'activity')}${kpi('Pendaftar Baru',s.baru7,'7 hari terakhir',3,'person-plus')}${kpi('Kuota Email Hari Ini',s.kuota+'/'+s.batas,'Reset 00:00 UTC',2,'envelope')}</div>
  <div class="card"><div class="row sb"><h3>Direktori Pengguna</h3><input placeholder="Cari nama atau email…" value="${esc(aq)}" style="width:260px" onchange="aq=this.value.toLowerCase();draw()"></div><div class="tw" style="margin-top:12px"><table><tr><th>Pengguna</th><th>Peran</th><th>Status</th><th>Daftar</th><th>Login Terakhir</th><th class="r">Konten</th><th>Tindakan</th></tr>${U.map(u=>`<tr><td><b>${esc(u.nama)}</b><br><small>${esc(u.email)}</small></td><td><span class="chip ${u.role==='admin'?'bd-b':'bd-g'}">${esc(u.role).toUpperCase()}</span></td><td><span class="chip ${bs[u.status]}">${esc(u.status).toUpperCase()}</span></td><td>${fd(String(u.dibuat_pada).slice(0,10))}</td><td>${fd(String(u.login_terakhir).slice(0,10))}</td><td class="r">${u.jumlah_konten}</td><td>${u.role==='admin'?'':`<button class="btn btn-s btn-sm" onclick="admSt('${u.user_id}','${u.status==='aktif'?'nonaktif':'aktif'}')">${u.status==='aktif'?'Nonaktifkan':'Aktifkan'}</button> <button class="btn btn-d btn-sm" onclick="admDel('${u.user_id}')">Hapus</button>`}</td></tr>`).join('')}</table></div></div>`;
};
function admSt(id,st){const u=AD.u.find(x=>x.user_id===id);if(u)u.status=st;draw();rpc('adminUbahStatusUser',T,id,st).catch(x=>{toast(x,1);loadAdmin()})}
function admDel(id){if(!confirm('Hapus akun beserta seluruh datanya? Tindakan ini permanen.'))return;AD.u=AD.u.filter(x=>x.user_id!==id);draw();rpc('adminHapusUser',T,id).then(()=>toast('Pengguna dihapus')).catch(x=>{toast(x,1);loadAdmin()})}

/* ── Gemini AI: otomatis (API key di server) atau manual (salin prompt → gemini.google.com → tempel hasil) ── */
let AIR=[],MH=null;
function ai(jenis,a,btn,onHasil,mdlTarget){
  const t=btn&&btn.innerHTML;if(btn){btn.disabled=true;btn.innerHTML='<i class="bi bi-stars"></i> Memproses…'}
  return rpc('tanyaAI',T,jenis,a).then(r=>{if(r.mode==='manual')aiManual(jenis,r.prompt,onHasil,r.info);else onHasil(r.hasil)})
    .catch(x=>toast(typeof x==='string'?x:'Gagal memproses AI.',1)).finally(()=>{if(btn){btn.disabled=false;btn.innerHTML=t}});
}
const tutup2=()=>{$('#mdl2').hidden=true;$('#mdl2').innerHTML=''};
$('#mdl2').onclick=e=>{if(e.target.id==='mdl2')tutup2()};
function aiManual(jenis,prompt,onHasil,info){
  const paste=jenis!=='insight';MH=onHasil;
  $('#mdl2').innerHTML=`<div class="md" role="dialog" aria-modal="true"><h2>✨ Mode Manual — Gemini</h2>${info?`<p class="red">${esc(info)}</p>`:''}<p><small>Gunakan langganan Gemini Anda: (1) salin prompt, (2) tempel di Gemini, (3) ${paste?'salin jawabannya lalu tempel di kotak bawah, kemudian klik “Gunakan Hasil”.':'baca analisisnya langsung di Gemini.'}</small></p><textarea id="mp" rows="7" readonly style="margin:12px 0">${esc(prompt)}</textarea><button class="btn btn-p" onclick="salinBuka()"><i class="bi bi-clipboard"></i> Salin prompt & buka Gemini</button>${paste?'<label class="f" style="margin-top:16px">Tempel jawaban Gemini di sini<textarea id="mh" rows="6"></textarea></label>':''}<div class="ft"><button class="btn btn-s" onclick="tutup2()">Tutup</button>${paste?'<button class="btn btn-p" onclick="pakaiManual()">Gunakan Hasil</button>':''}</div></div>`;
  $('#mdl2').hidden=false;
}
function salinBuka(){window.open('https://gemini.google.com/app','_blank','noopener');const v=$('#mp').value;
  (navigator.clipboard?navigator.clipboard.writeText(v):Promise.reject()).then(()=>toast('Prompt disalin. Tempel di Gemini (Ctrl+V).')).catch(()=>{$('#mp').select();toast('Tekan Ctrl+C untuk menyalin prompt.',1)})}
function pakaiManual(){const t=$('#mh').value.trim();if(!t)return toast('Tempel jawaban Gemini dulu.',1);try{MH(t);tutup2()}catch(x){toast(typeof x==='string'?x:'Format hasil tidak sesuai.',1)}}
function parseIde(t){const i=t.indexOf('['),k=t.lastIndexOf(']'),bad='Format hasil tidak sesuai. Salin jawaban Gemini yang berisi daftar JSON.';if(i<0||k<i)throw bad;let r;try{r=JSON.parse(t.slice(i,k+1))}catch(e){throw bad}
  if(!Array.isArray(r)||!r.length)throw bad;const c=(v,n)=>String(v==null?'':v).slice(0,n);return r.slice(0,5).map(x=>({judul:c(x.judul,120),topik:c(x.topik,80),hook:c(x.hook,300),konsep_video:c(x.konsep_video,600)}))}
function aiHook(b){const f=b.closest('form');if(!f.judul.value.trim())return toast('Isi judul ide dulu.',1);const p=f.querySelector('[name=pt]:checked');
  ai('hook',{judul:f.judul.value,kategori:f.kategori.value,platform:p?p.value:'',hook:f.hook.value},b,t=>{f.hook.value=t.trim().replace(/^["“]|["”]$/g,'').slice(0,300)})}
function aiTulis(jn,b){const f=b.closest('form');if(!f.judul.value.trim())return toast('Isi judul konten dulu.',1);
  ai(jn,{judul:f.judul.value,platform:f.platform.value,kategori:f.kategori.value,catatan:f.catatan.value},b,t=>{f.catatan.value=((f.catatan.value?f.catatan.value+'\n\n':'')+t.trim()).slice(0,2000);toast('Teks AI ditambahkan. Tinjau sebelum disimpan.')})}
function fAiIde(){mdl(`<h2>✨ Ide Konten dengan AI</h2><p>Didukung Gemini. Hasilnya saran, tinjau dulu sebelum dipakai.</p><form onsubmit="return runAiIde(event)" style="margin-top:14px">${fld('Topik / niche',`<input name="topik" required maxlength="120" placeholder="mis. review gear untuk kreator pemula">`)}<div class="g2">${fld('Platform',sel('platform',pla()))}${fld('Jumlah ide',sel('jumlah',['3','5']))}</div><div class="ft"><button type="button" class="btn btn-s" onclick="tutup()">Tutup</button><button class="btn btn-p"><i class="bi bi-stars"></i> Buat Ide</button></div></form><div id="aiRes"></div>`)}
function runAiIde(e){e.preventDefault();const f=e.target,o=FD(f);ai('ide',o,f.querySelector('.btn-p'),t=>showIde(parseIde(t),o.platform));return false}
function showIde(r,pl){AIR=r.map(x=>Object.assign(x,{platform_tujuan:pl}));
  $('#aiRes').innerHTML=AIR.map((x,i)=>`<div class="card ide" style="margin-top:12px;box-shadow:none"><h3>${esc(x.judul)}</h3><div class="hook">“${esc(x.hook)}”</div><small>${esc(x.konsep_video)}</small><button class="btn btn-s btn-sm" id="sa${i}" onclick="simpanAi(${i})">+ Simpan ke Bank Ide</button></div>`).join('')}
function simpanAi(i){const x=AIR[i],b=$('#sa'+i);sv([{t:'Ide',o:{ide_id:uid(),judul:x.judul,topik:x.topik,hook:x.hook,konsep_video:x.konsep_video,platform_tujuan:x.platform_tujuan,prioritas:'Sedang',status_ide:'Baru',dibuat_pada:new Date().toISOString()}}]);b.disabled=true;b.textContent='Tersimpan ✓'}
function fInsight(b){ai('insight',{},b,t=>mdl(`<h2>✨ Insight AI</h2><p><small>Analisis data performa Anda oleh Gemini. Gunakan sebagai masukan, bukan kepastian.</small></p><div style="white-space:pre-wrap;margin:14px 0">${esc(t).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>')}</div><div class="ft"><button class="btn btn-p" onclick="tutup()">Tutup</button></div>`))}

/* ── TikTok Display API (resmi): hubungkan akun sekali, statistik diambil dari tautan konten ── */
function hubungkanTT(btn){const t=btn&&btn.innerHTML;if(btn){btn.disabled=true;btn.innerHTML='Membuka TikTok…'}
  rpc('tiktokHubungkan',T).then(u=>{location.href=u}).catch(x=>{toast(typeof x==='string'?x:'Gagal.',1);if(btn){btn.disabled=false;btn.innerHTML=t}})}
function putusTT(){if(!confirm('Putuskan koneksi TikTok? Data analitik yang sudah tersimpan tetap ada.'))return;
  rpc('tiktokPutus',T).then(()=>{D.profil.tiktok=false;keep();draw();toast('Koneksi TikTok diputus.')}).catch(x=>toast(x,1))}
function sinkronTT(btn,ids){
  if(!D.profil.tiktok){if(confirm('Akun TikTok belum dihubungkan. Hubungkan sekarang?'))hubungkanTT(null);return}
  const t=btn.innerHTML;btn.disabled=true;btn.innerHTML='<i class="bi bi-arrow-repeat"></i> Mengambil data…';
  rpc('sinkronTikTok',T,ids||null).then(h=>{const ok=h.filter(x=>x.ok).length;toast(ok?ok+' konten diperbarui dari TikTok.':'Tidak ada data yang berhasil diambil.',!ok);
    h.filter(x=>!x.ok).slice(0,3).forEach(x=>toast(String(x.judul).slice(0,28)+': '+x.pesan,1));tutup();return muat()})
   .catch(x=>toast(typeof x==='string'?x:'Gagal sinkron.',1)).finally(()=>{btn.disabled=false;btn.innerHTML=t});
}

/* ── mulai ── */
if(window.Chart)Chart.defaults.font.family="'Plus Jakarta Sans',sans-serif";
if(!T)auth('masuk');else{try{D=JSON.parse(localStorage.getItem('kk_D'))}catch(e){}showApp();muat()}
