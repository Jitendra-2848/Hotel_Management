import jwt, { SignOptions } from "jsonwebtoken";

interface jwt_payload {
    id: string;
    role?: string;
    time: SignOptions["expiresIn"];
}

const token = (JWT_DATA: jwt_payload) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }

    return jwt.sign(
        {
            id: JWT_DATA.id,
            role: JWT_DATA.role
        },
        JWT_SECRET,
        { expiresIn: JWT_DATA.time }
    );
};

export default token;
