import { useEffect, useState, type ChangeEvent } from "react";
import { supabase } from "./supabaseClient";
import { Loading } from "./components/Loading";
import { memo } from "react";
import { useMemo } from "react";
import "./App.css";
import { useCallback } from "react";
import type { StudyRecord } from "./types/db/study-record";

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
      setRecords(data as StudyRecord[]);
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
    <div className="app-container">
      <h1 className="app-title">学習記録アプリ</h1>

      <div className="form-group">
        <label htmlFor="detail">学習内容</label>
        <input id="detail" className="input-field" type="text" value={detail} onChange={handleClickDetail} placeholder="例: Reactの学習" />
        <div className="preview-text">入力中: {detail}</div>
      </div>

      <div className="form-group">
        <label htmlFor="time">学習時間 (時間)</label>
        <input id="time" className="input-field" type="number" value={time} onChange={handleClickTime}/>
        <div className="preview-text">入力中: {time} 時間</div>
      </div>

      <button className="btn-primary" onClick={onClickInsert}>登録</button>

      <div className="error-message">
        {isError ? "⚠️ 入力されていない項目があります" : ""}
      </div>

      <div className="section-title">登録データ</div>

      <div>
        {isLoading ? <Loading /> : <RecordList records={records} onClickDelete={onClickDelete} />}
      </div>

      <div className="total-container">
        合計時間: <span className="total-time-badge">{totalTime}</span> 時間
      </div>
    </div>
  );

};

type Props = {
  records: StudyRecord[];
  onClickDelete: (id: string) => void;
}

const RecordList = memo((props: Props) => {
  const { records, onClickDelete } = props;
  return (
    <div className="record-list">
      {records.map((record) => {
        return (
          <div className="record-item" key={record.id}>
            <span className="record-title">{record.title}</span>
            <div className="record-action">
              <span className="record-time">{record.time} 時間</span>
              <button className="btn-delete" onClick={() => onClickDelete(record.id)}>削除</button>
            </div>
          </div>
        );
      })}
    </div>
  );
});
