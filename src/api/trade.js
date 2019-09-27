import request from '@/utils/request'

export const etmTicker = (params) => {
  return request({
    url: 'http://40.114.70.112:2019/api/okex/ticker',
    method: 'get',
    params
  })
}
export const etmRate = (params) => {
  return request({
    url: 'http://40.114.70.112:2019/api/okex/rate',
    method: 'get',
    params
  })
}

export const orderSubmit = (data) => {
  return request({
    url: 'wx/orderetm/submit',
    method: 'post',
    data
  })
}
export const orderCancel = (data) => {
  return request({
    url: 'wx/orderetm/cancel',
    method: 'post',
    data
  })
}

export const orderDetail = (params) => {
  return request({
    url: 'wx/orderetm/detail',
    method: 'get',
    params
  })
}
export const orderPay = (data) => {
  return request({
    url: 'wx/orderetm/pay',
    method: 'post',
    data
  })
}
export const orderList = (params) => {
  return request({
    url: 'wx/orderetm/list',
    method: 'get',
    params
  })
}