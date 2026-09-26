import { supabase } from "@/supabaseClient";
import { StudyRecord } from "@/types/db/study-record";
import { useCallback, useState } from "react";

export const useStudyRecord = () => {

  // レコード
  const [ records, setRecords ] = useState<StudyRecord[]>([]);
  // ローディング状態
  const [isLoading, setIsLoading] = useState(false);

  // studyRecordからデータを取得するフック
  const fetchStudyRecords = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("study-record")
        .select('id, title, time')
        .order('id');
      if (error) {
        console.log(error);
      } else {
        const recordList = data.map((item) => (
          new StudyRecord(item.id, item.title, Number(item.time))
        ));
        setRecords(recordList);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // studyRecordからデータを削除するフック
  const deleteStudyRecord = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("study-record")
        .delete()
        .eq("id", id);
      if (error) {
        console.log(error);
        return;
      }
      await fetchStudyRecords();
    } finally {
      setIsLoading(false);
    }
  }, [ fetchStudyRecords ]);

  // studyRecordへデータを登録するフック
  const insertStudyRecord = useCallback(async (record: Pick<StudyRecord, "title" | "time">) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("study-record")
        .insert({ title: record.title, time: record.time });
      if (error) {
        console.log(error);
      }
      await fetchStudyRecords();
    } finally {
      setIsLoading(false);
    }
  }, [ fetchStudyRecords ]);

  // studyRecordへデータを更新するフック
  const updateStudyRecord = useCallback(async (record: StudyRecord) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("study-record")
        .update({ title: record.title, time: record.time })
        .eq('id', record.id);
      if (error) {
        console.log(error);
      }
      fetchStudyRecords();
    } finally {
      setIsLoading(false);
    }
  }, [ fetchStudyRecords ]);

  return { records, isLoading, fetchStudyRecords, deleteStudyRecord, insertStudyRecord, updateStudyRecord };
}
