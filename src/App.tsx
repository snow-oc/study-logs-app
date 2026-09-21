import { useEffect, useState, type ChangeEvent } from "react";
import { supabase } from "./supabaseClient";
import { Loading } from "./components/Loading";
import { memo } from "react";
import { useMemo } from "react";
import { useCallback } from "react";
import { StudyRecord } from "./types/db/study-record";
import { PrimaryButton } from "./components/atoms/button/PrimaryButton";
import { Box, Container, Field, Flex, Heading, HStack, Input, Stack, Text } from "@chakra-ui/react";
import { DangerButton } from "./components/atoms/button/DangerButton";

export const App = () => {

  // レコード
  const [records, setRecords] = useState<StudyRecord[]>([]);
  // 学習内容
  const [detail, setDetail] = useState("");
  // 学習時間
  const [time, setTime] = useState(0);
  // ローディング状態
  const [isLoading, setIsLoading] = useState(false);
  // エラーフラグ
  const [isError, setIsError] = useState(false);

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

  // データの登録
  const insertRecord = async (record: Pick<StudyRecord, "title" | "time">) => {
    const { error } = await supabase
      .from("study-record")
      .insert({ title: record.title, time: record.time });

    if (error) {
      console.log(error);
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

  // 登録ボタン押下
  const onClickInsert = async () => {

    if (detail === "" || time === 0) {
      setIsError(true);
      return;
    } else {
      setIsError(false);
    }

    const record = {
      title: detail,
      time: time
    };


    setIsLoading(true);
    try {
      // データ登録
      await insertRecord(record);
      // データ再取得
      await fetchRecords();
    } finally {
      setIsLoading(false);
    }

    // 入力初期化
    setDetail("");
    setTime(0);

  }

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

  const handleClickDetail = (e: ChangeEvent<HTMLInputElement>) => {
    setDetail(e.target.value);
  }

  const handleClickTime = (e: ChangeEvent<HTMLInputElement>) => {
    setTime(Number(e.target.value));
  }

  return (
    <Container maxW="2xl" my={6} p={6} bg="white" borderRadius="xl" boxShadow="md" borderWidth="1px">
      <Heading as="h1" fontSize="xl" textAlign="center" mb={4}>
        学習記録アプリ
      </Heading>

      <Stack gap={4}>
        <Field.Root>
          <Field.Label htmlFor="detail">学習内容</Field.Label>
          <Input id="detail" type="text" value={detail} onChange={handleClickDetail} placeholder="例: Reactの学習"/>
          <Text fontSize="sm" color="gray.500">入力中: {detail}</Text>
        </Field.Root>
        <Field.Root>
          <Field.Label htmlFor="time">学習時間 (時間)</Field.Label>
          <Input id="time" type="number" value={time} onChange={handleClickTime} />
          <Text fontSize="sm" color="gray.500">入力中: {time} 時間</Text>
        </Field.Root>
        <PrimaryButton w="100px" p="10px" fontWeight="semibold" fontSize="0.95rem" onClick={onClickInsert}>登録</PrimaryButton>
      </Stack>

      <Box color="red.500" fontSize="sm" fontWeight="medium" minH="1.5rem" mt={2}>
        {isError ? "⚠️ 入力されていない項目があります" : ""}
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
