import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient.jsx";
import { Loading } from "./components/Loading.jsx";
import { memo } from "react";
import { useMemo } from "react";

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
    <>
      <div>
        <label>学習内容</label>
        <input type="text" value={detail} onChange={handleClickDetail} />
      </div>
      <div>
        <label>学習時間</label>
        <input type="number" value={time} onChange={handleClickTime}/>
      </div>
      <div>
        入力されている学習内容: {detail}
      </div>
      <div>
        入力されている時間: {time}時間
      </div>
      <div>
        <button onClick={onClickInsert}>登録</button>
      </div>
      <div>
        {isError ? "入力されていない項目があります" : ""}
      </div>
      <div>
        登録データ
      </div>
      <div>
        {isLoading ? <Loading /> : <RecordList records={records} />}
      </div>
      <div>
        合計時間: {totalTime}(h)
      </div>

    </>
  );

};

const RecordList = memo((props) => {
  const { records } = props;
  return (
    records.map((record, index) => {
      return (
        <div key={index}>
          {record.title}: {record.time}(h)
        </div>
      );
    })
  );
})
