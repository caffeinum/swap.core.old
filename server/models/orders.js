let _order

const currentOrder = (order) => _order = order
const clearCurrentOrder = () => _order = null

module.exports = { currentOrder, clearCurrentOrder }
