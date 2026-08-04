export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') as string
  const ok = await deleteCharacter(id)
  if (!ok) throw createError({ statusCode: 404, statusMessage: 'Персонаж не найден' })
  return { ok: true }
})
