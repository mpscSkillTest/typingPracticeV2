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

  // index of last correct word from question passage to count skipped words
  let lastCorrectWordIndexFromPassage = -1;

  // index of last correct word from typed words passage to count incorrect words after last correct words
  let lastCorrectWordIndexFromTypedWords = -1;

  const totalCorrectWordsInSequence = correctWordsInSequence.length;
  const totalWordsFromPassage = expectedWords.length;

  const lastCorrectWord =
    correctWordsInSequence[totalCorrectWordsInSequence - 1];

  // Iterate through both arrays
  while (
    typedWordIndex < totalCorrectWordsInSequence &&
    expectedWordsIndex < totalWordsFromPassage
  ) {
    const currentExpectedWord = expectedWords[expectedWordsIndex];
    const currentCorrectWord = correctWordsInSequence[typedWordIndex];
    // If the words match, move to the next word in both arrays
    if (currentExpectedWord === currentCorrectWord) {
      lastCorrectWordIndexFromPassage = expectedWordsIndex;
      correctWordsIndicesInPassage.push(expectedWordsIndex);
      typedWordIndex += 1;
    } else if (!expectedWords.includes(currentCorrectWord)) {
      // If the words from correctWordsInSequence is not present in expectedWords, move to the next word in correctWordsInSequence
      typedWordIndex += 1;
    }
    expectedWordsIndex += 1;
  }

  if (lastCorrectWord) {
    for (
      let index = 0;
      index < typedWords.length && index <= lastCorrectWordIndexFromPassage;
      index += 1
    ) {
      if (typedWords[index] === lastCorrectWord) {
        lastCorrectWordIndexFromTypedWords = index;
      }
    }
  }

  return {
    lastCorrectWordIndexFromPassage,
    lastCorrectWordIndexFromTypedWords,
    correctWordsIndicesInPassage,
  };
};

export const getUserResults = ({ expectedWords, typedWords }) => {
  const correctWordsInSequence = getCorrectWordsFromPassage(
    expectedWords,
    typedWords
  );

  const {
    lastCorrectWordIndexFromPassage,
    lastCorrectWordIndexFromTypedWords,
    correctWordsIndicesInPassage,
  } = getCompleteWordDetails({
    correctWordsInSequence,
    expectedWords,
    typedWords,
  });

  const totalExpectedWords = expectedWords.length;
  const totalTypedWords = typedWords.length;

  const totalPendingWords =
    totalExpectedWords - (lastCorrectWordIndexFromPassage + 1);

  const totalCorrectWords = correctWordsIndicesInPassage.length || 0;

  const extraIncorrectWordsTyped =
    totalTypedWords - (lastCorrectWordIndexFromTypedWords + 1);

  const totalErrorCount =
    totalExpectedWords +
    extraIncorrectWordsTyped -
    (totalPendingWords + totalCorrectWords);

  const accuracy =
    (totalCorrectWords / (totalCorrectWords + totalErrorCount)) * 100;

  return {
    totalErrorCount,
    totalCorrectWords,
    totalPendingWords,
    totalTypedWords,
    accuracy,
    correctWordIndices: correctWordsIndicesInPassage,
  };
};
