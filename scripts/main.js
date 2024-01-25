
/* VARIABLES */

var main_data = new Object
var today = new Date()
var meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
var semana = ['Dom','Seg','Ter','Qua','Qui','Sex','Sab']

/*  FUNCTIONS  */

/*  MODAL  */

function closeModal(id='all'){
    const mod_main = document.querySelector('#myModal')
    if(id=='all'){
        while(mod_main.querySelectorAll('.modal').length > 0){
            mod_main.querySelectorAll('.modal')[0].remove()    
        }
    }else{
        id = (id=='')? mod_main.querySelectorAll('.modal').length-1 : id
        mod_main.querySelector('#modal-'+id).remove()
        delete main_data[id]
    }
    mod_main.style.display = (mod_main.querySelectorAll('.modal').length < 1) ? "none" : 'block'
//    checkMail()
}

function newModal(title, content, pos, id){

    const mod_main = document.querySelector('#myModal')
    const index = mod_main.querySelectorAll('.modal-content').length        
    const offset = 15

    const backModal = document.createElement('div')
        backModal.classList = 'modal'
        backModal.id = 'modal-'+id
        backModal.style.zIndex = 2+index
        backModal.style.display = 'block'

    const mod_card = document.createElement('div')
        mod_card.classList = 'modal-content'
        mod_card.id = 'card-'+id        
        mod_card.style.position = 'absolute'
        mod_card.style.zIndex = 3+index
        mod_card.style.margin = '0 auto'
        mod_card.style.top = pos[1] + 50 + index*offset+'px'
        mod_card.style.left = pos[0] + index*offset+'px'
        mod_card.style.right = pos[0] - index*offset+'px'
    
    const mod_title = document.createElement('div')
    mod_title.className = 'modal-title'    

    const p = document.createElement('p')
    p.innerHTML = title
    mod_title.appendChild(p)

    const span = document.createElement('span')
    span.classList = 'close'
    span.innerHTML = '&times;'
    span.addEventListener('click',()=>{
        closeModal(id)
    })
    mod_title.appendChild(span)
    mod_card.appendChild(mod_title)

    const mod_content = document.createElement('div')
    mod_content.classList = 'modal-text'
    mod_content.innerHTML = content
    mod_card.appendChild(mod_content)


    backModal.appendChild(mod_card)
    mod_main.appendChild(backModal)
    mod_main.style.display = "block"


}

async function openHTML(template,where="content-screen",label="", data="",pos=[30,30]){
    if(template.trim() != ""){
        const page_name = template.split('.')[0]
        return await new Promise((resolve,reject) =>{
            fetch( "templates/"+template)
            .then( stream => stream.text())
            .then( text => {
                const temp = document.createElement('div');
                temp.innerHTML = text;
                let body = temp.getElementsByTagName('template')[0];
                let script = temp.getElementsByTagName('script')[0];

                if(body == undefined){
                    script = ''
                    body = document.createElement('div')
                    body.innerHTML = '<style>p{text-align : center;}</style> <p>Desculpe, este módulo ainda não foi implementado</p>'
                    body.style.color = '#FFFF00 !important'
                    where = 'pop-up'
                    label = 'ERRO 404!'
                }

                if(where == "pop-up"){
                    newModal(label,body.innerHTML,pos,page_name)
                }else{
                    const cont = body.innerHTML.replace('<h1>', `<span id="close-screen" onclick="document.querySelector('#imgLogo').click()">&times;</span><h1>`)
                    
//                    const close = where == 'content-screen' ? `<div id="close-screen"><span onclick="document.querySelector('#imgLogo').click()">&times;</span></div>` : ''
                    document.getElementById(where).innerHTML = cont;                    
                }

                main_data[page_name] = new Object
                main_data[page_name].data = data == "" ? new Object : data
                main_data[page_name].func = new Object

                eval(script.innerHTML);
                resolve = body
                if(localStorage.getItem('hash') != null){
                    document.querySelector('#drop').checked = false // close menu
                }           
            }); 
        }); 
    }
}

/*  DATABASE  */
function queryDB(params,cod){
    const data = new URLSearchParams();        
        data.append("cod", cod);
        data.append("params", JSON.stringify(params));
        data.append("storage", localStorage.getItem("storage"));

    const myRequest = new Request("backend/query_db.php",{
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
//                alert('Houve um erro na comunicação com o servidor, favor verificar sua conexão com a internet.')
            } 
        });
    });      
}

function NFeConf(dados='',file='NFe.json'){
    const data = new URLSearchParams();
    if(dados == ''){
        data.append("data", dados);
        data.append("file", file);
    }else{
        data.append("data", JSON.stringify(dados));
        data.append("file", file);
    }        

    const myRequest = new Request("backend/setFile.php",{
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
                document.querySelector('#usr-name').innerHTML = '<span id="badge" class="badge"></span> '+localStorage.getItem('username').toUpperCase()
                resolve(response.text()); 
//                checkMail()                   
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
        setBarStyle()
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

function loadImg(filename, id='cnvImg') {

    var ctx = document.getElementById(id);
    if (ctx.getContext) {

        ctx = ctx.getContext('2d');
        var img = new Image();
        img.onload = function () {
            ar = aspect_ratio(img)
            ctx.drawImage(img, 0, 0,img.width,img.height,ar[0],ar[1],ar[2],ar[3]);
        };

        img.src = './'+filename;
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
    line = `${now.getFullDate()} ${localStorage.getItem('username')} -> ` + line.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    const data = new URLSearchParams();        
        data.append("line",line);
        data.append("db",localStorage.getItem('db'));
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

function setBarStyle(){

        getConfig(localStorage.getItem('username'),'config.json').then((txt)=>{
            try{

                const json = JSON.parse(txt)

                document.body.style.setProperty('-top-bar', json.bar_back_color)
                document.body.style.setProperty('-top-bar-font', json.bar_font_color)
                document.body.style.setProperty('--top-bar-hover', json.bar_mouse_color)
                document.body.style.setProperty('--win-back', json.win_back_color);
                document.body.style.setProperty('--win-font', json.win_font_color);
                
                document.querySelector('nav').style.backgroundColor = json.bar_back_color
                document.querySelector('#usr-name').style.color = json.bar_font_color

                                
                main_data.dashboard.data.bar_back_color = json.bar_back_color
                main_data.dashboard.data.bar_font_color = json.bar_font_color
                main_data.dashboard.data.bar_mouse_color = json.bar_mouse_color
                main_data.dashboard.data.win_back_color = json.win_back_color
                main_data.dashboard.data.win_font_color = json.win_font_color

                const ulli = document.querySelectorAll('nav ul li ul li') 
                for(let i=0; i<ulli.length; i++){
                    ulli[i].style.backgroundColor = json.bar_back_color            
                }
                const a = document.querySelectorAll('nav a')
                for(let i=0; i<a.length; i++){
                    a[i].style.color = json.bar_font_color
                }
            } catch {
                return
            }
    
        })
    


}