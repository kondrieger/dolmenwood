export default defineEventHandler(async () => {
  return { characters: await listCharacters() }
})
