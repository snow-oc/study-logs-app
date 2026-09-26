import { useCallback, useEffect, useMemo, useState } from "react";
import { Loading } from "./components/Loading";
import { PrimaryButton } from "./components/atoms/button/PrimaryButton";
import { Box, Container, Heading, Text } from "@chakra-ui/react";
import { RecordFormModal } from "./components/organisms/RecordFormModal";
import { RecordList } from "./components/organisms/RecordList";
import type { StudyRecord } from "./types/db/study-record";
import { useStudyRecord } from "./hooks/useStudyRecord";

export const App = () => {

  // モーダル
  const [ open, setOpen ] = useState(false);
  // 選択されたレコード
  const [ selectedRecord, setSelectedRecord ] = useState<StudyRecord | null>(null);
  // StudyRecordフック
  const {
    records,
    isLoading,
    fetchStudyRecords,
    deleteStudyRecord,
    insertStudyRecord,
    updateStudyRecord
  } = useStudyRecord();

  // 合計時間
  const totalTime = useMemo(() => {
    let sum = 0;
    records.forEach((record) => {
      sum += Number(record.time);
    });
    return sum;
  }, [records]);

  useEffect(() => {
    fetchStudyRecords();
  }, []);

    // 新規登録ボタンクリック
  const onClickInsert = useCallback(() => {
    setSelectedRecord(null);
    setOpen(true);
  }, [setOpen]);

  // 編集ボタンクリック
  const onClickEdit = useCallback((record: StudyRecord) => {
    setSelectedRecord(record);
    setOpen(true);
  }, [ setSelectedRecord, setOpen ]);

  // モーダルを閉じた際の処理
  const onCloseModal = useCallback(() => {
    setOpen(false);
    setSelectedRecord(null);
  }, []);

  return (
    <>
      <Container maxW="2xl" my={6} p={6} bg="white" borderRadius="xl" boxShadow="md" borderWidth="1px">
        <Heading as="h1" fontSize="xl" textAlign="center" mb={4}>
          学習記録アプリ
        </Heading>
        <Box textAlign="right" mb={3}>
          <PrimaryButton onClick={onClickInsert}>新規登録</PrimaryButton>
        </Box>

        <Heading as="h2" size="md" mt={6} mb={3} pb={2} borderBottom="2px solid" borderColor="gray.100">
          登録データ
        </Heading>

        <Box>
          {isLoading ? <Loading /> : <RecordList records={records} onClickDelete={deleteStudyRecord} onClickEdit={onClickEdit} />}
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
      <RecordFormModal
        open={open}
        onClose={onCloseModal}
        onInsert={insertStudyRecord}
        onUpdate={updateStudyRecord}
        record={selectedRecord}
      />
    </>
  );

};
