import React from "react";
import css from "./ConventionErrTable.module.css";

const ConventionErrTable = ({ commitMsgList }) => {
  return (
    <div className={css.tableWrapper}>
      <table className={css.tableHeader}>
        <thead>
          <tr>
            <th className={css.colCreated}>Created At</th>
            <th className={css.colTitle}>Title</th>
            <th className={css.colUser}>User</th>
            <th className={css.colResult}>reason </th>
          </tr>
        </thead>
      </table>
      <div className={css.scrollBody}>
        <table className={css.tableBody}>
          <tbody>
            {commitMsgList?.map((commitMsg, index) => (
              <tr key={index}>
                <td className={css.colCreated}>
                  {commitMsg.date.split("T")[0]}
                </td>
                <td className={css.colTitle}>{commitMsg.message}</td>
                <td className={css.colUser}>{commitMsg.author}</td>
                <td className={css.colResult}>🚨{commitMsg.result}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ConventionErrTable;
