import UserActionTypes from "./userActionTypes";
import { IUser } from "../../interfaces";
import UserAPI from "../api/UserAPI";

export const createUser = (data: IUser) => {
	return {
		type: UserActionTypes.CREATE_USER,
		payload: UserAPI.createUser(data),
	};
};

export const getUserInfo = () => {
	return {
		type: UserActionTypes.GET_USER,
		payload: UserAPI.getUser(),
	};
};

export const refreshToken = () => {
	return {
		type: UserActionTypes.REFRESH_TOKEN,
		payload: UserAPI.getAuthUser(),
	};
};

export const getAllUsers = () => {
	return {
		type: UserActionTypes.GET_ALL_USERS,
		payload: UserAPI.getAllUser(),
	};
};

export const updateUser = (data: IUser) => {
	return {
		type: UserActionTypes.UPDATE_USER,
		payload: UserAPI.updateUser(data),
	};
};

export const removeUser = () => {
	return {
		type: UserActionTypes.DELETE_USER,
		payload: UserAPI.deleteUser(),
	};
};

export const loginUser = (userName: string, password: string) => {
	return {
		type: UserActionTypes.LOGIN_USER,
		payload: UserAPI.login(userName, password),
	};
};
