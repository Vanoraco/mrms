import React from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from 'reactstrap';

const ConfirmationDialog = ({
  isOpen,
  toggle,
  title,
  message,
  onConfirm,
  confirmText = "Delete",
  cancelText = "Cancel",
  confirmColor = "danger",
  cancelColor = "light",
}) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>
        {title}
      </ModalHeader>
      <ModalBody>
        {message}
      </ModalBody>
      <ModalFooter>
        <Button color={cancelColor} onClick={toggle}>
          {cancelText}
        </Button>
        <Button color={confirmColor} onClick={onConfirm}>
          {confirmText}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ConfirmationDialog; 