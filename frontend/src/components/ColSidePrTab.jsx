import css from "./ColSidePrTab.module.css";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";

const ColSidePrTab = ({ prFiles }) => {
  return (
    <Col className={css.prSidebar} sm={3}>
      <Nav variant="pills" className="flex-column">
        <Nav.Item>
          <Nav.Link eventKey="pr-body">코드 변경 요약</Nav.Link>
        </Nav.Item>
        {prFiles?.map((file) => (
          <Nav.Item key={file.filename}>
            <Nav.Link eventKey={file.filename}>
              <span className="text-ellipsis">
                {file.filename.split("/").pop()}
              </span>
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
    </Col>
  );
};

export default ColSidePrTab;
