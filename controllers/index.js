/* eslint-disable prettier/prettier */
const index = (req, res) => {
  res.status(200).json({
    status: 'Success',
    message: 'Welcome to WorkGate API'
  })
}

module.exports = index;