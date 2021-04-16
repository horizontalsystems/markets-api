class CyrptoNewsProvider {
  constructor(cryptoCompareProvider) {
    this.cryptoCompareProvider = cryptoCompareProvider
  }

  async getLatestNews() {
    const responses = await this.cryptoCompareProvider.getLatestNews()
    return responses.map(resp => ({
      timestamp: resp.published_on,
      guid: resp.guid,
      title: resp.title,
      body: resp.body,
      url: resp.url,
      source: resp.source_info.name
    }))
  }
}

export default CyrptoNewsProvider
