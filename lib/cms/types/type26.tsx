import { renderWidth, type TableCell, type TableValue } from "../schema";
import { richProps, str, type CmsType } from "../type";
import { TitleBlock, titleDefault, titleField } from "./parts";

// 원본 타입 26: 제목 + 설명 + 표. 표는 머리글 행, 본문 행(첫 칸은 th), 열 너비, 칸 병합(colspan/rowspan)을 가진다.
// 이 데모의 편집기는 칸 편집, 행/열 추가·삭제, 열 너비를 지원하고 병합을 만드는 화면은 없다(그리는 경로와 값 보정은 있다).
const cell = (value: string): TableCell => ({ value, colspan: 1, rowspan: 1, hidden: false });

function isTable(value: unknown): value is TableValue {
  return typeof value === "object" && value !== null && "rows" in value && "headers" in value;
}

function spanProps(cell: TableCell): { colSpan?: number; rowSpan?: number } {
  const props: { colSpan?: number; rowSpan?: number } = {};
  if (cell.colspan > 1) props.colSpan = cell.colspan;
  if (cell.rowspan > 1) props.rowSpan = cell.rowspan;
  return props;
}

const type26: CmsType = {
  id: "type26",
  number: "26",
  label: "타입 26 · 설명 + 표 (행·열 편집, 열 너비)",
  fields: [
    titleField,
    { kind: "rich", key: "text", label: "표 위 설명 (비우면 없음)" },
    { kind: "table", key: "table", label: "표" },
  ],
  defaults: {
    title: titleDefault,
    text: "표 위에 놓을 설명을 입력해 보세요.",
    table: {
      headers: [[cell("구분"), cell("항목 A"), cell("항목 B")]],
      rows: [
        [cell("행 1"), cell("내용 1"), cell("내용 2")],
        [cell("행 2"), cell("내용 3"), cell("내용 4")],
      ],
      colWidths: ["30%", "auto", "auto"],
    },
  },
  css: `
    .demo-type26 .demo-table-wrap { display: flex; flex-direction: column; gap: 12px; }
    .demo-type26 .demo-table-scroll { overflow-x: auto; }
    .demo-type26 .demo-table { width: 100%; border-collapse: collapse; table-layout: fixed; }
    .demo-type26 .demo-table th, .demo-type26 .demo-table td { padding: 10px 12px; border: 1px solid #d5dce4; text-align: left; overflow-wrap: anywhere; }
    .demo-type26 .demo-table thead th { background: #eef3f9; }
    .demo-type26 .demo-table tbody th { background: #f7f9fb; font-weight: 600; }
  `,
  View: ({ values }) => {
    const table = isTable(values.table) ? values.table : null;
    return (
      <section className="demo-block demo-type26">
        <div className="demo-inner">
          <TitleBlock values={values} />
          <div className="demo-table-wrap">
            {str(values.text).trim() !== "" && (
              <div className="demo-description-box">
                <p className="demo-desc" {...richProps(values.text)} />
              </div>
            )}
            {table && (
              <div className="demo-table-scroll">
                <table className="demo-table">
                  <colgroup>
                    {table.colWidths.map((width, index) => (
                      <col key={index} style={{ width: renderWidth(width) }} />
                    ))}
                  </colgroup>
                  <thead>
                    {table.headers.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((header, colIndex) =>
                          header.hidden ? null : (
                            <th key={colIndex} scope="col" {...spanProps(header)}>
                              {header.value}
                            </th>
                          ),
                        )}
                      </tr>
                    ))}
                  </thead>
                  <tbody>
                    {table.rows.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((body, colIndex) => {
                          if (body.hidden) return null;
                          return colIndex === 0 ? (
                            <th key={colIndex} scope="row" {...spanProps(body)}>
                              {body.value}
                            </th>
                          ) : (
                            <td key={colIndex} {...spanProps(body)}>
                              {body.value}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  },
};

export { type26 };
