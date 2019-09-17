import React from "react";
import axios from "axios";
import Log from "./Log";

const path =
  process.env.NODE_ENV === "development" ? "./serverlog.json" : "/logs";

const LogContainer = () => {
  const [datas, setDatas] = React.useState([]);

  React.useEffect(() => {
    axios
      .get(path)
      .then(response => {
        let logs = response.data;
        return setDatas(logs);
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  }, []);

  return (
    <div className="term">
      <div className="term-header">
        <button class="term-header-button term-header-button-close"></button>
        <button class="term-header-button term-header-button-minimize"></button>
        <button class="term-header-button term-header-button-expand"></button>
        <div class="term-header-title">
          <span>Cookie Clicker - Logs</span>
        </div>
      </div>
      <div className="term-content">
        {datas.map((data, i) => {
          return <Log {...data} key={i} />;
        })}
        <span class="term-content-arrow">➜</span>{" "}
        <span class="term-content-tilde">~</span>
        <span class="term-content-caret"></span>
      </div>
    </div>
  );
};

export default LogContainer;
