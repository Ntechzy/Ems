import NextAuth from "next-auth"
import Option from "./option"

const handler = NextAuth(Option)

export { handler as GET, handler as POST }