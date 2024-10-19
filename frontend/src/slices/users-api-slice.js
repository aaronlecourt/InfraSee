import { apiSlice } from "./api-slice";
const USERS_URL = "/api/users";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: "POST",
        body: data,
      }),
    }),
    adminLogin: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth/admin`,
        method: "POST",
        body: data,
      }),
    }),
    moderatorLogin: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth/moderator`,
        method: "POST",
        body: data,
      }),
    }),
    subModeratorLogin: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth/submoderator`,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data,
      }),
    }),
    checkEmail: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/check-email/${encodeURIComponent(email)}`,
        method: "GET",
        body: data,
      }),
    }),
    verifyOtp: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/verify-otp`,
        method: "POST",
        body: data,
      }),
    }),
    requestResetPassword: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/password-reset/request`,
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/password-reset`,
        method: "POST",
        body: data,
      }),
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/change-password`,
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useAdminLoginMutation,
  useModeratorLoginMutation,
  useSubModeratorLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useUpdateUserMutation,
  useCheckEmailMutation,
  useVerifyOtpMutation,
  useRequestResetPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
} = userApiSlice;
