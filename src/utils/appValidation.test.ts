import { validateStudyTime } from "./appValidation";

// 正常系
test('1以上の入力があった場合に、trueが返ること', () => {
  expect(validateStudyTime(1)).toBe(true);
})

// 異常系1
test('未入力の場合に、必須エラーメッセージが返ること', () => {
  expect(validateStudyTime(NaN)).toBe('時間の入力は必須です');
})

// 異常系2
test('0以下の場合に、範囲エラーメッセージが返ること', () => {
  expect(validateStudyTime(0)).toBe('時間は1以上である必要があります');
  expect(validateStudyTime(-1)).toBe('時間は1以上である必要があります');
})
