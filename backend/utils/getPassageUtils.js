/**
 * This function will return array of words which match with expected passage words
 * If expected word is present in output array of words return by executing this function
 * then we will mark that word in green in expected passage else it will be marked in red
 * @param {Expected Passage} wordsFromPassage | Array of string
 * @param {User Input} typedWords | Array of string
 * @returns string
 */
export const getCorrectWordsFromPassage = (wordsFromPassage, typedWords) => {
  const m = wordsFromPassage.length;
  const n = typedWords.length;

  // Create a 2D array to store the lengths of LCS
  const dp = [];
  for (let i = 0; i <= m; i++) {
    dp[i] = new Array(n + 1).fill(0);
  }

  // Build the dp array in bottom-up manner
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (wordsFromPassage[i - 1] === typedWords[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Reconstruct the correctWords
  let i = m;
  let j = n;
  const correctWords = [];
  while (i > 0 && j > 0) {
    if (wordsFromPassage[i - 1] === typedWords[j - 1]) {
      correctWords.unshift(wordsFromPassage[i - 1]);
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  return correctWords;
};

export const getCompleteWordDetails = ({
  correctWordsInSequence,
  expectedWords,
  typedWords,
}) => {
  let expectedWordsIndex = 0;
  let typedWordIndex = 0;

  //indices of correct words in question passage to highlight in green
  const correctWordsIndicesInPassage = [];

  const correctWordIndicesFromTypedWords = [];

  // Iterate through both arrays
  while (
    typedWordIndex < correctWordsInSequence.length &&
    expectedWordsIndex < expectedWords.length
  ) {
    const currentExpectedWord = expectedWords[expectedWordsIndex];
    const currentCorrectWord = correctWordsInSequence[typedWordIndex];
    // If the words match, move to the next word in both arrays
    if (currentExpectedWord === currentCorrectWord) {
      correctWordsIndicesInPassage.push(expectedWordsIndex);
      typedWordIndex += 1;
    } else if (!expectedWords.includes(currentCorrectWord)) {
      // If the words from correctWordsInSequence is not present in expectedWords, move to the next word in correctWordsInSequence
      typedWordIndex += 1;
    }
    expectedWordsIndex += 1;
  }

  expectedWordsIndex = 0;
  typedWordIndex = 0;

  // Iterate through both arrays
  while (
    typedWordIndex < typedWords.length &&
    expectedWordsIndex < correctWordsInSequence.length
  ) {
    const currentExpectedWord = correctWordsInSequence[expectedWordsIndex];
    const currentWord = typedWords[typedWordIndex];
    // If the words match, move to the next word in both arrays
    if (currentExpectedWord === currentWord) {
      correctWordIndicesFromTypedWords.push(typedWordIndex);
      expectedWordsIndex += 1;
    }
    typedWordIndex += 1;
  }

  return {
    correctWordIndicesFromTypedWords,
    correctWordsIndicesInPassage,
  };
};

export const getUserResults = ({ expectedWords, typedWords }) => {
  const correctWordsInSequence = getCorrectWordsFromPassage(
    expectedWords,
    typedWords
  );

  const { correctWordIndicesFromTypedWords, correctWordsIndicesInPassage } =
    getCompleteWordDetails({
      correctWordsInSequence,
      expectedWords,
      typedWords,
    });

  let totalExpectedWords = expectedWords.length;
  const totalTypedWords = typedWords.length;
  let totalCorrectWords = correctWordsIndicesInPassage.length;

  const lastCorrectWordIndexFromTypedWordsIndex =
    correctWordIndicesFromTypedWords[
      correctWordIndicesFromTypedWords.length - 1
    ] || -1;

  let totalSkippedOrIncorrectWords = totalExpectedWords;

  let extraIncorrectWordsTyped = 0;

  if (totalCorrectWords > 2) {
    const secondLastCorrectWordIndex =
      correctWordsIndicesInPassage[totalCorrectWords - 2];

    const lastCorrectWordIndex =
      correctWordsIndicesInPassage[totalCorrectWords - 1];

    const skippedWordsBetweenLast2Words = Math.abs(
      lastCorrectWordIndex - secondLastCorrectWordIndex
    );

    if (skippedWordsBetweenLast2Words < 10) {
      totalSkippedOrIncorrectWords =
        totalExpectedWords - (lastCorrectWordIndex + 1);
    } else {
      totalSkippedOrIncorrectWords =
        totalExpectedWords - (secondLastCorrectWordIndex + 1);
      totalCorrectWords -= 1;
    }
  } else {
    totalExpectedWords += totalCorrectWords;
  }

  if (lastCorrectWordIndexFromTypedWordsIndex != -1) {
    extraIncorrectWordsTyped =
      totalTypedWords - (lastCorrectWordIndexFromTypedWordsIndex + 1);
  }

  const totalErrorCount =
    totalExpectedWords +
    extraIncorrectWordsTyped -
    (totalSkippedOrIncorrectWords + totalCorrectWords);

  const accuracy =
    (totalCorrectWords / (totalCorrectWords + totalErrorCount)) * 100;

  return {
    totalErrorCount,
    totalCorrectWords,
    totalTypedWords,
    accuracy,
    correctWordIndices: correctWordsIndicesInPassage,
  };
};
