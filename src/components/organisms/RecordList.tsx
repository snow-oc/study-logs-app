import { Flex, HStack, Stack, Text } from "@chakra-ui/react";
import { memo } from "react";
import { PrimaryButton } from "../atoms/button/PrimaryButton";
import { DangerButton } from "../atoms/button/DangerButton";
import type { StudyRecord } from "@/types/db/study-record";

type Props = {
  records: StudyRecord[];
  onClickDelete: (id: string) => void;
  onClickEdit: (record: StudyRecord) => void;
}

export const RecordList = memo((props: Props) => {
  const { records, onClickDelete, onClickEdit } = props;
  return (
    <Stack gap={2}>
      {records.map((record) => {
        return (
          <Flex
            key={record.id}
            justify="space-between"
            align="center"
            p={3}
            borderWidth="1px"
            borderRadius="md"
            bg="gray.50"
            >
            <Text fontWeight="medium">{record.title}</Text>
            <HStack gap={3} align="center">
              <Text
                bg="blue.50"
                color="blue.600"
                px={2.5}
                py={1}
                borderRadius="md"
                fontWeight="semibold"
                fontSize="sm"
              >
                {record.time} 時間
              </Text>
              <PrimaryButton px="10px" py="4px" fontSize="0.8rem" fontWeight="semibold" onClick={() => onClickEdit(record)}>編集</PrimaryButton>
              <DangerButton px="10px" py="4px" fontSize="0.8rem" fontWeight="semibold" onClick={() => onClickDelete(record.id)}>削除</DangerButton>
            </HStack>
          </Flex>
        );
      })}
    </Stack>
  );
})
