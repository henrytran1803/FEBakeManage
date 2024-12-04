// src/components/ui/Modal.tsx
import React from "react";

interface ModalProps {
    isOpen: boolean;  // Thêm prop isOpen để điều khiển trạng thái hiển thị modal
    title: string;
    onClose: () => void;
    actions: React.ReactNode;
    children: React.ReactNode;
    onConfirm?: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, title, onClose, actions, children, onConfirm }) => {
    if (!isOpen) return null; // Nếu không open thì không render modal

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-4 w-[90%] max-w-md">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold">{title}</h3>
                    <button onClick={onClose} className="text-gray-500">
                        &times;
                    </button>
                </div>
                <div className="my-4">{children}</div>
                <div className="flex justify-end space-x-2">
                    {actions}
                </div>
            </div>
        </div>
    );
};

export default Modal;


