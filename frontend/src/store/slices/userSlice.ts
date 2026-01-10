import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  user: any | null;
  isEmailVerified: boolean;
  isLoginDialogOpen: boolean;
  isLoggedIn: boolean;
}

const initialState: UserState = {
  user: null,
  isEmailVerified: false,
  isLoginDialogOpen: false,
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // setUser: (state, action: PayloadAction<any>) => {
    //   state.user = action.payload;
    // },
    setUser: (state, action: PayloadAction<any>) => {
      // If the new email already exists in state, remove the previous user
      if (state.user && state.user.email === action.payload.email) {
        state.user = null;
      }

      // Then set the new user
      state.user = action.payload;
    },
    setEmailVerified: (state, action: PayloadAction<boolean>) => {
      state.isEmailVerified = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isEmailVerified = false;
      state.isLoggedIn = false;
    },
    toggleLoginDialog: (state) => {
      state.isLoginDialogOpen = !state.isLoginDialogOpen;
    },
    authStatus: (state) => {
      state.isLoggedIn = true;
    },
  },
});

export const {
  setUser,
  logout,
  setEmailVerified,
  toggleLoginDialog,
  authStatus,
} = userSlice.actions;

export default userSlice.reducer;
