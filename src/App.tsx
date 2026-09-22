import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { Loading } from "./components/Loading";
import { memo } from "react";
import { useMemo } from "react";
import { useCallback } from "react";
import { StudyRecord } from "./types/db/study-record";
import { PrimaryButton } from "./components/atoms/button/PrimaryButton";
import { Box, Container, Flex, Heading, HStack, Stack, Text } from "@chakra-ui/react";
import { DangerButton } from "./components/atoms/button/DangerButton";
import { InsertModal } from "./components/organisms/InsertModal";

export const App = () => {

  // レコード
  const [records, setRecords] = useState<StudyRecord[]>([]);
  // ローディング状態
  const [isLoading, setIsLoading] = useState(false);
  // モーダル
  const [ open, setOpen ] = useState(false);

  // 合計時間
  const totalTime = useMemo(() => {
    let sum = 0;
    records.forEach((record) => {
      sum += Number(record.time);
    });
    return sum;
  }, [records]);

  // データの取得
  const fetchRecords = async () => {
    const { data, error } = await supabase
      .from("study-record")
      .select('id, title, time');
    if (error) {
      console.log(error);
    } else {
      const recordList = data.map((item) => (
        new StudyRecord(item.id, item.title, Number(item.time))
      ));
      setRecords(recordList);
    }
  }

  // データの削除
  const deleteRecord = async (id: string) => {
    const { error } = await supabase
      .from("study-record")
      .delete()
      .eq("id", id);
    if (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await fetchRecords();
      } finally {
        setIsLoading(false);
      }
    }
    loadData();

  }, []);

  // 削除ボタン押下
  const onClickDelete = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      await deleteRecord(id);
      await fetchRecords();
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 新規登録ボタンクリック
  const onClickInsertModal = useCallback(() => {
    setOpen(true);
  }, []);

  return (
    <>
      <Container maxW="2xl" my={6} p={6} bg="white" borderRadius="xl" boxShadow="md" borderWidth="1px">
        <Heading as="h1" fontSize="xl" textAlign="center" mb={4}>
          学習記録アプリ
        </Heading>
        <Box textAlign="right" mb={3}>
          <PrimaryButton onClick={onClickInsertModal}>新規登録</PrimaryButton>
        </Box>

        <Heading as="h2" size="md" mt={6} mb={3} pb={2} borderBottom="2px solid" borderColor="gray.100">
          登録データ
        </Heading>

        <Box>
          {isLoading ? <Loading /> : <RecordList records={records} onClickDelete={onClickDelete} />}
        </Box>

        <Box
          textAlign="right"
          mt={5}
          pt={4}
          borderTop="2px dashed"
          borderColor="gray.200"
          fontWeight="bold"
        >
          合計時間: <Text as="span" fontSize="lg" color="#2563eb">{totalTime}</Text> 時間
        </Box>
      </Container>
      <InsertModal
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={fetchRecords}
      />
    </>
  );

};

type Props = {
  records: StudyRecord[];
  onClickDelete: (id: string) => void;
}

const RecordList = memo((props: Props) => {
  const { records, onClickDelete } = props;
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
              <DangerButton px="10px" py="4px" fontSize="0.8rem" fontWeight="semibold" onClick={() => onClickDelete(record.id)}>削除</DangerButton>
            </HStack>
          </Flex>
        );
      })}
    </Stack>
  );
});
