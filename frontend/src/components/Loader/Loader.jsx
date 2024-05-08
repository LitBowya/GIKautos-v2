import { Spinner } from "react-bootstrap"

const Loader = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Spinner
        animation="border"
        role="status"
        style={{
          width: "50px",
          height: "50px",
          color: "red",
        }}
      />
    </div>
  );

}

export default Loader
