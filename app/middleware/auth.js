const jwt = require('jsonwebtoken')
const config = require('../../config')
const Company = require('../company/model')

module.exports = {
  isLoginCompany: async (req, res, next) => {
    try {
      const token = req.headers.authorization.replace('Bearer ', '')

      if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
      }

      const data = jwt.verify(token, config.jwtKey)
      const company = await Company.findOne({ _id: data.company.id })

      if(!company){
        throw new Error()
      }

      req.company = company
      // console.log("🚀 ~ isLoginCompany: ~ req.company:", req.company)
      req.token = token
      // console.log("🚀 ~ isLoginCompany: ~ req.token:", req.token)
      next()
    } catch (err) {
      res.status(401).json({
        error: 'Not authorized to access this resource'
      })
    }
  }
}