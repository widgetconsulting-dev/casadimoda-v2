export const getBaseUrl = () => {
    if (process.env.NODE_ENV === "development") {
        return "http://localhost:3000";
    }
    return process.env.NEXTAUTH_URL || "http://localhost:3000";
};
