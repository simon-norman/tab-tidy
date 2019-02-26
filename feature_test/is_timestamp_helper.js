module.exports = (timestamp) => {
  const date = new Date(timestamp)

  return date.getTime() > 0
}
