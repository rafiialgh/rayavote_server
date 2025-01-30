const express = require('express')
// const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')



module.exports = {
  test: (req, res) => {
    res.status(200).json({
      loh: 'asdasd'
    })
  }
}