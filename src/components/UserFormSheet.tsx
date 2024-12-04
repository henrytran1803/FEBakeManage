import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import {format, parseISO} from "date-fns";
import { CalendarIcon } from "lucide-react";
import { UserRequest, User } from "@/types/User";
import {UserErrorCode} from "@/utils/error/UserError.ts";
import {ErrorCode} from "@/types/error.ts";

const roles = [
    {
        id: 1,
        label: "Manager",
        value: 1
    },
    {
        id: 2,
        label: "Employee",
        value: 2
    }
];

interface UserFormSheetProps {
    trigger: React.ReactNode;
    user?: User;
    onSubmit: (data: UserRequest) => Promise<void>;
    showSuccessToast: (message: ErrorCode) => void;
    showErrorToast: (message: ErrorCode) => void;
}
const formatDateToString = (date: Date): string => {
    return format(date, "yyyy-MM-dd");
};

const parseDateString = (dateString: string): Date => {
    const datePart = dateString.split(' ')[0];
    return parseISO(datePart);
};
export const UserFormSheet = ({
                                  trigger,
                                  user,
                                  onSubmit,
                                  showSuccessToast,
                                  showErrorToast
                              }: UserFormSheetProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState<UserRequest>({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        password: "",
        dateOfBirth: user?.dateOfBirth ? formatDateToString(parseDateString(user.dateOfBirth)) : "",
        roleIds: user?.roleIds || []
    });
    const [date, setDate] = useState<Date | undefined>(
        user?.dateOfBirth ? new Date(user.dateOfBirth) : undefined
    );
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.firstName.trim()) {
            showErrorToast(UserErrorCode.FIRST_NAME_REQUIRED);
            return;
        }
        if (!formData.lastName.trim()) {
            showErrorToast(UserErrorCode.LAST_NAME_REQUIRED);
            return;
        }
        if (!formData.email.trim()) {
            showErrorToast(UserErrorCode.EMAIL_REQUIRED);
            return;
        }
        if (!user && !formData.password.trim()) {
            showErrorToast(UserErrorCode.PASSWORD_REQUIRED);
            return;
        }
        if (!formData.dateOfBirth) {
            showErrorToast(UserErrorCode.DATE_OF_BIRTH_REQUIRED);
            return;
        }
        if (formData.roleIds.length === 0) {
            showErrorToast(UserErrorCode.ROLE_REQUIRED);
            return;
        }

        try {
            await onSubmit(formData);
            showSuccessToast(user ? UserErrorCode.UPDATE_SUCCESS : UserErrorCode.CREATE_SUCCESS);
            setIsOpen(false);
        } catch (error) {
            showErrorToast(user ? UserErrorCode.UPDATE_ERROR : UserErrorCode.CREATE_ERROR);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRoleChange = (roleValue: number, checked: boolean) => {
        setFormData(prev => {
            const newRoleIds = checked
                ? [...prev.roleIds, roleValue]
                : prev.roleIds.filter(id => id !== roleValue);

            return {
                ...prev,
                roleIds: newRoleIds
            };
        });
    };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                {trigger}
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg">
                <SheetHeader>
                    <SheetTitle>{user ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}</SheetTitle>
                    <SheetDescription>
                        {user ? "Cập nhật thông tin người dùng" : "Điền thông tin để tạo người dùng mới"}
                    </SheetDescription>
                </SheetHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">Họ</Label>
                            <Input
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Tên</Label>
                            <Input
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                    </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Mật khẩu</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                        </div>

                    <div className="space-y-2">
                        <Label>Ngày sinh</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start text-left font-normal"
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "dd/MM/yyyy") : "Chọn ngày"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={(newDate) => {
                                        setDate(newDate);
                                        if (newDate) {
                                            setFormData(prev => ({
                                                ...prev,
                                                dateOfBirth: formatDateToString(newDate)
                                            }));
                                        }
                                    }}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="space-y-2">
                        <Label>Vai trò</Label>
                        <div className="space-y-3 border rounded-md p-4">
                            {roles.map((role) => (
                                <div key={role.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={role.id.toString()}
                                        checked={formData.roleIds.includes(role.value)}
                                        onCheckedChange={(checked) =>
                                            handleRoleChange(role.value, checked as boolean)
                                        }
                                    />
                                    <Label
                                        htmlFor={role.id.toString()}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        {role.label}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                            Hủy
                        </Button>
                        <Button type="submit">
                            {user ? "Cập nhật" : "Tạo mới"}
                        </Button>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    );
};

export default UserFormSheet;