// src/components/ui/Modal.tsx
import React from "react";

interface ModalProps {
    title: string;
    onClose: () => void;
    actions: React.ReactNode;
    children: React.ReactNode;
    onConfirm?: () => void;
}

const Modal: React.FC<ModalProps> = ({ title, onClose, actions, children }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-4 w-[90%] max-w-md">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">{title}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-black">&times;</button>
                </div>
                <div className="mt-4">{children}</div>
                <div className="mt-4 flex justify-end space-x-2">{actions}</div>
            </div>
        </div>
    );
};

export default Modal;


