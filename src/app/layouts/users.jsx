import React from "react";
import { useParams } from "react-router-dom";
import EditUserPage from "../components/page/editUserPage";
import UserPage from "../components/page/userPage";
import UsersListPage from "../components/page/usersListPage";
import UserProvider from "../hooks/useUsers";
import { useAuth } from "../hooks/useAuth";
const Users = () => {
    const params = useParams();
    const { userId, edit } = params;
    const { currentUser } = useAuth();

 if (edit && userId !== currentUser._id) {
   window
     .history.replaceState(
     null
     ,
     "New Page Title"
     ,
     `/users/${currentUser._id}/edit`
   );
 }
    return (
        <>
            <UserProvider>
                {userId ? (
                    edit ? (
                        <EditUserPage />
                    ) : (
                        <UserPage userId={userId} />
                    )
                ) : (
                    <UsersListPage />
                )}
            </UserProvider>
        </>
    );
};

export default Users;
