import React from "react";
import moment from "moment";

moment.locale();

const Log = ({ date, method, path, code, time }) => {
  date = moment(date).format("L LTS");
  return (
    <>
      <span className="term-content-arrow">➜</span>{" "}
      <span className="term-content-tilde">~</span>
      <span
        className={
          code === 200 || code === 201
            ? "text-green-600"
            : code === 404 || code === 400
            ? "text-red-600"
            : "text-gray-100"
        }
      >
        [Date: {date}] : {method} {path} {code} {time}ms
      </span>
      <br />
    </>
  );
};

export default Log;
