export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') as string
  const ch = await readCharacter(id)
  if (!ch) throw createError({ statusCode: 404, statusMessage: 'Персонаж не найден' })
  return ch
})
