import { getServerSession } from "next-auth"
import { Option } from "@/app/api/auth/[...nextauth]/option"
import { AppError } from "../errors/AppError";

export const isUserAuthenticated = async (req, res) => {
    const session = await getServerSession(req, {
        ...res,
        getHeader: (name) => res.headers?.get(name),
        setHeader: (name, value) => res.headers?.set(name, value),
    }, Option); 

    if (session && session.user) {
        return session.user;
    } else {
        throw new AppError("You are not signed in. Please login to continue.", 401);
    }
}

export const validateRole = (sessionUser, allowedRolesArr) => {
    console.log(sessionUser)
    if (sessionUser && (allowedRolesArr.includes(sessionUser?.role))) {
        return true;
    } else {
        throw new AppError("You are not allowed to access this resource", 401);
    }
}