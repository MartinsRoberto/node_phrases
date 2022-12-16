const User = require('../model/User')
const bcrypt = require('bcrypt')

module.exports = class AuthController{

  static login(req, res){
    res.render('auth/login')
  }

  static async loginPost(req, res){
    const { email, password } = req.body 

    // verificando se o usuário existe
    const user = await User.findOne({where: { email: email}})

    if(!user){
      req.flash('message', 'Usuário não encontrado')
      res.render('auth/login')
      return
    }

    // verificando se a senha está correta
    const passwordMatch = bcrypt.compareSync(password, user.password)
    
    if(!passwordMatch){
      req.flash('message', 'Senha inválida')
      res.render('auth/login')
      return
    }

    // salvando o usuário na session
    req.session.userid = user.id

    req.flash('message', 'Logado com sucesso')
    req.session.save( () => {
      res.redirect('/')
    })
  }

  static register(req, res){
    res.render('auth/register')
  }

  static async registerPost(req, res){
    const { name, email, password, confirmpassword } = req.body 

    // verificando se tem algum campo vazio
    if(name == false || email == false || password == false || confirmpassword == false){
      req.flash('message', 'Por favor preencha todos os campos')
      res.render('auth/register')
      return
    }

    // verificando se as senhas são iguais
    if( password != confirmpassword){
      req.flash('message', 'As senhas são diferentes')
      res.render('auth/register')
      return
    }

    // verificando se o email já foi cadastrado
    const checkIfUserExist = await User.findOne({where: { email: email}})

    if(checkIfUserExist){
      req.flash('message', 'Este email já foi cadastrado')
      res.render('auth/register')
      return
    }

    // criptografando a senha

    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password, salt)

    const user = { name, email, password: hashedPassword }

    // salvando o id do usuário na session
    try {
      const createdUser = await User.create(user)

      req.session.userid = createdUser.id
      
      console.log('================')
      console.log(req.session.userid)

      req.flash('message', 'Cadastro realizado com sucesso')
      
      req.session.save( () => {
        res.redirect('/')
      })

    } catch (error) {
      console.log(error)
    }
  }

  static async logout(req, res){
    req.session.destroy()
    res.redirect('/auth/login')
  }
}