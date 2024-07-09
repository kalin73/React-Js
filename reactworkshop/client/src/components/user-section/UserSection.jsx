import Search from "../search/Search.jsx";
import UserList from "./user-list/UserList.jsx";
import Pagination from "./pagination/Pagination.jsx";
import {useEffect, useState} from "react";
import UserAdd from "./user-add/UserAdd.jsx";
import UserDetails from "./user-details/UserDetails.jsx";
import UserDelete from "./user-delete/UserDelete.jsx";

const baseUrl = "http://localhost:3030/jsonstore";

export default function UserSection() {
    const [users, setUsers] = useState([]);
    const [showAddUser, setShowAddUser] = useState(false);
    const [showUserDetails, setShowUserDetails] = useState(null);
    const [showUserDeleteById, setShowUserDeleteById] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async function getUsers() {
            try {
                const response = await fetch(`${baseUrl}/users`);
                const result = await response.json();
                const data = Object.values(result);

                setUsers(data);

            } catch (error) {
                alert(error.message);
            } finally {
                setIsLoading(false);
            }
        })();

    }, []);

    const addUserClickHandler = () => {
        setShowAddUser(true);
    }

    const addUserCloseHandler = () => {
        setShowAddUser(false);
    }

    const userDetailsClickHandler = (user) => {
        setShowUserDetails(user);
    };

    const addUserSaveHandler = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const userData = Object.fromEntries(formData);

        const newUser = {
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            phoneNumber: userData.phoneNumber,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            imageUrl: userData.imageUrl,
            address: {
                country: userData.country,
                city: userData.city,
                street: userData.street,
                streetNumber: userData.streetNumber
            }
        };

        const response = await fetch(`${baseUrl}/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newUser)
        });

        const createdUser = await response.json();

        setUsers(oldUsers => [...oldUsers, createdUser]);

        setShowAddUser(false);
    };

    const userDeleteClickHandler = (user) => {
        setShowUserDeleteById(user._id);
    };

    const userDeleteHandler = async () => {
        await fetch(`${baseUrl}/users/${showUserDeleteById}`, {
            method: "DELETE",
        });
        setUsers(oldUsers => oldUsers.filter(u => u._id !== showUserDeleteById));

        setShowUserDeleteById(null);
    };
    
    return (
        <>
            <section className="card users-container">
                <Search/>
                <UserList users={users} onUserDetailsClick={userDetailsClickHandler} onDelete={userDeleteClickHandler}
                          isLoading={isLoading}/>
                {showAddUser &&
                    <UserAdd
                        onClose={addUserCloseHandler}
                        onSave={addUserSaveHandler}
                    />
                }
                {showUserDetails &&
                    <UserDetails
                        userDetails={showUserDetails}
                        onClose={() => setShowUserDetails(null)}/>}

                <button className="btn-add btn" onClick={addUserClickHandler}>Add new user</button>

                {showUserDeleteById &&
                    <UserDelete onClose={() => setShowUserDeleteById(null)} onUserDelete={userDeleteHandler}/>}
                <Pagination/>
            </section>
        </>
    );
}