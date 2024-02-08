
/* VARIABLES */

var main_data = new Object
var today = new Date()
var meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
var semana = ['Dom','Seg','Ter','Qua','Qui','Sex','Sab']

/*  FUNCTIONS  */



/*  DATABASE  */
function queryDB(params,cod){

    const access = main_data.dashboard.data.access == undefined ? '^k^ax^(cybp`wz^lb)^_d`p) ^qs/m%hrg`Pd^!ao^uQ^"TT' : main_data.dashboard.data.access
    const hash = localStorage.getItem('hash') == undefined ? 0 : localStorage.getItem('hash')

    const data = new URLSearchParams()
        data.append("access", access)
        data.append("hash", hash)
        data.append("cod", cod)
        data.append("params", JSON.stringify(params))

    const myRequest = new Request("backend/query_db.php",{
        method : "POST",
        body : data
    });

    return new Promise((resolve,reject) =>{
        fetch(myRequest)
        .then(function (response){
            if (response.status === 200) { 
                resolve(response.text())        
            } else { 
                reject(new Error("Houve algum erro na comunicação com o servidor"));
//                alert('Houve um erro na comunicação com o servidor, favor verificar sua conexão com a internet.')
            } 
        });
    });      
}

function getConfig(field,file='config.json',order='read',value=0){
    const data = new URLSearchParams();        
        data.append("order", order);
        data.append("field", field);
        data.append("value", value);
        data.append("file",file);
    const myRequest = new Request("backend/getConfig.php",{
        method : "POST",
        body : data
    });

    return new Promise((resolve,reject) =>{
        fetch(myRequest)
        .then(function (response){
            if (response.status === 200) {                 
                resolve(response.text());                    
            } else { 
                reject(new Error("Houve algum erro na comunicação com o servidor"));                    
            } 
        });
    }); 
}

function setConfig(user,field,value){
    const data = new URLSearchParams();        
        data.append("user", user);
        data.append("field", field);
        data.append("value", value);
    const myRequest = new Request("backend/setConfig.php",{
        method : "POST",
        body : data
    });

    return new Promise((resolve,reject) =>{
        fetch(myRequest)
        .then(function (response){
            if (response.status === 200) {                 
                resolve(response.text());                    
            } else { 
                reject(new Error("Houve algum erro na comunicação com o servidor"));                    
            } 
        });
    }); 
}

function loadTXT(file='templateNFe.txt'){
        const data = new URLSearchParams();        
            data.append("file",file);
        const myRequest = new Request("backend/getFile.php",{
            method : "POST",
            body : data
        });

        return new Promise((resolve,reject) =>{
            fetch(myRequest)
            .then(function (response){
                if (response.status === 200) {                 
                    resolve(response.text());                    
                } else { 
                    reject(new Error("Houve algum erro na comunicação com o servidor"));                    
                } 
            });
        }); 
}

/*  ABAS */

function pictab(e){
    const tab = e.id
    const content = document.querySelectorAll(".tab");
    for (let i = 0; i < content.length; i++) {
        const sel_tab = document.querySelector('#tab-'+content[i].id)

        if(content[i].id == tab.split('-')[1]){
            content[i].style.display = "block"
//            sel_tab.style.background = "#3F5954";
//            sel_tab.style.color = "#FFF8DC";
            sel_tab.classList.add("check-tab")
        }else{
            content[i].style.display = "none"
            sel_tab.classList.remove("check-tab")
//            sel_tab.style.background = "#00000000";
//            sel_tab.style.color = "#3F5954";
        }
    }
}
 /* CHECK USER MAIL */

    function checkUserMail(){
        const params = new Object;
            params.hash = localStorage.getItem('hash')

        const myPromisse = queryDB(params,'USR-3');
        myPromisse.then((resolve)=>{
            const json = JSON.parse(resolve)[0]
            const unread = json.new_mail
            document.querySelector('#mail-badge').innerHTML = unread!='0' ? unread : ''
        })
    }

 /*  MENU  */ 
function openMenu(){

    var drop = 0
    const data = new URLSearchParams();        
        data.append("hash", localStorage.getItem('hash'));
//        data.append("storage", localStorage.getItem("storage"));

    const myRequest = new Request("backend/openMenu.php",{
        method : "POST",
        body : data
    });

    const myPromisse = new Promise((resolve,reject) =>{
        fetch(myRequest)
        .then(function (response){        
            if (response.status === 200) { 
                document.querySelector('#usr-name').innerHTML = '<span id="mail-badge" class="badge"></span>'+localStorage.getItem('nome').toUpperCase()
                resolve(response.text()); 
                checkUserMail()                  
            } else { 
                reject(new Error("Houve algum erro na comunicação com o servidor"));                    
            } 
        });
    }); 

    myPromisse.then((resolve)=>{
        localStorage.setItem("menu",resolve);
        const menu_data = JSON.parse(resolve)
        const menu = document.querySelector('.menu')
        pushMenu(menu, menu_data)
    });

    function pushMenu(menu, obj){
        menu.innerHTML = ''
        for( let i=0; i<obj.length; i++){
            const li = document.createElement('li') 
            if(obj[i].class.trim().length>0){
                li.classList = obj[i].class
            }           
            const a = document.createElement('a')

            a.href = obj[i].script
            a.innerHTML = obj[i].modulo            
            a.addEventListener('click',()=>{
                main_data.dashboard.data.access = obj[i].access
            })
            if (obj[i].itens.length > 0 ){
                const lbl = document.createElement('label')
                lbl.htmlFor = `drop-${drop}`
                lbl.classList = 'toggle'
                lbl.innerHTML = obj[i].modulo + ' ▸'  
                li.appendChild(lbl)
//                const span = document.createElement("span");
//                span.innerHTML = '▸'
//                span.classList = 'toggle'
//                lbl.after(span)
                li.appendChild(a)

                const ckb = document.createElement('input')
                ckb.type = 'checkbox';
                ckb.id = `drop-${drop}`
                drop++
                li.appendChild(ckb)

                if(obj[i].itens.length > 0){
                    const ul = document.createElement('ul')  
                    for(let j=0; j<obj[i].itens.length; j++){
                        pushMenu(ul,obj[i].itens[j])
                    }                                         
                    li.appendChild(ul)
                }

            }else{
                li.appendChild(a)
            }

            menu.appendChild(li)
        }
    }
}

/*  FILL COMBOS  */

function fillCombo(combo, params, cod, fields, value=''){

    combo = document.getElementById(combo)
    combo.innerHTML = ''
    const myPromisse = queryDB(params,cod);
    myPromisse.then((resolve)=>{
        const json = JSON.parse(resolve)
        for(let i=0; i<json.length; i++){
            const opt = document.createElement('option')
            opt.value = json[i][fields[0]]
            opt.innerHTML = json[i][fields[1]].toUpperCase()
            combo.appendChild(opt)
        }
        if(value != ''){
            combo.value = value
        }
    })

}

function checkMail(){
    const params = new Object;
        params.id_user = localStorage.getItem('id_user')
    const myPromisse = queryDB(params,53)
    myPromisse.then((txt)=>{
        const json = JSON.parse(txt)
        let unread = 0
        for(let i=0; i<json.length; i++){
            unread += parseInt(json[i].nao_lida)
        }     
        document.querySelector('#badge').innerHTML = unread > 0 ? unread : '' 
        document.querySelector('#badge_mobile').innerHTML = unread > 0 ? unread : ''                   
    })
}

/* IMAGE */

function aspect_ratio(img,cvw=300, cvh=300){
    out = [0,0,cvw,cvh]
    w = img.width
    h = img.height
    
    if(w >= h){
        out[3] = cvh/(w/h)
        out[1] = (cvh - out[3]) / 2
    }else{
        out[2] = cvw/(h/w)
        out[0] = (cvw - out[2]) / 2
    }
    return out
}

function showFile(idFile='up_file',idCanvas='cnvImg'){
    const inputFile = document.getElementById(idFile)
    if (inputFile.files && inputFile.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {            
            var ctx = document.getElementById(idCanvas)
            if (ctx.getContext) {
                ctx = ctx.getContext('2d');
                let preview = new Image();
                preview.onload = function () {
                    ar = aspect_ratio(preview)
                    ctx.drawImage(preview, 0, 0,preview.width,preview.height,ar[0],ar[1],ar[2],ar[3]);
                };
                preview.src = e.target.result
            }
        }
        reader.readAsDataURL(inputFile.files[0]);
    }
}

/*

        if (document.querySelector('#up_file').files && document.querySelector('#up_file').files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {

                var ctx = document.getElementById('cnvImg');
                if (ctx.getContext) {

                    ctx = ctx.getContext('2d');
                    let preview = new Image();
                    preview.onload = function () {
                        ar = aspect_ratio(preview)
                        ctx.drawImage(preview, 0, 0,preview.width,preview.height,ar[0],ar[1],ar[2],ar[3]);
                    };

                    preview.src = e.target.result
              
                }

            }

            reader.readAsDataURL(document.querySelector('#up_file').files[0]);
        }

*/


function loadImg(filename, id='#cnvImg') {
    var ctx = document.querySelector(id); 
    try{
        const size = {w:ctx.width, h:ctx.height}
        if (ctx.getContext) {
            ctx = ctx.getContext('2d');
            ctx.clearRect(0, 0, size.w, size.h);
            var img = new Image();
            img.onload = function () {
                ar = aspect_ratio(img)
                ctx.drawImage(img, 0, 0,img.width,img.height,ar[0],ar[1],ar[2],ar[3]);
            };        
            img.src = filename+'?'+new Date().getTime()
        }
    }catch{
        console.error('Imagem não existe!')
    }

}

function uploadImage(fileID,path,filename){

    const up_data = new FormData();        
        up_data.append("up_file",  document.getElementById(fileID).files[0]);
        up_data.append("path", path);
        up_data.append("filename", filename);

    const myRequest = new Request("backend/upload.php",{
        method : "POST",
        body : up_data
    });

    const myPromisse = new Promise((resolve,reject) =>{
        fetch(myRequest)
        .then(function (response){
            if (response.status === 200) { 
                resolve(response.text());             
            } else { 
                reject(new Error("Houve algum erro na comunicação com o servidor"));                    
            } 
        });
    }); 

    return myPromisse
}

function listNF(dir,ext='txt'){

    const data = new URLSearchParams();        
        data.append("dir",'assets/'+dir);
    const myRequest = new Request("backend/lookDir.php",{
        method : "POST",
        body : data
    });
    const myPromisse = new Promise((resolve,reject) =>{
        fetch(myRequest)
        .then(function (response){
            if (response.status === 200) { 
                resolve(response.text());             
            } else { 
                reject(new Error("Houve algum erro na comunicação com o servidor"));                    
            } 
        });
    });        
    myPromisse.then((txt)=>{
        const list = JSON.parse(txt)
        const sel = document.querySelector(`#${ext}Files`)
        sel.innerHTML=''
        for(let i=list.length-1; i>1;  i--){
            sel.innerHTML += `<option value="${list[i]}">${list[i]}</option>`
        }
    })
}

function setLog(line){
    const now = new Date
    line = line.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    const data = new URLSearchParams();        
        data.append("line",line);
        data.append("hash",localStorage.getItem('hash'));
    const myRequest = new Request("backend/setLog.php",{
        method : "POST",
        body : data
    })
    const myPromisse = new Promise((resolve,reject) =>{
        fetch(myRequest)
        .then(function (response){
            if (response.status === 200) { 
                resolve(response.text());             
            } else { 
                reject(new Error("Houve algum erro na comunicação com o servidor"));                    
            } 
        })
    })  
    myPromisse.then((txt)=>{

    })    
}


function logout(){
    if(confirm(`Encerrar login de ${localStorage.getItem('email')}?`)){
        localStorage.clear()
        this.location.reload(true)    
    }
}

/* FRM BUSCA */

function getVal(){
    const sel = document.querySelector('#cmbBusca')
    const field = sel.value
    const signal = sel.options[sel.selectedIndex].getAttribute('signal')
    let value = sel.options[sel.selectedIndex].hasAttribute('val') ? sel.options[sel.selectedIndex].getAttribute('val') : document.querySelector('#edtBusca').value.trim()
        value = signal=='LIKE' ? `'%${value}%'` : signal=='IN' ? `(${value})` : parseInt(value)? value : `${value}`
    return [field,signal,value]
}