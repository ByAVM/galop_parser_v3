let i = 0

module.exports = {
  setStartIndex: (n = 0) => {
    i = Number(n);
  },
  getVC: () => {
    const num = i + 1000
    i++
    const vc = `Store${num}`

    return vc
  }
}