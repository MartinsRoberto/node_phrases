const User = require('../model/User')
const Phrase = require('../model/Phrase')
const { Op } = require('sequelize')

module.exports = class PhrasesController{

  static async allPhrases(req, res){
    let search = ''

    if(req.query.search){
      search = req.query.search
    }

    let order = 'DESC'

    if(req.query.order === 'old'){
      order = 'ASC'
    }
    else{
      order = 'DESC'
    }

    const phrasesData = await Phrase.findAll({ 
      include: User,
      where: {
        title: {[Op.like]: `%${search}%`}
      },
      order: [['createdAt', order]]
    })

    const phrases = phrasesData.map( data => data.get({plain: true}))

    let phrasesQty = phrases.length

    if(phrasesQty === 0){
      phrasesQty = false
    }

    res.render('phrases/home', { phrases, search, phrasesQty })
  }

  static add(req, res){
    res.render('phrases/create')
  }

  static async addPost(req, res){
    const title = req.body.title

    if(title.length == '0'){
      req.flash('message', 'A frase não pode estar vazia')
      req.session.save( () => {
        res.redirect('/phrases/add')
      })
      return
    }

    const phrase = {
      title,
      UserId: req.session.userid
    }

    await Phrase.create(phrase)

    try {
      req.flash('message', 'Frase criada com sucesso')
      req.session.save( () => {
        res.redirect('/phrases/dashboard')
      })
    } catch (error) {
      console.log(error)
    }
  }

  static async dashboard(req, res){
    const userId = req.session.userid


    const user = await User.findOne({
      where: { 
        id: userId
      },
      include: Phrase,
      plain: true
    })

    const phrases = user.Phrases.map( (result) => result.dataValues)
    
    res.render('phrases/dashboard', { phrases })
  }

  static async edit(req, res){
    const id = req.params.id

    const phrase = await Phrase.findOne({ where: { id: id}, raw: true})

    res.render('phrases/edit', { phrase })
  }

  static async editPost(req, res){
    const id = req.body.id

    const phrase = {
      title: req.body.title
    }

    try {
      await Phrase.update(phrase, { where: { id: id}})

      req.flash('message', 'Frase editada com sucesso')

      req.session.save( () => {
        res.redirect('/phrases/dashboard')
      })

    } catch (error) {
      console.log(error)
    }
  }

  static async remove(req, res){
    const id = req.params.id

    try {
      await Phrase.destroy({where: { id:id}})

      req.flash('message', 'Frase deletada com sucesso')

      req.session.save( () => {
        res.redirect('/phrases/dashboard')
      })

    } catch (error) {
      console.log(error)
    }
  }
}