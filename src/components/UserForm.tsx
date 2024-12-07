// UserForm.tsx

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";


// 1. Định nghĩa mã lỗi
export enum UserErrorCode {
    FIRST_NAME_REQUIRED = 'FIRST_NAME_REQUIRED',
    FIRST_NAME_INVALID = 'FIRST_NAME_INVALID',
    LAST_NAME_REQUIRED = 'LAST_NAME_REQUIRED',
    LAST_NAME_INVALID = 'LAST_NAME_INVALID',
    EMAIL_REQUIRED = 'EMAIL_REQUIRED',
    EMAIL_INVALID = 'EMAIL_INVALID',
    DATE_OF_BIRTH_REQUIRED = 'DATE_OF_BIRTH_REQUIRED',
    DATE_OF_BIRTH_INVALID = 'DATE_OF_BIRTH_INVALID',
    PASSWORD_REQUIRED = 'PASSWORD_REQUIRED',
    PASSWORD_INVALID = 'PASSWORD_INVALID',
    ROLE_REQUIRED = 'ROLE_REQUIRED',
    CREATE_USER_ERROR = 'CREATE_USER_ERROR',
    UPDATE_USER_ERROR = 'UPDATE_USER_ERROR',
    USER_CREATED = 'USER_CREATED',
    USER_UPDATED = 'USER_UPDATED'
}

// 2. Định nghĩa nội dung lỗi
export const userErrorMessages: { [key in UserErrorCode]: string } = {
    [UserErrorCode.FIRST_NAME_REQUIRED]: 'Vui lòng nhập họ',
    [UserErrorCode.FIRST_NAME_INVALID]: 'Họ không hợp lệ',
    [UserErrorCode.LAST_NAME_REQUIRED]: 'Vui lòng nhập tên',
    [UserErrorCode.LAST_NAME_INVALID]: 'Tên không hợp lệ',
    [UserErrorCode.EMAIL_REQUIRED]: 'Vui lòng nhập email',
    [UserErrorCode.EMAIL_INVALID]: 'Email không hợp lệ',
    [UserErrorCode.DATE_OF_BIRTH_REQUIRED]: 'Vui lòng nhập ngày sinh',
    [UserErrorCode.DATE_OF_BIRTH_INVALID]: 'Ngày sinh không hợp lệ',
    [UserErrorCode.PASSWORD_REQUIRED]: 'Vui lòng nhập mật khẩu',
    [UserErrorCode.PASSWORD_INVALID]: 'Mật khẩu phải có ít nhất 6 ký tự',
    [UserErrorCode.ROLE_REQUIRED]: 'Vui lòng chọn vai trò',
    [UserErrorCode.CREATE_USER_ERROR]: 'Đã có lỗi xảy ra khi tạo người dùng',
    [UserErrorCode.UPDATE_USER_ERROR]: 'Đã có lỗi xảy ra khi cập nhật người dùng',
    [UserErrorCode.USER_CREATED]: 'Tạo người dùng thành công',
    [UserErrorCode.USER_UPDATED]: 'Cập nhật người dùng thành công'
};

// 3. Component chính
export default function UserForm({ selectedUser, onSubmit }) {
  // 4. Schema validation
  const userFormSchema = z.object({
    firstName: z.string()
      .min(1, { message: userErrorMessages[UserErrorCode.FIRST_NAME_REQUIRED] })
      .refine(value => /^[\p{L}\s-]+$/u.test(value), {
        message: userErrorMessages[UserErrorCode.FIRST_NAME_INVALID]
      }),
    lastName: z.string()
      .min(1, { message: userErrorMessages[UserErrorCode.LAST_NAME_REQUIRED] })
      .refine(value => /^[\p{L}\s-]+$/u.test(value), {
        message: userErrorMessages[UserErrorCode.LAST_NAME_INVALID]
      }),
    email: z.string()
      .min(1, { message: userErrorMessages[UserErrorCode.EMAIL_REQUIRED] })
      .email({ message: userErrorMessages[UserErrorCode.EMAIL_INVALID] }),
    dateOfBirth: z.string()
      .min(1, { message: userErrorMessages[UserErrorCode.DATE_OF_BIRTH_REQUIRED] }),
    password: selectedUser 
      ? z.string().optional().or(z.literal(''))
      : z.string()
        .min(6, { message: userErrorMessages[UserErrorCode.PASSWORD_INVALID] }),
    roleIds: z.array(z.number())
      .min(1, { message: userErrorMessages[UserErrorCode.ROLE_REQUIRED] })
  });

  // 5. React Hook Form với validation
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      firstName: selectedUser?.firstName || "",
      lastName: selectedUser?.lastName || "",
      email: selectedUser?.email || "",
      dateOfBirth: selectedUser?.dateOfBirth || "",
      password: "",
      roleIds: selectedUser?.roleIds || []
    }
  });

  // 6. Xử lý submit form
  const handleFormSubmit = async (data) => {
    try {
      await onSubmit(data);
      toast({
        title: "Thành công",
        description: selectedUser 
          ? userErrorMessages[UserErrorCode.USER_UPDATED]
          : userErrorMessages[UserErrorCode.USER_CREATED],
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: selectedUser
          ? userErrorMessages[UserErrorCode.UPDATE_USER_ERROR]
          : userErrorMessages[UserErrorCode.CREATE_USER_ERROR],
        variant: "destructive"
      });
    }
  };

  // 7. Giao diện form
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      {/* First Name */}
      <div className="mb-4">
        <Label htmlFor="firstName">Họ</Label>
        <Controller
          control={control}
          name="firstName"
          render={({ field }) => (
            <div>
              <Input {...field} id="firstName" placeholder="Nhập họ" />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>
          )}
        />
      </div>

      {/* Last Name */}
      <div className="mb-4">
        <Label htmlFor="lastName">Tên</Label>
        <Controller
          control={control}
          name="lastName"
          render={({ field }) => (
            <div>
              <Input {...field} id="lastName" placeholder="Nhập tên" />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          )}
        />
      </div>

      {/* Email */}
      <div className="mb-4">
        <Label htmlFor="email">Email</Label>
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <div>
              <Input {...field} id="email" placeholder="Nhập email" />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          )}
        />
      </div>

      {/* Date of Birth */}
      <div className="mb-4">
        <Label htmlFor="dateOfBirth">Ngày Sinh</Label>
        <Controller
          control={control}
          name="dateOfBirth"
          render={({ field }) => (
            <div>
              <Input
                {...field}
                id="dateOfBirth"
                type="date"
                value={String(field.value)}
              />
              {errors.dateOfBirth && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.dateOfBirth.message}
                </p>
              )}
            </div>
          )}
        />
      </div>

      {/* Password */}
      <div className="mb-4">
        <Label htmlFor="password">
          {selectedUser ? "Mật khẩu mới (tùy chọn)" : "Mật khẩu"}
        </Label>
        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <div>
              <Input
                {...field}
                id="password"
                type="password"
                placeholder={
                  selectedUser
                    ? "Để trống nếu không muốn thay đổi"
                    : "Nhập mật khẩu"
                }
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
          )}
        />
      </div>

      {/* Roles */}
      <div className="mb-4">
        <Label htmlFor="roleIds" className="block mb-2 font-medium">
          Vai trò
        </Label>
        <Controller
          control={control}
          name="roleIds"
          render={({ field }) => (
            <div>
              <select
                {...field}
                multiple
                className="form-select mt-1 block w-full"
                value={field.value.map(String)}
                onChange={(e) => {
                  const selectedOptions = Array.from(
                    e.target.selectedOptions,
                    (option) => Number(option.value)
                  );

                  if (selectedOptions.includes(3)) {
                    field.onChange([1, 2]);
                  } else {
                    field.onChange(selectedOptions);
                  }
                }}
              >
                <option value="1">Quản lý</option>
                <option value="2">Nhân viên</option>
                <option value="3">Cả 2</option>
              </select>
              {errors.roleIds && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.roleIds.message}
                </p>
              )}
            </div>
          )}
        />
      </div>

      {/* Submit button */}
      <Button type="submit" className="w-full mt-4">
        {selectedUser ? "Sửa người dùng" : "Tạo người dùng"}
      </Button>
    </form>
  );
}