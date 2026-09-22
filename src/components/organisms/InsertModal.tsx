import { Box, CloseButton, Dialog, Field, Input, Stack, Text } from "@chakra-ui/react";
import { memo, type FC } from "react";
import { PrimaryButton } from "../atoms/button/PrimaryButton";
import { useForm } from "react-hook-form";
import { validateStudyTime } from "@/utils/appValidation";
import { supabase } from "@/supabaseClient";
import type { StudyRecord } from "@/types/db/study-record";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => Promise<void>;
}

type FormInputs = {
  detail: string;
  time: number;
};

export const InsertModal: FC<Props> = memo((props) => {

  const { open, onClose, onSuccess } = props;
  // 入力フォーム
  const { register, handleSubmit, reset, formState: { errors }, watch } = useForm<FormInputs>({
    defaultValues: {
      detail: "",
      time: 0,
    }
  });

  // データの登録
  const insertRecord = async (record: Pick<StudyRecord, "title" | "time">) => {
    const { error } = await supabase
      .from("study-record")
      .insert({ title: record.title, time: record.time });
    if (error) {
      console.log(error);
    }
  }

  // 登録ボタン押下
  const onClickInsert = async (data: FormInputs) => {
    try {
      // データ登録
      await insertRecord({title: data.detail, time: data.time});
      // データ再取得
      await onSuccess();
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
            <Dialog.Title>学習記録の登録</Dialog.Title>
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
                <PrimaryButton w="100px" p="10px" fontWeight="semibold" fontSize="0.95rem" onClick={handleSubmit(onClickInsert)}>
                  登録
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
