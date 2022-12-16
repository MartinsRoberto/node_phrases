const { Sequelize } = require('sequelize')

const sequelize = new Sequelize ('phrases', 'root', '123456',{
  host: 'localhost',
  dialect: 'mysql'
})

try{
  sequelize.authenticate()
  console.log('Connected to MySQL!')
}
catch(err){
  console.log('Failed to connect to MySQL.', err)
}

module.exports = sequelize