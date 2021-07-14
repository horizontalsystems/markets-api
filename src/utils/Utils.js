class Utils {
  static sortByProperty(property) {
    return (a, b) => {
      if (a[property] > b[property]) return 1
      if (a[property] < b[property]) return -1

      return 0
    }
  }

  static sortByPropertyDesc(property) {
    return (a, b) => {
      if (a[property] < b[property]) return 1
      if (a[property] > b[property]) return -1

      return 0
    }
  }
}

export default Utils;
