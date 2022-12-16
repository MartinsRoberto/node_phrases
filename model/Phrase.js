const { DataTypes } = require('sequelize')
const db = require('../db/conn')
const User = require('./User')

const Phrase = db.define('Phrase', {
  title:{
    type: DataTypes.STRING
  }
})

Phrase.belongsTo(User)
User.hasMany(Phrase)

module.exports = Phrase