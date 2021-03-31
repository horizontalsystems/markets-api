import Storage from '../db/Storage'

class MarketsService {
  async getLatestGlobalMarkets() {
    try {
      const marketsData = await Storage.getGlobalMarkets((Math.floor(Date.now() / 1000)) - 86400)

      if (marketsData && marketsData.length > 0) {
        const latest = marketsData.shift()
        const data24 = marketsData.pop()

        return {
          marketCap: latest.marketCap,
          marketCapDefi: latest.marketCapDefi,
          volume24h: latest.volume24h,
          dominanceBTC: latest.dominanceBTC,
          totalValueLocked: latest.totalValueLocked,
          marketCapDiff24h: ((latest.marketCap - data24.marketCap) * 100) / data24.marketCap,
          marketCapDefiDiff24h: ((latest.marketCapDefi - data24.marketCapDefi) * 100) / data24.marketCapDefi,
          dominanceBTCDiff24h: ((latest.dominanceBTC - data24.dominanceBTC) * 100) / data24.dominanceBTC,
          volume24hDiff: ((latest.volume24h - data24.volume24h) * 100) / data24.volume24h,
          totalValueLockedDiff24h: ((latest.totalValueLocked - data24.totalValueLocked) * 100) / data24.totalValueLocked
        }
      }
    } catch (e) {
      console.error(e)
    }

    return {}
  }

  get24hGlobalMarkets() {
    const i24h = (Math.floor(Date.now() / 1000)) - 86400
    return Storage.getGlobalMarkets(i24h)
  }
}

export default MarketsService
