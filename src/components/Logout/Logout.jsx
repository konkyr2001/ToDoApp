import "./Logout.css";
import Modal from "react-bootstrap/Modal";

import { useState } from "react";
export default function Logout({ setUser }) {
  const [modal, setModal] = useState(false);

  function handleShow() {
    setModal(true);
  }

  function handleHide() {
    setModal(false);
  }

  function handleLogout() {
    localStorage.setItem("username", undefined);
    localStorage.setItem("password", undefined);
    localStorage.setItem("id", undefined);

    setUser({
      username: "",
      password: "",
      app: false,
    });
    handleHide();
  }
  return (
    <div className="profile-container">
      <button
        type="button"
        className="btn btn-danger rounded-circle"
        data-bs-toggle="modal"
        data-bs-target="#modalMedium"
        onClick={handleShow}
      >
        <i className="fa-solid fa-power-off"></i>
      </button>
      <Modal show={modal} onHide={handleHide}>
        <Modal.Header className="modal-header">
          <h5 className="modal-title" id="modalMediumTitle">
            Logout
          </h5>
          <button
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            onClick={handleHide}
          ></button>
        </Modal.Header>
        <Modal.Body className="modal-body">
          <p>Are you sure you want to logout from your account?</p>
        </Modal.Body>
        <Modal.Footer className="modal-footer">
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleLogout}
          >
            Logout
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            data-bs-dismiss="modal"
            onClick={handleHide}
          >
            Cancel
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
