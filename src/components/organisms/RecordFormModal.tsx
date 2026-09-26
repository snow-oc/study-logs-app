import { Box, CloseButton, Dialog, Field, Input, Stack, Text } from "@chakra-ui/react";
import { memo, useEffect } from "react";
import { PrimaryButton } from "../atoms/button/PrimaryButton";
import { useForm } from "react-hook-form";
import { validateStudyTime } from "@/utils/appValidation";
import type { StudyRecord } from "@/types/db/study-record";

type Props = {
  open: boolean;
  record: StudyRecord | null;
  onClose: () => void;
  onInsert: (record: Pick<StudyRecord, "title" | "time">) => Promise<void>;
  onUpdate: (record: StudyRecord) => Promise<void>;
}

type FormInputs = {
  detail: string;
  time: number;
};

export const RecordFormModal = memo((props: Props) => {

  const { open, onClose, record, onInsert, onUpdate } = props;

  // 入力フォーム
  const { register, handleSubmit, reset, formState: { errors }, watch } = useForm<FormInputs>();

  useEffect(() => {
    reset({
      detail: record?.title || "",
      time: record?.time || 0,
    })
  }, [record, reset ]);

  // 送信ボタン押下(登録・更新)
  const onSubmit = async (data: FormInputs) => {
    try {
      if (record) {
        // データ更新
        await onUpdate({id: record.id, title: data.detail, time: data.time});
      } else {
        // データ登録
        await onInsert({title: data.detail, time: data.time});
      }
      // フォームリセット
      reset({detail: "", time: 0});
      // モーダルを閉じる
      onClose();
    } catch(error) {
      console.error("エラー:", error);
    }
  }
  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.CloseTrigger asChild>
            <CloseButton size="sm"></CloseButton>
          </Dialog.CloseTrigger>
          <Dialog.Header>
            <Dialog.Title>学習記録入力フォーム</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <>
              <Stack gap={4}>
                <Field.Root>
                  <Field.Label htmlFor="detail">学習内容</Field.Label>
                  <Input
                    id="detail"
                    type="text"
                    {...register("detail", {required: "内容の入力は必須です"})}
                    placeholder="例: Reactの学習"
                  />
                  <Text fontSize="sm" color="gray.500">入力中: {watch("detail")}</Text>
                </Field.Root>
                <Field.Root>
                  <Field.Label htmlFor="time">学習時間 (時間)</Field.Label>
                  <Input
                    id="time"
                    type="number"
                    {...register("time", {
                      valueAsNumber: true,
                      validate: validateStudyTime,
                    })}
                  />
                  <Text fontSize="sm" color="gray.500">入力中: {watch("time") || 0} 時間</Text>
                </Field.Root>
                <PrimaryButton
                  w="100px"
                  p="10px"
                  fontWeight="semibold"
                  fontSize="0.95rem"
                  onClick={handleSubmit(onSubmit)}
                >
                  {record ? "更新" : "登録"}
                </PrimaryButton>
              </Stack>

              {Object.keys(errors).length > 0 && (
                <Box color="red.500" fontSize="sm" fontWeight="medium" mt={2}>
                  {errors.detail?.message && <Text>{errors.detail.message}</Text>}
                  {errors.time?.message && <Text>{errors.time.message}</Text>}
                </Box>
              )}
            </>
          </Dialog.Body>
          <Dialog.Footer />
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
})
