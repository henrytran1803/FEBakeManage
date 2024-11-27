import { ApiResponse } from "@/types/ApiResponse";
import { api } from "@/api/axios";
import { Supplier } from "@/types/Supplier";

const supplierService = {
    getSuppliers: async (): Promise<ApiResponse<Supplier[]>> => {
        try {
            const response = await api.get("/api/supplier");
            return response.data;
        } catch (error) {
            console.error("Error fetching suppliers:", error);
            throw error;
        }
    },

    createSupplier: async (supplier: Omit<Supplier, "id">): Promise<ApiResponse<Supplier>> => {
        try {
            const response = await api.post("/api/supplier", supplier);
            return response.data;
        } catch (error) {
            console.error("Error creating supplier:", error);
            throw error;
        }
    },

    updateSupplier: async (id: number, supplier: Omit<Supplier, "id">): Promise<ApiResponse<Supplier>> => {
        try {
            const response = await api.put(`/api/supplier/${id}`, supplier);
            return response.data;
        } catch (error) {
            console.error("Error updating supplier:", error);
            throw error;
        }
    },
};

export { supplierService };
