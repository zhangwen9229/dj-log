
// eslint-disable-next-line no-extend-native
Object.defineProperty(String.prototype, 'hashCode', {
  value: function () {
    var hash = 0; var i; var chr
    for (i = 0; i < this.length; i++) {
      chr = this.charCodeAt(i)
      hash = ((hash << 5) - hash) + chr
      hash |= 0 // Convert to 32bit integer
    }
    return hash
  }
})

var ss = 'Users/zhangws/company/h5/pdj_static_cdn/daojia/react/js/vendors4-Index~activityPage~storeHome~discovery~DiscoverySearchResult~cart~searchResult~channel~storeSearchResult~IndexSearch~goodsdetial~promotionPage~storeActivityPage~makeUpGoods~PieceCartTogetherResult~thirdCateSelect~StoreSearch~orderList~orderdetail~GoodsIngredients~PurchTickets~PieceTogether~PieceSearchResult~Combination~SearchResultOrderList~ChannelSkuPage~AfterSalesMode~AfterSalesDetail~AfterSalesApply~OrderListUnComment~SettlePrescription~SettlePrescriptionEditHome~GiftCardList~SettlementDiscounts~Thousand-immutable.es.js.21dce5e8.chunk.js'

console.log(ss.hashCode())
