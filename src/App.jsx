import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient.jsx";

export const App = () => {

  // データの取得
  const fetchRecords = async () => {
    const { data, error } = await supabase
      .from("study-record")
      .select('*')
    console.log(data);
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


  // 合計時間
  let totalTime = 0;
  useEffect(() => {
    records.forEach((record) => {
      totalTime += Number(record.time);
    });
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

  return (
    <>
      <div>
        <label>学習内容</label>
        <input type="text" value={detail} onChange={e => setDetail(e.target.value)} />
      </div>
      <div>
        <label>学習時間</label>
        <input type="number" value={time} onChange={e => setTime(e.target.value)}/>
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
        {records.map((record, index) => {
          return (
            <div key={index}>
              {record.title}: {record.time}(h)
            </div>
          );
        })}
      </div>
      <div>
        合計時間: {totalTime}(h)
      </div>

    </>
  );

};
