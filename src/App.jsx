import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient.jsx";
import { Loading } from "./components/Loading.jsx";
import { memo } from "react";
import { useMemo } from "react";
import "./App.css";

export const App = () => {

  // データの取得
  const fetchRecords = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("study-record")
      .select('id, title, time');
    if (error) {
      console.log(error);
    } else {
      setRecords(data);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    fetchRecords();
  }, []);

  // レコード
  const [records, setRecords] = useState([]);
  // 学習内容
  const [detail, setDetail] = useState("");
  // 学習時間
  const [time, setTime] = useState(0);
  // ローディング状態
  const [isLoading, setIsLoading] = useState(false);

  // 合計時間
  const totalTime = useMemo(() => {
    let sum = 0;
    records.forEach((record) => {
      sum += Number(record.time);
    });
    return sum;
  }, [records]);

  // エラーフラグ
  const [isError, setIsError] = useState(false);

  const onClickInsert = () => {

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
    const newRecord = [...records, record];

    setRecords(newRecord);
    setDetail("");
    setTime(0);

  }

  const handleClickDetail = (e) => {
    setDetail(e.target.value);
  }

  const handleClickTime = (e) => {
    setTime(e.target.value);
  }

  return (
    <div className="app-container">
      <h1 className="app-title">学習記録アプリ</h1>

      <div className="form-group">
        <label>学習内容</label>
        <input className="input-field" type="text" value={detail} onChange={handleClickDetail} placeholder="例: Reactの学習" />
        <div className="preview-text">入力中: {detail}</div>
      </div>

      <div className="form-group">
        <label>学習時間 (時間)</label>
        <input className="input-field" type="number" value={time} onChange={handleClickTime}/>
        <div className="preview-text">入力中: {time} 時間</div>
      </div>

      <button className="btn-primary" onClick={onClickInsert}>登録</button>

      <div className="error-message">
        {isError ? "⚠️ 入力されていない項目があります" : ""}
      </div>

      <div className="section-title">登録データ</div>

      <div>
        {isLoading ? <Loading /> : <RecordList records={records} />}
      </div>

      <div className="total-container">
        合計時間: <span className="total-time-badge">{totalTime}</span> 時間
      </div>
    </div>
  );

};

const RecordList = memo((props) => {
  const { records } = props;
  return (
    <div className="record-list">
      {records.map((record, index) => {
        return (
          <div className="record-item" key={index}>
            <span className="record-title">{record.title}</span>
            <span className="record-time">{record.time} 時間</span>
          </div>
        );
      })}
    </div>
  );
});
