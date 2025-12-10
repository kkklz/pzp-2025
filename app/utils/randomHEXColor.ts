export default function getRandomHexColor(): string {
  // Generujemy losową liczbę całkowitą od 0 do 16777215 (czyli 0xFFFFFF)
  const randomColor = Math.floor(Math.random() * 16777215)

  // Zamieniamy liczbę na system szesnastkowy (hex)
  const hexString = randomColor.toString(16)

  // Dodajemy "pad", czyli zera wiodące, aby zawsze mieć 6 znaków (np. 0000FF zamiast FF)
  const paddedHexString = hexString.padStart(6, '0')

  return `#${paddedHexString.toUpperCase()}`
}
