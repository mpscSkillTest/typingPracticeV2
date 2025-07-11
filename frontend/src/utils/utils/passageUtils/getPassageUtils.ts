/**
 * This function will return array of words which match with expected passage words
 * If expected word is present in output array of words return by executing this function
 * then we will mark that word in green in expected passage else it will be marked in red
 * @param {Expected Passage} wordsFromPassage | Array of string
 * @param {User Input} typedWords | Array of string
 * @returns string
 */
export const getCorrectWordsFromPassage = (
	wordsFromPassage: string[],
	typedWords: string[]
) => {
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

export const getHighlightIndexesForLesson = (
	questionPassage: string,
	answerPassage: string
) => {
	const questionWords = questionPassage.trim().split(/\s+/)?.filter(Boolean);
	const answerWords = answerPassage?.trim?.().split?.(/\s+/)?.filter(Boolean);

	const correctIndices = [];
	const wrongIndices = [];
	const untouchedIndices = [];

	for (let i = 0; i < questionWords.length; i++) {
		const qWord = questionWords[i];
		const aWord = answerWords[i];

		if (!aWord) {
			untouchedIndices.push(i);
		} else if (qWord === aWord) {
			correctIndices.push(i);
		} else {
			wrongIndices.push(i);
		}
	}

	return {
		correctIndices,
		wrongIndices,
		untouchedIndices,
	};
};

export const getCompleteWordDetails = ({
	correctWordsInSequence,
	expectedWords,
	typedWords,
}: {
	correctWordsInSequence: string[];
	expectedWords: string[];
	typedWords: string[];
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

export const getUserResults = ({
	expectedWords,
	typedWords,
	isLesson = false,
}: {
	expectedWords: string[];
	typedWords: string[];
	isLesson?: boolean;
}) => {
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
	let totalTypedWords = typedWords.length;
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

			// that last correct word will be considered as incorrect word
			// since it might be typed in hurry or incomplete
			// we will remove that word from correct words as well
			totalCorrectWords -= 1;
			totalTypedWords += 1;
			correctWordsIndicesInPassage.pop();
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

	let accuracy =
		(totalCorrectWords / (totalCorrectWords + totalErrorCount)) * 100;

	if (isLesson) {
		accuracy = (totalCorrectWords / parseInt(`${expectedWords.length}`)) * 100;
	}

	return {
		totalErrorCount,
		totalCorrectWords,
		totalTypedWords,
		accuracy: accuracy || 0,
		correctWordIndices: correctWordsIndicesInPassage,
	};
};
