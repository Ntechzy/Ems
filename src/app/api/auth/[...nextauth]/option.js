import dbconn from "@/lib/dbconn"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt"
import userModel from "@/modal/user"
export const Option = {
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'credentials',
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                await dbconn()
                try {
                    const user = await userModel.findOne({ employee_id: credentials.username })
                    if (!user) {
                        throw new Error("User Not Found")
                    }

                    const checkPassword = await bcrypt.compare(credentials.password, user.password)
                    if (!checkPassword) {
                        throw new Error("Invalid Password")
                    }
                    else {
                        return user
                    }

                } catch (error) {
                    throw new Error(error)
                }
            }
        })
    ],
    callbacks: {

        async jwt({ token, user }) {
            if (user) {
                token.id = user._id?.toString()
                token.role = user.role
                token.username = user.name
                token.isFormCompleted = false
            }
            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user = {
                    id: token.id?.toString(),
                    role: token.role,
                    username: token.username,
                    isFormCompleted: token.isFormCompleted
                };
            }
            return session
        },
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
    page: {
        signIn: "/login"
    }
} 