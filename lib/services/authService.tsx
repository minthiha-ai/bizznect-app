import authApi from "@/lib/api/auth";

export const getDistricts = async () => {
    const res = await authApi.get("/districts");
    return res.data.data.data;
};

export const getTownships = () => authApi.get('/townships');
