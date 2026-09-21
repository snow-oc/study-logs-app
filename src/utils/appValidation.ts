// 時間のバリデーションチェック
export const validateStudyTime = (value: number) => {
  if (Number.isNaN(value) || value === null || value === undefined) {
    return "時間の入力は必須です";
  }
  if (value <= 0) {
    return "時間は1以上である必要があります";
  }
  return true;
}
