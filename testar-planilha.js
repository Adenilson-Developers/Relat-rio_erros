const GoogleSpreadsheet = require('google-spreadsheet')
const credentials = require('./Bugtracker.json')
//promisify fica dentro do util
const {promisify} = require('util')


const addRowToSheet = async() =>{
    const doc = new GoogleSpreadsheet('1dBr7Z3JNSI-AESFZYLctkRs15sBew-3UheLnqLy_iEM')
    await promisify(doc.useServiceAccountAuth)(credentials)
    console.log('planilha aberta')
    const Info = await promisify(doc.getInfo)()
    const worksheet = Info.worksheets[0]
    await promisify(worksheet.addRow)({ name: 'Adenilson', email: 'adenilson@'})
       
}
addRowToSheet()  

/*
const doc = new GoogleSpreadsheet('1dBr7Z3JNSI-AESFZYLctkRs15sBew-3UheLnqLy_iEM')
doc.useServiceAccountAuth(credentials, (err)=> {
    if(err){
        console.log('nao foi possivel abrir a planilha')
    } else {
        console.log('planilha aberta')
        doc.getInfo((err, info) => {
            const worksheet = info.worksheets[0]
            worksheet.addRow({ name: 'Adenilson', email: 'adenilson@'}, err =>{
                console.log('linha inserida')
            })

        })
    }
})
*/