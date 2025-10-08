export function generateRandomNumbersSet(qty, min = 0, max = qty + min - 1) {
  if (qty > max - min + 1) {
    console.log(
      "Too few numbers available in range to generate a unique set.  Increasing qty to required minimum."
    );
    qty = max - min + 1;
  }
  const uniqueNumbers = new Set();
  while (uniqueNumbers.size < qty) {
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    uniqueNumbers.add(randomNumber);
  }

  return uniqueNumbers;
}

export function randomShuffleArray(array) {
  return array
    .map((element) => ({ element, randomNumber: Math.random() }))
    .toSorted((a, b) => a.randomNumber - b.randomNumber)
    .map(({ element }) => element);
}

export function createRandomUUID() {
  return Crypto.randomUUID();
}
