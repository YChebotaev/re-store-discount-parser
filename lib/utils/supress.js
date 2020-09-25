const supress = error => {
  if (process.env.SHOW_SUPPRESSED_ERRORS) {
    console.error(error)
  }
}

module.exports = supress
