// src/types/User.ts
export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
    active: boolean;
    roles: Set<string>;
  }
  export interface ListUserActive {
    content: User[];
    pageable: any; // Có thể thêm kiểu dữ liệu chi tiết cho pageable
    last: boolean;
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    sort: any;
  }

  
  export interface PaginatedUserResponse {
    content: User[];
    totalPages: number;
    totalElements: number;
  }

  // dùng để tạo
  export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string; // Dùng kiểu Date nếu backend sử dụng Date
    password: string;
    roles: Set<string>; // Dùng Set<string> cho trường roles nếu cần thiết
  }
  // dùng để sửa
  export interface UserRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    dateOfBirth: string; // Dùng kiểu Date nếu backend sử dụng Date
    active: boolean;
    roles: Set<string>; // Dùng Set<string> cho trường roles nếu cần thiết
  }
  
 // Cập nhật Page<T> để bao gồm các trường phân trang và thông tin khác từ API
export interface Page<T> {
  content: T[];          // Mảng dữ liệu người dùng
  totalElements: number; // Tổng số phần tử (người dùng)
  totalPages: number;    // Tổng số trang
  size: number;          // Kích thước mỗi trang (số lượng người dùng mỗi trang)
  number: number;        // Số trang hiện tại (bắt đầu từ 0)
  pageable: Pageable;    // Thông tin phân trang
  last: boolean;         // Kiểm tra xem đây có phải là trang cuối cùng không
  first: boolean;        // Kiểm tra xem đây có phải là trang đầu tiên không
  sort: Sort;            // Thông tin sắp xếp
  numberOfElements: number; // Số lượng phần tử trong trang hiện tại
  empty: boolean;        // Kiểm tra xem trang hiện tại có trống không
}

export interface Pageable {
  pageNumber: number;    // Số trang hiện tại
  pageSize: number;      // Kích thước mỗi trang
  sort: Sort;            // Thông tin sắp xếp
  offset: number;        // Vị trí bắt đầu của trang
  paged: boolean;        // Xác định phân trang có được sử dụng hay không
  unpaged: boolean;      // Xác định phân trang không được sử dụng hay không
}

export interface Sort {
  empty: boolean;        // Trạng thái không có sắp xếp
  sorted: boolean;       // Trạng thái đang sắp xếp
  unsorted: boolean;     // Trạng thái không sắp xếp
}



// Cấu trúc phản hồi của API
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  errorcode: string;
  data: T;
}
