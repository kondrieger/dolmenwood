/* Деньги Дольменвуда — Player's Book, стр. 117.

   1 зм (золотая) = 10 см (серебряных) = 100 мм (медных).
   Пеллюцидий, «фейское серебро», = 5 зм = 50 см = 500 мм.

   Внутри всё считается в медяках целыми числами: половина товаров с рынка
   стоит меньше золотого, а дроби от золота дают ошибки округления. */

export const CP_PER_GP = 100
export const CP_PER_SP = 10
export const CP_PER_PP = 500

/** Цена предмета в медяках: у новых товаров есть cp, у старых — cost в золотых. */
export function priceCp(item) {
  if (!item) return null
  if (typeof item.cp === 'number') return item.cp
  if (typeof item.cost === 'number') return item.cost * CP_PER_GP
  return null
}

/**
 * Цена словами: «5 зм», «3 см», «9 мм», «1 зм 5 см».
 * Показываем в самой крупной монете, в которой цена выражается ровно,
 * чтобы «2 см» не превращались в «0,2 зм».
 */
export function formatPrice(cp) {
  if (cp == null) return '—'
  if (cp === 0) return 'даром'
  const gp = Math.floor(cp / CP_PER_GP)
  const sp = Math.floor((cp % CP_PER_GP) / CP_PER_SP)
  const rest = cp % CP_PER_SP
  const parts = []
  if (gp) parts.push(gp + ' зм')
  if (sp) parts.push(sp + ' см')
  if (rest) parts.push(rest + ' мм')
  return parts.join(' ')
}

/** Цена предмета сразу словами. */
export function itemPrice(item) {
  return formatPrice(priceCp(item))
}

/** Вес словами: в книге он в монетах, 10 монет = 1 фунт. null — веса в книге нет. */
export function formatWeight(weight) {
  return weight == null ? '—' : String(weight)
}
