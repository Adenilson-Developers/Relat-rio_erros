    const express = require('express')
    const app = express()
    const path = require('path')
    const bodyParser = require ('body-parser')
    const {promisify} = require('util')
    const sgMail = require('@sendgrid/mail');



    const GoogleSpreadsheet = require('google-spreadsheet')
    const credentials = require('./Bugtracker.json')


    // configuraçoes
    const docId = '1dBr7Z3JNSI-AESFZYLctkRs15sBew-3UheLnqLy_iEM'
    const worksheetIndex = 0
    const SendGridKey = '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'

    app.set('view engine', 'ejs')
    app.set('views', path.resolve(__dirname, 'views'))

    app.use(bodyParser.urlencoded({ extended: true}))

    app.get('/', (request, response) =>{
        response.render('home')
    })

    app.post('/', async(request, response)=>{
        try{
    const doc = new GoogleSpreadsheet(docId)
    await promisify(doc.useServiceAccountAuth)(credentials)
    const Info = await promisify(doc.getInfo)()
    const worksheet = Info.worksheets[worksheetIndex]
    await promisify(worksheet.addRow)({
        name: request.body.name,
        email: request.body.email,
        userAgent: request.body.userAgent,
        userDate: request.body.userDate,
        issueType: request.body.issueType,
        source: request.query.source || 'direct'
        })
        // se for critico
    if (request.body.issueType === 'CRITICAL'){
    sgMail.setApiKey(SendGridKey)
    const msg = {
    to: 'adenilson.developers@gmail.com',
    from: 'adenilson.developers@gmail.com',
    subject: 'BUG Critico reportado',
    text: 
    `O usuário ${request.body.name} reportou um problema`
    ,
    html: ` O usuário ${request.body.name} reportou um problema`,
        }
        await sgMail.send(msg)
    }
// response.render para voltar para o vormulario novamente
// porem n esta respondendo de forma desejada.
    response.send('Sucesso!')
    }catch (err) {
        response.send('erro ao enviar formulario.')
        console.log(err)
    }

    /*
    const doc = new GoogleSpreadsheet(docId)
    doc.useServiceAccountAuth(credentials, (err)=> {
        if(err){
            console.log('nao foi possivel abrir a planilha')
        } else {
            console.log('planilha aberta')
            doc.getInfo((err, info) => {
                const worksheet = info.worksheets[worksheetIndex]
                worksheet.addRow({ name: request.body.name , email: request.body.email }, err =>{
                    response.send('bug reportado com sucesso !')
                })

            })
        }
    })
    */
    })
    app.listen(3000, (err) =>{
        if (err){
            console.log('Aconteceu um erro', err)
        }else{
            console.log('bugtracker rodando na porta http://locahost:300')
        }
    })
