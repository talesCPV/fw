/*  IMPORTS  */




/*  VARIABLES  */

var doc = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4'
}) 

var txt = new Object
    txt.lineHeigth = 5
    txt.x = 10
    txt.y = 10
    txt.page = 1
    txt.width = doc.internal.pageSize.getWidth() - txt.x
    txt.text
    txt.dim = [90,80] 

var imgData = new Image()
    imgData.src = 'assets/logo.png'

/* FUNCTIONS */

function addPage(Y=46){
    doc.addPage();
    frame()
    header_pdf()    
    txt.y = Y 
}

function getBarcode(N, pos=[txt.dim[0]-41,txt.dim[1]-30, 36, 25] ){
    const bar = newBarcode(N,70)    
    const image = new Image();
    image.src = bar.toDataURL();
    doc.addImage(image, 'png', pos[0],pos[1],pos[2],pos[3]);
}

function clearTxt(y=10,x=10,dim=[90,80]){
    txt = new Object
        txt.lineHeigth = 5
        txt.x = x
        txt.y = y
        txt.page = 1
        txt.width = doc.internal.pageSize.getWidth() - txt.x
        txt.text = ''
        txt.dim = dim 

}

function frame(margin=5){
    doc.rect(margin,margin,txt.dim[0]-margin*2,txt.dim[1]-margin*2)
}

function line(p, direct='h',margin=5, end=margin){

    if(direct == 'h'){
        doc.line(margin,p,txt.dim[0]-end,p)
    }else{
        doc.line(p,margin,p,txt.dim[1]-end)
    }

}

function logo(pos = [14,7,36,25]){
    doc.addImage(imgData, 'png', pos[0], pos[1], pos[2], pos[3]);
}

function addLine(N=1, botton=0, top=46){
    txt.y += txt.lineHeigth * N
    if(txt.y >= doc.internal.pageSize.getHeight() - botton){
        addPage(top)
        return false
    }
    return true
}

function backLine(N=1, botton=0, top=46){
    txt.y -= txt.lineHeigth * N
    return true
}

function box(text,x,y,w,lh=0.8){
    const h = txt.lineHeigth * lh   
    text = text.trim().split('\n')
    for(let i=0; i<text.length; i++){
        const txt = text[i].trim().split(' ')
        let lin = ''
        for(let j=0; j<txt.length; j++){
            if(doc.getTextDimensions(lin+txt[j]+' ').w < w ){
                lin +=  txt[j] + ' '
            }else{
                doc.text(lin.trim(),x,y);
                y += h
                lin =  txt[j] + ' '
                addLine()
            }

        }
        lin.trim() != '' ? doc.text(lin,x,y): '';
        y += h
        addLine()
    }    
}

function center_text(T='',box=[0,doc.internal.pageSize.getWidth()]){
    const text = T==''? txt.text : T
    const w = doc.getTextDimensions(T).w
    const xOffset = (box[1] - box[0] - w) /2;  
    doc.text(T, box[0] + xOffset, txt.y);
    addLine()
}

function right_text(T='',margin=0, pos=doc.internal.pageSize.getWidth()){
    const text = T==''? txt.text : T
    const w = doc.getTextDimensions(T).w
    const xOffset = pos - margin - w 
    doc.text(T, xOffset, txt.y);
}

function block_text(T=''){
    const text = T==''? txt.text.split(' ') : T.split(' ')
    let line = ''

    function print(){

        if(line.length > 0){
            doc.text(line.trim(), txt.x, txt.y);
        }
        addLine()
        line = ''
        if (txt.y >= txt.dim[1]){
            addPage(46)
        }                
    }

    for(let i=0; i< text.length; i++){

        if(text[i].includes('\n')){
            line = line.trim() + ' ' + text[i].trim()
            print()
        }else if(text[i] != ''){
            line = line.trim() + ' ' + text[i].trim()
        }

        length = line.length * (doc.internal.getFontSize() / 4.6)
        if(length > txt.width){
            print()
        }                
    }
    print()
}

function header_pdf(lin_h = 5, font_size = 20){
    const ini_y = txt.y
    logo([14,15,45,10])
    //  CABEÇALHO
    doc.setFontSize(font_size)
    doc.setFont(undefined, 'bold')
    txt.y = 20
    center_text('CALDEIRÃO SUCATAS',[35,200])
    txt.y = ini_y
}


/*  RELATORIES  */

function print_etq(data){
    
    doc = new jsPDF()  
    const x_ = 60

    clearTxt()
//    frame()

    doc.rect(x_+5,5,txt.dim[0]-5*2,txt.dim[1]-5*2)
    doc.line(x_+5,23,x_+txt.dim[0]-5,23)
    doc.line(x_+5,45,x_+txt.dim[0]-5,45)

    getBarcode(data.cod.padStart(13,'0'),[x_+25,52,40,15])
    logo([x_+30,10,30,10])

    doc.setFontSize(8)
    doc.setFont(undefined, 'bold')
    doc.text(data.descricao, x_+6,30);
    doc.text('Forn.:', x_+6,35);
    doc.text('Cod.:', x_+6,40);
    doc.text('Cod. Orig:', x_+40,40);

    doc.setFont(undefined,'normal')
    doc.text(data.nome.toUpperCase(), x_+15,35);
    doc.text(data.cod.padStart(13,'0') , x_+15,40);
    doc.text(data.cod_cli.padStart(13,'0') , x_+55,40);

    doc.save('etiqueta.pdf')
}

function print_compra(data){

    jsPDF.autoTableSetDefaults({
        headStyles: { fillColor: [37, 68, 65] },
    })

    const now = new Date()
    let tbl_body = []
    let total = 0
    let outfile = `Viagem_${data.id.padStart(6,'0')}.pdf`
    for(let i=0; i<data.itens.length; i++){
        if(Math.round(parseFloat(data.itens[i].qtd))>0){
            if(data.callby == 'viewLocal'){
                tbl_body.push([data.itens[i].nome,data.itens[i].und, data.itens[i].qtd_tot ,viewMoneyBR(parseFloat(data.itens[i].val_unit).toFixed(2)),viewMoneyBR(data.itens[i].total)])
            }else{
                tbl_body.push([data.itens[i].nome,data.itens[i].und, data.itens[i].qtd,viewMoneyBR(parseFloat(data.itens[i].val_unit).toFixed(2)),viewMoneyBR(data.itens[i].total)])
            }
        }
        total += parseFloat(data.itens[i].total)
    }
    tbl_body.push(['','','','TOTAL',viewMoneyBR(total.toFixed(2))])

    doc = new jsPDF()

    const x_ = 60
    clearTxt()    
    header_pdf()

    txt.y = 40

    doc.setFontSize(12)
    doc.setFont(undefined, 'bold')

    doc.setFontSize(10)
//    doc.setFont(undefined, 'NORMAL')
    if(data.callby == 'viewLocal'){
        doc.text('Relatório de Estoque - '+ now.getFormatBR() +' as '+now.getFullTime() , 10,50);
        if(data.local == 'FIXO'){
            doc.text('Local: '+data.modelo, 10,55);
            doc.text('Peso Total Estimado: '+data.peso, 10,60);
            txt.y = 70
    
        }else{
            doc.text('Veículo: '+data.modelo, 10,55);
            doc.text('Tipo: '+ data.tipo , 10,60);
            doc.text('Placa: '+data.placa, 10,65);
            doc.text('Peso Total Estimado: '+data.peso, 10,70);
            txt.y = 80
        }

    }else{
        txt.y = 35
/*        doc.setFontSize(15)
        doc.setTextColor(255,0,0);
        center_text('NÃO VALE COMO RECIBO')
*/      doc.setFontSize(12)
        doc.setTextColor(0);

        if(data.callby == 'viewComp_detal'){
            doc.text('Compra: '+ data.id.padStart(6,'0') , 10,35);
            doc.text('Data: '+ data.saida , 10,40);
            outfile = `Boleta_CP_${data.id.padStart(6,'0')}.pdf`
        }else{
            doc.text('Venda: '+ data.id.padStart(6,'0')+' realizada dia '+data.saida, 10,35);
            doc.text('Data: '+ data.saida , 10,40);
            outfile = `Boleta_VD_${data.id.padStart(6,'0')}.pdf`
        }
        doc.text('Cliente: '+ data.nome, 10,45);       
        txt.y = 60
    }    

    
    doc.autoTable({
        head: [["Discriminação",'Und.','Qtd.',"Valor Unit.","Total"]],
        body: tbl_body,
        startY: txt.y      
    });
    
    txt.y = doc.previousAutoTable.finalY + 10


    if(data.callby == 'viewComp_detal'){
        doc.setFontSize(15)
        doc.setTextColor(255,0,0);
        center_text('NÃO VALE COMO RECIBO')
    }

    doc.save(outfile)
}

