import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IUser } from "../../../interfaces";
import { getAllUsers } from "../../../store/user-store/userActions";
import AddUser from "./add";
import DeleteUser from "./delete";
import User from "./list";
import ViewUser from "./view";

const Users: React.FC = () => {
	const dispatch = useDispatch();
	const state = useSelector((state) => state.userReducer);
	const [users, setUsers] = useState<IUser[]>();
	const [permissionLevel, setPermissionLevel] = useState<string>();

	useEffect(() => {
		if (state.authUser && state.authUser.authToken && state.authUser.permissionLevel) {
			setPermissionLevel(state.authUser.permissionLevel);
		}
	}, [state.authUser]);

	useEffect(() => {
		dispatch(getAllUsers());
	}, [dispatch, getAllUsers]);

	useEffect(() => {
		setUsers(state.users);
	}, [state.users]);

	return (
		<div className="organization">
			{permissionLevel === "ROOT_ADMIN" && (
				<div className="d-flex justify-content-end">
					<button
						className="btn btn-primary btn-rounded shadow-none mb-2"
						data-mdb-toggle="modal"
						data-mdb-target="#addUserModal"
					>
						<span className="fas fa-plus" />
						<span className="mx-2">New User</span>
					</button>
				</div>
			)}
			<div className="row">
				{users &&
					users.length &&
					users.map((user, index) => (
						<div key={index} className="col-md-4">
							<User
								id={user._id}
								firstName={user.firstName}
								lastName={user.lastName}
								email={user.email}
								imagePath={user.profileImage}
								permissionLevel={user.permissionLevel}
								phoneNumber={user.phoneNumber01}
								userName={user.userName}
							/>
						</div>
					))}
			</div>
			{permissionLevel === "ROOT_ADMIN" && <AddUser />}
			<ViewUser />
			{permissionLevel === "ROOT_ADMIN" && <DeleteUser />}
		</div>
	);
};

export default Users;
