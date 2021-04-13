class TimePeriod {
  static get HOUR_1() {
    return { name: '1h', seconds: 3600 };
  }

  static get HOUR_24() {
    return { name: '24h', seconds: 86400 };
  }

  static get DAY_7() {
    return { name: '7d', seconds: 604800 };
  }

  static get DAY_14() {
    return { name: '1h', seconds: 1209600 };
  }

  static get DAY_30() {
    return { name: '1h', seconds: 2592000 };
  }

  static identify(period) {
    if (period === '1h') return TimePeriod.HOUR_1
    if (period === '24h') return TimePeriod.HOUR_24
    if (period === '7d') return TimePeriod.DAY_7
    if (period === '14d') return TimePeriod.DAY_14
    return TimePeriod.DAY_30
  }
}

export default TimePeriod;
