export function generateRandomNumbersSet(qty, min = 0, max = qty + min - 1) {
  if (qty > max - min + 1) {
    console.log(
      "Too few numbers available in range to generate a unique set.  Increasing qty to required minimum."
    );
    qty = max - min + 1;
  }
  const uniqueNumbers = new Set();
  while (uniqueNumbers.size < count) {
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    uniqueNumbers.add(randomNumber);
  }
}
