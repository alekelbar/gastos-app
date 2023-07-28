

export const generateId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export const numberFormat = (num: number) =>
    num.toLocaleString("es-CR", {
        style: "currency",
        currency: "CRC"
    });