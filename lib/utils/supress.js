const supress = error => {
  if (process.env.NODE_ENV === 'development') {
    console.error(error)
  }
}

module.exports = supress
