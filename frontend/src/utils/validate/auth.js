import * as yup from 'yup';

const authSchema = yup
  .object({
    fullname: yup
      .string()
      .trim()
      .required('Vui lòng nhập Tên người dùng!')
      .max(30, 'Tên người dùng không được dài quá 30 ký tự!'),
    emailOrUid: yup
      .string()
      .trim()
      .required('Vui lòng nhập Email hoặc UID!')
      .max(30, 'Email hoặc UID không được dài quá 30 ký tự!'),
    password: yup.string().trim().required('Vui lòng nhập Mật Khẩu!').min(8, 'Mật Khẩu ít nhất 8 ký tự!'),
    email: yup
      .string()
      .trim()
      .required('Vui lòng nhập Email!')
      .matches(
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
        'Vui lòng nhập Email đúng định dạng!',
      ),
    referenceId: yup.string().trim().required('Vui lòng nhập Người giới thiệu!'),
    userId: yup.string().trim().required('Vui lòng nhập User ID!'),
    bankAccount: yup.string().trim().required('Vui lòng nhập mã ngân hàng!'),
    bankName: yup.string().trim().required('Vui lòng nhập tên tài khoản!'),
    bankNumber: yup.string().trim().required('Vui lòng nhập số tài khoản!'),
    amount: yup.string().trim().required('Vui lòng nhập số tài khoản!'),
    bankFullName: yup.string().trim().required('Vui lòng nhập tên ngân hàng!'),
    bankShortName: yup.string().trim().required('Vui lòng nhập tên rút gọn!'),
    bankCode: yup.string().trim().required('Vui lòng nhập mã ngân hàng!'),
    bankLogo: yup.string().trim().required('Vui lòng nhập logo!'),
    rejectMessage: yup.string().trim().required('Vui lòng nhập lí do từ chối!'),
  })
  .required();

export default authSchema;
